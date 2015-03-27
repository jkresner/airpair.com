create = ->

  it "Cannot get my expert profile as anonymous user", itDone ->
    ANONSESSION (s) ->
      GET "/experts/me", { status: 401 }, (r) ->
        DONE()


  it "Cannot create / update expert profile as anonymous user", itDone ->
    ANONSESSION (s) ->
      POST "/experts/me", {_id: newId(), user: data.users['jk'] }, { status: 401 }, (r) ->
        PUT "/experts/me", {_id: newId(), user: data.users['jk'] }, { status: 401 }, (r) ->
          DONE()


  it "Cannot create expert profile without required user info", itDone ->
    d = rate: 80, breif: 'yo', tags: [data.tags.angular]
    SETUP.addAndLoginLocalUser 'alyr', (salyr) ->
      POST "/experts/me", d, { status: 403 }, (r) ->
        expectStartsWith(r.message, "Cannot create expert without username")
        PUT "/users/me/username", { username: salyr.userKey }, {}, (r) ->
          POST "/experts/me", d, { status: 403 }, (r) ->
            expectStartsWith(r.message, "Cannot create expert without initials")
            PUT "/users/me/initials", { initials: 'ar' }, {}, (r) ->
              POST "/experts/me", d, { status: 403 }, (r) ->
                expectStartsWith(r.message, "Cannot create expert without location")
                PUT "/users/me/location", data.wrappers.localization_melbourne.locationData, {}, (r) ->
                  expect(r.localization).to.exist
                  POST "/experts/me", d, { status: 403 }, (r) ->
                    expectStartsWith(r.message, "Cannot create expert without bio")
                    PUT "/users/me/bio", { bio: 'a bio'}, {}, (r) ->
                      POST "/experts/me", d, { status: 403 }, (r) ->
                        expectStartsWith(r.message, "Must connect at least 2 social account to create expert profile")
                        DONE()


  it "Can create expert profile with required user info", itDone ->
    d = rate: 80, breif: 'yo', tags: [data.tags.angular]
    db.ensureDoc 'User', data.users.ape1, ->
      db.findAndRemove 'Expert', { userId: data.users.ape1._id }, ->
        LOGIN 'ape1', (s) ->
          PUT "/users/me/username", { username: 'apexpert1' }, {}, ->
            PUT "/users/me/initials", { initials: 'ap' }, {}, ->
              PUT "/users/me/location", data.wrappers.localization_melbourne.locationData, {}, ->
                PUT "/users/me/bio", { bio: 'a bio for apexpert 1'}, {}, ->
                  POST "/experts/me", d, {}, (expert) ->
                    expect(expert._id).to.exist
                    expect(expert.lastTouch).to.exist
                    expect(expert.name).to.equal(data.users.ape1.name)
                    expect(expert.username).to.equal('apexpert1')
                    expect(expert.initials).to.equal('ap')
                    expect(expert.location).to.equal('Melbourne VIC, Australia')
                    expect(expert.timezone).to.equal('Australian Eastern Standard Time')
                    expect(expert.gh.username).to.equal('airpairtest1')
                    expect(expert.gh.provider).to.be.undefined
                    expect(expert.gp.id).to.equal('107399914803761861041')
                    expect(expert.gp.name).to.be.undefined
                    expect(expert.actvity).to.be.undefined
                    db.readDoc 'User', s._id, (user) ->
                      expect(user.cohort.expert._id).to.exist
                      DONE()



