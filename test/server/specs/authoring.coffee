module.exports = ->


  before (done) ->
    # {jkg,tiag} = FIXTURE.users
    # DB.ensureDocs 'User', [jkg,tiag], ->
      # DB.ensureDoc 'Post', FIXTURE.posts.higherOrder, ->
    DB.removeDocs 'Redirect', {_id:ObjectId("574d2509c6c20809714a4ebd")}, ->
      done()


  DESCRIBE("DRAFT",           () => require('./author/draft'))
  DESCRIBE("SUBMIT",          () => require('./author/submit'))
  DESCRIBE("SUBMITTED",       () => require('./author/submitted'))
  DESCRIBE("PUBLISH",    () => require('./author/publish'))
  DESCRIBE("PUBLISHED",  () => require('./author/published'))
