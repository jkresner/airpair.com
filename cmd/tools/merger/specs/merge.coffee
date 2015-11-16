handlebars            = require('handlebars')
marked                = require('marked')


checkName = ->
  if !merging.byName then DONE()
  Users.find({name:merging.byName}).toArray (e, users) ->
    expect(users.length, "Only #{users.length} matching name #{merging.byName}").to.be.at.least(2)
    $log("\nFound #{users.length} matching #{merging.byName}:\n".green)
    text = ""
    text += uInfoChain(user) for user in users
    $log(text)
    $log("\n")
    DONE()


checkEmails = ->
  emails = merging.M
  expect(emails.length, "Two emails required for merge").to.be.at.least(2)
  Users.find({email:{$in:emails}}).toArray (e, users) ->
    expect(users.length, "Only #{users.length} matching emails #{emails} #{JSON.stringify(users).white}").to.be.equal(emails.length)
    $log("\nFound #{users.length} matching #{emails}:\n".green)
    $log(uInfoChain(user)) for user in users
    $log("\n")
    DONE()


mergeFixture = ->

  mergeByEmails = (uaEmail, ubEmail, overrides, expects, cb) ->
    domain.create().on('error', DONE).run ->
      Users.findOne {email:uaEmail}, (e,uA) ->
        Users.findOne {email:ubEmail}, (e,uB) ->
          expect(uA, "No user for #{uaEmail}. Merged already?").to.exist
          expect(uB, "No user for #{ubEmail}. Merged already?").to.exist
          require('../../../migrate/201509/merge') uA, uB, overrides, (e, r) ->
            M = r.merged.user
            if r.merged.expert
              mergedExpertId = ObjectId(r.merged.expert._id)
            checkMergeMergedGraph M, mergedExpertId, expects, ->
              checkMergeRemovedGraph r.removed, (ee) ->
                cb ee, r

  expectAllMerges = (promObjList) ->
    newProm = (key) -> new Promise (resolve, reject) ->
      {M,O,R} = promObjList[key]
      expectFn = R.fn || (->)
      mergeByEmails M[0], M[1], O, _.omit(R,'fn'), (e, r) ->
        if e
          return reject(e)
        try
          if !r.replay
            expectFn r
            tmplData =
              emails:         M.join(' & ')
              primaryEmail:   M[0]
              firstName:      util.firstName(r.merged.user.name)

            subject = TEMPLATE.subjectFn(tmplData)
            body = TEMPLATE.markdownFn(tmplData)
            mailman.sendMarkdown subject, body, r.merged.user, 'jk', ->
              mailman.sendMarkdown subject, body, r.removed.user, 'jk', ->
                resolve key
          else
            console.log('Replay     '.green.dim, key)
            resolve key
        catch err
          reject(err)

    Promise.all(newProm(attr) for attr of promObjList)
      .then ((values)->$log('Passed     '.green, '(all)'||values);DONE()), DONE

  expectAllMerges FIXTURE.merged



module.exports = ->

  specInit(@)

  # DESCRIBE 'CHECK', ->

  #   before (done) ->
  #     @timeout(10000)

  #     checkKey = 'Mickey_Puri'

  #     global.merging = FIXTURE.merged[checkKey]
  #     global.merging.byName = checkKey.replace('_',' ')
  #     require('../../../migrate/201509/graph')(done)

  #   IT "Name matches more than one user", checkName
  #   IT "Emails match existing users", checkEmails


  DESCRIBE 'MERGES', ->

    before (done) ->
      Templates.findOne {key:'user-merged'}, (e, tmpl) ->
        global.TEMPLATE =
          markdownFn: handlebars.compile(tmpl.markdown)
          subjectFn: handlebars.compile(tmpl.subject)
        done()

    IT "Merges FIXTURE.merged users", mergeFixture
