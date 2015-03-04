db = require('./helpers/setup.db')
dataHlpr = require('./helpers/setup.data')

module.exports = -> describe "API: ", ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initTags -> SETUP.initTemplates done

  after ->
    SETUP.analytics.restore()


  it "Cannot get my expert profile as anonymous user", (done) ->
    ANONSESSION (s) ->
      GET "/experts/me", { status: 401 }, (r) ->
        done()


  it "Cannot create / update expert profile as anonymous user", (done) ->
    ANONSESSION (s) ->
      POST "/experts/me", {_id: newId(), user: data.users['jk'] }, { status: 401 }, (r) ->
        PUT "/experts/me", {_id: newId(), user: data.users['jk'] }, { status: 401 }, (r) ->
          done()


  it "Cannot create expert profile without required user info", (done) ->
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
                PUT "/users/me/location", data.wrappers.locationlization_melbourne.locationData, {}, (r) ->
                  expect(r.localization).to.exist
                  POST "/experts/me", d, { status: 403 }, (r) ->
                    expectStartsWith(r.message, "Cannot create expert without bio")
                    PUT "/users/me/bio", { bio: 'a bio'}, {}, (r) ->
                      POST "/experts/me", d, { status: 403 }, (r) ->
                        expectStartsWith(r.message, "Must connect at least 2 social account to create expert profile")
                        done()


  it "Can create expert profile with required user info", (done) ->
    d = rate: 80, breif: 'yo', tags: [data.tags.angular]
    db.ensureDoc 'User', data.users.ape1, ->
      db.findAndRemove 'Expert', { userId: data.users.ape1._id }, ->
        LOGIN 'ape1', data.users.ape1, (s) ->
          PUT "/users/me/username", { username: 'apexpert1' }, {}, ->
            PUT "/users/me/initials", { initials: 'ap' }, {}, ->
              PUT "/users/me/location", data.wrappers.locationlization_melbourne.locationData, {}, ->
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
                    db.readUser s._id, (e, user) ->
                      expect(user.cohort.expert._id).to.exist
                      done()


  it "Can update expert profile as new v1 user", (done) ->
    SETUP.createNewExpert 'ape1', {}, (s, expert) ->
      expect(expert.lastTouch.action, 'create')
      expect(expert.rate, 110)
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
        expect(exp2.rate).to.equal(110)
        expect(exp2.tags.length).to.equal(1)
        expect(exp2.gh.username).to.equal('airpairtest1')
        expect(exp2.gp.id).to.equal('107399914803761861041')
        exp2.rate = 150
        PUT "/experts/#{expert._id}/me", exp2, {}, (expert2) ->
          expect(expert.lastTouch.action, 'update')
          expect(expert.rate, 150)
          done()


  it.skip "Collects social data for social scoring", (done) ->

  it.skip "Can update expert profile as existing v0 expert", (done) ->

  it.skip "*** JK Sent annoucement to pre-applied experts expert", (done) ->
