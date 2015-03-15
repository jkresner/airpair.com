var dataHelpers           = require('./data')
var db                    = require('./db')
var stories               = require('./stories')
var stubs                 = require('./../helpers/stubs')

var setup = {

  init(done)
  {
    new db.Models.User(data.users.admin).save((e,r) => {
      if (e) return done()  // we failed to insert as it's done already
      $log('mongodb_restore'.cyan)
      db.RestoreBSONData(done)
    })
  },

  upsertProviderProfile(provider, userKey, done)
  {
    var user = data.oauth[userKey]
    UserService.upsertProviderProfile(null, provider, user, done)
  },

  initTags(done)
  {
    done()
    // db.initCollectionData('Tag', {slug:'angularjs'}, _.values(data.tags), done)
  },

  initTemplates(done)
  {
    done()
    // db.initCollectionData('Template', {key:'post-repo-readme'}, data.templates, done)
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
        SETUP.ensureV0LoggedInExpert('dros', () =>
          SETUP.ensureV1LoggedInExpert('abha', () =>
            SETUP.ensureV0LoggedInExpert('tmot', () =>
              SETUP.ensureV0LoggedInExpert('admb', () => done() ))))
      }
      else
        done()
    })
  }

}

// setup = _.extend(setup,db)
setup = _.extend(setup,dataHelpers)
setup = _.extend(setup,stubs)

for (var story of _.keys(stories)) {
  setup[story] = stubs.analytics.storyWithNoAnalytics(stories[story])
}


module.exports = setup
