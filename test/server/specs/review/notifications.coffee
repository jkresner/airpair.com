
IT "Sends appropriate email notifications for reviews and replies", ->
  post = FIXTURE.clone('posts.higherOrder', {omit:'reviews stats'})
  post._id = new ObjectId()
  post.slug = post.slug + @timeSeed
  STORY.newUser 'tiagorg', (sTiagorg, authorKey) ->
    post.by.userId = sTiagorg._id
    post.by.name = sTiagorg.name
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
