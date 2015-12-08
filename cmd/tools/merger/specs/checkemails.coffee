module.exports = ->

  specInit(@)

  DESCRIBE 'CHECK', ->

    before (done) ->
      @timeout(10000)
      if !global.dupEmails
        throw Error("global.dupEmails undefined")
      require('../../../migrate/201509/graph')(done)


    IT "Emails match existing users", ->
      emails = global.dupEmails
      # expect(emails.length, "Two emails required for merge").to.be.at.least(2)
      sortHash = {}
      i = 0
      for email in emails
        sortHash[email] = i++
      Users.find({$or:[{'email':{$in:emails}},{'auth.gh.email':{$in:emails}},{'auth.gh.emails.email':{$in:emails}}]}).toArray (e, users) ->
        users.sort((u)->sortHash[u.email])
        expect(users.length, "Only #{users.length} matching emails #{emails} #{JSON.stringify(users).white}").to.be.at.least(2)
        $log("\nFound #{users.length} matching #{emails}:\n".green)
        $log(uInfoChain(user)) for user in users
        $log("\n\n\n")
        graph0 = UserGraph[users[0]._id]
        graph1 = UserGraph[users[1]._id]
        $log('graph0'.white, users[0]._id, graph0)
        $log('graph1'.white, users[1]._id, graph1)
        $log("\n\n\n")
        $log((uInfoChain(users[0]).reset.replace('\n','# '.gray)+uInfoChain(users[1]).reset.replace('\n','\n# '.gray)))
        $log((users[0].name.replace(/ /g,'_')+':').gray)
        $log(("  M: ['"+[users[0].email,users[1].email].join("','")+"']").gray)
        override = "  O: "
        if (users[0].name != users[1].name)
          override += "name: '"+"CHOOSE: #{users[0].name}|#{users[1].name}".yellow+"', "
        if (users[0].username && users[1].username)
          override += "username: '"+"CHOOSE: #{users[0].username}|#{users[1].username}".yellow+"', ".gray
        if (users[0].auth.gp && users[1].auth.gp)
          gpEmail = emails[0]
          if users[0].auth.gp.email != gpEmail && users[1].auth.gp.email != gpEmail
            gpEmail = "CHOOSE: #{users[0].auth.gp.email}|#{users[1].auth.gp.email}".yellow
          override += "auth: { gp: { email: '#{gpEmail}' } }".gray
        $log(override.gray)
        expects = "  R: "
        for attr in ['posts','suggests','booked','bookings','requests','paymethods','ordered','orders','paidout','released']

          if (graph0[attr] || graph1[attr])
            expects += "#{attr}:#{(graph0[attr]||0)+(graph1[attr]||0)},"
        expects += " fn:->"
        $log(expects.gray)
        $log("\n")
        DONE()
