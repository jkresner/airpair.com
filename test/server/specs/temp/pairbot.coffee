

module.exports = -> describe "pairbot: ", ->

  before (done) ->
    done()


  IT 'Can get rendered template without sending', ->
    hangoutUrl = "https://talkgadet.com/test-spinning-test"
    pairbot.get 'hangout-started-slack', {hangoutUrl}, (e,msg) ->
      expect(e).to.be.null
      # expectContains(msg,"New post for review")
      # expectContains(msg,"https://www.airpair.com/posts/review/#{d._id}")
      DONE()

  describe.skip "posts ", ->

    IT 'Sends message with attachment on post submit', ->
      pairbot.sendPostSubmitted data.posts.mmTopAngMistakes, (e,r) ->
        expect(e).to.be.null
        msg = r.message
        # expectContains(msg,"New post for review")
        DONE()


    IT 'Sends message with attachment on post sync', ->
      pairbot.sendPostSynced data.posts.mmTopAngMistakes, (e,r) ->
        expect(e).to.be.null
        msg = r.message
        DONE()


    IT 'Sends message with attachment on post published', ->
      pairbot.sendPostPublished data.posts.mmTopAngMistakes, (e,r) ->
        expect(e).to.be.null
        msg = r.message
        DONE()


    IT 'Sends message with', ->
    #   pairbot.sendPostPublished data.posts.mmTopAngMistakes, (e,r) ->
    #     expect(e).to.be.null
    #     msg = r.message
    #     DONE()

