module.exports = ->

  before (done) ->
    done()

  beforeEach ->
    UTIL.clearIP()


  DESCRIBE "Reviews",  () => require("./review/submit")
  #   SKIP "Rating no comment", ->
  #   SKIP "Comment no rating", ->
  #   SKIP "Comment with a title", ->
  #   SKIP "Markdown filtered rendering", ->
  #     SKIP "Links no follow", ->
  #     SKIP "No script", ->
  #     SKIP "Mojo to include images", ->


  # DESCRIBE "Votes", ->
  #   SKIP "Limited based on Mojo", ->
  #   SKIP "Can count votes on you", ->

  #   SKIP "Post score enables publish", ->
  #     SKIP "People found helpful", ->
  #     SKIP "Accepted edits", ->
  #     SKIP "Subscribed count", ->
  #     SKIP "Reviews with votes", ->
  #     SKIP "Likes of sections", ->
  #     SKIP "Promotion steps under taken", ->




  # # DESCRIBE "Thanks",    -> require("./posts/thanks")

  # # DESCRIBE "Questions", -> require("./posts/thanks")


  # DESCRIBE "Highlight", ->
  #   SKIP "Like a sentence / paragraph", ->
  #   SKIP "Comment threads on paragraphs ?", ->


  # DESCRIBE "Profile (as reader)", ->
  #   SKIP "Choose avatar", ->
  #   SKIP "Control notifications / receipt addresses", ->
  #   SKIP "Own news letters", ->
  #   SKIP "Subscribe to tags", ->
  #   SKIP "Follow authors", ->
  #   SKIP "Bookmark posts", ->


  # DESCRIBE "Subscribes",  ->
  #   SKIP "Email notifications", ->
  #   SKIP "Bot / messengers", ->
  #   SKIP "Rss", ->
  #   SKIP "Social", ->


  # DESCRIBE "Stats",     ->
  #   SKIP "SEE VIEWS based on own credibility", ->



  # DESCRIBE "CTAs",   ->

  #   DESCRIBE "Moderate", ->

  #     SKIP "Issues", ->
  #     SKIP "EDITs", ->
  #     SKIP "Maintain", ->

  #   DESCRIBE "Write", ->

  #     SKIP "Start own post", ->
  #     SKIP "Port repo docs", ->
  #     SKIP "Fork airpair blog", ->

  #   DESCRIBE "Reach", ->

  #     SKIP "Buy ads", ->
  #     SKIP "Earn Mojo / Recognition", ->
  #     SKIP "Featured expert for hire", ->

  #   DESCRIBE "Promote", ->

  #     SKIP "Shared", ->
  #     SKIP "Build network", ->


  # # DESCRIBE "Activity",  -> require("./posts/activity")



