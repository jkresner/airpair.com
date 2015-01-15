# might be cool to inject this instead of require
db = require('./setup.db')
dataHelpers = require('./setup.data')
UserService = require('../../../server/services/users')
PaymethodsService = require('../../../server/services/paymethods')

"""
// Stories are use cases that take multiple steps that are often precursors
// To the functionality that we want to test.
// Their main benefit is reducing the amount of code we need to write
// For tests by allowing us to start with fresh needed data in one helper method

// Sometimes we directly insert into the DB instead of going through a service
// To save execution overhead, e.g. creating a paymethod for a user without
// hitting braintree and making a slow network call
"""

global.addLocalUser = (userKey, opts, done) ->
  clone = getNewUserData(userKey)
  UserService.localSignup.call(newUserSession(userKey), clone.email, clone.password, clone.name, (e, r) ->
    data.users[clone.userKey] = r
    if (opts && opts.emailVerified)
      db.Models.User.findOneAndUpdate({_id:r._id},{emailVerified:true},{upsert:true}, (err, user) ->
        r.emailVerified = true
        data.users[clone.userKey] = r
        done(clone.userKey)
      )
    else
      done(clone.userKey)
  )


global.addAndLoginLocalUser = (originalUserKey, done) ->
  addLocalUser originalUserKey, {}, (userKey) ->
    LOGIN userKey, data.users[userKey], ->
      GET '/session/full', {}, (s) ->
        s.userKey = userKey
        done(s)


global.addAndLoginLocalUserWithEmailVerified = (originalUserKey, done) ->
  addLocalUser originalUserKey, {emailVerified: true}, (userKey) ->
    LOGIN userKey, data.users[userKey], (resp) ->
      GET '/session/full', {}, (s) ->
        expect(s.emailVerified).to.be.true
        s.userKey = userKey
        done(s)



global.addAndLoginLocalUserWithPayMethod = (originalUserKey, done) ->
  addAndLoginLocalUserWithEmailVerified originalUserKey, (s) ->
    new db.Models.PayMethod( _.extend({userId: s._id}, data.paymethods.braintree_visa) ).save (e,r) ->
      s.primaryPayMethodId = r._id
      done(s)


