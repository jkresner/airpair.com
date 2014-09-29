var postTitle =  "Analytics Tests "+moment().format('X')
var postSlug = postTitle.toLowerCase().replace(/ /g,'-')

//-- Approach

// (1) Generate sessionID on first request to the server
// (2) Alias the sessionID against the mixpanel distinctId immediately on first client
// (3) Alias the userId against the sessionId on user creation

//-- TODO
// 
// (1) Make sure we have utms available
// (2) Make sure we can see page views
 

module.exports = function() {
 
  describe("Tracking: ", function() {

    before(function(done) {
      testDb.addAdmin('jkap', () =>
        testDb.initTags( () =>
          login('jkap', data.users['jkap'], function(s) {
            testDb.createWorkshop(data.workshops.railsTests)
            testDb.createAndPublishPost(s, {title: postTitle,slug:postSlug}, done)
          })
        )
      )
    })


    it('Can track an anonymous post view', function(done) {
      analytics.setCallback(done)
      var spy = sinon.spy(analytics,'view')
      http(global.app)
        .get(`/v1/posts/${postSlug}?utm_source=test1src&utm_content=test1ctn`)
        .set('referer', 'http://airpair.com/posts')
        .expect('Content-Type', /text/)
        .expect(200)
        .end(function(err, resp){
          if (err) throw err
          expect(spy).to.have.been.calledOnce
          expect(spy.args[0][0]).to.be.null
          expect(spy.args[0][1]).to.exist          
          expect(spy.args[0][2]).to.equal('post')                   
          expect(spy.args[0][3]).to.equal(postTitle)                            
          expect(spy.args[0][4].tags).to.exist
          expect(spy.args[0][5].referer).to.equal('http://airpair.com/posts') 
          expect(spy.args[0][5].campaign.source).to.equal('test1src')                                        
          expect(spy.args[0][5].campaign.content).to.equal('test1ctn')          
          expect(spy.args[0][5].campaign.medium).to.be.undefined
          expect(spy.args[0][5].campaign.term).to.be.undefined
          expect(spy.args[0][5].campaign.name).to.be.undefined
          expect(spy.args[0][6]).to.be.undefined                                        
          spy.restore()
        })
    })


    it('Can track logged in post view', function(done) {
      var spy = sinon.spy(analytics,'view')
      addLocalUser('ajde', function(userKey) {
        analytics.setCallback(done)
        login(userKey, data.users[userKey], function(s) {
          http(global.app)
            .get(`/v1/posts/${postSlug}?utm_campaign=test2nm`)
            .set('cookie', cookie)
            .set('referer', 'http://www.airpair.com/posts')
            .expect('Content-Type', /text/)
            .expect(200)
            .end(function(err, resp){
              if (err) throw err
              expect(spy).to.have.been.calledOnce
              expect(spy.args[0][0]).to.equal(s._id)
              expect(spy.args[0][1]).to.be.null          
              expect(spy.args[0][2]).to.equal('post')                   
              expect(spy.args[0][3]).to.equal(postTitle)                            
              expect(spy.args[0][4].tags).to.exist
              expect(spy.args[0][5].referer).to.equal('http://www.airpair.com/posts')                                        
              expect(spy.args[0][5].campaign.source).to.be.undefined
              expect(spy.args[0][5].campaign.content).to.be.undefined         
              expect(spy.args[0][5].campaign.medium).to.be.undefined
              expect(spy.args[0][5].campaign.term).to.be.undefined
              expect(spy.args[0][5].campaign.name).to.equal('test2nm')              
              expect(spy.args[0][6]).to.be.undefined                                        
              spy.restore()
            })
        })
      })
    })


    it('Can track post view action', function(done) {
      //-- will have to be implemented in a front-end integration test
      $log('TODO', "Required front end test")
      done()
    //   expect('analytics track called')
    //   expect('analytics track has time to action')      
    //   expect('expect userId linked to event')      
    //   expect('expect sessionId (if anonymous) linked to event')            
    })

    it('Can track an anonymous workshop view', function(done) {
      analytics.setCallback(done)
      var spy = sinon.spy(analytics,'view')
      http(global.app)
        .get(`/v1/workshops/simplifying-rails-tests`)
        .set('referer', 'http://airpair.com/workshops')
        .expect('Content-Type', /text/)
        .expect(200)
        .end(function(err, resp){
          if (err) throw err
          expect(spy).to.have.been.calledOnce
          expect(spy.args[0][0]).to.be.null
          expect(spy.args[0][1]).to.exist          
          expect(spy.args[0][2]).to.equal('workshop')                   
          expect(spy.args[0][3]).to.equal('Breaking Up (with) Your Test Suite')                            
          expect(spy.args[0][4].tags).to.exist
          expect(spy.args[0][5].referer).to.equal('http://airpair.com/workshops') 
          expect(spy.args[0][5].campaign).to.be.undefined
          expect(spy.args[0][6]).to.be.undefined                                        
          spy.restore()
        })
    })


    it('Can track logged in workshop view', function(done) {
      var spy = sinon.spy(analytics,'view')
      addLocalUser('joem', function(userKey) {
        analytics.setCallback(done)
        login(userKey, data.users[userKey], function(s) {
          http(global.app)
            .get(`/v1/workshops/simplifying-rails-tests?utm_campaign=test4nm&utm_medium=test4md`)
            .set('cookie', cookie)
            .set('referer', 'http://www.airpair.com/workshops')
            .expect('Content-Type', /text/)
            .expect(200)
            .end(function(err, resp){
              if (err) throw err
              expect(spy).to.have.been.calledOnce
              expect(spy.args[0][0]).to.equal(s._id)
              expect(spy.args[0][1]).to.be.null          
              expect(spy.args[0][2]).to.equal('workshop')                   
              expect(spy.args[0][3]).to.equal('Breaking Up (with) Your Test Suite')                            
              expect(spy.args[0][4].tags).to.exist
              expect(spy.args[0][5].referer).to.equal('http://www.airpair.com/workshops')                                        
              expect(spy.args[0][5].campaign.source).to.be.undefined
              expect(spy.args[0][5].campaign.content).to.be.undefined         
              expect(spy.args[0][5].campaign.medium).to.equal('test4md')
              expect(spy.args[0][5].campaign.term).to.be.undefined
              expect(spy.args[0][5].campaign.name).to.equal('test4nm')              
              expect(spy.args[0][6]).to.be.undefined                                        
              spy.restore() 
            })
        })
      })
    })


    it('Aliases anonymous user with new user signup', (done) => 
      http(global.app)
        .get(`/v1/posts/${postSlug}?utm_campaign=testSingup&utm_source=test8src&utm_content=test8ctn`)
        .set('referer', 'http://twitter.co')
        .expect(200)
        .end(function(err, resp) {
          var spy = sinon.spy(analytics,'alias')
          cookie = resp.headers['set-cookie']
          get('/session', {}, (s) => { 
            analytics.setCallback(done)
            var singup = getNewUserData('pgap')
            http(global.app).post('/v1/auth/signup').send(singup)
              .set('cookie',cookie)
              .end( (err, resp) =>
                get('/session/full', {}, (sFull) => {
                  expect(sFull._id).to.exist
                  expect(sFull.name).to.equal(singup.name)                
                  expect(sFull.tags).to.be.undefined

                  expect(spy).to.have.been.calledOnce
                  expect(spy.args[0][0]).to.equal(s.sessionID)
            //       // expect(spy.args[0][1]).to.be.null          
            //       // expect(spy.args[0][2]).to.equal('Workshop')                   
            //       // expect(spy.args[0][3]).to.equal('Breaking Up (with) Your Test Suite')                            
            //       // expect(spy.args[0][4].tags).to.exist
            //       // expect(spy.args[0][5].referer).to.equal('http://www.airpair.com/workshops')                                        
            //       // expect(spy.args[0][5].campaign.source).to.be.undefined
            //       // expect(spy.args[0][5].campaign.content).to.be.undefined         
            //       // expect(spy.args[0][5].campaign.medium).to.equal('test4md')
            //       // expect(spy.args[0][5].campaign.term).to.be.undefined
            //       // expect(spy.args[0][5].campaign.name).to.equal('test4nm')              
            //       // expect(spy.args[0][6]).to.be.undefined                                        
            //       spy.restore()
                  // expect('view docs to be alias')
                  done()
                })
              )
            })
        })
    )


// make sure we have utms



// Anonymous View a post
// View login
// View signup
// Signup 
// View a workshop
//
// expect events
// View (server:distinctId:sessionId) 
// Click CTA (client:distinctId:sessionId)
// Route Login (client:distinctId:sessionId)
// Route Signup (client:distinctId:sessionId)
// Submit Local Signup (server:distinctId:sessionId)
// Signup (server:distinctId:userId)
// View (server:distinctId:userId)


    // it('Can track an anonymous workshop view', function(done) {

    // })

    // it('Can track logged in workshop view', function(done) {

    // })


    // it('Can link an existing user', function(done) {
    //   expect('email aliased to userId, preserves events')
    // })


    // it('First visit time tracked in session', function(done) {

    // })

    // it('User signup of new user copied to cohort', function(done) {

    // })

    // it('User signup of existing user copied to cohort', function(done) {

    // })

    // it('User alias', function(done) {
    //   expect('pageViews linked')
    //   expect('visit_first')      
    //   expect('visit_last')      
    //   expect('visit_signup')            
    //   expect('visits')      
    //   expect('copied-bookmarks')            
    //   expect('copied-stack')                  
    //   expect('?copied-email')                        
    // })

    // afterEach(function(){
    // })

  })

}