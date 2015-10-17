RequestsUtil                = require('../../../shared/requests')
reqs                        = {}

matchmaking = ->


  IT '401 for non authenticated get matches for request', ->
    GET '/experts/mojo/rank', {status: 401}, ->
      DONE()


  IT '301 Result for logged in rank with no query propeties', ->
    STORY.newUser 'tjar', (s) ->
      GET '/experts/mojo/rank', {status: 403}, (experts) ->
        DONE()


  IT 'Matches experts on swift', ->
    STORY.newUser 'tard', (s) ->
      query = RequestsUtil.mojoQuery(reqs.matchSwift)
      expect(query).to.equal('tags=swift')
      GET "/experts/mojo/rank?#{query}", (experts) ->
        expect(experts.length).to.equal(1)
        # expect(experts.length).to.equal(65)
        expect(experts[0].score).to.equal(46307)
        DONE()


  IT 'Rank filters out excludes by username', ->
    STORY.newUser 'tedj', (s) ->
      req = _.extend({},reqs.matchSwift)
      req.suggested = [{expert:{username:'loufranco'}}]
      query = RequestsUtil.mojoQuery(req)
      expect(query).to.equal('tags=swift&exclude=loufranco')
      GET "/experts/mojo/rank?#{query}", {}, (experts) ->
        expect(experts.length).to.equal(0)
        # expect(experts.length).to.equal(64)
        DONE()


  IT 'Rank by c# and C++', ->
    STORY.newUser 'mrik', (s) ->
      cPPQuery = 'tags=c%2B%2B'
      GET "/experts/mojo/rank?#{cPPQuery}", {}, (experts) ->
        expect(experts.length).to.equal(1)
        # expect(experts.length).to.equal(100)
        cShaprQuery = 'tags=c%23'
        GET "/experts/mojo/rank?#{cShaprQuery}", {}, (experts2) ->
          expect(experts.length).to.equal(1)
          # expect(experts2.length).to.equal(100)
          DONE()


  IT 'Ranked experts must have a rate', ->
    DB.ensureDocs 'Expert', [FIXTURE.experts.ronr], (r) ->
      LOGIN {key:'admin'}, ->
        qq = 'tags=operating-system'
        GET "/experts/mojo/rank?#{qq}", (experts) ->
          expect(experts.length).to.equal(0)
          # expect(experts.length).to.equal(3)
          DONE()


  it.skip 'Does a good job at sorting top tag over 2nd and 3rd tag', ->
    # http://localhost:3333/matchmaking/5565a27e8d9baa1100ce2cd9
    # http://localhost:3333/matchmaking/5565e8391acf981100722e68
    # http://localhost:3333/matchmaking/555d33401cf1ff1100e8426e

module.exports = ->

  before (done) ->
    DB.removeDocs 'Expert', {_id: FIXTURE.experts.louf.id }, ->
      SETUP.ensureExpert 'louf', ->
        DB.ensureDoc 'Request', FIXTURE.requests.matchSwift, ->
          reqs.matchSwift = FIXTURE.requests.matchSwift
          done()

  if global.againstProd
    describe "skiiping mojo", ->
      it "SKIPPED"
  else
    DESCRIBE "matchmaking: ", matchmaking
