
IT "Reply to review as author", ->
  postReview = FIXTURE.clone('reviews.simple4')
  title = "Post Reply to Review as Author Test #{@testSeed}"
  STORY.newPost 'AngOnRails', { author: 'jrenaux', data: {title}, submit: true }, (p0) =>
    STORY.newUser 'jkg', (sjkg) =>
      PUT "/reviews/submitreview/#{p0._id}", postReview, (p1) =>
        reviewId = p1.reviews[0]._id
        expect(reviewId).to.exist
        expect(p1.reviews.length).to.equal(1)
        # expect(p1.reviews[0].replies).to.be.undefined
        # expect(p1.reviews[0].votes).to.be.undefined
        expect(p1.reviews[0].replies.length).to.equal(0)
        expect(p1.reviews[0].votes.length).to.equal(0)
        DB.docById 'Post', p1._id, (p1DB) =>
          expect(p1DB.reviews.length).to.equal(1)
          # expect(p1DB.reviews[0].replies).to.be.undefined
          # expect(p1DB.reviews[0].votes).to.be.undefined
          expect(p1DB.reviews[0].replies.length).to.equal(0)
          expect(p1DB.reviews[0].votes.length).to.equal(0)
          LOGIN 'tiag', (sTiag) =>
            comment = { said: 'test review reply as author' }
            PUT "/reviews/comment/#{reviewId}", comment, (p2) =>
              expect(p2.reviews.length).to.equal(1)
              expect(p2.reviews[0].replies.length).to.equal(1)
              expect(p2.reviews[0].replies[0].said).to.equal('test review reply as author')
              expect(p2.reviews[0].replies[0].by.name).to.equal(sTiag.username)
              # expect(p2.reviews[0].replies[0].by.name).to.equal(sTiag.name)
              expect(p2.reviews[0].replies[0].by.pic).to.equal(sTiag.avatar.split('?')[0])
              expect(p2.reviews[0].replies[0].by.gh).to.exist
              DONE()


IT "Reply to review as another reviewer", ->
  postReview = FIXTURE.clone('reviews.simple5')
  title = "Post Reply to Review as another Reviewer #{@testSeed}"
  STORY.newPost 'bestWP', { author: 'tst8', data: {title}, submit: true }, (p0) =>
    STORY.newUser 'tst5', (sTst5) =>
      PUT "/reviews/submitreview/#{p0._id}", postReview, (p1) =>
        reviewId = p1.reviews[0]._id
        expect(reviewId).to.exist
        LOGIN 'jkg', (sJKg) =>
          comment = { said: 'test review reply as another reviewer' }
          PUT "/reviews/comment/#{reviewId}", comment, (p2) =>
            expect(p2.stats.comments).to.equal(2)
            expect(p2.reviews.length).to.equal(1)
            expect(p2.reviews[0].replies.length).to.equal(1)
            expect(p2.reviews[0].replies[0].by.pic).to.equal(sJKg.avatar.split('?')[0])
            expect(p2.reviews[0].replies[0].said).to.equal('test review reply as another reviewer')
            DONE()


SKIP "Edit review reply", ->
  postReview = FIXTURE.clone('reviews.codeTag')
  STORY.newPost 'logoBra', { author: 'tiag', submit: true }, (p0) =>
    LOGIN 'jkg', (sJKg) =>
      PUT "/reviews/submitreview/#{p0._id}", postReview, (p1) =>
        reviewId = p1.reviews[0]._id
        expect(reviewId).to.exist
        expect(p1.stats.comments).to.equal(1)
        expect(p1.stats.reviews).to.equal(1)
        expect(p1.stats.rating).to.equal(4)
        expect(p1.reviews.length).to.equal(1)
        expect(p1.reviews[0].replies.length).to.equal(0)
        LOGIN 'tiag', (sTiag) =>
          comment = { said: 'test before edit' }
          PUT "/reviews/comment/#{reviewId}", comment, (p2) =>
            expect(p2.stats.comments).to.equal(2)
            expect(p2.stats.reviews).to.equal(1)
            expect(p2.stats.rating).to.equal(4)
            expect(p2.reviews[0].replies.length).to.equal(1)
            expect(p2.reviews.length).to.equal(1)
            EXPECT.idsEqual(p2.reviews[0]._id, p1.reviews[0]._id)
            expect(p2.reviews[0].said).to.equal(p1.reviews[0].said)
            expect(p2.reviews[0].val).to.equal(p1.reviews[0].val)
            expect(p2.reviews[0].by.pic).to.equal(p1.reviews[0].by.pic)
            expect(p2.reviews[0].by.name).to.equal(p1.reviews[0].by.name)
            DONE()


SKIP "Gate low Mojo user", ->
