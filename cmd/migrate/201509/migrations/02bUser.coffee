
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

  noVerifiedEmail = { emailVerified:{$ne:true}, 'linked.gp.verified_email':{$ne:true}, 'linked.gh':{$exists:0} }
  Users.find(noVerifiedEmail, { email:1, name:1, 'linked.gp': 1 }, q.sortById).toArray (e, users) ->
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

  Users.find({},{
    name:1,'linked.gp.name':1,'linked.gh.name':1
    email:1, 'linked.gp.email':1
  }, q.sortById).toArray (e, users) =>
    $log('HEALING.prop.name+prop.email', users.length)
    ups = []
    for u in users
      u.name = assignName(u)
      expect(u.name).to.exist

      u.email = u.email || _.get(u,'linked.gp.email')
      expect(u.email).to.exist

      ups.push
        updateOne:
          q: {_id:u._id},
          u: { $set: { email: u.email } },
          upsert : false

    Users.bulkWrite ups, {ordered:false}, (e, r) ->
      DONE(e)



module.exports = ->

  specInit(@)

  describe 'Migrating 20150822users culling', ->

#     before (done) ->
#       Users.remove inQuery(FIXTURE.users.unwated), (e,r) ->
#         if r.result.n
#           $log('delete.USERS.unwanted'.yellow, r.result.n)
#           Experts.remove inQuery(FIXTURE.users.unwated, 'userId'), (e,r) ->
#         done()


    IT "Culls users without a verified email & model relationships", cull
    IT "Heals email & name properties", heals

