//-- might be cool to inject this instead of require
var db = require('./setup.db')
var UserService = require('../../../server/services/users')

// Stories are use cases that take multiple steps that are often precursors
// To the functionality that we want to test.
// Their main benefit is reducing the amount of code we need to write
// For tests by allowing us to start with fresh needed data in one helper method

// Sometimes we directly insert into the DB instead of going through a service
// To save execution overhead, e.g. creating a paymethod for a user without
// hitting braintree and making a slow network call

global.addLocalUser = function(userKey, opts, done)
{
  var clone = getNewUserData(userKey)
  UserService.tryLocalSignup.call(newUserSession(userKey), clone.email, clone.password, clone.name, function(e, r) {
    data.users[clone.userKey] = r
    if (opts && opts.emailVerified)
    {
      UserService.update.call(this, data.users[clone.userKey]._id, opts, function(err, user) {
        data.users[clone.userKey] = user
        done(clone.userKey)
      })
    }
    else done(clone.userKey)
  })
}


global.addAndLoginLocalUserWithEmailVerified = function(originalUserKey, done)
{
  addLocalUser(originalUserKey, {emailVerified: true}, function(userKey) {
    LOGIN(userKey, data.users[userKey], function(resp) {
      GET('/session/full', {}, function(s) {
        expect(s.emailVerified).to.be.true
        s.userKey = userKey
        done(s)
      })
    })
  })
}

global.addAndLoginLocalUser = function(originalUserKey, done)
{
  addLocalUser(originalUserKey, {}, function(userKey) {
    LOGIN(userKey, data.users[userKey], function() {
      GET('/session/full', {}, function(s) {
        s.userKey = userKey
        done(s)
      })
    })
  })
}

global.addAndLoginLocalUserWithPayMethod = function(originalUserKey, done)
{
  addAndLoginLocalUserWithEmailVerified(originalUserKey, (s) =>{
    new db.Models.PayMethod( _.extend({userId: s._id}, data.paymethods.generic) ).save( (e,r) => {
      s.primaryPayMethodId = r._id
      done(s)
    })
  })
}

var stories = {

  addUserWithRole(userKey, role, done)
  {
    var session = newUserSession()

    // so we aren't aliasing on every login
    session.sessionID = 'test'+userKey

    // Add an administrator
    UserService.upsertProviderProfile.call(session, 'google', data.oauth[userKey], function(e,r){
      if (!r.roles || !r.roles.length) {
        UserService.toggleUserInRole.call({user:r}, r._id, role, function(e,rr) {
          data.users[userKey] = rr;
          done(e,rr)
        })
      }
      else {
        data.users[userKey] = r;
        done(null, r)
      }
    })
  },

  createAndPublishPost(by, postData, done) {
    var title = 'A test post '+moment().format('X')
    var slug = title.toLowerCase().replace(/ /g,'-')
    var tags = [data.tags.angular,data.tags.node]
    var by = { userId: by._id, name: by.name, bio: 'yo yo', avatar: by.avatar }
    var d = { tags, title, by, slug,  md: 'Test', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
    d = _.extend(d, postData)
    POST('/posts', d, {}, function(p) {
      PUT('/posts/publish/'+p._id, p, {}, function(ppub) {
        done()
      })
    })
  },

  setupCompanyWithPayMethodAndTwoMembers(companyCode, adminCode, memberCode, done) {
    addAndLoginLocalUser(memberCode, (sCompanyMember) => {
      addAndLoginLocalUser(adminCode, (sCompanyAdmin) => {
        var c = _.clone(data.v0.companys[companyCode])
        c._id = new db.ObjectId()
        c.contacts[0]._id = sCompanyAdmin._id
        testDb.ensureDocs('Company', [c], (e,r) => {
          var d = { type: 'braintree', token: braintree.Test.Nonces.Transactable, name: `${c.name} Company Card`, companyId: c._id }
          POST('/billing/paymethods', d, {}, (pm) => {
            LOGIN('admin', data.users.admin, () => {
              PUT(`/adm/companys/migrate/${c._id}`, {type:'smb'}, {}, (r) => {
                PUT(`/adm/companys/member/${c._id}`, {user:sCompanyMember}, {}, (rCompany) => {
                  done(c._id, pm._id, sCompanyAdmin, sCompanyMember)
          })})})})
        })
      })
    })
  }
}


module.exports = stories
