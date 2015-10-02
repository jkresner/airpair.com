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
    SETUP.addEditorUserWithGitHub 'jkap', ->
      done()


  it "correctly saves index from the UI"


  it "Cannot submit anonymous review", itDone ->
    title = "Post Anon Review Test " + moment().format('X')
    SETUP.createNewPost 'jkap', {title}, (post) ->
      ANONSESSION (s) ->
        POST "/posts/review/#{post._id}", postReview, { status: 401 }, (r) ->
          DONE()



  it "Cannot submit review for draft post", itDone ->
    title = "Post Draft Review Test " + moment().format('X')
    SETUP.createNewPost 'jkap', {title}, (post) ->
      SETUP.addAndLoginLocalUser 'rvw1', (rvw1) ->
        POST "/posts/#{post._id}/review", postReview, { status: 403 }, (r) ->
          expectContains(r.message, 'has not been submitted or published')
          DONE()


  it "Can review post in review", itDone ->
    title = "Post in Review, Review Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rvw2', (rvw2) ->
        POST "/posts/#{post._id}/review", postReview, {}, (p1) ->
          expect(p1.reviews.length).to.equal(1)
          DONE()


  it "Review fails without valid rating and feedback", itDone ->
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
              DONE()


  it.skip "Can submit review for published post", itDone ->
    ## Where is this published ?
    title = "Published Post Review Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rvw4', (rvw4) ->
        POST "/posts/#{post._id}/review", postReview, {}, (p1) ->
          expect(p1.reviews.length).to.equal(1)
          expect(p1.reviews[0].by._id).to.equal(rvw4._id)
          expect(p1.reviews[0].questions.length).to.equal(2)
          expect(p1.reviews[0].questions[0].key).to.equal('rating')
          expect(p1.reviews[0].questions[1].key).to.equal('feedback')
          DONE()


  it "Submitting review twice updates review"
    # .put('/posts/review/:post', API.Posts.addReview)


  it "Reply to review as author", itDone ->
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
              DONE()


  it "Reply to review as another reviewer", itDone ->
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
              DONE()


  it "Upvote review", itDone ->
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
                  DONE()


  it "Sends appropriate email notifications for reviews and replies", itDone ->
    spyReviewNotify = sinon.spy(mailman,'sendTemplate')
    spyReviewReplyNotify = sinon.spy(mailman,'sendTemplateMails')
    title = "Post Review Notifications Test " + moment().format('X')
    SETUP.createNewPost 'jkap', { title, submitted: new Date }, (post) ->
      SETUP.addAndLoginLocalUser 'rev0', (rev0) ->
        POST "/posts/#{post._id}/review", postReview, {}, (p1) ->
          reviewId = p1.reviews[0]._id
          SETUP.addAndLoginLocalUser 'rev1', (rev1) ->
            PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 1 reply to your review' }, {}, (p2) ->
              expect(spyReviewNotify.callCount).to.equal(1)
              expect(spyReviewNotify.args[0][0]).to.equal('post-review-notification')
              tmp1Data = spyReviewNotify.args[0][1]
              # expectIdsEqual(spyReviewNotify.args[0][0]._id, post.by.userId)
              expectIdsEqual(tmp1Data._id, post._id)
              expect(tmp1Data.title).to.equal(post.title)
              expect(tmp1Data.reviewerFullName).to.equal(rev0.name)
              expect(tmp1Data.rating).to.equal(postReview.questions[0].answer)
              expect(tmp1Data.comment).to.equal(postReview.questions[1].answer)
              spyReviewNotify.restore()
              expect(spyReviewReplyNotify.callCount).to.equal(1)
              expect(spyReviewReplyNotify.args[0][0]).to.equal('post-review-reply-notification')
              tmp2Data = spyReviewReplyNotify.args[0][1]
              toUsers1 = spyReviewReplyNotify.args[0][2]
              expectIdsEqual(tmp2Data._id, post._id)
              expect(tmp2Data.title).to.equal(post.title)
              expect(tmp2Data.comment).to.equal('I say 1 reply to your review')
              expect(tmp2Data.replierFullName).to.equal(rev1.name)
              expect(toUsers1.length).to.equal(2)
              expect(toUsers1[0].name).to.equal(post.by.name)
              expect(toUsers1[1].name).to.equal(rev0.name)
              LOGIN 'jkap', (jkap) ->
                PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 2 reply to your review' }, {}, (p3) ->
                  expect(spyReviewReplyNotify.callCount).to.equal(2)
                  expect(spyReviewReplyNotify.args[1][0]).to.equal('post-review-reply-notification')
              #     expect(spyReviewReplyNotify.args[1][0].length).to.equal(2)
                  tmp3Data = spyReviewReplyNotify.args[1][1]
                  toUsers3 = spyReviewReplyNotify.args[1][2]
                  expect(toUsers3[0].name).to.equal(rev0.name)
                  expect(toUsers3[1].name).to.equal(rev1.name)
                  expectIdsEqual(tmp3Data._id, post._id)
                  expect(tmp3Data.title).to.equal(post.title)
                  expect(tmp3Data.replierFullName).to.equal(post.by.name)
                  expect(tmp3Data.comment).to.equal('I say 2 reply to your review')
                  LOGIN rev0.userKey, (sRev2) ->
                    PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 3 reply to your review' }, {}, (p4) ->
                      expect(spyReviewReplyNotify.callCount).to.equal(3)
                      expect(spyReviewReplyNotify.args[2][2].length).to.equal(2)
                      expect(spyReviewReplyNotify.args[2][2][0].name).to.equal(post.by.name)
                      expect(spyReviewReplyNotify.args[2][2][1].name).to.equal(rev1.name)
                      expect(spyReviewReplyNotify.args[2][1].comment).to.equal('I say 3 reply to your review')
                      SETUP.addAndLoginLocalUser 'rev2', (rev2) ->
                        PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 4 reply to your review' }, {}, (p5) ->
                          expect(spyReviewReplyNotify.callCount).to.equal(4)
                          expect(spyReviewReplyNotify.args[3][2].length).to.equal(3)
                          expect(spyReviewReplyNotify.args[3][2][0].name).to.equal(post.by.name)
                          expect(spyReviewReplyNotify.args[3][2][1].name).to.equal(rev0.name)
                          expect(spyReviewReplyNotify.args[3][2][2].name).to.equal(rev1.name)
                          expect(spyReviewReplyNotify.args[3][1].comment).to.equal('I say 4 reply to your review')
                          spyReviewReplyNotify.restore()
                          DONE()




  it "Can delete review as editor or review owner"


  it "Can publish post once it has positive reviews"


  it "Cannot publish post with negative reviews"
