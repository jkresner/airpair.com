var dataHelpers           = require('./data')
var stubs                 = require('./stubs')


var setup = {

  initStubs()
  {
    return {
      timezone: stubs.stubGoogleTimezone(),
      slackGetUsers: SETUP.stubSlack('getUsers', data.wrappers.slack_users_list),
      slackGetChannels: SETUP.stubSlack('getChannels', data.wrappers.slack_channels_list),
      slackGetGroups: SETUP.stubSlack('getGroups', data.wrappers.slack_groups_list),
    }
  },

  ensureExpert(key, done)
  {
    DB.ensureDocs('User', [FIXTURE.users[key]], (e) => {
      DB.ensureDocs('Expert', [FIXTURE.experts[key]], (ee) => done())
    })
  },

  initExperts(done)
  {
    DB.docById('expert',FIXTURE.experts.admb._id, function(r) {
      if (r) return done()
      setup.ensureExpert('dros', () =>
        setup.ensureExpert('tmot', () =>
          done() ))

        // SETUP.ensureV0Expert('snug', () =>
        //   SETUP.ensureV0Expert('rbig', () =>
        //     SETUP.ensureV1LoggedInExpert('abha', () =>
        //         SETUP.ensureV0Expert('admb', () => done() ))))))

    })
  }

}


module.exports = Object.assign(setup,stubs,dataHelpers)