migrate = ->

  it "Can update expert profile as new v1 user", itDone ->
    SETUP.createNewExpert 'ape1', {}, (s, expert) ->
      expect(expert.lastTouch.action, 'create')
      expect(expert.rate, 70)
      expect(!_.idsEqual(s._id,expert._id))
      GET "/experts/me", {}, (exp2) ->
        expect(exp2._id).to.exist
        expect(exp2.lastTouch).to.exist
        expect(exp2.name).to.equal(data.users.ape1.name)
        expect(exp2.username).to.equal(expert.username)
        expect(exp2.initials).to.equal(expert.initials)
        expect(exp2.location).to.equal('Melbourne VIC, Australia')
        expect(exp2.timezone).to.equal('Australian Eastern Standard Time')
        expect(exp2.bio).to.equal(expert.bio)
        expect(exp2.breif).to.equal(expert.breif)
        expect(exp2.rate).to.equal(70)
        expect(exp2.tags.length).to.equal(1)
        expect(exp2.gh.username).to.equal('airpairtest1')
        expect(exp2.gh.followers).to.exist
        expect(exp2.gp.id).to.equal('107399914803761861041')
        expect(exp2.gp._json.picture).to.equal('https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg')
        exp2.rate = 150
        PUT "/experts/#{expert._id}/me", exp2, {}, (expert2) ->
          expect(expert.lastTouch.action, 'update')
          expect(expert.rate, 150)
          DONE()


  it "Can update expert profile as existing v0 expert", itDone ->
    SETUP.ensureV0Expert 'azv0', ->
      db.readDoc 'User', data.users.azv0._id, (azv0User) ->
        expect(_.keys(azv0User).length).to.equal(16)
        expect(azv0User._id).to.exist
        expect(azv0User.email).to.exist
        expect(azv0User.name).to.exist
        expect(azv0User.bitbucket).to.exist
        expect(azv0User.bitbucketId).to.exist
        expect(azv0User.github).to.exist
        expect(azv0User.githubId).to.exist
        expect(azv0User.google).to.exist
        expect(azv0User.googleId).to.exist
        expect(azv0User.linkedin).to.exist
        expect(azv0User.linkedinId).to.exist
        expect(azv0User.stack).to.exist
        expect(azv0User.stackId).to.exist
        expect(azv0User.twitter).to.exist
        expect(azv0User.twitterId).to.exist
        expect(azv0User.emailVerified).to.be.true
        expect(azv0User.cohort).to.be.undefined
        expect(azv0User.bookmarks).to.be.undefined
        expect(azv0User.tags).to.be.undefined
        expect(azv0User.siteNotifications).to.be.undefined
        expect(azv0User.roles).to.be.undefined
        db.readDoc 'Expert', data.experts.azv0._id, (azv0Exp) ->
          expect(_.keys(azv0Exp).length).to.equal(24)
          expect(azv0Exp._id).to.exist
          expect(azv0Exp.availability).to.exist
          expect(azv0Exp.bb).to.exist
          expect(azv0Exp.bookMe).to.exist
          expect(azv0Exp.brief).to.exist
          expect(azv0Exp.email).to.exist
          expect(azv0Exp.gh).to.exist
          expect(azv0Exp.gmail).to.exist
          expect(azv0Exp.homepage).to.exist
          expect(azv0Exp.hours).to.exist
          expect(azv0Exp.in).to.exist
          expect(azv0Exp.karma).to.exist
          expect(azv0Exp.minRate).to.exist
          expect(azv0Exp.name).to.exist
          expect(azv0Exp.pic).to.exist
          expect(azv0Exp.rate).to.exist
          expect(azv0Exp.so).to.exist
          expect(azv0Exp.status).to.exist
          expect(azv0Exp.tags).to.exist
          expect(azv0Exp.timezone).to.exist
          expect(azv0Exp.tw).to.exist
          expect(azv0Exp.updatedAt).to.exist
          expect(azv0Exp.userId).to.exist
          expect(azv0Exp.username).to.exist
          expect(azv0Exp.user).to.be.undefined
          expect(azv0Exp.lastTouch).to.be.undefined
          expect(azv0Exp.activity).to.be.undefined
          expect(azv0Exp.settings).to.be.undefined
          expect(azv0Exp.mojo).to.be.undefined
          expect(azv0Exp.matching).to.be.undefined
          LOGIN 'azv0', (sAzv0) ->
            eData = tags: azv0Exp.tags, rate: 150, username: azv0Exp.username, initials: 'az', bio: 'a bio for az'
            SETUP.applyToBeAnExpert eData, (exp) ->
              expectIdsEqual(exp._id,azv0Exp._id)
              expectIdsEqual(exp.userId,azv0User._id)
              db.readDoc 'User', data.users.azv0._id, (azv0U2) ->
                expectIdsEqual(azv0U2._id, azv0User._id)
                expect(azv0U2.email).to.exist
                expect(azv0U2.name).to.exist
                # TODO after v0 is gone, impl wiping
                $log("## TODO after v0 is gone, impl wiping".white)
                # expect(azv0U2.bitbucket).to.be.undefined
                # expect(azv0U2.bitbucketId).to.be.undefined
                # expect(azv0U2.github).to.be.undefined
                # expect(azv0U2.githubId).to.be.undefined
                # expect(azv0U2.linkedin).to.be.undefined
                # expect(azv0U2.linkedinId).to.be.undefined
                # expect(azv0U2.stack).to.be.undefined
                # expect(azv0U2.stackId).to.be.undefined
                # expect(azv0U2.twitter).to.be.undefined
                # expect(azv0U2.twitterId).to.be.undefined
                expect(azv0U2.social).to.exist
                expect(azv0U2.social.bb.username).to.equal(azv0User.bitbucket.username)
                expect(azv0U2.social.gh.username).to.equal(azv0User.github.username)
                expect(azv0U2.social.in.id).to.equal(azv0User.linkedin.id)
                expect(azv0U2.social.so.link).to.equal(azv0User.stack.link)
                expect(azv0U2.social.tw.username).to.equal(azv0User.twitter.username)
                expect(azv0U2.google).to.exist
                expect(azv0U2.googleId).to.equal(azv0User.googleId)
                expect(azv0U2.initials).to.equal('az')
                expect(azv0U2.username).to.equal(azv0Exp.username)
                expect(azv0U2.bio).to.equal('a bio for az')
                expect(azv0U2.localization).to.exist
                expect(azv0U2.siteNotifications).to.exist
                # expect(azv0U2.local).to.exist # doesn't have to exist
                expect(azv0U2.cohort).to.exist
                expect(azv0U2.bookmarks).to.exist
                expect(azv0U2.tags).to.exist
                expect(azv0U2.roles).to.exist
                expect(azv0U2.roles.length).to.equal(0)
                expect(azv0U2.emailVerified).to.be.true
                db.readDoc 'Expert', data.experts.azv0._id, (azv0E2) ->
                  expectIdsEqual(azv0U2.cohort.expert._id, azv0E2._id)
                  expect(azv0E2.brief).to.exist
                  expect(azv0E2.gmail).to.exist
                  expect(azv0E2.pic).to.exist
                  expect(azv0E2.rate).to.exist
                  expect(azv0E2.tags).to.exist
                  expect(azv0E2.userId).to.exist
                  expect(azv0E2.lastTouch).to.exist
                  expect(azv0E2.activity).to.exist
                  expect(azv0E2.activity.length).to.equal(1)
                  expect(azv0E2.user).to.exist
                  expect(azv0E2.user.google).to.be.undefined
                  expect(azv0E2.user.googleId).to.be.undefined
                  expect(azv0E2.user.social.bb.username).to.equal(azv0User.bitbucket.username)
                  expect(azv0E2.user.social.gh.username).to.equal(azv0User.github.username)
                  expect(azv0E2.user.social.in.id).to.equal(azv0User.linkedin.id)
                  expect(azv0E2.user.social.so.link).to.equal(azv0User.stack.link.replace('http://stackoverflow.com/users/',''))
                  expect(azv0E2.user.social.tw.username).to.equal(azv0User.twitter.username)
                  expect(azv0E2.user.social.gp.id).to.equal(azv0User.googleId)
                  expect(azv0E2.user.name).to.equal(azv0User.name)
                  expect(azv0E2.user.email).to.equal(azv0User.email)
                  expect(azv0E2.user.emailVerified).to.equal(true)
                  expect(azv0E2.user.initials).to.equal('az')
                  expect(azv0E2.user.username).to.equal(azv0Exp.username)
                  expect(azv0E2.user.bio).to.equal('a bio for az')
                  expect(azv0E2.user.localization).to.exist
                  # To soon phase out
                  expect(azv0E2.bookMe).to.exist
                  expect(azv0E2.availability).to.exist
                  expect(azv0E2.hours).to.exist
                  expect(azv0E2.minRate).to.exist
                  expect(azv0E2.status).to.exist
                  expect(azv0E2.updatedAt).to.exist
                  # v0 Phased out
                  expect(azv0E2.bb).to.be.undefined
                  expect(azv0E2.email).to.be.undefined
                  expect(azv0E2.gh).to.be.undefined
                  expect(azv0E2.homepage).to.be.undefined
                  expect(azv0E2.in).to.be.undefined
                  expect(azv0E2.name).to.be.undefined
                  expect(azv0E2.so).to.be.undefined
                  expect(azv0E2.timezone).to.be.undefined
                  expect(azv0E2.tw).to.be.undefined
                  expect(azv0E2.username).to.be.undefined
                  expect(azv0E2.karma).to.be.undefined
                  # props that would exist upon other operations
                  expect(azv0E2.settings).to.be.undefined
                  expect(azv0E2.mojo).to.be.undefined
                  expect(azv0E2.matching).to.be.undefined
                  DONE()


admin = ->

  it "Delete by id", itDone ->
    SETUP.ensureV1LoggedInExpert 'dlim', (s) ->
      expertId = s.cohort.expert._id
      LOGIN 'admin', ->
        DELETE "/adm/experts/#{expertId}", {}, ->
          db.readDoc 'Expert', expertId, (r) ->
            expect(r).to.be.null
            DONE()

  it "Get newest experts", itDone ->
    LOGIN 'admin', ->
      GET "/adm/experts/new", {}, (experts) ->
        expect(experts.length>0).to.be.true
        DONE()


  it "Get recently active experts", itDone ->
    LOGIN 'admin', ->
      GET "/adm/experts/active", {}, (experts) ->
        expect(experts.length>0).to.be.true
        DONE()


module.exports = ->

  before ->

  it "*** JK Sent annoucement to pre-applied experts expert"
  it "Collects social data for social scoring"

  describe("Create: ".subspec, create)
  describe("Migrate: ".subspec, migrate)
  describe("Admin: ".subspec, admin)


