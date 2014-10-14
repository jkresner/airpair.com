var UserService = require('../../../server/services/users')
var Tag = require('../../../server/models/tag')
var Workshop = require('../../../server/models/workshop')
var View = require('../../../server/models/view')
var User = require('../../../server/models/user')
var util = require('../../../shared/util')

global.stubAnalytics = function()
{
  global.trackStub = sinon.stub(analytics,'track', (p1,p2,p3,p4,p5,cb) => { if (cb) cb() })
  global.viewStub = sinon.stub(analytics,'view', (p1,p2,p3,p4,p5,p6,cb) => { if (cb) cb() })
  global.identifyStub = sinon.stub(analytics,'identify', (p1,p2,p3,p4,cb) => { if (cb) cb() })
  global.aliasStub = sinon.stub(analytics,'alias', (p1,p2,p3,cb) => { if (cb) cb() })
}

global.resotreAnalytics = function()
{
  global.trackStub.restore()
  global.identifyStub.restore()
  global.aliasStub.restore()
  global.viewStub.restore()
}

global.getNewUserData = function(userKey)
{
  var seed = data.users[userKey]
  var suffix = moment().format('X')
  return {
    email: seed.email.replace('@',suffix+'@'),
    name: seed.name+suffix,
    password: 'testpass'+suffix,
    userKey: userKey + suffix
  }
}


global.newUserSession = function(userKey)
{
  var suffix = moment().format('X')
  var session = { cookie: {
    originalMaxAge: 2419200000,
    _expires: moment().add(2419200000, 'ms').subtract(1,'s') }
  }
  cookieCreatedAt = util.sessionCreatedAt(session)
  return {user:null,sessionID:`test${userKey}${suffix}`,session}
}

global.addLocalUser = function(userKey, done)
{
  var clone = getNewUserData(userKey)

  UserService.tryLocalSignup.call(newUserSession(userKey), clone.email, clone.password, clone.name, function(e,r) {
    data.users[clone.userKey] = r;
    done(clone.userKey)
  })
}

global.addAndLoginLocalUser = function(originalUserKey, done)
{
  addLocalUser(originalUserKey, function(userKey) {
    LOGIN(userKey, data.users[userKey], function() {
      GET('/session/full', {}, function(s) {
        s.userKey = userKey
        done(s)
      })
    })
  })
}


function addUserWithRole(userKey, role, done)
{
  stubAnalytics()
  var session = newUserSession();
  session.sessionID = 'test'+userKey; // so we aren't aliasing on every login
  // Add an administrator
  UserService.upsertProviderProfile.call(session, 'google', data.oauth[userKey], function(e,r){
    if (!r.roles || !r.roles.length) {
      UserService.toggleUserInRole.call({user:r}, r._id, role, function(e,rr) {
        data.users[userKey] = rr;
        resotreAnalytics()
        done()
      })
    }
    else {
      data.users[userKey] = r;
      resotreAnalytics()
      done()
    }
  })
}


module.exports = {

  init: function(done)
  {
    addUserWithRole('admin', 'admin', done)
  },

  addUserWithRole: addUserWithRole,

  initTags: function(done)
  {
    Tag.findOne({slug:'angularjs'}, function(e,r) {
      if (!r) {
        var tags = [data.tags.angular,data.tags.node,data.tags.mongo]
        Tag.create(tags, done)
      }
      else
        done()
    })
  },

  upsertProviderProfile: function(provider, userKey, done)
  {
    var user = data.oauth[userKey]
    UserService.upsertProviderProfile(null, provider, user, done)
  },

  createAndPublishPost: function(by, postData, done) {
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

  createWorkshop: function(workshop, done)
  {
    workshop.time = new Date()
    Workshop.findOne({slug:workshop.slug}, function(e,r) {
      if (!r) {
        Workshop.create(workshop, done)
      }
      else
        if (done) done()
    })
  },

  viewsByUserId: function(userId, cb) {
    View.find({userId}, cb)
  },

  viewsByAnonymousId: function(anonymousId, cb) {
    View.find({anonymousId}, cb)
  },

  ensureUser: function(user, cb) {
    User.findByIdAndRemove(user._id, (e, r) => {new User(user).save(cb)})
  }

}


