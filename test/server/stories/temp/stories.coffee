



UserService          = require('../../../server/services/users')
expertData           = require('../../../server/services/experts.data')


"""
// Stories are use cases that take multiple steps that are often precursors
// To the functionality that we want to test.
// Their main benefit is reducing the amount of code we need to write
// For tests by allowing us to start with fresh needed data in one helper method

// Sometimes we directly insert into the DB instead of going through a service
// To save execution overhead, e.g. creating a paymethod for a user without
// hitting braintree and making a slow network call
"""

updateUser = (userKey, _id, ups, done) ->
  DB.Collections.users.findAndModify {_id}, [['_id',1]], { $set: ups }, {'new':true}, (e, r) ->
    FIXTURE.users[userKey] = r.value
    done userKey


addLocalUser = (userKey, opts, done) ->
  clone = DATA.newSignupData(userKey)
  newSession = DATA.newSession(userKey)
  UserService.localSignup.call newSession, clone.email, clone.password, clone.name, (e, r) ->
    expect(r.email)
    FIXTURE.users[clone.userKey] = r
    if (opts)
      ups = {}
      if (opts.emailVerified)
        ups.emailVerified = true
      if (opts.gh)
        ups.social = {gh:opts.gh}
      if (opts.localization)
        ups.localization = FIXTURE.wrappers.localization_melbourne

      r = _.extend(r, ups)
      updateUser clone.userKey, r._id, ups, done
    else
      done(clone.userKey)


 addAndLoginLocalUser = (originalUserKey, done) ->
  addLocalUser originalUserKey, {}, (userKey) ->
    LOGIN {key:userKey}, (u) ->
      GET '/session/full', {}, (s) ->
        s.userKey = userKey
        done(s)


 addAndLoginLocalUserWithEmailVerified = (originalUserKey, done) ->
  addLocalUser originalUserKey, {emailVerified: true}, (userKey) ->
    LOGIN {key:userKey}, (resp) ->
      GET '/session/full', {}, (s) ->
        expect(s.emailVerified).to.be.true
        s.userKey = userKey
        done(s)


 addAndLoginLocalUserWithEmailVerifiedAndTimezone = (originalUserKey, done) ->
  addLocalUser originalUserKey, {emailVerified: true, localization: true}, (userKey) ->
    LOGIN userKey, (resp) ->
      GET '/session/full', {}, (s) ->
        s.userKey = userKey
        done(s)


 addAndLoginLocalUserWithPayMethod = (originalUserKey, done) ->
  addAndLoginLocalUserWithEmailVerified originalUserKey, (s) ->
    new db.Models.paymethod( _.extend({userId: s._id}, data.paymethods.braintree_visa) ).save (e,r) ->
      s.primaryPayMethodId = r._id
      done(s)



