RequestsUtil                = require('../../shared/requests')
reqs                        = {}

matchmaking = ->

  # rSwiftId = data.requests.matchSwift._id

  it '401 for non authenticated get matches for request', (done) ->
    GET '/experts/mojo/rank', {status: 401}, ->
      done()


  it '301 Result for logged in rank with no query propeties', (done) ->
    SETUP.addAndLoginLocalUser 'tjar', (s) ->
      GET '/experts/mojo/rank', {status: 403}, (experts) ->
        done()


  it 'Matches experts on swift', (done) ->
    SETUP.addAndLoginLocalUser 'tard', (s) ->
      query = RequestsUtil.mojoQuery(reqs.matchSwift)
      expect(query).to.equal('tags=swift')
      GET "/experts/mojo/rank?#{query}", {}, (experts) ->
        expect(experts.length).to.equal(1)
        expect(experts[0].score).to.equal(26307)
        done()


  it 'Rank filters out excludes by username', (done) ->
    SETUP.addAndLoginLocalUser 'tedj', (s) ->
      req = _.extend({},reqs.matchSwift)
      req.suggested = [{expert:{username:'loufranco'}}]
      query = RequestsUtil.mojoQuery(req)
      expect(query).to.equal('tags=swift&exclude=loufranco')
      GET "/experts/mojo/rank?#{query}", {}, (experts) ->
        expect(experts.length).to.equal(0)
        done()


module.exports = ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initTags ->
      db.ensureDoc 'Request', data.requests.matchSwift, ->
        reqs.matchSwift = data.requests.matchSwift
        SETUP.ensureV1LoggedInExpert 'louf', ->
          done()

  after ->
    SETUP.analytics.restore()


  describe "matchmaking: ".subspec, matchmaking
