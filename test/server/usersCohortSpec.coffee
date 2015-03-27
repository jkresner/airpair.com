
mailsubscriptions = ->

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


    it 'Can see mail subscribed & unsubscribed lists for loggedInUser', itDone ->
      subscriptionsStub = SETUP.stubMailchimpLists(data.wrappers.mailchimp_subscription)
      LOGIN 'jkap', (s) ->
        GET '/users/me/maillists', {}, (maillists) ->
          # $log('maillists', maillists)
          expect(maillists.length).to.equal(4)
          subscribed = _.filter(maillists, (l) -> l.subscribed)
          expect(subscribed.length).to.equal(1)
          expect(subscribed[0].name).to.equal('AirPair Newsletter')
          subscriptionsStub.restore()
          DONE()


    it 'Can toggle subscribe & unsubscribe to a maillist', itDone ->
      listsForEmailStub = SETUP.stubMailchimpLists(data.wrappers.mailchimp_listsforemail)
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



module.exports = ->

  before (done) ->
    SETUP.addUserWithRole 'jkap', 'editor', ->
      done()


  describe "Mail Lists: ".subspec, mailsubscriptions
