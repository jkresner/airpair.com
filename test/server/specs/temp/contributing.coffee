
contributing = ->

#   it "Can fork, edit & preview post in review", ->
#     @timeout(14000)

#     edit = (s, sRobot21, _id, liveMD) ->
#       GET "/posts/#{_id}/edit", {}, (pForkEdit) ->
#         # $log('going 3'.white)
#         expect(pForkEdit.md).to.equal(liveMD)
#         expect(pForkEdit.editHistory).to.be.undefined
#         expect(pForkEdit.publishHistory).to.be.undefined
#         expect(pForkEdit.forkers).to.be.undefined
#         forkedMD = 'my fork ' + pForkEdit.md
#         PUT "/posts/#{_id}/md", { md: forkedMD, commitMessage: timeSeed() }, {}, (pForkSaved) ->
#           expect(pForkSaved.md).to.equal(forkedMD)
#           getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:data.users[sRobot21.userKey]})
#           getForPreviewFn = $callSvc(PostsSvc.getByIdForPreview,{user:data.users[sRobot21.userKey]})
#           getForReviewFn _id, (e, pForkReview) ->
#             expect(pForkReview.md).to.equal(liveMD)
#             getForPreviewFn _id, (eee, pForkPreview) ->
#               expect(pForkPreview.md).to.equal(forkedMD)
#               LOGIN s.userKey, (sRobot4) ->
#                 GET "/posts/#{_id}/edit", {}, (pParentEdit) ->
#                   expect(pParentEdit.md).to.equal(liveMD)
#                   parentMD = 'my parent ' + pParentEdit.md
#                   PUT "/posts/#{_id}/md", { md: parentMD, commitMessage: timeSeed() }, {}, (pParentSaved) ->
#                     expect(pParentSaved.md).to.equal(parentMD)
#                     getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:data.users[s.userKey]})
#                     getForPreviewFn = $callSvc(PostsSvc.getByIdForPreview,{user:data.users[s.userKey]})
#                     getForReviewFn _id, (e, pParentReview) ->
#                       expect(pParentReview.md).to.equal(liveMD)
#                       getForPreviewFn _id, (eee, pParentPreview) ->
#                         expect(pParentPreview.md).to.equal(parentMD)
#                         DONE()

#     fork = (_id, done) ->
#       STORY.newUserWithGithubProfile 'robot21', data.users.apt5.social.gh, (sRobot21) ->
#         GET "/posts/#{_id}/fork", {}, (pForFork) ->
#           expectIdsEqual(pForFork._id, _id)
#           expect(pForFork.submit.repoAuthorized).to.be.true
#           expect(pForFork.editHistory).to.be.undefined
#           expect(pForFork.publishHistory).to.be.undefined
#           expect(pForFork.github).to.be.undefined
#           expect(pForFork.reviews).to.be.undefined
#           expect(pForFork.forkers).to.be.undefined
#           PUT "/posts/add-forker/#{pForFork._id}", {}, {}, (p2) ->
#             expect(p2.editHistory).to.be.undefined
#             expect(p2.publishHistory).to.be.undefined
#             # expect(p2.github.repoInfo).to.exist
#             expect(p2.reviews.length).to.equal(0)
#             expect(p2.forkers.length).to.equal(1)
#             expectIdsEqual(p2.forkers[0].userId, sRobot21._id)
#             expect(p2.forkers[0]._id).to.exist
#             expect(p2.forkers[0]._id.toString()).to.not.equal(p2._id.toString())
#             expect(p2.forkers[0].name).to.equal(sRobot21.name)
#             expect(p2.forkers[0].email).to.be.undefined
#             expect(p2.forkers[0].username).to.equals('airpairtest5')
#             expect(p2.forkers[0].social).to.be.undefined
#             GET "/posts/me", {}, (myposts) ->
#               p3 = _.find(myposts,(p)->_.idsEqual(p._id,p2._id))
#               expect(p3.editHistory).to.be.undefined
#               expect(p3.publishHistory).to.be.undefined
#               # expect(p3.github.repoInfo).to.exist
#               expect(p3.github).to.be.undefined
#               # expect(p3.github.events).to.be.undefined
#               expect(p3.reviews.length).to.equal(0)
#               expect(p3.forkers.length).to.equal(1)
#               done(sRobot21)

#     title = "Can fork edit and preview #{timeSeed()}"
#     STORY.newUserWithGithubProfile 'robot4', null, (s) ->
#       d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Can fork and stuffz ') }
#       SETUP.createSubmitReadyPost s.userKey, d, (post) ->
#         _id = post._id
#         slug = title.toLowerCase().replace(/\ /g, '-')
#         PUT "/posts/submit/#{_id}", { slug }, {}, (p1) ->
#           getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:data.users[s.userKey]})
#           getForReviewFn _id, (e, pReview) ->
#             liveMD = pReview.md
#             expect(liveMD).to.equal(d.md)
#             fork _id, (sRobot21) ->
#               go = () -> edit(s, sRobot21, _id, liveMD)
#               setTimeout(go,500) # sometimes it breaks because github isn't finished

module.exports = ->

  @timeout(8000)

  before (done) ->
    DB.ensureDoc 'Post', FIXTURE.posts.higherOrder, ->
      done()

  DESCRIBE("Contributing", contributing)
