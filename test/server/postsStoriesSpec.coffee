module.exports = -> describe "API: ", ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.addUserWithRole 'jkap', 'editor', ->
      SETUP.initTags ->
        SETUP.initTemplates done

  after ->
    SETUP.analytics.restore()


  it.skip "Author can create a new post", (done) ->


  it.skip "Author can edit draft post", (done) ->


  it.skip "Author can submit post for review", (done) ->


  it.skip "Reviwer can fork a post", (done) ->
    # Reviewer see recent posts for review on my posts


  it.skip "Reviwer reviewing a post sees post version from db", (done) ->
    # Version in the db does not updated by forker .


  it.skip "Reviwer previewing a post sees forked verion a post", (done) ->


  it.skip "Author can see on contributors page how to publish post", (done) ->
