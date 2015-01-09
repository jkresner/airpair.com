var db = require('./setup.db')
var dataHelpers = require('./setup.data')
var stories = require('./setup.stories')


global.braintree = require('braintree')

// "resotreAnalytics"

var analyticsSetup = {

  stubbed: false,

  stub()
  {
    if (analyticsSetup.stubbed) return
    global.trackStub = sinon.stub(analytics,'track', (p1,p2,p3,p4,p5,cb) => { if (cb) cb() })
    global.viewStub = sinon.stub(analytics,'view', (p1,p2,p3,p4,p5,p6,cb) => { if (cb) cb() })
    global.identifyStub = sinon.stub(analytics,'identify', (p1,p2,p3,p4,cb) => { if (cb) cb() })
    global.aliasStub = sinon.stub(analytics,'alias', (p1,p2,p3,cb) => { if (cb) cb() })
    analyticsSetup.stubbed = true
  },

  restore()
  {
    global.trackStub.restore()
    global.identifyStub.restore()
    global.aliasStub.restore()
    global.viewStub.restore()
    analyticsSetup.stubbed = false
  },

  withNoAnalytics(fn, args) {
    var args = [].slice.call(args)

    if (analyticsSetup.stubbed = false) {
      var done = args.pop()
      var doneWithStub = (e,r) => {
        analyticsSetup.restore()
        done(e,r)
      }
      args.push(doneWithStub)
      analyticsSetup.stub()
    }

    fn.apply({}, args)
  },

  storyWithNoAnalytics(storyName) {
    return function() { analyticsSetup.withNoAnalytics(stories[storyName], arguments) }
  }

}


var setup = {

  analytics: analyticsSetup,

  clearIdentity() {
    global.cookie = null
    global.cookieCreatedAt = null
  },

  init(done)
  {
    var _id = data.users.admin._id
    db.Models.User.findOneAndUpdate({_id}, data.users.admin, { upsert: true }, done)
  },

  upsertProviderProfile(provider, userKey, done)
  {
    var user = data.oauth[userKey]
    UserService.upsertProviderProfile(null, provider, user, done)
  },

  initTags(done)
  {
    db.initCollectionData('Tag', {slug:'angularjs'}, _.values(data.tags), done)
  },

  initPosts(done)
  {
    var {v1AirPair,migrateES6,sessionDeepDive,sessionDeepDive2} = data.posts
    var d = [v1AirPair,migrateES6,sessionDeepDive,sessionDeepDive2]
    db.initCollectionData('Post', {slug:'starting-a-mean-stack-app'}, d, done)
  },

  initWorkshops(done)
  {
    var {railsTests, biggestFailsOnThePlayStore} = data.workshops
    railsTests.time = moment().add(1,'day').format()
    biggestFailsOnThePlayStore.time = moment().add(2,'day').format()
    var d = [railsTests,biggestFailsOnThePlayStore]
    db.initCollectionData('Workshop', {slug:'simplifying-rails-tests'}, d, done)
  },

  initExperts(done)
  {
    db.Models.Expert.findOne({_id:data.experts.admb._id}, function(e,r) {
      if (!r) {
        db.ensureExpert('dros', () =>
          db.ensureExpert('tmot', () =>
            db.ensureExpert('abha', () =>
              db.ensureExpert('admb', done ))))
      }
      else
        done()
    })
  }

}

setup = _.extend(setup,db)

for (var story of _.keys(stories)) {
  setup[story] = analyticsSetup.storyWithNoAnalytics(story)
}

module.exports = setup
