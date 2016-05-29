{higherOrder} = FIXTURE.posts


IT 'Can get rendered template without sending', ->
  hangoutUrl = "https://talkgadet.com/test-spinning-test"
  pairbot.get 'hangout-started-slack', {hangoutUrl}, (e,r) ->
    expect(e).to.be.null
    expect(r.type).to.inc("message")
    expect(r.text).to.inc("our hangout is ready. Please join at => https://talkgadet.com/test-spinning-test")
    DONE()


IT 'Sends message with attachment on post submit', ->
  pairbot.sendPostSubmitted higherOrder, (e,r) ->
    expect(e).to.be.null
    expect(r.message.text).to.equal('')
    expect(r.message.attachments[0].fallback).to.inc("Post SUBMITTED: Mastering")
    expect(r.message.attachments[0].title).to.inc(higherOrder.title)
    DONE()


IT 'Sends message with attachment on post sync', ->
  pairbot.sendPostSynced higherOrder, (e,r) ->
    expect(e).to.be.null
    expect(r.message.text).to.equal('')
    expect(r.message.attachments[0].fallback).to.inc("Post SYNCED: Mastering")
    expect(r.message.attachments[0].title).to.inc(higherOrder.title)
    DONE()


IT 'Sends message with attachment on post published', ->
  pairbot.sendPostPublished higherOrder, (e,r) ->
    expect(e).to.be.null
    expect(r.message.text).to.equal('')
    expect(r.message.attachments[0].pretext).to.inc('PUBLISHED by Tiago')
    expect(r.message.attachments[0].title).to.inc(higherOrder.title)
    expect(r.message.attachments[0].title_link).to.equal(higherOrder.htmlHead.canonical)
    DONE()
