var mongoose = require('mongoose')
var util = require('../../../shared/util')
var UserService = require('../../../server/services/users')
var {Settings} = require('../../../server/models/v0')
var Models = {
  Tag: require('../../../server/models/tag'),
  Workshop: require('../../../server/models/workshop'),
  View: require('../../../server/models/view'),
  User: require('../../../server/models/user'),
  Expert: require('../../../server/models/expert'),
  PayMethod: require('../../../server/models/paymethod'),
  Post: require('../../../server/models/post'),
  Order: require('../../../server/models/order'),
  Company: require('../../../server/models/company'),
  Session: mongoose.model('Session', {_id: String, session: String, expires: Date}, 'v1sessions')
}


global.braintree = require('braintree')


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
    new Models.PayMethod( _.extend({userId: s._id}, data.paymethods.generic) ).save( (e,r) => {
      s.primaryPayMethodId = r._id
      done(s)
    })
  })
}

global.createCountedDone = function(count, done)
{
    return (function(){
      var the_count = count
      return function() {
        the_count--
        if (the_count == 0) {
          return done()
        }
      }
    })()
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
}

module.exports = {

  init(done)
  {
    var _id = data.users.admin._id
    Models.User.findOneAndUpdate({_id}, data.users.admin, { upsert: true }, done)
  },

  addUserWithRole: addUserWithRole,

  upsertProviderProfile(provider, userKey, done)
  {
    var user = data.oauth[userKey]
    UserService.upsertProviderProfile(null, provider, user, done)
  },

  initTags(done)
  {
    Models.Tag.findOne({slug:'angularjs'}, function(e,r) {
      if (!r) {
        var bulk = Models.Tag.collection.initializeOrderedBulkOp()
        for (var t in data.tags) { bulk.insert(data.tags[t]) }
        bulk.execute(done)
        cache.flush('tags')
      }
      else
        done()
    })
  },

  initPosts(done)
  {
    Models.Post.findOne({slug:'starting-a-mean-stack-app'}, function(e,r) {
      if (!r) {
        var {v1AirPair,migrateES6,sessionDeepDive,sessionDeepDive2} = data.posts
        var bulk = Models.Post.collection.initializeOrderedBulkOp()
        for (var t of [v1AirPair,migrateES6,sessionDeepDive,sessionDeepDive2]) { bulk.insert(t) }
        bulk.execute(done)
        cache.flush('posts')
      }
      else
        done()
    })
  },

  initWorkshops(done)
  {
    Models.Workshop.findOne({slug:'simplifying-rails-tests'}, function(e,r) {
      if (!r) {
        var {railsTests, biggestFailsOnThePlayStore} = data.workshops
        railsTests.time = moment().add(1,'day').format()
        biggestFailsOnThePlayStore.time = moment().add(2,'day').format()
        var bulk = Models.Workshop.collection.initializeOrderedBulkOp()
        for (var t of [railsTests,biggestFailsOnThePlayStore]) { bulk.insert(t) }
        bulk.execute(done)
        cache.flush('workshops')
      }
      else
        done()
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
        c._id = new mongoose.Types.ObjectId()
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
  },

  ModelById(modelName, id, cb) {
    Models[modelName].findOne({_id:id}, cb)
  },

  viewsByUserId(userId, cb) {
    Models.View.find({userId}, cb)
  },

  viewsByAnonymousId(anonymousId, cb) {
    Models.View.find({anonymousId}, cb)
  },

  readUser(id, cb) {
    Models.User.findOne({_id:id}, (e,r)=> { r.toObject(); cb(e,r); })
  },

  ensureExpert(user, expert, cb) {
    ensureDocument(Models.User, user, () => {
      ensureDocument(Models.Expert, expert, cb)
    })
  },

  ensureSettings(user, settings, cb) {
    settings.userId = user._id
    ensureDocument(Settings, settings, cb)
  },

  ensurePost(post, cb) {
    ensureDocument(Models.Post, post, cb)
  },

  ensureDoc(modelName, doc, cb) {
    ensureDocument(Models[modelName], doc, cb)
  },

  ensureDocs(modelName, docs, cb) {
    var bulk = Models[modelName].collection.initializeOrderedBulkOp()
    for (var o of docs) { bulk.insert(o) }
    bulk.execute(cb)
  }


}
