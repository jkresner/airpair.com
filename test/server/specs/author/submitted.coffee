info = ->


  IT.skip "Fail slug change", ->
    opts = { author: 'tst5', submit: new Date, data: {
      title: "Up.slug #{@timeSeed}",
      tags: [{'_id':ObjectId("514825fa2a26ea020000001f"), "sort" : "0" }] } }
    STORY.newPost 'logoBra', opts, (p0, session) ->
      $log('p0', p0.tags)
      expect(p0.slug).to.exist
      p0.slug = 'up'+p0.slug
      PUT "/author/info/#{p0._id}", p0, { status: 403 }, (err1) ->
        expect(err1.message).to.inc ['Cannot update slug']
        DONE()


deleting = ->


  IT "Fail as author", ->
    opts = { author: 'tbau', data: {title: "Delete #{@testSeed}",slug:"delete-#{@testSeed}"}, submit: new Date }
    STORY.newPost 'exps_deep', opts, (p0, session) ->
      DELETE "/author/post/#{p0._id}", { status: 403 }, (err1) ->
        expect(err1.message).to.inc ['must be deleted by an editor']
        DONE()


  IT "Success as editor", ->
    opts = { author: 'gnic', data: {title: "okDelete #{@testSeed}"}, submit: new Date }
    STORY.newPost 'pubedArchitec', opts, (p0, session) ->
      LOGIN 'tiag', {session:null}, (s2) ->
        DELETE "/author/post/#{p0._id}", (ok) ->
          DB.docById 'Post', p0._id, (pDB) ->
            expect(pDB).to.be.null
            DONE()


editing = ->


  SKIP "Edit and preview HEAD as author", ->
#     author = data.users.submPostAuthor
#     db.ensureDoc 'User', author, ->
#       db.ensurePost data.posts.submittedWithGitRepo, ->
#         LOGIN 'submPostAuthor', (s) ->
#           GET "/post/me", {}, (posts) ->
#             myposts = _.where(posts,(p)=>_.idsEqual(p.by._id,s._id))
#             expect(myposts.length).to.equal(1)
#             _id = myposts[0]._id
#             getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:author})
#             getForPreviewFn = $callSvc(PostsSvc.getByIdForPreview,{user:author})
#             getForReviewFn _id, (e, pReview) ->
#               reviewMD = pReview.md
#               expect(reviewMD).to.equal(data.posts.submittedWithGitRepo.md)
#               GET "/post/#{_id}/edit", {}, (pEdit) ->
#                 md = "1"+pEdit.md
#                 PUT "/post/#{_id}/md", { md, commitMessage: timeSeed() }, {}, (p2) ->
#                   expect(p2.md).to.equal(md)
#                   getForPreviewFn _id, (eee, pPreview2) ->
#                     expect(pPreview2.md).to.equal(md)
#                     getForReviewFn _id, (ee, pReview2) ->
#                       expect(pReview2.md).to.equal(reviewMD)
#                       DONE()


  SKIP "Sync HEAD as author", ->
#     title = "Submit success with connected github #{timeSeed()}"
#     STORY.newUserWithGithubProfile 'robot6', null, (s) ->
#       d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Sync from with github') }
#       SETUP.createSubmitReadyPost s.userKey, d, (post) ->
#         _id = post._id
#         slug = title.toLowerCase().replace(/\ /g, '-')
#         PUT "/post/submit/#{_id}", {slug}, {}, (p1) ->
#           liveMD = p1.md
#           md = "2"+liveMD
#           PUT "/post/#{_id}/md", { md, commitMessage: timeSeed() }, {}, (p2) ->
#             getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:data.users[s.userKey]})
#             getForReviewFn _id, (e, pReview) ->
#               expect(pReview.md).to.equal(liveMD)
#               expect(pReview.md).to.not.equal(md)
#               PUT "/post/propagate-head/#{_id}", {}, {}, (p3) ->
#                 expect(p3.md).to.equal(md)
#                 getForReviewFn _id, (ee, pReview2) ->
#                   expect(pReview2.md).to.equal(md)
#                   DONE()



DESCRIBE("UPDATE Info", info)
DESCRIBE("EDIT Markdown", editing)
DESCRIBE("DELETE", deleting)

