module.exports = () => {

    before(function(done) {
      testDb.initPosts( () => {
        testDb.initTags(done) })
    })

    after(function(done) {
      testDb.initPosts( () => {
        testDb.initTags(done) })
    })

      var sessionSpy
      var viewSpy

      beforeEach(() => {
        sessionSpy = sinon.spy(sessions, 'middleware')
        viewSpy = sinon.spy(analytics, 'view')
      })

      afterEach(() => {
        sessions.middleware.restore()
        analytics.view.restore()
      })


    // Considerations
    // 1 - the express generated session
    // 2 - the user session returned from the DB on GET /v1/api/session/full
    // Bots (probably) won't handle cookies (or reliably tell us it can) so the ANONSESSION approach in analyticsSpec is not a realistic one for bots

    function expectSessionNotToBeStored(req, done) {
      expect(req.sessionID).to.exist
      expect(req.sessionID).to.match(a_uid)
      expect(req.session).to.exist
      testDb.sessionBySessionId(req.sessionID, (e, s) => {
          if (e) return done(e)
          expect(s).to.be.empty
          return done()
        })
    }

    function expectSessionToBeStored(req, done) {
      expect(req.session).to.exist
      expect(req.sessionID).to.exist
      expect(req.sessionID).to.match(a_uid)
      testDb.sessionBySessionId(req.sessionID, (e, s) => {
          if (e) return done(e)
          expect(s[0].id).to.equal(req.sessionID)
          done()
        })
    }

    var uaFirefox = 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0'
    var uaGooglebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    var a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\,\-_]*).{24,}/


    describe("Sessions are stored and views are created", function() {

      describe("From Browsers", function() {

        it('GET /v1/api/session/full from a browser', function(done) {
          http(global.app)
          .get('/v1/api/session/full')
          .set('user-agent', uaFirefox)
          .expect(200)
          .end( (e, r) => {
            expect(viewSpy.callCount).to.equal(0)
            expect(r.body.sessionID).to.match(a_uid)
            expect(sessionSpy.args[0][0].sessionID).to.equal(r.body.sessionID)
            expect(r.body.authenticated).to.exist
            expect(r.body.avatar).to.exist
            testDb.sessionBySessionId(r.body.sessionID, (e, s) => {
                if (e) return done(e)
                expect(s).to.not.be.empty
                expect(s[0].id).to.equal(r.body.sessionID)
                return done()
              })
          })
        })

        it('GET /angularjs from a browser', function(done) {
          http(global.app)
          .get('/angularjs')
          .set('user-agent', uaFirefox)
          .expect(200)
          .end( (e, r) => {
            expect(viewSpy.calledOnce).to.be.true
            expect(sessionSpy.calledOnce).to.be.true
            expectSessionToBeStored(sessionSpy.args[0][0], done)
          })
        })

        it('GET /v1/posts/starting-a-mean-stack-app from a browser', function(done) {
          http(global.app)
          .get('/v1/posts/starting-a-mean-stack-app')
          .set('user-agent', uaFirefox)
          .expect(200)
          .end( (e, r) => {
            expect(viewSpy.calledOnce).to.be.true
            expect(sessionSpy.calledOnce).to.be.true
            expectSessionToBeStored(sessionSpy.args[0][0], done)
          })
        })

      })

      describe("When there is no UA header", function() {
        it('GET /v1/api/session/full with no user-agent header', function(done) {
          http(global.app)
          .get('/v1/api/session/full')
          .unset('user-agent')
          .expect(200)
          .end( (e, r) => {
            expect(viewSpy.callCount).to.equal(0)
            expect(r.body.sessionID).to.match(a_uid)
            expect(sessionSpy.args[0][0].sessionID).to.equal(r.body.sessionID)
            expect(r.body.authenticated).to.exist
            expect(r.body.avatar).to.exist
            testDb.sessionBySessionId(r.body.sessionID, (e, s) => {
                if (e) return done(e)
                expect(s).to.not.be.empty
                expect(s[0].id).to.equal(r.body.sessionID)
                return done()
              })
          })
        })

        it('GET /angularjs with no user-agent header', function(done) {
          http(global.app)
          .get('/angularjs')
          .unset('user-agent')
          .expect(200)
          .end( (e, r) => {
            expect(viewSpy.calledOnce).to.be.true
            expect(sessionSpy.calledOnce).to.be.true
            expectSessionToBeStored(sessionSpy.args[0][0], done)
          })
        })

        it('GET /v1/posts/starting-a-mean-stack-app with no user-agent header', function(done) {
          http(global.app)
          .get('/v1/posts/starting-a-mean-stack-app')
          .unset('user-agent')
          .expect(200)
          .end( (e, r) => {
            expect(viewSpy.calledOnce).to.be.true
            expect(sessionSpy.calledOnce).to.be.true
            expectSessionToBeStored(sessionSpy.args[0][0], done)
          })
        })
      })
    })

    describe("Sessions are NOT stored and NO views are created", function() {

      describe("For known bots", function() {

        it('GET /v1/api/session/full from a known bot', function(done) {
          http(global.app)
          .get('/v1/api/session/full')
          .set('user-agent', uaGooglebot)
          .expect(200)
          .end( (e, r) => {
            expect(viewSpy.callCount).to.equal(0)
            expect(r.body.authenticated).to.exist
            expect(r.body.avatar).to.exist
            expect(sessionSpy.calledOnce).to.be.true
            expectSessionNotToBeStored(sessionSpy.args[0][0], done)
          })
        })

        it('GET /angularjs from a known bot', function(done) {
          http(global.app)
          .get('/angularjs')
          .set('user-agent', uaGooglebot)
          .expect(200)
          .end( (e, r) => {
            expect(viewSpy.called).to.be.false
            expect(sessionSpy.calledOnce).to.be.true
            expectSessionNotToBeStored(sessionSpy.args[0][0], done)
          })
        })

        it('GET /v1/posts/starting-a-mean-stack-app from a known bot', function(done) {
          http(global.app)
          .get('/v1/posts/starting-a-mean-stack-app')
          .set('user-agent', uaGooglebot)
          .expect(200)
          .end( (e, r) => {
            expect(viewSpy.called).to.be.false
            expect(sessionSpy.calledOnce).to.be.true
            expectSessionNotToBeStored(sessionSpy.args[0][0], done)
          })
        })

      })

    })

}
