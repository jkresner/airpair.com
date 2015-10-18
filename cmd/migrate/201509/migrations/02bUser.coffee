
cull = ->

  checks = ->
    expectAllPromises resolveResult('Users','users'),
      jlem1: (u, orig) ->
        expectObjIdsEqual(u, FIXTURE.users.jlem1)
        expectIdsEqual("54d390c41f49fb0a00ecb076", orig._id)
        expect(u.emailVerified).to.be.tru


  removeAssociatedRequests = (removedUserIds) ->
    Requests.find({}, {_id:1, userId:1}).toArray (e, requests) ->
      ops = []
      for o in requests
        ops.push( removeOne: { q: { _id: o._id } }) if removedUserIds[o.userId]
      Requests.bulkWrite ops, {ordered:false}, (ee,rr) ->
        $log('delete.requests.notVerifiedEmail'.yellow, rr.deletedCount)
        checks()

  noVerifiedEmail = { emailVerified:{$ne:true}, 'auth.gp.verified_email':{$ne:true}, 'auth.gh':{$exists:0} }
  Users.find(noVerifiedEmail, { email:1, name:1, 'auth.gp': 1 }, q.sortById).toArray (e, users) ->
    removeIds = {}
    excludeIds = []
    text = ''
    excludesReports = ''
    for o in users
      {posts,expert,bookings,paymethods,requests} = UserGraph[o._id]
      if posts? or expert? or requests>2 or bookings? or paymethods?
        excludesReports += uInfoChain(o)
        excludeIds.push o._id
      else
        text += "#{o._id} #{idToMoment(o._id, 'YYMMMDD|HH:mm')} \"#{o.name}\" <#{o.email}>\n"
        removeIds[o._id] = true

    $log(excludesReports)
    fileName = "#{__dirname}/../#{moment().format('YYYYMMDD')}culled[#{users.length-excludeIds.length}].txt"
    fs.writeFile fileName, text, ->
      Users.remove _.extend(noVerifiedEmail,{_id:{$nin:excludeIds}}), (e,r) ->
        $log('delete.USERS.noVerifiedEmail'.yellow, r.result.n)
        expect(r.result.n).to.equal(users.length-excludeIds.length)
        removeAssociatedRequests(removeIds)


heals = ->
  dups = {}

  Users.find({}, { _id: 1, email:1, 'auth.gp.email':1 }, q.sortById).toArray (e, users) =>
    existing = {}
    ups = []
    for u in users
      if (u.email)
        existing[u.email] = u._id
    for u in users
      if !u.email
        if existing[_.get(u,'auth.gp.email')]?
          $log('already have an account for', _.get(u,'auth.gp.email'), existing[_.get(u,'auth.gp.email')], u._id)
          # MERGE uA, uB, overrides, (e, r) ->
          u.email = _.get(u,'auth.gp.email')+2
        else
          u.email = _.get(u,'auth.gp.email')
        expect(u.email).to.exist

        ups.push
          updateOne:
            q: {_id:u._id},
            u: { $set: { email: u.email } },
            upsert : false

    $log('HEALING.prop.email.yellow', ups.length)
    Users.bulkWrite ups, {ordered:false}, (e, r) ->
      DONE(e)


MERGE = require('../merge')
mergeDupEmails = ->
  mergeDups = (uaId, ubId, overrides, cb) ->
    domain.create().on('error', DONE).run ->
      Users.findOne {_id:ObjectId(uaId)}, (e,uA) ->
        Users.findOne {_id:ObjectId(ubId)}, (e,uB) ->
          MERGE uA, uB, overrides, cb

  mergeDups "52dee5131c67d1a4859d1d16", "544b63d88f8c80299bcc4d3a", auth: { gp: { email:'mezzalab@gmail.com'} }, ->
    $log('MERGED: mezzalab@gmail.com'.green)
    mergeDups "5431dce98f8c80299bcc4a2d", "543f37548f8c80299bcc4bec", auth: { gp: { email:'matt.klinkhammer@gmail.com'} }, ->
      $log('MERGED: matt.klinkhammer@gmail.com'.green)
      mergeDups "546bf35b8f8c80299bcc510e", "540a8ea18f8c80299bcc4611", auth: { gp: { email:'david@midmoapps.com'} }, ->
        $log('MERGED: david@midmoapps.com'.green)
        mergeDups "54f4b5020ec2d80c0017b1b9", "53b24df38f8c80299bcc36e1", auth: { gp: { email:'dliamkin@gmail.com'} }, ->
          $log('MERGED: dliamkin@gmail.com'.green)
          mergeDups "54b1dbbc7b1047516695d464", "5302afca1c67d1a4859d2380", { auth: { gp: { email:'domurtag@gmail.com'} }, name: "Mary Murtagh" }, ->
            $log('MERGED: domurtag@gmail.com'.green)
            mergeDups "53ee24568f8c80299bcc4251", "51af958f66a6f999a465f37a", { auth: { gp: { email:'ehl258@stern.nyu.edu'} }, name: "Emil Lee" }, ->
              $log('MERGED: ehl258@stern.nyu.edu'.green)
              DONE()


module.exports = ->

  specInit(@)

  describe 'Migrating 20150822users culling', ->

    before (done) ->
      Users.remove inQuery(FIXTURE.users.unwated), (e,r) ->
        if r.result.n
          $log('delete.USERS.unwanted'.yellow, r.result.n)
          Experts.remove inQuery(FIXTURE.users.unwated, 'userId'), (e,r) ->
        done()


    IT "Culls users without a verified email or graph relationship", cull
    IT "Heals email property", heals
    IT "Merge duplicate email property", mergeDupEmails

    IT "done phase 2", ->
      $log("\n\n\n")
      $log('terminal     ', 'mongodump -h localhost -d airpair_dev -o ./cmd/migrate/201509/bson/2passed'.white)
      $log('config.json  ', 'copy => config3.json  --->   /migrate/config.json",'.white)
      $log('terminal     ', 'cmd/dev/db-migrate -f -d'.white)
      $log("\n\n\n")
      expect(false).to.be.true

