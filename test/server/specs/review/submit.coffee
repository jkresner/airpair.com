{higherOrder} = FIXTURE.posts


success = ->


  IT "Submitted Post, Reviewed with rating + comment", ->
    postReview = FIXTURE.clone('reviews.simple4')
    title = "Post in Review, Review Test #{@testSeed}"
    STORY.newPost 'vagrantCheat', { author: 'tst8', submit:true, data: { title } }, (p0, sTst8) =>
      DB.docById 'Post', p0._id, (p0DB) =>
        expect(p0DB.reviews.length).to.equal(0)
        expect(p0DB.stats.reviews).to.be.undefined
        expect(p0DB.stats.rating).to.be.undefined
        # L @, 'p0DB', p0DB
        expect(p0DB.meta.activity.length).to.equal(0)
        LOGIN 'jkg', (jkg) =>
          PUT "/reviews/submitreview/#{p0._id}", postReview, (r0) =>
            EXPECT.equalIds(r0._id, p0._id)
            expect(r0.body).to.be.undefined
            expect(r0.subHash).to.be.undefined
            expect(r0.stats.reviews).to.equal(1)
            expect(r0.stats.rating).to.equal(4)
            expect(r0.reviews.length).to.equal(1)
            expect(r0.reviews[0]._id).to.exist
            expect(r0.reviews[0].said).to.equal('Good but not great')
            expect(r0.reviews[0].val).to.equal(4)
            # $log('going'.yellow, r0.reviews[0])
            # expect(r0.reviews[0].by.name).to.equal(jkg.name)
            # expect(r0.reviews[0].by.avatar).to.equal(jkg.avatar)
            # expect(r0._id).to.exist
            # expect(r0.feedback).to.equal('Good but not great')
            # expect(r0.rating).to.equal(4)
            # EXPECT.equalIds(r0.by._id, jkg._id)
            postReviewUpdate = { val: 5, said: 'Great almost, but not perfect'}
            PUT "/reviews/submitreview/#{p0._id}", postReviewUpdate, (r1) =>
              EXPECT.equalIds(r1._id, p0._id)
              EXPECT.equalIds(r1.reviews[0]._id,r0.reviews[0]._id)
              expect(r1.body).to.be.undefined
              expect(r1.stats.reviews).to.equal(1)
              expect(r1.stats.rating).to.equal(5)
              expect(r1.reviews.length).to.equal(1)
              expect(r1.reviews[0].said).to.equal('Great almost, but not perfect')
              expect(r1.reviews[0].val).to.equal(5)
              # $log('going'.yellow, r1.reviews[0])
              # expect(r1.reviews[0].by.name).to.equal(jkg.name)
              expect(r1.reviews[0].by.name).to.equal('jkres')
              expect(r1.reviews[0].by.pic).to.equal(jkg.avatar.split('?')[0])
              DB.docById 'Post', p0._id, (p1DB) =>
                # L @, 'p1DB', p1DB
                expect(p1DB.meta.activity.length).to.equal(2)
                expect(p1DB.meta.lastTouch.action).to.equal('postreview:update')
                DONE()




  IT "Published post, Reviewed with rating + comment", ->
    postReview = FIXTURE.clone('reviews.simple5')
    STORY.newPost 'higherOrder', { author: 'tiag', publish: true, submit:true }, (p0, sTiag) =>
      STORY.newUser 'jrenaux', (s) =>
        PUT "/reviews/submitreview/#{p0._id}", postReview, (p1) =>
          # L @, 'P0', p1.reviews[0]
          # expect(p1.reviews.length>0).to.be.true
          expect(p1.reviews.length).to.equal(1)
          review = p1.reviews[0]
          # review = _.find(p1.reviews, (rev) => _.idsEqual(rev.by._id,s._id))
          expect(review.by._id).to.be.undefined
          expect(review.by.email).to.be.undefined
          expect(review.by.name).to.exist
          expect(review.by.pic).to.exist
          expect(review.by.gh).to.exist
          expect(review.val).to.equal(5)
          expect(review.said).to.equal('Great, basically perfect')
          DONE()




  IT "Published Post, Review with only rating", ->
    postReview = FIXTURE.clone('reviews.noComment')
    STORY.newPost 'exps_deep', { author: 'tst8', publish: true, submit:true }, (p0, sTst8) =>
      DB.docById 'Post', p0._id, (p0DB) =>
        expect(p0DB.history.submitted).to.exist
        expect(p0DB.history.published).to.exist
        expect(p0DB.reviews.length).to.equal(0)
        expect(p0DB.stats.reviews).to.be.undefined
        LOGIN 'jkg', (jkg) =>
          PUT "/reviews/submitreview/#{p0._id}", postReview, (r0) =>
            EXPECT.equalIds(r0._id, p0._id)
            expect(r0.body).to.be.undefined
            expect(r0.stats.reviews).to.equal(1)
            expect(r0.stats.rating).to.equal(3)
            expect(r0.reviews.length).to.equal(1)
            expect(r0.reviews[0]._id).to.exist
            expect(r0.reviews[0].said).to.be.undefined
            expect(r0.reviews[0].val).to.equal(3)
            DONE()



  IT "Published Post, Review with only comment", ->
    postReview = FIXTURE.clone('reviews.noRating')
    STORY.newPost 'logoBra', { author: 'tst8', publish: true, submit:true }, (p0, sTst8) =>
      DB.docById 'Post', p0._id, (p0DB) =>
        expect(p0DB.history.submitted).to.exist
        expect(p0DB.history.published).to.exist
        expect(p0DB.reviews.length).to.equal(0)
        expect(p0DB.stats.reviews).to.be.undefined
        LOGIN 'jkg', (jkg) =>
          PUT "/reviews/submitreview/#{p0._id}", postReview, (r0) =>
            EXPECT.equalIds(r0._id, p0._id)
            expect(r0.body).to.be.undefined
            expect(r0.stats.reviews).to.equal(0)
            expect(r0.stats.rating).to.be.undefined
            expect(r0.reviews.length).to.equal(1)
            expect(r0.reviews[0]._id).to.exist
            expect(r0.reviews[0].said).to.equal('I like how you did that, could you say this?')
            expect(r0.reviews[0].val).to.be.undefined
            DONE()


  SKIP "Reviews unaffected by new reviews and review edits", ->




