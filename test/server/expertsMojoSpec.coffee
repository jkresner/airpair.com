RequestsUtil                = require('../../shared/requests')
reqs                        = {}

matchmaking = ->

  # rSwiftId = data.requests.matchSwift._id

  it '401 for non authenticated get matches for request', itDone ->
    GET '/experts/mojo/rank', {status: 401}, ->
      DONE()


  it '301 Result for logged in rank with no query propeties', itDone ->
    SETUP.addAndLoginLocalUser 'tjar', (s) ->
      GET '/experts/mojo/rank', {status: 403}, (experts) ->
        DONE()


  it 'Matches experts on swift', itDone ->
    SETUP.addAndLoginLocalUser 'tard', (s) ->
      query = RequestsUtil.mojoQuery(reqs.matchSwift)
      expect(query).to.equal('tags=swift')
      GET "/experts/mojo/rank?#{query}", {}, (experts) ->
        expect(experts.length).to.equal(1)
        expect(experts[0].score).to.equal(26307)
        DONE()


  it 'Rank filters out excludes by username', itDone ->
    SETUP.addAndLoginLocalUser 'tedj', (s) ->
      req = _.extend({},reqs.matchSwift)
      req.suggested = [{expert:{username:'loufranco'}}]
      query = RequestsUtil.mojoQuery(req)
      expect(query).to.equal('tags=swift&exclude=loufranco')
      GET "/experts/mojo/rank?#{query}", {}, (experts) ->
        expect(experts.length).to.equal(0)
        DONE()


  it 'Rank by c# and C++', itDone ->
    SETUP.addAndLoginLocalUser 'mrik', (s) ->
      cPPQuery = 'tags=c%2B%2B'
      GET "/experts/mojo/rank?#{cPPQuery}", {}, (experts) ->
        expect(experts.length).to.equal(1)
        cShaprQuery = 'tags=c%23'
        GET "/experts/mojo/rank?#{cShaprQuery}", {}, (experts2) ->
          expect(experts2.length).to.equal(1)
          DONE()



module.exports = ->

  before (done) ->
    SETUP.initTags ->
      db.ensureDoc 'Request', data.requests.matchSwift, ->
        reqs.matchSwift = data.requests.matchSwift
        SETUP.ensureV1LoggedInExpert 'louf', ->
          done()

  describe "matchmaking: ".subspec, matchmaking
