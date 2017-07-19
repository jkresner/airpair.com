# DESCRIBE "Low Mojo", ->


IT "Upvote review", ->
  postReview = FIXTURE.clone('reviews.simple4')
  title = "Vote up Review "
  STORY.newPost 'hosts', { author: 'tiag', data: {title}, submit: true }, (p0) =>
    STORY.newUser 'tbau', (sjkg) =>
      PUT "/reviews/submitreview/#{p0._id}", postReview, (p1) =>
        reviewId = p1.reviews[0]._id
        expect(reviewId).to.exist
        expect(p1.reviews.length).to.equal(1)
        expect(p1.reviews[0].votes.length).to.equal(0)
        DB.docById 'Post', p1._id, (p1DB) =>
          expect(p1DB.reviews.length).to.equal(1)
          expect(p1DB.reviews[0].votes.length).to.equal(0)
          vote = {  val: 1 }
          PUT "/reviews/vote/#{reviewId}", vote, RES(403,/json/), (e1) =>
            expect(e1.message).to.inc 'not vote on your own review'
            LOGIN 'tiag', (sTiag) =>
              PUT "/reviews/vote/#{reviewId}", vote, RES(403,/json/), (e2) =>
                expect(e2.message).to.inc 'not vote on reviews of your own post'
                LOGIN 'tst8', (tst8) =>
                  PUT "/reviews/vote/#{reviewId}", vote, (p2) =>
                    expect(p2.reviews.length).to.equal(1)
                    expect(p2.reviews[0].replies.length).to.equal(0)
                    expect(p2.reviews[0].votes.length).to.equal(1)
                    expect(p2.reviews[0].votes[0].val).to.equal(1)
                    expect(p2.reviews[0].votes[0].by.name).to.equal(tst8.username)
                    expect(p2.reviews[0].votes[0].by.pic).to.equal(tst8.avatar.split('?')[0])
                    DONE()


IT "Down vote", ->
  postReview = FIXTURE.clone('reviews.simple5')
  title = "Vote down Review"
  STORY.newPost 'js11', { author: 'jrenaux', data: {title}, submit: true }, (p0) =>
    STORY.newUser 'jkx', (sjkg) =>
      PUT "/reviews/submitreview/#{p0._id}", postReview, (p1) =>
        reviewId = p1.reviews[0]._id
        expect(reviewId).to.exist
        expect(p1.reviews.length).to.equal(1)
        expect(p1.reviews[0].votes.length).to.equal(0)
        DB.docById 'Post', p1._id, (p1DB) =>
          expect(p1DB.reviews.length).to.equal(1)
          expect(p1DB.reviews[0].votes.length).to.equal(0)
          vote = {  val: -1 }
          LOGIN 'tst8', (tst8) =>
            PUT "/reviews/vote/#{reviewId}", vote, (p2) =>
              expect(p2.reviews.length).to.equal(1)
              expect(p2.reviews[0].replies.length).to.equal(0)
              expect(p2.reviews[0].votes.length).to.equal(1)
              expect(p2.reviews[0].votes[0].val).to.equal(-1)
              expect(p2.reviews[0].votes[0].by.name).to.equal(tst8.username)
              expect(p2.reviews[0].votes[0].by.pic).to.equal(tst8.avatar.split('?')[0])
              DONE()


SKIP "Indifferent vote (?hide UX feature)", ->


SKIP "Max of 3 votes on one post", ->


SKIP "Upvote comment", ->


SKIP "Down vote comment", ->



# SKIP "Gate low Mojo user", ->


# DESCRIBE "High Mojo", ->