aPost = null
fail = ->

  before (done) ->
    STORY.newPost 'pubedArchitec', { author: 'tst8', publish: true, submit:true }, (p0, sTst8) =>
      aPost = p0
      done()


  IT "Anonymous", ->
    postReview = FIXTURE.clone('reviews.noRating')
    PUT "/reviews/submitreview/#{aPost._id}", postReview, RES(403,/json/,{unauthenticated:true}), (err) =>
      DONE()


  IT "Draft post", ->
    postReview = FIXTURE.clone('reviews.simple5')
    title = "Post Draft Review Test #{@testSeed}"
    STORY.newPost 'logoBra', { author: 'matias', data: {title} }, (p0, sTst5) =>
      expect(p0.title).to.equal(title)
      LOGIN 'jkg', (jkg) =>
        PUT "/reviews/submitreview/#{p0._id}", postReview, { status: 403 }, (r) =>
          expect(r.message).to.inc ['not submitted']
          DONE()



  IT "Fail submit invalid rating", ->
    postReview = FIXTURE.clone('reviews.bogus')
    # title = "Post in Review, Missing bogus rating #{@testSeed}"
    # STORY.newPost 'exps_deep', { author: 'jky', submit:true, data: { title } }, (p0, sTst1) =>
    LOGIN 'jkg', (jkg) ->
      PUT "/reviews/submitreview/#{aPost._id}", postReview, {status:403}, (r) =>
        expect(r.message).to.inc '5 star rating required'
        # PUT "/reviews/submitreview/#{p0._id}", postReviewBogus, {status:403}, (r) =>
          # expect(r.message).to.inc ['Feedback required']
          # PUT "/reviews/submitreview/#{p0._id}", missingRating, {status:403}, (r) =>
            # expect(r.message).to.inc ['5 star rating required']
        DONE()


  IT "Author's own post", ->
    postReview = FIXTURE.clone('reviews.simple5')
    title = "Post Authors Own Review Test #{@testSeed}"
    LOGIN 'tst8', (s) ->
    # STORY.newPost 'logoBra', { author: 'tst5', data: {title} }, (p0, sTst5) =>
       PUT "/reviews/submitreview/#{aPost._id}", postReview, { status: 403 }, (r) =>
        expect(r.message).to.inc "Cannot review your own post"
        DONE()



  SKIP "Double submit", ->


  SKIP "Update (another users review)", ->


  SKIP "Submitted Post, Reviewed with Only rating", ->

  SKIP "Submitted Post, Reviewed with only comment", ->





DESCRIBE("Create/update", success)
DESCRIBE("Fail", fail)

# DESCRIBE.skip("DELETE", ->)

  # Cannot read property 'constructor' of null
  # POST /v1/api/posts/5485f71f9504360b00ff98bb/review
  # 202.14.85.241, 108.162.222.4
  # Francis Vidal francis.vidal@spi-global.com 56e780a64255651100fc611e
  #  << https://www.airpair.com/aws/posts/building-a-scalable-web-app-on-amazon-web-services-p1
  #  isBot:false:Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36

  #  {"postId":"5485f71f9504360b00ff98bb","questions":[{"idx":0,"key":"rating","prompt":"How would you rate the quality of this post?","answer":"5"},{"idx":1,"key":"feedback","prompt":"Overall comment","answer":"Excellent guide!"}],"by":{"_id":"56e780a64255651100fc611e","name":"Francis Vidal","email":"francis.vidal@spi-global.com"},"type":"post-survey-inreview"}




