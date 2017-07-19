module.exports = ->


  before (done) ->
    DB.removeDocs 'User', {'auth.gh.id': FIXTURE.users.tst1.auth.gh.id}, ->
      DB.ensureDoc 'Post', FIXTURE.posts.higherOrder, ->
        done()


  beforeEach ->
    STUB.allGitPublisherAPIcalls()


  DESCRIBE("NEW AUTHOR",      () => require('./flows/newauthor'))
  # DESCRIBE("VETERAN AUTHOR", () => require('./flows/verteran'))
  # DESCRIBE("RE-ENGAGED AUTHOR", () => require('./flows/reengaged'))
