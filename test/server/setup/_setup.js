var dataHelpers           = require('./data')
var stories               = require('./stories')
var stubs                 = require('./../helpers/stubs')

var setup = {

  init(done)
  {
    new db.Models.User(data.users.admin).save((e,r) => {
      if (e) return done()  // we failed to insert as it's done already
      this.timeout(10000)
      db.RestoreBSONData(done)
    })
  },


  initStubs()
  {
    return {
      timezone: stubs.stubGoogleTimezone(),
      slackGetUsers: SETUP.stubSlack('getUsers', data.wrappers.slack_users_list),
      slackGetChannels: SETUP.stubSlack('getChannels', data.wrappers.slack_channels_list),
      slackGetGroups: SETUP.stubSlack('getGroups', data.wrappers.slack_groups_list),
    }
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
        SETUP.ensureV0Expert('snug', () =>
          SETUP.ensureV0Expert('rbig', () =>
            SETUP.ensureV0Expert('dros', () =>
              SETUP.ensureV1LoggedInExpert('abha', () =>
                SETUP.ensureV0Expert('tmot', () =>
                  SETUP.ensureV0Expert('admb', () => done() ))))))
      }
      else
        done()
    })
  }

}

setup = _.extend(setup,stubs)
setup = _.extend(setup,stories)
setup = _.extend(setup,dataHelpers)

module.exports = setup
