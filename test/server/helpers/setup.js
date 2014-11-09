var UserService = require('../../../server/services/users')
var Tag = require('../../../server/models/tag')
var Workshop = require('../../../server/models/workshop')
var View = require('../../../server/models/view')
var User = require('../../../server/models/user')
var Expert = require('../../../server/models/expert')
var PayMethod = require('../../../server/models/paymethod')
var Post = require('../../../server/models/post')
var {Settings,Company} = require('../../../server/models/v0')
var util = require('../../../shared/util')

global.braintree = require('braintree')

var mongoose = require('mongoose')
var Session = mongoose.model('Session', {_id: String, session: String, expires: Date}, 'v1sessions')

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
		new PayMethod( _.extend({userId: s._id}, data.paymethods.generic) ).save( (e,r) => {
	    s.primaryPayMethodId = r._id
	    done(s)
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

function ensureDocument(Model, doc, cb, refresh)
{
	//if (refresh) return
	Model.findByIdAndRemove(doc._id, function(e, r) { new Model(doc).save((e,r)=> { r.toObject(); cb(e,r); } ); })
  //Model.findOneAndUpdate({_id:doc._id}, doc, {upsert:true}, cb)  // problems in few places with upsert method
}

module.exports = {

  init: function(done)
  {
  	var _id = data.users.admin._id
    User.findOneAndUpdate({_id}, data.users.admin, { upsert: true }, done)
  },

  addUserWithRole: addUserWithRole,

  initTags: function(done)
  {
    Tag.findOne({slug:'angularjs'}, function(e,r) {
      if (!r) {
      	var {angular,node,mongo,mean,rails} = data.tags
        var bulk = Tag.collection.initializeOrderedBulkOp()
	    	for (var t of [angular,node,mongo,mean,rails]) { bulk.insert(t) }
	    	bulk.execute(done)
	    	cache.flush('tags')
      }
      else
        done()
    })
  },

  initPosts: function(done)
  {
    Post.findOne({slug:'starting-a-mean-stack-app'}, function(e,r) {
      if (!r) {
      	var {v1AirPair,migrateES6,sessionDeepDive} = data.posts
        var bulk = Post.collection.initializeOrderedBulkOp()
	    	for (var t of [v1AirPair,migrateES6,sessionDeepDive]) { bulk.insert(t) }
	    	bulk.execute(done)
	    	cache.flush('posts')
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

  sessionBySessionId: function (id, cb) {
    Session.find({_id:id}, (e,r) => {
      return cb(e,r[0])
    })
  },

  countSessionsInSessionStore: function(cb) {
    Session.find({}, function(e, r) {
      return cb(e, r.length)
    })
  },

  countViews: function(cb) {
    View.find({}, (e,r) => {
      return cb(e, r.length)
    })
  },

  viewsByUserId: function(userId, cb) {
    View.find({userId}, cb)
  },

  viewsByAnonymousId: function(anonymousId, cb) {
    View.find({anonymousId}, cb)
  },

  readUser: function(id, cb) {
  	User.findOne({_id:id}, (e,r)=> { r.toObject(); cb(e,r); })
  },

  ensureUser: function(user, cb) {
  	ensureDocument(User, user, cb, true)
  },

  ensureExpert: function(user, expert, cb) {
  	ensureDocument(User, user, () => {
	  	ensureDocument(Expert, expert, cb)
  	})
  },

  ensureSettings: function(user, settings, cb) {
  	settings.userId = user._id
    ensureDocument(Settings, settings, cb)
  },

  ensureCompany: function(user, company, cb) {
  	company.contacts[0].fullName = user.name
  	company.contacts[0].userId = user._id
    ensureDocument(Company, company, cb)
  },

  ensurePost: function(post, cb) {
  	ensureDocument(Post, post, cb)
  }

}


