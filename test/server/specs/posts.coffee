

browsing = ->

  IT '200 on rss', ->
    opts = status: 200, unauthenticated: true, contentType: /rss/
    PAGE "/rss", opts, -> DONE()


  IT '200 on unauthenticated Posts index', ->
    opts = status: 200, unauthenticated: true
    PAGE "/software-experts", opts, -> DONE()


  IT '200 on unauthenticated Posts by tag', ->
    opts = status: 200, unauthenticated: true
    GET("/posts/tagged/javascript", opts, -> DONE() )


  IT "Request post by non-existing slug", ->
    fakeUrl = "/angularjs/posts/the-definitive-ionic-starter-gu"
    PAGE fakeUrl, {status:404}, (r) ->
      expectContains(r,'not found')
      DONE()


  IT "Redirect on review link for published post", ->
    author = FIXTURE.users.submPostAuthor
    post = FIXTURE.posts.pubedArchitec
    DB.ensureDoc 'Post', post, ->
      PAGE "/posts/review/#{post._id}", { status: 301 }, (e) ->
        EXPECT.startsWith(e, 'Moved Permanently. Redirecting to https://www.airpair.com/scalable-architecture-with-docker-consul-and-nginx')
        DONE()


  IT "Anon view a published post", ->
    post = FIXTURE.posts.higherOrder
    url = post.meta.canonical.replace('https://www.airpair.com', '')
    DB.ensureDoc 'Post', post, ->
      PAGE url, {}, (html) ->
        expectContains(html, '<h1 class="entry-title" itemprop="headline">Mastering ES6 higher-order functions for Arrays</h1>')
        expectContains(html, '<li><a href="/posts/tag/javascript" target="_self">javascript</a></li>')
        DONE()


  IT "Authd view a published post", ->
    post = FIXTURE.posts.higherOrder
    url = post.meta.canonical.replace('https://www.airpair.com', '')
    DB.ensureDoc 'Post', post, ->
      LOGIN {key:'snug'}, ->
        PAGE url, {}, (html) ->
          expectContains(html, '<h1 class="entry-title" itemprop="headline">Mastering ES6 higher-order functions for Arrays</h1>')
          expectContains(html, '<li><a href="/posts/tag/javascript" target="_self">javascript</a></li>')
          DONE()


  IT "2015 100k writing competition", ->
    PAGE '/100k-writing-competition', {status:200}, (html) ->
      expectContains(html, '<h1>2015 Developer Writing Competition</h1>')
      DONE()



postReview = { questions: [
    { idx: 0, key: 'rating', promt: 'How many stars?', answer: 4 },
    { idx: 1, key: 'feedback', promt: 'Explain your star rating', answer: 'Good but not great' }
  ] }



