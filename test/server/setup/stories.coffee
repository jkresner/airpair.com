dataHelpers          = require('./data')
UserService          = require('../../../server/services/users')
PaymethodsService    = require('../../../server/services/paymethods')
braintree            = require('braintree')
expertData           = require('../../../server/services/experts.data')
{selectFromObject}   = require('../../../shared/util')

"""
// Stories are use cases that take multiple steps that are often precursors
// To the functionality that we want to test.
// Their main benefit is reducing the amount of code we need to write
// For tests by allowing us to start with fresh needed data in one helper method

// Sometimes we directly insert into the DB instead of going through a service
// To save execution overhead, e.g. creating a paymethod for a user without
// hitting braintree and making a slow network call
"""

addLocalUser = (userKey, opts, done) ->
  clone = dataHelpers.userData(userKey)
  newSession = dataHelpers.userSession(userKey)
  UserService.localSignup.call newSession, clone.email, clone.password, clone.name, (e, r) ->
    data.users[clone.userKey] = r
    if (opts)
      ups = {}
      if (opts.emailVerified)
        ups.emailVerified = true
      if (opts.gh)
        ups.social = {gh:opts.gh}

      r = _.extend(r, ups)
      db.Models.User.findOneAndUpdate {_id:r._id}, ups, {upsert:true}, (err, user) ->
        data.users[clone.userKey] = r
        done(clone.userKey)
    else
      done(clone.userKey)


 addAndLoginLocalUser = (originalUserKey, done) ->
  addLocalUser originalUserKey, {}, (userKey) ->
    LOGIN userKey, (u) ->
      GET '/session/full', {}, (s) ->
        s.userKey = userKey
        done(s)


 addAndLoginLocalUserWithEmailVerified = (originalUserKey, done) ->
  addLocalUser originalUserKey, {emailVerified: true}, (userKey) ->
    LOGIN userKey, (resp) ->
      GET '/session/full', {}, (s) ->
        expect(s.emailVerified).to.be.true
        s.userKey = userKey
        done(s)


 addAndLoginLocalUserWithPayMethod = (originalUserKey, done) ->
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
    session = dataHelpers.userSession()

    # so we aren't aliasing on every login
    session.sessionID = 'test'+userKey

    # Add an administrator
    UserService.googleLogin.call session, data.oauth[userKey], (e,r) ->
      if (!r.roles || !r.roles.length)
        UserService.toggleUserInRole.call {user:r}, r._id, role, (ee,rr) ->
          if (role == 'editor')
            gh = data.users.jkya.social.gh
            db.Models.User.findOneAndUpdate {_id:r._id}, {social: {gh}}, {upsert:true}, (err, rrr) ->
              data.users[userKey] = rrr
              done(err,rrr)
          else
            data.users[userKey] = rr
            done(e,rr)
      else
        data.users[userKey] = r
        done(null, r)


  addAndLoginLocalUserWithGithubProfile: (userKey, ghSocial, done) ->
    opts = emailVerified: true, gh: ghSocial || data.users.apt1.social.gh
    addLocalUser userKey, opts, (userKey) ->
      LOGIN userKey, ->
        GET '/session/full', {}, (s) ->
          s.userKey = userKey
          done(s)


  injectOAuthPayoutMethod: (user, providerName,pmKey,cb) ->
    PaymethodsService.addOAuthPayoutmethod.call({user},
      providerName, data.paymethods[pmKey],{},(e,r)->cb(r))


  createNewExpert: (seedKey, expData, done) ->
    userKey = "#{seedKey}#{timeSeed()}"
    username = "#{seedKey}-#{timeSeed()}"
    initials = "ap-#{timeSeed()}"
    localization = data.wrappers.localization_melbourne
    bio = "a bio for apexpert 1 #{timeSeed()}"
    user = _.extend({initials,localization,bio}, data.users[seedKey])
    if (user.social)
      user.social.gh = user.social.gh || data.users.ape1.social.gh
    else
      user.social = { gh: data.users.ape1.social.gh }
    user._id = newId()
    user.username = userKey
    user.googleId = userKey
    user.google = user.google || data.users.ape1.google
    user.email = user.email.replace('@',timeSeed()+'@')
    db.ensureDoc 'User', user, ->
      data.users[userKey] = user
      LOGIN userKey, (s) ->
        s.userKey = userKey
        d = rate: 70, breif: 'yo', tags: [data.tags.angular]
        POST "/experts/me", d, {}, (expert) ->
          done(s, expert)


  newLoggedInExpert: (userKey, done) ->
    user = dataHelpers.expertUserData(userKey)
    seedExpert = dataHelpers.expertData(userKey, user)
    data.users[user.userKey] = user
    data.experts[user.userKey] = seedExpert

    db.ensureDocs 'User', [user], (e) ->
      db.ensureDocs 'Expert', [seedExpert], (ee) ->
        LOGIN user.userKey, (expertSession) ->
          expertSession.userKey = user.userKey
          expertSession.expertId = seedExpert._id
          done(seedExpert, expertSession)


  newLoggedInExpertWithPayoutmethod: (userKey, done) ->
    stories.newLoggedInExpert userKey, (expert, expertSession) ->
      stories.injectOAuthPayoutMethod expertSession, 'paypal', 'payout_paypal_enus_verified', (payoutmethod) ->
        done expert, expertSession, payoutmethod


  ensureV1LoggedInExpert: (userKey, done) ->
    user = _.extend({localization:data.wrappers.localization_melbourne}, data.users[userKey])
    expert = data.experts[userKey]
    expert.user = selectFromObject(user, expertData.select.userCopy)
    db.ensureDocs 'User', [user], (e) ->
      db.ensureDocs 'Expert', [expert], (ee) ->
        LOGIN userKey, (sExpert) ->
          done sExpert


  ensureV0Expert: (userKey, done) ->
    user = _.extend({emailVerified:true},data.users[userKey])
    db.ensureDocs 'User', [user], (e) ->
      db.ensureDocs 'Expert', [data.experts[userKey]], (ee) ->
        done()


  applyToBeAnExpert: (expertData, done) ->
    expertData.tags = expertData.tags || [data.tags.angular]
    GET "/experts/me", {}, (meExpert) ->
      d = _.extend(meExpert, expertData)
      PUT "/users/me/username", {  username: expertData.username || expertData.userKey }, {}, ->
        PUT "/users/me/initials", { initials: expertData.initials }, {}, ->
          PUT "/users/me/location", expertData.location || data.wrappers.localization_melbourne.locationData, {}, ->
            PUT "/users/me/bio", { bio: expertData.bio || 'a bio'}, {}, ->
              # $log('updating expert'.cyan, meExpert._id, d)
              if (meExpert._id)
                PUT "/experts/#{meExpert._id}/me", d, {}, done
              else
                POST "/experts/me", d, {}, done


  createNewPost: (userKey, postData, done) ->
    LOGIN userKey, (authorSession) ->
      title = postData.title || 'A test post '+moment().format('X')
      # slug = title.toLowerCase().replace(/\ /g, '-')
      # tags = slug,
      author = data.users[userKey]
      b = { userId: author._id, name: author.name, bio: 'yo yo', avatar: author.avatar }
      d = { title, by:b, assetUrl: 'http://youtu.be/qlOAbrvjMBo' } #tags
      d = _.extend(d, postData)
      d.md = 'New'
      POST '/posts', d, {}, done


  createSubmitReadyPost: (userKey, postData, done) ->
    stories.createNewPost userKey, postData, (post) ->
      PUT "/posts/#{post._id}/md", { md: postData.md }, {}, (p1) ->
        expect(p1.md).to.equal(postData.md)
        p1.tags = postData.tags || [data.tags.angular,data.tags.node]
        p1.assetUrl = 'http://youtu.be/qlOAbrvjMBo'
        PUT "/posts/#{post._id}", _.omit(p1,['reviews']), {}, done


  ## Todo, consider not using createAndPublishPost
  createAndPublishPost: (author, postData, done) ->
    $log('createAndPublishPost deprecated'.red.dim)
    title = 'A test post '+moment().format('X')
    slug = title.toLowerCase().replace(/\ /g, '-')
    tags = [data.tags.angular,data.tags.node]
    b = { userId: author._id, name: author.name, bio: 'yo yo', avatar: author.avatar }
    d = { tags, title, by:b, slug, md: 'Test', assetUrl: 'http://youtu.be/qlOAbrvjMBo', submitted: new Date, published: new Date() }
    d = _.extend(d, postData)
    d.reviews = [dataHelpers.postReview({email:'jk@airpair.com'}),
                 dataHelpers.postReview({email:'pg@airpair.com'}),
                 dataHelpers.postReview({email:'ar@airpair.com'})]
    POST '/posts', d, {}, (p) ->
      #PUT '/posts/publish/'+p._id, p, {}, (ppub) ->
      done()


  setupCompanyWithPayMethodAndTwoMembers: (companyCode, adminCode, memberCode, done) ->
    addAndLoginLocalUser memberCode, (sCompanyMember) ->
      addAndLoginLocalUser adminCode, (sCompanyAdmin) ->
        c = _.clone(data.v0.companys[companyCode])
        c._id = new db.ObjectId()
        c.contacts[0]._id = sCompanyAdmin._id
        db.ensureDocs 'Company', [c], (e,r) ->
          d =
            type: 'braintree',
            token: braintree.Test.Nonces.Transactable,
            name: "#{c.name} Company Card",
            companyId: c._id
          POST '/billing/paymethods', d, {}, (pm) ->
            LOGIN 'admin', ->
              PUT "/adm/companys/migrate/#{c._id}", {type:'smb'}, {}, (r) ->
                PUT "/adm/companys/member/#{c._id}", {user:sCompanyMember}, {}, (rCompany) ->
                  done(c._id, pm._id, sCompanyAdmin, sCompanyMember)


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
        PUT "/requests/#{r0._id}", _.extend(r0,{budget,title:'test'}), {}, (r) ->
          cb(r,sessionCustomer)


  newCompleteRequestForAdmin: (userKey, requestData, cb) ->
    SETUP.newCompleteRequest userKey, requestData, (r,sCust) ->
      LOGIN 'admin', ->
        GET "/adm/requests/user/#{r.userId}", {}, (rAdm) ->
          expect(r.status).to.equal('received')
          expect(rAdm.length).to.equal(1)
          expect(rAdm[0].lastTouch.utc).to.exist
          expectStartsWith(rAdm[0].lastTouch.by.name,data.users[userKey].name)
          expect(rAdm[0].adm.active).to.be.true
          expect(rAdm[0].adm.owner).to.be.undefined
          expect(rAdm[0].adm.lastTouch).to.be.undefined
          expect(rAdm[0].adm.submitted).to.exist
          expect(rAdm[0].adm.received).to.be.undefined
          expect(rAdm[0].adm.farmed).to.be.undefined
          expect(rAdm[0].adm.reviewable).to.be.undefined
          expect(rAdm[0].adm.booked).to.be.undefined
          expect(rAdm[0].adm.paired).to.be.undefined
          expect(rAdm[0].adm.feedback).to.be.undefined
          expect(rAdm[0].adm.closed).to.be.undefined
          expect(rAdm[0].messages.length).to.equal(0)
          cb(rAdm[0],sCust)


  newBookedRequest: (customerUserKey, requestData, expertUserKey, cb) ->
    SETUP.newCompleteRequest customerUserKey, {}, (request, customerSession) ->
      SETUP.newLoggedInExpert expertUserKey, (expert, expertSession) ->
        reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
        PUT "/requests/#{request._id}/reply/#{expert._id}", reply, {}, (r1) ->
          expect(r1.suggested[0].expertStatus).to.equal("available")
          expect(customerSession.primaryPayMethodId).to.exist
          LOGIN customerSession.userKey,  ->
            GET "/requests/#{request._id}/book/#{expert._id}", {}, (r2) ->
              airpair1 = time: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: customerSession.primaryPayMethodId, request: { requestId: request._id, suggestion: r2.suggested[0] }
              POST "/bookings/#{expert._id}", airpair1, {}, (booking) ->
                expect(booking._id).to.exist
                cb(request, booking, customerSession, expertSession)


  newBookedRequestWithExistingExpert: (customerUserKey, requestData, expertSession, cb) ->
    SETUP.newCompleteRequest customerUserKey, {}, (request, customerSession) ->
      LOGIN expertSession.userKey, () ->
        reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
        PUT "/requests/#{request._id}/reply/#{expertSession.expertId}", reply, {}, (r1) ->
          LOGIN customerSession.userKey, ->
            GET "/requests/#{request._id}/book/#{expertSession.expertId}", {}, (r2) ->
              airpair1 = time: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: customerSession.primaryPayMethodId, request: { requestId: request._id, suggestion: r2.suggested[0] }
              POST "/bookings/#{expertSession.expertId}", airpair1, {}, (booking) ->
                cb(request, booking, customerSession, expertSession)


  releaseOrderAndLogExpertBackIn: (orderId, expertSession, cb) ->
    LOGIN 'admin', ->
      PUT "/adm/billing/orders/#{orderId}/release", {}, {}, (released) ->
        LOGIN expertSession.userKey, cb

}

module.exports = stories
