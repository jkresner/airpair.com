module.exports = function()
{
  describe("API", function() {
  
    it('gets 401 on unauthenticated session for creating a post', function(done) {
      var opts = { status: 401, unauthenticated: true }
      var d = { title: "test", by: { bio: 'yoyo' } }
      post('/posts', d, opts, function() { done() })
    })


    it('Can create post as signed in user with minimal detail', function(done) {
      addLocalUser('prat', function(userKey) {
        login(userKey, data.users[userKey], function() {
          get('/session/full', {}, function(s) {
            var by = { userId: s._id, name: s.name, bio: 'yo yyoy o', avatar: s.avatar }
            var d = { title: "test", by: by, md: 'Test' }    
            post('/posts', d, {}, function(post) {
              expect(post.by.userId).to.equal(s._id)
              expect(post.by.name).to.equal(s.name)              
              expect(post.by.bio).to.equal('yo yyoy o')                            
              expect(post.by.avatar).to.equal(s.avatar)                                          
              expect(post.created).to.exist
              expect(post.updated).to.exist // updated is used to show admins recent edited posts
              expect(post.published).to.be.undefined
              expect(post.assetUrl).to.be.undefined              
              expect(post.title).to.equal(d.title)
              expect(post.md).to.exist
              expect(post.tags.length).to.equal(0)     
              done()
            })
          })
        })
      })
    })

    it('Can create post as signed in user with max detail', function(done) {
      addLocalUser('ajde', function(userKey) {
        login(userKey, data.users[userKey], function() {
          get('/session/full', {}, function(s) {
            var by = { userId: s._id, name: s.name, bio: 'yes test', avatar: s.avatar }
            by.username = 'ajayD'
            by.tw = 'ajaytw'
            by.gh = 'ajaygh'
            by.in = 'ajayin'
            by.so = 'ajay/1231so'
            by.gp = 'ajaygp'
            var d = { title: "test", by: by, md: 'Test', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }    
            post('/posts', d, {}, function(post) {
              expect(post.by.userId).to.equal(s._id)
              expect(post.by.name).to.equal(s.name)              
              expect(post.by.bio).to.equal('yes test')                            
              expect(post.by.avatar).to.equal(s.avatar) 
              expect(post.by.username).to.equal('ajayd') 
              expect(post.by.tw).to.equal('ajaytw') 
              expect(post.by.gh).to.equal('ajaygh') 
              expect(post.by.in).to.equal('ajayin') 
              expect(post.by.so).to.equal('ajay/1231so') 
              expect(post.by.gp).to.equal('ajaygp')               
              expect(post.created).to.exist
              expect(post.updated).to.exist
              expect(post.published).to.be.undefined
              expect(post.assetUrl).to.equal(d.assetUrl)         
              expect(post.title).to.equal(d.title)
              expect(post.md).to.exist
              expect(post.tags.length).to.equal(0)     
              done()
            })
          })
        })
      })
    })

    
    it('Can not edit post as non-author', function(done) {
      $log('TODO', 'write test')
      done()      
    })


    it('Can edit post as author', function(done) {
      $log('TODO', 'write test')
      done()
    })


    it('Can not delete post as non-author', function(done) {
      $log('TODO', 'write test')
      done()      
    })


    it('Can delete post as author', function(done) {
      $log('TODO', 'write test')
      done()      
    })


    it('Can not publish post as non-editor', function(done) {
      $log('TODO', 'write test')
      done()      
    })


    it('Can publish post as editor', function(done) {
      $log('TODO', 'write test')
    //   expect('published').toBe(false)  
    //   expect('slug').toBe(false)  
    //   expect('assetUrl')
    //   expect('tags')  
      done()      
    })


    it('Get 401 on unauthenticated session for users own posts', function(done) {
      var opts = { status: 401, unauthenticated: true }
      get('/posts/me', opts, function() { done() })
    })

    
    it('Get users own posts returns published and unpublished posts', function(done) {
      addLocalUser('jkre', function(userKey) {
        login(userKey, data.users[userKey], function() {
          get('/session/full', {}, function(s) {
            var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
            var d1 = { title: "test 1", by: by, md: 'Test 1', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
            var d2 = { title: "test 2", by: by, md: 'Test 2', assetUrl: 'http://www.airpair.com/v1/img/css/blog/example2.jpg' }
            var d3 = { title: "test 3", by: by, md: 'Test 3', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }    
            post('/posts', d1, {}, function(p1) {
              post('/posts', d2, {}, function(p2) {
                expect(p2.published).to.be.undefined
                p2.slug = "test-2-pub-"+moment().format('X')
                post('/posts', d3, {}, function(p3) {
                  login('admin', data.users.admin, function() {
                    put('/posts/publish/'+p2._id, p2, {}, function(p2pub, resp) {
                      expect(p2pub.published).to.exist
                      login(userKey, data.users[userKey], function() {
                        get('/posts/me', {}, function(posts) { 
                          // $log(_.pluck(posts,'published'))
                          expect(posts.length).to.equal(3)
                          done() 
                        })
                      })
                    })                      
                  })
                })
              })
            })
          })
        })
      })
    })






  })
}