reviews = ->


  IT "Cannot submit anonymous review", ->
    POST "/posts/review/#{higherOrder._id}", postReview, { status: 401 }, (r) ->
      DONE()


  IT "Can submit review for published post", ->
    STORY.newUser 'jkap', (s) ->
      POST "/posts/#{higherOrder._id}/review", postReview, (p1) ->
        expect(p1.reviews.length>0).to.be.true
        review = _.find(p1.reviews,(rev)->_.idsEqual(rev.by._id,s._id))
        EXPECT.equalIds(review.by._id, s._id)
        expect(review.questions.length).to.equal(2)
        expect(review.questions[0].key).to.equal('rating')
        expect(review.questions[1].key).to.equal('feedback')
        DONE()


  IT "Sends appropriate email notifications for reviews and replies", ->
    STORY.newUser 'tiagorg', (sTiagorg, authorKey) ->
      post = FIXTURE.clone('posts.higherOrder', {omit:'reviews stats'})
      post._id = new ObjectId()
      post.by.userId = sTiagorg._id
      post.by.name = sTiagorg.name
      post.slug = post.slug + timeSeed()
      DB.ensureDoc 'Post', post, ->
      spyReviewNotify = STUB.spy(mailman,'sendTemplate')
      spyReviewReplyNotify = STUB.spy(mailman,'sendTemplateMails')
      title = "Post Review Notifications Test " + moment().format('X')
      STORY.newUser 'rev0', (rev0, rev0Key) ->
        POST "/posts/#{post._id}/review", postReview, (p1) ->
          reviewId = p1.reviews[0]._id
          STORY.newUser 'rev1', (rev1, rev1Key) ->
            PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 1 reply to your review' }, (p2) ->
              expect(spyReviewNotify.callCount).to.equal(1)
              expect(spyReviewNotify.args[0][0]).to.equal('post-review-notification')
              tmp1Data = spyReviewNotify.args[0][1]
              # EXPECT.equalIds(spyReviewNotify.args[0][0]._id, post.by.userId)
              EXPECT.equalIds(tmp1Data._id, post._id)
              expect(tmp1Data.title).to.equal(post.title)
              expect(tmp1Data.reviewerFullName).to.equal(rev0.name)
              expect(tmp1Data.rating).to.equal(postReview.questions[0].answer)
              expect(tmp1Data.comment).to.equal(postReview.questions[1].answer)
              expect(spyReviewReplyNotify.callCount).to.equal(1)
              expect(spyReviewReplyNotify.args[0][0]).to.equal('post-review-reply-notification')
              tmp2Data = spyReviewReplyNotify.args[0][1]
              toUsers1 = spyReviewReplyNotify.args[0][2]
              EXPECT.equalIds(tmp2Data._id, post._id)
              expect(tmp2Data.title).to.equal(post.title)
              expect(tmp2Data.comment).to.equal('I say 1 reply to your review')
              expect(tmp2Data.replierFullName).to.equal(rev1.name)
              expect(toUsers1.length).to.equal(2)
              expect(toUsers1[0].name).to.equal(post.by.name)
              expect(toUsers1[1].name).to.equal(rev0.name)
              LOGIN {key:authorKey}, (tiagorg) ->
                PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 2 reply to your review' }, (p3) ->
                  expect(spyReviewReplyNotify.callCount).to.equal(2)
                  expect(spyReviewReplyNotify.args[1][0]).to.equal('post-review-reply-notification')
              #     expect(spyReviewReplyNotify.args[1][0].length).to.equal(2)
                  tmp3Data = spyReviewReplyNotify.args[1][1]
                  toUsers3 = spyReviewReplyNotify.args[1][2]
                  expect(toUsers3[0].name).to.equal(rev0.name)
                  expect(toUsers3[1].name).to.equal(rev1.name)
                  EXPECT.equalIds(tmp3Data._id, post._id)
                  expect(tmp3Data.title).to.equal(post.title)
                  expect(tmp3Data.replierFullName).to.equal(post.by.name)
                  expect(tmp3Data.comment).to.equal('I say 2 reply to your review')
                  LOGIN {key:rev0Key}, (sRev2, rev2Key) ->
                    PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 3 reply to your review' }, (p4) ->
                      expect(spyReviewReplyNotify.callCount).to.equal(3)
                      expect(spyReviewReplyNotify.args[2][2].length).to.equal(2)
                      expect(spyReviewReplyNotify.args[2][2][0].name).to.equal(post.by.name)
                      expect(spyReviewReplyNotify.args[2][2][1].name).to.equal(rev1.name)
                      expect(spyReviewReplyNotify.args[2][1].comment).to.equal('I say 3 reply to your review')
                      STORY.newUser 'rev2', (rev2) ->
                        PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 4 reply to your review' }, (p5) ->
                          expect(spyReviewReplyNotify.callCount).to.equal(4)
                          expect(spyReviewReplyNotify.args[3][2].length).to.equal(3)
                          expect(spyReviewReplyNotify.args[3][2][0].name).to.equal(post.by.name)
                          expect(spyReviewReplyNotify.args[3][2][1].name).to.equal(rev0.name)
                          expect(spyReviewReplyNotify.args[3][2][2].name).to.equal(rev1.name)
                          expect(spyReviewReplyNotify.args[3][1].comment).to.equal('I say 4 reply to your review')
                          DONE()


  IT "Review fails without valid rating and feedback", ->
    post = higherOrder
    STORY.newUser 'rvw3', (rvw3) ->
      POST "/posts/#{post._id}/review", {}, { status: 403 }, (e1) ->
        expectContains(e1.message, "5 star rating required")
        r2 = { questions: [
          { idx: 0, key: 'rating', promt: 'How many stars?', answer: "yo" }] }
        POST "/posts/#{post._id}/review", r2, { status: 403 }, (e2) ->
          expectContains(e2.message, "5 star rating required")
          r3 = { questions: [ postReview.questions[0] ] }
          POST "/posts/#{post._id}/review", r3, { status: 403 }, (e3) ->
            expectContains(e3.message, "5 star feedback required")
            DONE()





module.exports = ->

  before (done) ->
    global.higherOrder = FIXTURE.posts.higherOrder
    DB.ensureDoc 'User', FIXTURE.users.tiagorg, ->
      DB.ensureDoc 'Post', higherOrder, ->
        done()

  after ->
    delete global.higherOrder

  beforeEach ->
    STUB.cb(Wrappers.Slack, 'getUsers', FIXTURE.wrappers.slack_users_list)

  DESCRIBE("Browsing", browsing)
  DESCRIBE("Reviews", reviews)

