postTitle = "Post Surveys Tests "+moment().format('X')
postSlug = postTitle.toLowerCase().replace /\ /g, '-'
postUrl = "/v1/posts/#{postSlug}"
postId = null
postReview = { questions: [
    { idx: 0, key: 'rating', promt: 'How many stars?', answer: 4 },
    { idx: 1, key: 'feedback', promt: 'Explain your star rating', answer: 'Good but not great' }
  ] }

module.exports = -> describe "API: ".subspec, ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.addUserWithRole 'jkap', 'editor', ->
      SETUP.initTags ->
        SETUP.initTemplates done

  after ->
    SETUP.analytics.restore()

  it.skip "correctly saves index from the UI", (done) ->


  it "Cannot submit anonymous review", (done)->
    title = "Post Anon Review Test " + moment().format('X')
    SETUP.createNewPost 'jkap', {title}, (post) ->
      ANONSESSION (s) ->
        rev =
        POST "/posts/review/#{post._id}", postReview, { status: 401 }, (r) ->
          done()



  it "Cannot submit review for draft post", (done)->
    title = "Post Draft Review Test " + moment().format('X')
    SETUP.createNewPost 'jkap', {title}, (post) ->
      SETUP.addAndLoginLocalUser 'rvw1', (rvw1) ->
        POST "/posts/#{post._id}/review", postReview, { status: 403 }, (r) ->
          expectContains(r.message, 'has not been submitted or published')
          done()


  it "Can review post in review", (done)->
    title = "Post in Review, Review Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rvw2', (rvw2) ->
        POST "/posts/#{post._id}/review", postReview, {}, (p1) ->
          expect(p1.reviews.length).to.equal(1)
          done()


  it "Review fails without valid rating and feedback", (done)->
    title = "Post in Review, Bad Review Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rvw3', (rvw3) ->
        POST "/posts/#{post._id}/review", {}, { status: 403 }, (e1) ->
          expectContains(e1.message, "5 star rating required")
          r2 = { questions: [
            { idx: 0, key: 'rating', promt: 'How many stars?', answer: "yo" }] }
          POST "/posts/#{post._id}/review", r2, { status: 403 }, (e2) ->
            expectContains(e2.message, "5 star rating required")
            r3 = { questions: [ postReview.questions[0] ] }
            POST "/posts/#{post._id}/review", r3, { status: 403 }, (e3) ->
              expectContains(e3.message, "5 star feedback required")
              done()


  it "Can submit review for published post", (done)->
    title = "Published Post Review Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rvw4', (rvw4) ->
        POST "/posts/#{post._id}/review", postReview, {}, (p1) ->
          expect(p1.reviews.length).to.equal(1)
          expect(p1.reviews[0].by._id).to.equal(rvw4._id)
          expect(p1.reviews[0].questions.length).to.equal(2)
          expect(p1.reviews[0].questions[0].key).to.equal('rating')
          expect(p1.reviews[0].questions[1].key).to.equal('feedback')
          done()


  it.skip "Submitting review twice updates review", (done)->
    # .put('/posts/review/:post', API.Posts.addReview)


  it "Reply to review as author", (done)->
    title = "Post Reply to Review as Author Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rvw5', (rvw5) ->
        POST "/posts/#{post._id}/review", postReview, {}, (p1) ->
          reviewId = p1.reviews[0]._id
          expect(reviewId).to.exist
          LOGIN 'jkap', (jkap) ->
            PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'test review reply as author' }, {}, (p2) ->
              expect(p2.reviews.length).to.equal(1)
              expect(p2.reviews[0].replies.length).to.equal(1)
              expect(p2.reviews[0].replies[0].by._id).to.equal(jkap._id)
              expect(p2.reviews[0].replies[0].comment).to.equal('test review reply as author')
              done()


  it "Reply to review as another reviewer", (done)->
    title = "Post Reply to Review as another Reviewer Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rvw6', (rvw6) ->
        POST "/posts/#{post._id}/review", postReview, {}, (p1) ->
          reviewId = p1.reviews[0]._id
          expect(reviewId).to.exist
          SETUP.addAndLoginLocalUser 'rvw7', (rvw7) ->
            PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'test review reply' }, {}, (p2) ->
              expect(p2.reviews.length).to.equal(1)
              expect(p2.reviews[0].replies.length).to.equal(1)
              expect(p2.reviews[0].replies[0].by._id).to.equal(rvw7._id)
              expect(p2.reviews[0].replies[0].comment).to.equal('test review reply')
              done()


  it "Upvote review", (done)->
    title = "Post Upvote Review as another Reviewer Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rvw8', (rvw8) ->
        POST "/posts/#{post._id}/review", postReview, {}, (p1) ->
          reviewId = p1.reviews[0]._id
          expect(p1.reviews[0].votes.length).to.equal(0)
          SETUP.addAndLoginLocalUser 'rvw9', (rvw9) ->
            PUT "/posts/#{post._id}/review/#{reviewId}/upvote", { comment: 'test review vote another reviewer' }, {}, (p2) ->
              expect(p2.reviews.length).to.equal(1)
              expect(p2.reviews[0].votes.length).to.equal(1)
              expect(p2.reviews[0].votes[0].val).to.equal(1)
              expect(p2.reviews[0].votes[0].by._id).to.equal(rvw9._id)
              expect(p2.reviews[0].votes[0].by.email).to.be.undefined
              expect(p2.reviews[0].votes[0].by.avatar).to.exist
              LOGIN 'jkap', (jkap) ->
                PUT "/posts/#{post._id}/review/#{reviewId}/upvote", { comment: 'test review vote by author' }, {}, (p3) ->
                  expect(p3.reviews.length).to.equal(1)
                  expect(p3.reviews[0].votes.length).to.equal(2)
                  expect(p3.reviews[0].votes[0].by._id).to.equal(rvw9._id)
                  expect(p3.reviews[0].votes[1].by._id).to.equal(jkap._id)
                  expect(p3.reviews[0].votes[1].val).to.equal(1)
                  done()


  it "Sends appropriate email notifications for reviews and replies", (done) ->
    spyReviewNotify = sinon.spy(mailman,'sendPostReviewNotification')
    spyReviewReplyNotify = sinon.spy(mailman,'sendPostReviewReplyNotification')
    title = "Post Review Notifications Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rev0', (rev0) ->
        POST "/posts/#{post._id}/review", postReview, {}, (p1) ->
          reviewId = p1.reviews[0]._id
          SETUP.addAndLoginLocalUser 'rev1', (rev1) ->
            PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 1 reply to your review' }, {}, (p2) ->
              expect(spyReviewNotify.callCount).to.equal(1)
              expectIdsEqual(spyReviewNotify.args[0][0]._id, post.by.userId)
              expectIdsEqual(spyReviewNotify.args[0][1], post._id)
              expect(spyReviewNotify.args[0][2]).to.equal(post.title)
              expect(spyReviewNotify.args[0][3]).to.equal(rev0.name)
              expect(spyReviewNotify.args[0][4]).to.equal(postReview.questions[0].answer)
              expect(spyReviewNotify.args[0][5]).to.equal(postReview.questions[1].answer)
              spyReviewNotify.restore()
              expect(spyReviewReplyNotify.callCount).to.equal(1)
              expect(spyReviewReplyNotify.args[0][0].length).to.equal(2)
              expect(spyReviewReplyNotify.args[0][0][0].name).to.equal(post.by.name)
              expect(spyReviewReplyNotify.args[0][0][1].name).to.equal(rev0.name)
              expectIdsEqual(spyReviewReplyNotify.args[0][1], post._id)
              expect(spyReviewReplyNotify.args[0][2]).to.equal(post.title)
              expect(spyReviewReplyNotify.args[0][3]).to.equal(rev1.name)
              expect(spyReviewReplyNotify.args[0][4]).to.equal('I say 1 reply to your review')
              LOGIN 'jkap', (jkap) ->
                PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 2 reply to your review' }, {}, (p3) ->
                  expect(spyReviewReplyNotify.callCount).to.equal(2)
                  expect(spyReviewReplyNotify.args[1][0].length).to.equal(2)
                  expect(spyReviewReplyNotify.args[1][0][0].name).to.equal(rev0.name)
                  expect(spyReviewReplyNotify.args[1][0][1].name).to.equal(rev1.name)
                  expectIdsEqual(spyReviewReplyNotify.args[1][1], post._id)
                  expect(spyReviewReplyNotify.args[1][2]).to.equal(post.title)
                  expect(spyReviewReplyNotify.args[1][3]).to.equal(post.by.name)
                  expect(spyReviewReplyNotify.args[1][4]).to.equal('I say 2 reply to your review')
                  LOGIN rev0.userKey, (sRev2) ->
                    PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 3 reply to your review' }, {}, (p4) ->
                      expect(spyReviewReplyNotify.callCount).to.equal(3)
                      expect(spyReviewReplyNotify.args[2][0].length).to.equal(2)
                      expect(spyReviewReplyNotify.args[2][0][0].name).to.equal(post.by.name)
                      expect(spyReviewReplyNotify.args[2][0][1].name).to.equal(rev1.name)
                      expect(spyReviewReplyNotify.args[2][4]).to.equal('I say 3 reply to your review')
                      SETUP.addAndLoginLocalUser 'rev2', (rev2) ->
                        PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 4 reply to your review' }, {}, (p5) ->
                          expect(spyReviewReplyNotify.callCount).to.equal(4)
                          expect(spyReviewReplyNotify.args[3][0].length).to.equal(3)
                          expect(spyReviewReplyNotify.args[3][0][0].name).to.equal(post.by.name)
                          expect(spyReviewReplyNotify.args[3][0][1].name).to.equal(rev0.name)
                          expect(spyReviewReplyNotify.args[3][0][2].name).to.equal(rev1.name)
                          expect(spyReviewReplyNotify.args[3][4]).to.equal('I say 4 reply to your review')
                          spyReviewReplyNotify.restore()
                          done()




  it.skip "Can delete review as editor or review owner", (done)->


  it.skip "Can publish post once it has positive reviews", (done)->


  it.skip "Cannot publish post with negative reviews", (done)->
