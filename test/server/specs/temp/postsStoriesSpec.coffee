module.exports = -> describe "API: ", ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.addEditorUserWithGitHub 'jkap', done

  after ->
    SETUP.analytics.restore()


  it.skip "Anonymouys user can signup while rating a post", (done) ->


  it.skip "Author can create a new post", (done) ->


  it.skip "Author can edit draft post", (done) ->


  it.skip "Author can submit post for review", (done) ->


  it.skip "Reviwer can fork a post", (done) ->
    # Reviewer see recent posts for review on my posts


  it.skip "Reviwer reviewing a post sees post version from db", (done) ->
    # Version in the db does not updated by forker .


  it.skip "Reviwer previewing a post sees forked verion a post", (done) ->
    # still seeing damn fucking databases version

  it.skip "Author can see on contributors page how to publish post", (done) ->
