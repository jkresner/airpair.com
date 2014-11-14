module.exports = () => {

  describe("Sessions: ", function() {

    before(function(done) {
      testDb.initPosts( () => {
        testDb.initTags(done) })
    })

    after(function(done) {
      testDb.initPosts( () => {
        testDb.initTags(done) })
    })

      var spy

      beforeEach(() => {
        spy = sinon.spy(sessions, 'middleware')
      })

      afterEach(() => {
        sessions.middleware.restore()
      })


    // Considerations
    // 1 - the express generated session
    // 2 - the user session returned from the DB on GET /v1/api/session/full
    // Bots (probably) won't handle cookies (or reliably tell us it can) so the ANONSESSION approach in analyticsSpec is not a realistic one for bots

    var uaFirefox = 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0';
    var uaGooglebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

    var a_uid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{24,}/

    describe("API Calls", function() {
      it('GET /v1/api/session/full from a browser stores (anonymous) session', function(done) {
        http(global.app)
        .get('/v1/api/session/full')
        .set('user-agent', uaFirefox)
        .expect(200)
        .end( (e, r) => {
          expect(r.body.sessionID).to.match(a_uid)
          expect(spy.args[0][0].sessionID).to.equal(r.body.sessionID)
          expect(r.body.authenticated).to.exist
          expect(r.body.avatar).to.exist
          testDb.sessionBySessionId(r.body.sessionID, (e, s) => {
              if (e) return done(e)
              expect(s.length).to.be.greaterThan(0)
              expect(s[0].id).to.equal(r.body.sessionID)
              return done()
            })
        })
      })

      it('GET /v1/api/session/full with no user-agent stores (anonymous) session', function(done) {
        http(global.app)
        .get('/v1/api/session/full')
        .unset('user-agent')
        .expect(200)
        .end( (e, r) => {
          expect(r.body.sessionID).to.match(a_uid)
          expect(spy.args[0][0].sessionID).to.equal(r.body.sessionID)
          expect(r.body.authenticated).to.exist
          expect(r.body.avatar).to.exist
          testDb.sessionBySessionId(r.body.sessionID, (e, s) => {
              if (e) return done(e)
              expect(s.length).to.be.greaterThan(0)
              expect(s[0].id).to.equal(r.body.sessionID)
              return done()
            })
        })
      })

      it('GET /v1/api/session/full from a known bot does not store a session', function(done) {
        http(global.app)
        .get('/v1/api/session/full')
        .set('user-agent', uaGooglebot)
        .expect(200)
        .end( (e, r) => {
          expect(r.body.authenticated).to.exist
          expect(r.body.avatar).to.exist
          expect(spy.calledOnce).to.be.true
          expect(spy.args[0][0].sessionID).to.exist
          expect(spy.args[0][0].sessionID).to.match(a_uid)
          expect(spy.args[0][0].session).to.exist
          testDb.sessionBySessionId(spy.args[0][0].sessionID, (e, s) => {
              if (e) return done(e)
              expect(s).to.be.empty
              return done()
            })
        })
      })
    })

    describe("Dynamic Pages", function() {
      it('GET /angularjs from a browser stores (anonymous) session', function(done) {
        http(global.app)
        .get('/angularjs')
        .set('user-agent', uaFirefox)
        .expect(200)
        .end( (e, r) => {
          expect(spy.calledOnce).to.be.true
          expect(spy.args[0][0].session).to.exist
          expect(spy.args[0][0].sessionID).to.exist
          expect(spy.args[0][0].sessionID).to.match(a_uid)
          testDb.sessionBySessionId(spy.args[0][0].sessionID, (e, s) => {
              if (e) return done(e)
              expect(s[0].id).to.equal(spy.args[0][0].sessionID)
              done()
            })
        })
      })

      it('GET /angularjs with no user-agent header stores (anonymous) session', function(done) {
        http(global.app)
        .get('/angularjs')
        .unset('user-agent')
        .expect(200)
        .end( (e, r) => {
          expect(spy.calledOnce).to.be.true
          expect(spy.args[0][0].session).to.exist
          expect(spy.args[0][0].sessionID).to.exist
          expect(spy.args[0][0].sessionID).to.match(a_uid)
          testDb.sessionBySessionId(spy.args[0][0].sessionID, (e, s) => {
              if (e) return done(e)
              expect(s[0].id).to.equal(spy.args[0][0].sessionID)
              done()
            })
        })
      })

      it('GET /angularjs from a known bot does not store a session', function(done) {
        http(global.app)
        .get('/angularjs')
        .set('user-agent', uaGooglebot)
        .expect(200)
        .end( (e, r) => {
          expect(spy.calledOnce).to.be.true
          expect(spy.args[0][0].session).to.exist
          expect(spy.args[0][0].sessionID).to.exist
          expect(spy.args[0][0].sessionID).to.match(a_uid)
          testDb.sessionBySessionId(spy.args[0][0].sessionID, (e, s) => {
              if (e) return done(e)
              expect(s).to.be.empty
              done()
            })
        })
      })
    })

    describe("Posts", function() {
      it('GET /v1/posts/starting-a-mean-stack-app from a browser stores (anonymous) session', function(done) {
        http(global.app)
        .get('/v1/posts/starting-a-mean-stack-app')
        .set('user-agent', uaFirefox)
        .expect(200)
        .end( (e, r) => {
          expect(spy.calledOnce).to.be.true
          expect(spy.args[0][0].session).to.exist
          expect(spy.args[0][0].sessionID).to.exist
          expect(spy.args[0][0].sessionID).to.match(a_uid)
          testDb.sessionBySessionId(spy.args[0][0].sessionID, (e, s) => {
            if (e) return done(e)
            expect(s[0].id).to.equal(spy.args[0][0].sessionID)
            done()
          })
        })
      })

      it('GET /v1/posts/starting-a-mean-stack-app with no user-agent header stores (anonymous) session', function(done) {
        http(global.app)
        .get('/v1/posts/starting-a-mean-stack-app')
        .unset('user-agent')
        .expect(200)
        .end( (e, r) => {
          expect(spy.calledOnce).to.be.true
          expect(spy.args[0][0].session).to.exist
          expect(spy.args[0][0].sessionID).to.exist
          expect(spy.args[0][0].sessionID).to.match(a_uid)
          testDb.sessionBySessionId(spy.args[0][0].sessionID, (e, s) => {
            if (e) return done(e)
            expect(s[0].id).to.equal(spy.args[0][0].sessionID)
            done()
          })
        })
      })

      it('GET /v1/posts/starting-a-mean-stack-app from a known bot does not store a session', function(done) {
        http(global.app)
        .get('/v1/posts/starting-a-mean-stack-app')
        .set('user-agent', uaGooglebot)
        .expect(200)
        .end( (e, r) => {
          expect(spy.calledOnce).to.be.true
          expect(spy.args[0][0].session).to.exist
          expect(spy.args[0][0].sessionID).to.exist
          expect(spy.args[0][0].sessionID).to.match(a_uid)
          testDb.sessionBySessionId(spy.args[0][0].sessionID, (e, s) => {
            if (e) return done(e)
            expect(s).to.be.empty
            done()
          })
        })
      })
    })


 describe("Views: ", function() {
    before(function(done) {
      testDb.initPosts( () => {
        testDb.initTags(done) })
    })

    after(function(done) {
      testDb.initPosts( () => {
        testDb.initTags(done) })
    })

    var spy

    beforeEach(function(){
      sinon.spy(analytics, "view")
    })

    // it('an always passing test', function() {
    // })
  })


    // describe("Sessions", function() {
    //   var checkSessionIsNotAdded = (known_agent_string, done) => {
    //     testDb.countSessions( (e, oldNumSessions) => {
    //       http(global.app)
    //         .get('/angularjs')
    //         .set('user-agent', known_agent_string)
    //         .expect(200)
    //         .end( (e, r) => {
    //           if (e) return done(e)
    //           expect(r.body.authenticated).to.be.false
    //           expect(r.body.sessionID).to.not.exist
    //           testDb.countSessions( (e, count) => {
    //             if (e) return done(e)
    //             expect(count).to.equal(oldNumSessions)
    //             done()
    //           })
    //         })
    //       })
    //     }

    //   var checkSessionIsAdded = (known_agent_string, done) => {
    //     http(global.app)
    //       .get('/angularjs')
    //       .set('user-agent', known_agent_string)
    //       .expect(200)
    //       .end( (e, r) => {
    //         if (e) return done(e)
    //         expect(r.body.authenticated).to.be.false
    //         expect(r.body.sessionID).to.exist
    //         testDb.sessionBySessionId(r.body.sessionID, (e, s) => {
    //           if (e) return done(e)
    //           expect(s.length).to.be.greaterThan(0)
    //           expect(s[0].id).to.equal(r.body.sessionID)
    //           return done()
    //         })
    //       })
    //     }

    //   it('Sessions are saved when no user-agent header is present', (done) => {
    //     http(global.app)
    //       .get('/v1/api/session/full')
    //       .unset('user-agent')
    //       .expect(200)
    //       .end( (e, r) => {
    //         if (e) return done(e)
    //         expect(r.body.authenticated).to.be.false
    //         expect(r.body.sessionID).to.exist
    //         testDb.sessionBySessionId(r.body.sessionID, (e, s) => {
    //           if (e) return done(e)
    //           expect(s.length).to.be.greaterThan(0)
    //           expect(s[0].id).to.equal(r.body.sessionID)
    //           return done()
    //         })
    //       })
    //   })

    //   it('Sessions are saved for empty user-agent strings', (d) => {
    //     var done = createCountedDone(2, d)
    //     checkSessionIsAdded('', done)
    //     checkSessionIsAdded(null, done)
    //   })

    //   it('Sessions are saved for firefox', (done) => {
    //     checkSessionIsAdded('Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0', done)
    //   })

    //   it('Sessions are saved for chrome', (done) => {
    //     checkSessionIsAdded('Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25', done)
    //   })

    //   it('Sessions are saved for safari', (done) => {
    //     checkSessionIsAdded('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36', done)
    //   })

    //   it('Sessions are not saved for known bots', (d) => {
    //     var done = createCountedDone(8, d)
    //     checkSessionIsNotAdded('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', done)
    //     checkSessionIsNotAdded('Mozilla/5.0 (compatible; GurujiBot/1.0; +http://www.guruji.com/en/WebmasterFAQ.html)', done)
    //     checkSessionIsNotAdded('Twitterbot', done)
    //     checkSessionIsNotAdded('Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)', done)
    //     checkSessionIsNotAdded('Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)', done)
    //     checkSessionIsNotAdded('msnbot-media/1.1 (+http://search.msn.com/msnbot.htm)', done)
    //     checkSessionIsNotAdded('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)', done)
    //     checkSessionIsNotAdded('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', done)
    //   })
    // })


    // describe("Views", function() {

    //   var checkViewIsNotSaved = (known_agent_string, done) => {
    //     testDb.countViews( (e, oldViewsCount) => {
    //       if (e) return done(e)
    //       http(global.app)
    //       .get('/v1/posts/starting-a-mean-stack-app')
    //       .set('user-agent', known_agent_string)
    //       .expect(200)
    //       .end( (e,r) => {
    //         if (e) return done(e)
    //         testDb.countViews( (e, count) => {
    //           if (e) return done(e)
    //           expect(count).to.equal(oldViewsCount)
    //           done()
    //         })
    //       })
    //     })
    //   }

    //   var checkViewIsSaved = (known_agent_string, done) => {
    //     testDb.countViews( (e, oldViewsCount) => {
    //       http(global.app)
    //       .get('/v1/posts/starting-a-mean-stack-app')
    //       .set('user-agent', known_agent_string)
    //       .expect(200)
    //       .end( (e, r) => {
    //         if (e) return done(e)
    //         testDb.countViews( (e, count) => {
    //           if (e) return done(e)
    //           expect(count).to.equal(oldViewsCount+1)
    //           done()
    //         })
    //       })
    //     })
    //   }

    //   it('Views are saved when user-agent header is not present', (done) => {
    //     testDb.countViews( (e, oldViewsCount) => {
    //       http(global.app)
    //       .get('/v1/posts/starting-a-mean-stack-app')
    //       .unset('user-agent')
    //       .expect(200)
    //       .end( (e, r) => {
    //         if (e) return done(e)
    //         testDb.countViews( (e, count) => {
    //           if (e) return done(e)
    //           expect(count).to.equal(oldViewsCount+1)
    //           done()
    //         })
    //       })
    //     })
    //   })

    //   it('Views are saved for empty user-agent strings', (done) => {
    //       checkViewIsSaved('', done)
    //   })

    //   it('Views are saved for firefox', (done) => {
    //     checkViewIsSaved('Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0', done)
    //   })

    //   it('Views are saved for chrome', (done) => {
    //       checkViewIsSaved('Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25', done)
    //   })

    //   it('Views are saved for safari', (done) => {
    //     checkViewIsSaved('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36', done)
    //   })

    //   it('Views from known bots are not saved', (d) => {
    //     var done = createCountedDone(8, d)
    //     checkViewIsNotSaved('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', done)
    //     checkViewIsNotSaved('Mozilla/5.0 (compatible; GurujiBot/1.0; +http://www.guruji.com/en/WebmasterFAQ.html)', done)
    //     checkViewIsNotSaved('Twitterbot', done)
    //     checkViewIsNotSaved('Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)', done)
    //     checkViewIsNotSaved('Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)', done)
    //     checkViewIsNotSaved('msnbot-media/1.1 (+http://search.msn.com/msnbot.htm)', done)
    //     checkViewIsNotSaved('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)', done)
    //     checkViewIsNotSaved('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', done)
    //   })
    // })
  })
}
