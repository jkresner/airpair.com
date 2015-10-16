RequestsUtil                = require('../../../shared/requests')
reqs                        = {}

matchmaking = ->


  IT '401 for non authenticated get matches for request', ->
    GET '/experts/mojo/rank', {status: 401}, ->
      DONE()


  IT '301 Result for logged in rank with no query propeties', ->
    STORY.newUser 'tjar', {login:true}, (s) ->
      GET '/experts/mojo/rank', {status: 403}, (experts) ->
        DONE()


  IT 'Matches experts on swift', ->
    STORY.newUser 'tard', {login:true}, (s) ->
      query = RequestsUtil.mojoQuery(reqs.matchSwift)
      expect(query).to.equal('tags=swift')
      GET "/experts/mojo/rank?#{query}", (experts) ->
        expect(experts.length).to.equal(1)
        expect(experts[0].score).to.equal(46307)
        DONE()


  IT 'Rank filters out excludes by username', ->
    STORY.newUser 'tedj', {login:true}, (s) ->
      req = _.extend({},reqs.matchSwift)
      req.suggested = [{expert:{username:'loufranco'}}]
      query = RequestsUtil.mojoQuery(req)
      expect(query).to.equal('tags=swift&exclude=loufranco')
      GET "/experts/mojo/rank?#{query}", {}, (experts) ->
        expect(experts.length).to.equal(0)
        DONE()


  IT 'Rank by c# and C++', ->
    STORY.newUser 'mrik', {login:true}, (s) ->
      cPPQuery = 'tags=c%2B%2B'
      GET "/experts/mojo/rank?#{cPPQuery}", {}, (experts) ->
        expect(experts.length).to.equal(1)
        cShaprQuery = 'tags=c%23'
        GET "/experts/mojo/rank?#{cShaprQuery}", {}, (experts2) ->
          expect(experts2.length).to.equal(1)
          DONE()


  IT 'Ranked experts must have a rate', ->
    DB.ensureDocs 'Expert', [FIXTURE.experts.ronr], (r) ->
      LOGIN {key:'admin'}, ->
        qq = 'tags=operating-system'
        GET "/experts/mojo/rank?#{qq}", (experts) ->
          expect(experts.length).to.equal(0)
          DONE()


  it.skip 'Does a good job at sorting top tag over 2nd and 3rd tag', ->
    # http://localhost:3333/matchmaking/5565a27e8d9baa1100ce2cd9
    # http://localhost:3333/matchmaking/5565e8391acf981100722e68
    # http://localhost:3333/matchmaking/555d33401cf1ff1100e8426e

module.exports = ->

  before (done) ->
    DB.ensureDoc 'Request', FIXTURE.requests.matchSwift, ->
      reqs.matchSwift = FIXTURE.requests.matchSwift
      SETUP.ensureExpert 'louf', ->
        done()

  DESCRIBE "matchmaking: ", matchmaking
