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
        expect(experts[0].score).to.equal(46307)
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


  it 'Ranked experts must have a rate', itDone ->
    db.ensureDocs 'Expert', [data.experts.ronr], (r) ->
      LOGIN 'admin', ->
        qq = 'tags=operating-system'
        GET "/experts/mojo/rank?#{qq}", {}, (experts) ->
          expect(experts.length).to.equal(0)
          DONE()


  it.skip 'Does a good job at sorting top tag over 2nd and 3rd tag', itDone ->
    # http://localhost:3333/matchmaking/5565a27e8d9baa1100ce2cd9
    # http://localhost:3333/matchmaking/5565e8391acf981100722e68
    # http://localhost:3333/matchmaking/555d33401cf1ff1100e8426e

module.exports = ->

  before (done) ->
    db.ensureDoc 'Request', data.requests.matchSwift, ->
      reqs.matchSwift = data.requests.matchSwift
      SETUP.ensureV1LoggedInExpert 'louf', ->
        done()

  describe "matchmaking: ".subspec, matchmaking
