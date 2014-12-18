module.exports = -> describe "API", ->

  before (done) ->
    stubAnalytics()
    testDb.initTags(done)


  after (done) ->
    resotreAnalytics()
    done()


  beforeEach -> global.cookie = null


  it '401 for non authenticated request', (done) ->
    opts = status: 401
    d = type: 'mentoring', experience: 'beginner', brief: 'this is a test yo', hours: "1", time: 'rush', budget: 90
    POST '/requests', d, opts, ->
      done()


  it 'Can post request as logged in user', (done) ->
    addAndLoginLocalUser 'josh', (s) ->
      tag = _.extend({sort:1}, data.tags.node)
      d = tags: [tag], type: 'mentoring', experience: 'beginner', brief: 'this is a test yo', hours: "1", time: 'rush', budget: 90
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        expect(_.idsEqual(s._id,r.userId)).to.be.true
        expect(r.type).to.equal('mentoring')
        expect(r.tags.length).to.equal(1)
        expect(r.budget).to.equal(90)
        expect(r.tags[0].short).to.be.undefined
        done()