stories = {

  addLocalUser,
  addAndLoginLocalUser,
  addAndLoginLocalUserWithEmailVerified,
  addAndLoginLocalUserWithPayMethod,

  addUserWithRole: (userKey, role, done) ->
    session = newUserSession()

    # so we aren't aliasing on every login
    session.sessionID = 'test'+userKey

    # Add an administrator
    UserService.googleLogin.call session, data.oauth[userKey], (e,r) ->
      if (!r.roles || !r.roles.length)
        UserService.toggleUserInRole.call {user:r}, r._id, role, (ee,rr) ->
          data.users[userKey] = rr;
          done(e,rr)
      else
        data.users[userKey] = r;
        done(null, r)


  createAndPublishPost: (author, postData, done) ->
    title = 'A test post '+moment().format('X')
    slug = title.toLowerCase().replace(/\ /g, '-')
    tags = [data.tags.angular,data.tags.node]
    b = { userId: author._id, name: author.name, bio: 'yo yo', avatar: author.avatar }
    d = { tags, title, by:b, slug,  md: 'Test', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
    d = _.extend(d, postData)
    POST '/posts', d, {}, (p) ->
      PUT '/posts/publish/'+p._id, p, {}, (ppub) ->
        done()


  setupCompanyWithPayMethodAndTwoMembers: (companyCode, adminCode, memberCode, done) ->
    addAndLoginLocalUser memberCode, (sCompanyMember) ->
      addAndLoginLocalUser adminCode, (sCompanyAdmin) ->
        c = _.clone(data.v0.companys[companyCode])
        c._id = new db.ObjectId()
        c.contacts[0]._id = sCompanyAdmin._id
        testDb.ensureDocs 'Company', [c], (e,r) ->
          d =
            type: 'braintree',
            token: braintree.Test.Nonces.Transactable,
            name: "#{c.name} Company Card",
            companyId: c._id
          POST '/billing/paymethods', d, {}, (pm) ->
            LOGIN 'admin', data.users.admin, ->
              PUT "/adm/companys/migrate/#{c._id}", {type:'smb'}, {}, (r) ->
                PUT "/adm/companys/member/#{c._id}", {user:sCompanyMember}, {}, (rCompany) ->
                  done(c._id, pm._id, sCompanyAdmin, sCompanyMember)


  newLoggedInExpert: (userKey, done) ->
    user = dataHelpers.getNewExpertUserData(userKey)
    seedExpert = dataHelpers.getNewExpertData(userKey, user)
    data.users[user.userKey] = user
    data.experts[user.userKey] = seedExpert

    db.ensureExpert user.userKey, (e,expert) ->
      LOGIN user.userKey, data.users[user.userKey], (expertSession) ->
        expertSession.userKey = user.userKey
        expertSession.expertId = expert._id
        done(expert, expertSession)


  injectOAuthPayoutMethod: (user, providerName,pmKey,cb) ->
    PaymethodsService.addOAuthPayoutmethod.call({user},
      providerName, data.paymethods[pmKey],{},(e,r)->cb(r))


  newLoggedInExpertWithPayoutmethod: (userKey, done) ->
    stories.newLoggedInExpert userKey, (expert, expertSession) ->
      stories.injectOAuthPayoutMethod expertSession, 'paypal', 'payout_paypal_enus_verified', (payoutmethod) ->
        done expert, expertSession, payoutmethod


  newCompleteRequest: (userKey, requestData, cb) ->
    budget = requestData.budget || 100
    addAndLoginLocalUserWithPayMethod userKey, (sessionCustomer) ->
      request = {
        type: 'mentoring',
        tags: [data.tags.angular],
        experience: 'beginner',
        brief: 'this is a test yo',
        hours: "1",
        time: 'rush'
      }
      request = _.extend(request, requestData)
      POST '/requests', request, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget}), {}, (r) ->
          cb(r,sessionCustomer)


  newBookedRequest: (customerUserKey, requestData, expertUserKey, cb) ->
    SETUP.newCompleteRequest customerUserKey, {}, (request, customerSession) ->
      SETUP.newLoggedInExpert expertUserKey, (expert, expertSession) ->
        reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
        PUT "/requests/#{request._id}/reply/#{expert._id}", reply, {}, (r1) ->
          expect(r1.suggested[0].expertStatus).to.equal("available")
          expect(customerSession.primaryPayMethodId).to.exist
          LOGIN customerSession.userKey, customerSession, ->
            GET "/requests/#{request._id}/book/#{expert._id}", {}, (r2) ->
              airpair1 = time: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: customerSession.primaryPayMethodId, request: { requestId: request._id, suggestion: r2.suggested[0] }
              POST "/bookings/#{expert._id}", airpair1, {}, (booking) ->
                expect(booking._id).to.exist
                cb(request, booking, customerSession, expertSession)


  newBookedRequestWithExistingExpert: (customerUserKey, requestData, expertSession, cb) ->
    SETUP.newCompleteRequest customerUserKey, {}, (request, customerSession) ->
      LOGIN expertSession.userKey, expertSession, () ->
        reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
        PUT "/requests/#{request._id}/reply/#{expertSession.expertId}", reply, {}, (r1) ->
          LOGIN customerSession.userKey, customerSession, ->
            GET "/requests/#{request._id}/book/#{expertSession.expertId}", {}, (r2) ->
              airpair1 = time: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: customerSession.primaryPayMethodId, request: { requestId: request._id, suggestion: r2.suggested[0] }
              POST "/bookings/#{expertSession.expertId}", airpair1, {}, (booking) ->
                cb(request, booking, customerSession, expertSession)

  releaseOrderAndLogExpertBackIn: (orderId, expertSession, cb) ->
    LOGIN 'admin', data.users.admin, ->
      PUT "/adm/billing/orders/#{orderId}/release", {}, {}, (released) ->
        LOGIN expertSession.userKey, expertSession, cb

}

module.exports = stories
