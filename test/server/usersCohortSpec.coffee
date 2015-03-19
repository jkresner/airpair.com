db = require('./setup/db')

mailsubscriptions = ->

  describe "Anonymous: ".subspec, ->


    it.skip 'Empty mail subscriptions for new anonymous user', (done) ->
      # ANON

    it.skip 'Subscribe to mail list as anonymous user', (done) ->


    it.skip 'Migrate mail subscriptions from anonymous data to cohort on signup', (done) ->


  describe.only "Logged in: ".subspec, ->


    it 'Can see mail subscribed & unsubscribed lists for loggedInUser', (done) ->
      subscriptionsStub = SETUP.stubMailchimpLists(data.wrappers.mailchimp_subscription)
      LOGIN 'jkap', (s) ->
        GET '/users/me/maillists', {}, (maillists) ->
          # $log('maillists', maillists)
          expect(maillists.length).to.equal(4)
          subscribed = _.filter(maillists, (l) -> l.subscribed)
          expect(subscribed.length).to.equal(1)
          expect(subscribed[0].name).to.equal('AirPair Newsletter')
          subscriptionsStub.restore()
          done()


    it 'Can toggle subscribe & unsubscribe to a maillist', (done) ->
      # subscriptionsStub = SETUP.stubMailchimpLists(data.wrappers.mailchimp_subscription)
      LOGIN 'jkap', (s) ->
        GET '/users/me/maillists', {}, (maillists) ->
          # $log('maillists', maillists)
          expect(maillists.length).to.equal(4)
          subscribed = _.filter(maillists, (l) -> l.subscribed)
          # expect(subscribed.length).to.equal(1)
          expect(subscribed[0].name).to.equal('AirPair Newsletter')
          # subscriptionsStub.restore()
          digest = maillists[1]
          digestSubscribed = digest.subscribed
          expect(digest.name).to.equal('AirPair Developer Digest')
          PUT '/users/me/maillists', { name: digest.name }, {}, (digest) ->
            # $log('digest', digest)
            expect(digest.subscribed).to.equal(!digestSubscribed)
            done()



module.exports = ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.addUserWithRole 'jkap', 'editor', ->
      done()

  after ->
    SETUP.analytics.restore()


  describe "Lists: ".subspec, mailsubscriptions
