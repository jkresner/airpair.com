mailsubscriptions = ->

  describe "Admin: ".subspec, ->
    # it.only 'Get subscriptions for list', itDone ->
    #   report = (list) =>
    #     Wrappers.MailChimp.unsubscribedMembers list.id, (ee,rr) ->
    #       $log('list'.cyan, list.name, rr.total)
    #       # $log('report'.yellow, rr)

    #   Wrappers.MailChimp.lists (e,r) ->
    #     # $log('r', r)
    #     for list in r.data
    #       report(list)
    #       # Wrappers.MailChimp.abuseReport list.id, (ee,rr) ->
    #       #   $log('list'.cyan, list.name, list.id)
    #       #   $log('report'.yellow, rr)
    #     # DONE()

    # it.only 'Get member info', itDone ->
    #   Wrappers.MailChimp.memberLists 'jk@airpair.com', (e,r) ->
    #     $log('r'.cyan, e, r)
        # for list in r.data
        #   report(list)
          # Wrappers.MailChimp.abuseReport list.id, (ee,rr) ->
          #   $log('list'.cyan, list.name, list.id)
          #   $log('report'.yellow, rr)
      # Wrappers.MailChimp.member '903d16f497', 'jkaaaay@airpair.com', (e,r) ->
      #   $log('r', e, r.data[0])

      # Wrappers.MailChimp.member '903d16f497', 'tom@tilde.io', (e,r) ->
      #   $log('r', e, r.data[0])
        # DONE()

  describe "Anonymous: ".subspec, ->

    it 'Empty mail subscriptions for new anonymous user', itDone ->
      ANONSESSION (sAnon) ->
        expect(sAnon.maillists).to.be.undefined
        PUT '/users/me/maillists', { name: 'AirPair Developer Digest' }, { status: 403 }, (err) ->
          expectStartsWith(err.message, "Invalid email address")
          DONE()


    it 'Subscribe to mail list as anonymous user', itDone ->
      ANONSESSION (sAnon) ->
        email = data.wrappers.mailchimp_anon_subscribed.email
        anonSubscribedStub = SETUP.stubMailchimpLists(data.wrappers.mailchimp_anon_subscribed)
        PUT '/users/me/maillists', { name: 'AirPair Developer Digest', email }, {}, (subs) ->
          expect(subs.length).to.equal(1)
          expect(subs[0]).to.equal('AirPair Developer Digest')
          GET '/users/me/maillists', {}, (maillists) ->
            expect(maillists.length).to.equal(1)
            expect(maillists[0]).to.equal('AirPair Developer Digest')
            anonSubscribedStub.restore()
            # PUT '/users/me/maillists', { name: 'AirPair Developer Digest', email }, {}, (maillists2) ->
              # expect(_.find(maillists2,(m)->m=='AirPair Developer Digest')).to.be.null
            DONE()


  describe "Logged in: ".subspec, ->

    before (done) ->
      SETUP.addUserWithRole 'jkap', 'editor', ->
        done()

    it.skip 'Can see mail subscribed & unsubscribed lists for loggedInUser', itDone ->
      subscriptionsStub = SETUP.stubMailchimpLists(data.wrappers.mailchimp_memberinfo_jk)
      LOGIN 'jkap', (s) ->
        GET '/users/me/maillists', {}, (maillists) ->
          # $log('maillists', maillists)
          expect(maillists.length).to.equal(4)
          subscribed = _.filter(maillists, (l) -> l.subscribed)
          expect(subscribed.length).to.equal(3)
          expect(subscribed[0].name).to.equal('AirPair Newsletter')
          subscriptionsStub.restore()
          DONE()


    it 'Can toggle subscribe & unsubscribe to a maillist', itDone ->
      listsForEmailStub = SETUP.stubMailchimpLists(data.wrappers.mailchimp_memberinfo_jk)
      LOGIN 'jkap', (s) ->
        GET '/users/me/maillists', {}, (maillists) ->
          listsForEmailStub.restore()
          expect(maillists.length).to.equal(4)
          subscribed = _.filter(maillists, (l) -> l.subscribed)
          expect(subscribed[0].name).to.equal('AirPair Newsletter')
          digest = maillists[1]
          expect(digest.name).to.equal('AirPair Developer Digest')
          digestSubscribed = digest.subscribed
          if digestSubscribed
            resp = data.wrappers.mailchimp_unsubscribed
          else
            resp = data.wrappers.mailchimp_subscribed
          toggleStub = SETUP.stubMailchimpLists(resp)
          PUT '/users/me/maillists', { name: digest.name }, {}, (digest) ->
            # $log('digest', digest)
            expect(digest.subscribed).to.equal(!digestSubscribed)
            toggleStub.restore()
            DONE()


    it 'Updates subscriptions upon email verified'


