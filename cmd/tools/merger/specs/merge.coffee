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
              checkMergeRemovedGraph r, (ee) ->
                cb ee, r

  expectAllMerges = (promObjList) ->
    newProm = (key) -> new Promise (resolve, reject) ->
      {M,O,R} = promObjList[key]
      expectFn = R.fn || (->)
      mergeByEmails M[0], M[1], O, _.omit(R,'fn'), (e, r) ->
        if e
          return reject(e)
        try
          expectFn r
          tmplData =
            emails:         M.join(' & ')
            primaryEmail:   M[0]
            firstName:      util.firstName(r.merged.user.name)

          subject = TEMPLATE.subjectFn(tmplData)
          body = TEMPLATE.markdownFn(tmplData)
          mailman.sendMarkdown subject, body, r.merged.user, 'jk', ->
            # $log('removed', r.removed.user)
            mailman.sendMarkdown subject, body, r.removed.user, 'jk', ->
              resolve key
        catch err
          reject(err)

    Promise.all(newProm(attr) for attr of promObjList)
      .then ((values)->$log('Passed     '.green, '(all)'||values);DONE()), DONE

  expectAllMerges FIXTURE.merged



module.exports = ->

  specInit(@)

  DESCRIBE 'MERGES', ->

    before (done) ->
      handlebars     = require('handlebars')
      marked         = require('marked')
      global.mailman = require('../../../../server/util/mailman')()
      Templates.findOne {key:'user-merged'}, (e, tmpl) ->
        global.TEMPLATE =
          markdownFn: handlebars.compile(tmpl.markdown)
          subjectFn: handlebars.compile(tmpl.subject)
        done()

    IT "Merges FIXTURE.merged users", mergeFixture

    # IT "Send emails (if expects failed after merging)", ->
    #   name = 'Agam Duo'
    #   primary = { name, email: 'agamdua@gmail.com' }
    #   merged = { name, email: 'agam@comfylabs.io' }
    #   tmplData =
    #     emails:         [primary.email,merged.email].join(' & ')
    #     primaryEmail:   primary.email
    #     firstName:      util.firstName(name)

    #   subject = TEMPLATE.subjectFn(tmplData)
    #   body = TEMPLATE.markdownFn(tmplData)
    #   mailman.sendMarkdown subject, body, primary, 'jk', ->
    #     mailman.sendMarkdown subject, body, merged, 'jk', ->
    #       DONE()
