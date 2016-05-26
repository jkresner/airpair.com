module.exports = ->

  before (done) ->
    {tos,priv,refp} = FIXTURE.posts
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
    DB.ensureDocs 'Post', [tos,priv,refp], ->
      done()

  DESCRIBE "Pages",       -> require("./routes/pages")
  # DESCRIBE "Pages.BOTS",  -> require("./routes/pages.bots")
  # DESCRIBE "Post",       -> require("./routes/posts")
  # DESCRIBE "User",        -> require("./routes/pages")