stories = ->

  before (done) ->
    SETUP.analytics.on()
    done()

  it 'Create account and update lots of things', itDone ->
    _id = null
    firstRequestUrl = '/posts'
    firstSessionId = null
    signupData = SETUP.userData('jkjk')
    expert = null

    expectCohort = (session, expCompare, log, cb) ->
      if log then $log("session #{log}".yellow, session.cohort)
      expect(session.cohort).to.exist
      expect(session.cohort.firstRequest).to.be.undefined
      expect(session.cohort.aliases).to.be.undefined
      expect(session.cohort.maillists).to.be.undefined
      db.readDoc 'User', _id, (user) ->
        if !data.users[signupData.userKey]
          data.users[signupData.userKey] = user
        if log then $log('user'.yellow, user.cohort)
        expect(user.cohort).to.exist
        expect(user.cohort.firstRequest.url).to.equal(firstRequestUrl)
        expect(user.cohort.aliases).to.exist
        expect(user.cohort.aliases.length > 0).to.be.true
        expect(user.cohort.aliases[0]).to.equal(firstSessionId)
        expect(user.cohort.maillists).to.exist
        expect(user.cohort.maillists.length > 1).to.be.true
        expect(user.cohort.maillists[0]).to.equal('AirPair Newsletter')
        expect(user.cohort.maillists[1]).to.equal('AirPair Developer Digest')
        expect(user.cohort.engagement).to.exist
        expect(user.cohort.engagement.visits).to.exist
        expect(user.cohort.engagement.visit_first).to.exist
        expect(user.cohort.engagement.visit_signup).to.exist
        expect(user.cohort.engagement.visit_last).to.exist
        if (expCompare)
          expect(session.cohort.expert).to.exist
          expectIdsEqual(session.cohort.expert._id, expCompare._id)
          expect(user.cohort.expert).to.exist
          expectIdsEqual(user.cohort.expert._id, expCompare._id)
          expect(user.cohort.expert.applied).to.exist
          expect(user.cohort.maillists[2]).to.equal('AirPair Experts')
        if (cb)
          cb()


    signup = (cb) ->
      spy = sinon.spy(mailman,'singupSubscribeEmail')
      ANONSESSION (anonSesh) ->
        firstSessionId = anonSesh.sessionID
        GETP(firstRequestUrl).end (err, resp) ->
          POSTAUTH("/auth/subscribe", signupData).end (er, sResp) ->
            _id = sResp.body._id
            expectCohort(sResp.body)
            hash = spy.args[0][1]
            spy.restore()
            PUT '/users/me/password', { hash, password: signupData.password }, {}, (s2) ->
              expectCohort(s2)
              expect(s2.emailVerified).to.be.true
              cb()
            # PUT "/users/me/email-verify", { hash }, {}, (sVerified) ->
            # PUT '/users/me/email', { email: sResp.body.email }, {}, (s2) ->
            #   expectCohort(s2)
            #   hash = spy.args[0][1]
            #   spy.restore()
            #   PUT "/users/me/email-verify", { hash }, {}, (sVerified) ->
            #     expect(sVerified.emailVerified).to.be.true
            #     cb()

    updateAccount = (cb) ->
      PUT "/users/me/username", { username: signupData.userKey }, {}, (s4) ->
        expect(s4.username).to.equal(signupData.userKey)
        PUT "/users/me/initials", { initials: 'jk' }, {}, (s5) ->
          PUT "/users/me/location", data.wrappers.localization_melbourne.locationData, {}, (s6) ->
            PUT "/users/me/bio", { bio: 'a flow bio'}, {}, (s7) ->
              expectCohort(s7)
              SETUP.connectOAuth s7, 'github', data.users.ape1.social.gh, (s8) ->
                expectCohort(s8)
                SETUP.connectGoogle s8, data.users.ape1.google, (s9) ->
                  cb()

    applyToBeAnExpert = (cb) ->
      d = rate: 80, breif: 'yo flow', tags: [data.tags.angular]
      POST "/experts/me", d, {}, (expert) ->
        expert = expert
        GETP("/logout").end (err, resp) ->
          global.cookie = null
          POSTAUTH("/auth/login", signupData).end (er, sResp) ->
            cookie = resp.headers['set-cookie']
            s10 = sResp.body
            expectCohort(s10, expert)
            LOGIN signupData.userKey, ->
              cb()

    updateMailLists = (cb) ->
      # $log('updateMailLists'.cyan)
      GET "/users/me/maillists", {}, (ml) ->
        GET "/session/full", {}, (s11) ->
          expectCohort(s11, expert, null, cb)


    signup ->
      updateAccount ->
        applyToBeAnExpert ->
          updateMailLists(DONE)





module.exports = ->

  describe "Mail Lists: ".subspec, mailsubscriptions
  describe "Stories: ".subspec, stories
