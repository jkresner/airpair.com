

module.exports = -> describe "pairbot: ", ->

  before (done) ->
    done()

  after ->

  beforeEach ->

  afterEach ->

  it 'Can get rendered template without sending', itDone ->
    hangoutUrl = "https://talkgadet.com/test-spinning-test"
    pairbot.get 'hangout-started-slack', {hangoutUrl}, (e,msg) ->
      expect(e).to.be.null
      # expectContains(msg,"New post for review")
      # expectContains(msg,"https://www.airpair.com/posts/review/#{d._id}")
      DONE()

  describe.skip "posts ", ->

    it 'Sends message with attachment on post submit', itDone ->
      pairbot.sendPostSubmitted data.posts.mmTopAngMistakes, (e,r) ->
        expect(e).to.be.null
        msg = r.message
        # expectContains(msg,"New post for review")
        DONE()


    it 'Sends message with attachment on post sync', itDone ->
      pairbot.sendPostSynced data.posts.mmTopAngMistakes, (e,r) ->
        expect(e).to.be.null
        msg = r.message
        DONE()


    it 'Sends message with attachment on post published', itDone ->
      pairbot.sendPostPublished data.posts.mmTopAngMistakes, (e,r) ->
        expect(e).to.be.null
        msg = r.message
        DONE()


    # it 'Sends message with', itDone ->
    #   pairbot.sendPostPublished data.posts.mmTopAngMistakes, (e,r) ->
    #     expect(e).to.be.null
    #     msg = r.message
    #     DONE()