stories = {

  addLocalUser,
  addAndLoginLocalUser,
  addAndLoginLocalUserWithEmailVerified,
  addAndLoginLocalUserWithPayMethod,


  addAndLoginUserWithRole: (userKey, role, done) ->
    session = DATA.newSession()

    # so we aren't aliasing on every login
    session.sessionID = 'test'+userKey

    addAndLoginLocalUser userKey, (s) ->
      LOGIN 'admin', ->
        PUT "/adm/users/#{data.users[s.userKey]._id}/role/#{role}", {}, {}, (user) ->
          expect(user.roles.length).to.equal(1)
          expect(user.roles[0]).to.equal(role)
          data.users[s.userKey].roles = user.roles
          LOGIN s.userKey, (sWithRole) ->
            done(sWithRole)


  addEditorUserWithGitHub: (userKey, done) ->
    session = dataHelpers.userSession()
    # so we aren't aliasing on every login
    session.sessionID = 'test'+userKey

    UserService.googleLogin.call session, data.oauth[userKey], (e,r) ->
      if (!r.roles || !r.roles.length)
        UserService.toggleUserInRole.call {user:r}, r._id, "editor", (ee,rr) ->
          upsertUser userKey, r._id, {'social.gh':data.users.jkya.social.gh}, done
      else
        data.users[userKey] = r
        done userKey


  addAndLoginLocalUserWhoCanMakeBooking: (userKey, done) ->
    opts = emailVerified: true, localization: true
    addLocalUser userKey, opts, (userKey) ->
      LOGIN userKey, ->
        GET '/session/full', {}, (s) ->
          s.userKey = userKey
          new db.Models.paymethod( _.extend({userId: s._id}, data.paymethods.braintree_visa) ).save (e,r) ->
            s.primaryPayMethodId = r._id
            done(s)


  addAndLoginLocalUserWithGithubProfile: (userKey, ghSocial, done) ->
    opts = emailVerified: true, gh: ghSocial || data.users.apt1.social.gh
    addLocalUser userKey, opts, (userKey) ->
      LOGIN userKey, ->
        GET '/session/full', {}, (s) ->
          s.userKey = userKey
          done(s)


  connectOAuth: (user, provider, profile, done) ->
    short = null
    if provider is 'twitter' then short = 'tw'
    if provider is 'github' then short = 'gh'
    if provider is 'linkein' then short = 'in'
    UserService.connectProvider.call {user}, provider, short, profile, ->
      GET '/session/full', {}, (s) ->
        done(s)


  connectGoogle: (user, profile, done) ->
    profile = _.clone(profile)
    profile.id = profile.id + timeSeed()
    UserService.googleLogin.call {user}, profile, (e,r) ->
      GET '/session/full', {}, (s) ->
        done(s)


  # createSubmitReadyPost: (userKey, postData, done) ->
  #   stories.createNewPost userKey, postData, (post) ->
  #     PUT "/posts/#{post._id}/md", { md: postData.md }, {}, (p1) ->
  #       expect(p1.md).to.equal(postData.md)
  #       p1.tags = postData.tags || [data.tags.angular,data.tags.node]
  #       p1.assetUrl = 'http://youtu.be/qlOAbrvjMBo'
  #       PUT "/posts/#{post._id}", _.omit(p1,['reviews']), {}, done


  # ## Todo, consider not using createAndPublishPost
  # createAndPublishPost: (author, postData, done) ->
  #   $log('createAndPublishPost deprecated'.red.dim)
  #   title = 'A test post '+moment().format('X')
  #   slug = title.toLowerCase().replace(/\ /g, '-')
  #   tags = [data.tags.angular,data.tags.node]
  #   b = { userId: author._id, name: author.name, bio: 'yo yo', avatar: author.avatar }
  #   d = { tags, title, by:b, slug, md: 'Test', assetUrl: 'http://youtu.be/qlOAbrvjMBo', submitted: new Date, published: new Date() }
  #   d = _.extend(d, postData)
  #   d.reviews = [dataHelpers.postReview({email:'jk@airpair.com'}),
  #                dataHelpers.postReview({email:'pg@airpair.com'}),
  #                dataHelpers.postReview({email:'ar@airpair.com'})]
  #   POST '/posts', d, {}, (p) ->
  #     #PUT '/posts/publish/'+p._id, p, {}, (ppub) ->
  #     done()


  # setupCompanyWithPayMethodAndTwoMembers: (companyCode, adminCode, memberCode, done) ->
  #   addAndLoginLocalUserWithEmailVerifiedAndTimezone memberCode, (sCompanyMember) ->
  #     addAndLoginLocalUserWithEmailVerifiedAndTimezone adminCode, (sCompanyAdmin) ->
  #       c = _.clone(data.v0.companys[companyCode])
  #       c._id = newId()
  #       c.contacts[0]._id = sCompanyAdmin._id
  #       db.ensureDocs 'Company', [c], ->
  #         d =
  #           type: 'braintree',
  #           token: data.wrappers.braintree_test_nonces_transactable,
  #           name: "#{c.name} Company Card",
  #           companyId: c._id
  #         POST '/billing/paymethods', d, {}, (pm) ->
  #           LOGIN 'admin', ->
  #             PUT "/adm/companys/migrate/#{c._id}", {type:'smb'}, {}, (r) ->
  #               PUT "/adm/companys/member/#{c._id}", {user:sCompanyMember}, {}, (rCompany) ->
  #                 done(c._id, pm._id, sCompanyAdmin, sCompanyMember)


  ensureBookingFromRequest: (objectKey, cb) ->
    db.ensureDocs 'Request', [data.requests[objectKey]], ->
      db.ensureDocs 'Order', [data.orders[objectKey]], ->
        db.ensureDoc 'Booking', data.bookings[objectKey], (e, b) ->
          b.request = data.requests[objectKey]
          cb(b)


}

module.exports = stories
