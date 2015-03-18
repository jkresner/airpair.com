db = require('./setup/db')

mailsubscriptions = ->

  it 'Can see mail subscriptions for loggedInUser', (done) ->
    listsStub = SETUP.stubMailchimpLists(data.wrappers.mailchimp_lists)
    LOGIN 'jkap', (s) ->
      PUT '/users/me/cohort', {}, {}, (u1) ->
        # $log('s', u1)
        listsStub.restore()
        done()


  # it.skip 'Can subscribe and unsubscribe to a list', (done) ->

  # it 'Can store mail subscriptions anonymous data', (done) ->

  # it 'Can migrate mail subscriptions from anonymous data to cohort', (done) ->

  # it 'Can store mail subscriptions in cohort', (done) ->





module.exports = ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.addUserWithRole 'jkap', 'editor', ->
      done()

  after ->
    SETUP.analytics.restore()


  describe "Lists: ".subspec, mailsubscriptions
