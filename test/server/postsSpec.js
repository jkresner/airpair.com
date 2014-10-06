import {getHashId} from '../../server/services/postsToc'

module.exports = function()
{
  describe("API", function() {
  
    before(function(done) {
      testDb.addUserWithRole('edap', 'editor', stubAnalytics)
      testDb.initTags(done)      
    })

    after(function(done) {
      resotreAnalytics()
      done()      
    })
  
    it('401 on unauthenticated session for creating a post', function(done) {
      var opts = { status: 401, unauthenticated: true }
      var d = { title: "test", by: { bio: 'yoyo' } }
      POST('/posts', d, opts, function() { done() })
    })


    it('Create post as signed in user with minimal detail', function(done) {
      addAndLoginLocalUser('prat', function(s) {
        var by = { userId: s._id, name: s.name, bio: 'yo yyoy o', avatar: s.avatar }
        var d = { title: "test", by: by, md: 'Test' }    
        POST('/posts', d, {}, function(post) {
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


    it('Create post as signed in user with max detail', function(done) {
      addAndLoginLocalUser('ajde', function(s) {
        var by = { userId: s._id, name: s.name, bio: 'yes test', avatar: s.avatar }
        by.username = 'ajayD'
        by.tw = 'ajaytw'
        by.gh = 'ajaygh'
        by.in = 'ajayin'
        by.so = 'ajay/1231so'
        by.gp = 'ajaygp'
        var d = { title: "test", by: by, md: 'Test', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }    
        POST('/posts', d, {}, function(post) {
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


    it('Not edit or delete post as non-author and non-editor', (done) => {
      addAndLoginLocalUser('evnr', function(s) {
        var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
        var d1 = { title: "test authed", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg' }
        POST('/posts', d1, {}, function(p1) {
          addAndLoginLocalUser('nevk', function(s2) {
            PUT(`/posts/${p1._id}`, { title: 'updated title' }, { status: 403 }, function(e1) {
              expect(e1.message).to.equal('Post must be updated by owner')
              DELETE(`/posts/${p1._id}`, { status: 403 }, function(e2) {
                expect(e2.message).to.equal('Post must be deleted by owner')
                done()
              })
            })
          })
        })
      })
    })
      

    it('Edit and delete post as author', (done) => {
      addAndLoginLocalUser('stpv', function(s) {
        var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
        var d1 = { title: "test authed delete", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg' }
        POST('/posts', d1, {}, function(p1) {
          expect(p1.slug).to.be.undefined
          p1.slug = d1.title.replace(/ /g,'-')+moment().format('X')
          PUT(`/posts/${p1._id}`, p1, {}, function(e2) {
            expect(e2.slug).to.equal(p1.slug)
            DELETE(`/posts/${p1._id}`, { status: 200 }, function(r) {
              GET('/posts/me', {}, function(posts) { 
                expect(posts.length).to.equal(0)
                done() 
              })
            })
          })            
        })
      })
    })


    it('Edit and delete post as editor', (done) => {
      addAndLoginLocalUser('stpu', function(s) {
        var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
        var d1 = { title: "test authed", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg' }
        POST('/posts', d1, {}, function(p1) {
          expect(p1.slug).to.be.undefined
          p1.slug = d1.title.replace(/ /g,'-')+moment().format('X')
          LOGIN('edap', data.users['edap'], function() {
            PUT(`/posts/${p1._id}`, p1, {}, function(e2) {
              expect(e2.slug).to.equal(p1.slug)
              DELETE(`/posts/${p1._id}`, { status: 200 }, function(r) {
                GET('/posts/me', {}, function(posts) { 
                  expect(posts.length).to.equal(0)
                  done() 
                })
              })
            })            
          })
        })
      })
    })


    it('Not publish post as non-editor', (done) => {
      addAndLoginLocalUser('rapo', function(s) {
        var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
        var d1 = { title: "test not publish", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg' }
        POST('/posts', d1, {}, function(p1) {
          expect(p1.slug).to.be.undefined
          expect(p1.publish).to.be.undefined
          p1.slug = d1.title.replace(/ /g,'-')+moment().format('X')
          PUT(`/posts/${p1._id}`, p1, {}, function(e2) {
            expect(e2.slug).to.equal(p1.slug)
            PUT(`/posts/publish/${p1._id}`, p1, { status: 403 }, function(e1) {
              expect(e1.message).to.equal('Post must be published by an editor')
              done()
            })
          })            
        })
      })
    })


    it('Publish post as editor', function(done) {
      addAndLoginLocalUser('obie', function(s) {
        var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
        var d1 = { title: "test publish as editor", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg' }
        POST('/posts', d1, {}, function(p1) {
          expect(p1.slug).to.be.undefined
          expect(p1.publish).to.be.undefined
          expect(p1.publishedBy).to.be.undefined          
          p1.slug = d1.title.replace(/ /g,'-')+moment().format('X')
          LOGIN('edap', data.users['edap'], function() {
            PUT(`/posts/publish/${p1._id}`, p1, {}, function(p1pub) {
              expect(p1pub.published).to.exist
              expect(_.idsEqual(p1pub.publishedBy,data.users['edap']._id)).to.be.true
              done()
            })
          })            
        })
      })
    })


    it('401 on unauthenticated for users own posts', function(done) {
      var opts = { status: 401, unauthenticated: true }
      GET('/posts/me', opts, function() { done() })
    })

    
    it('Users own posts returns published and unpublished posts', function(done) {
      addAndLoginLocalUser('jkre', function(s) {
        var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
        var d1 = { title: "test 1", by: by, md: 'Test 1', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
        var d2 = { title: "test 2", by: by, md: 'Test 2', assetUrl: 'http://www.airpair.com/v1/img/css/blog/example2.jpg' }
        var d3 = { title: "test 3", by: by, md: 'Test 3', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }    
        POST('/posts', d1, {}, function(p1) {
          POST('/posts', d2, {}, function(p2) {
            expect(p2.published).to.be.undefined
            p2.slug = "test-2-pub-"+moment().format('X')
            POST('/posts', d3, {}, function(p3) {
              LOGIN('edap', data.users.edap, function() {
                PUT('/posts/publish/'+p2._id, p2, {}, function(p2pub, resp) {
                  expect(p2pub.published).to.exist
                  LOGIN(s.userKey, data.users[s.userKey], function() {
                    GET('/posts/me', {}, function(posts) { 
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


    it('Gets correct TOC hashId', function() {
      expect(getHashId('4 Understanding $scope')).to.equal('4-understanding-scope')
      expect(getHashId('11 Filters (Custom)')).to.equal('11-filters-custom-')
      expect(getHashId('4.1 Launch the ElasticSearch Server')).to.equal('4-1-launch-the-elasticsearch-server')
      expect(getHashId("8 Scoping $scope's")).to.equal('8-scoping-scope-s')
      expect(getHashId("2 Single-page applications and 'modules'")).to.equal('2-single-page-applications-and-modules-')
      expect(getHashId('3.3 Cypher expressions and scalar/collection functions')).to.equal('3-3-cypher-expressions-and-scalar-collection-functions')
    })



  })
}