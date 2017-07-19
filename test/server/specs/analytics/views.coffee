postUrl = FIXTURE.posts.higherOrder.htmlHead
                 .canonical.replace('https://www.airpair.com', '')


IT 'Track anonymous post view', ->
  ANONSESSION (s) ->
    sId = s.sessionID
    opts = {referer:'http://airpair.com/posts'}
    viewCheck = => DB.docsByQuery 'View', {sId}, (r) ->
      expect(r.length).to.equal(1)
      expect(r[0].uId).to.be.undefined
      expect(r[0].sId).to.equal(sId)
      expect(r[0].oId).eqId("55c02b22d131551100f1f0da")
      expect(r[0].ip).to.exist
      expect(r[0].type).to.equal('post')
      expect(r[0].url).to.equal(postUrl)
      expect(r[0].ua).to.equal('Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0')
      expect(r[0].ref).to.equal('http://airpair.com/posts')
      {utm} = r[0]
      expect(utm.source).to.equal('test1src')
      expect(utm.content).to.equal('test1ctn')
      expect(utm.medium).to.be.undefined
      expect(utm.term).to.be.undefined
      expect(utm.campaign).to.be.undefined
      DONE()
    PAGE "#{postUrl}?utm_source=test1src&utm_content=test1ctn", opts, ->
      _.delay(viewCheck, 300)


IT 'Track authed post view', ->
  DB.removeDocs 'User', { 'auth.gh.id': 215283 }, ->
  # $log('global.analytics'.yellow, global.analytics.view)
  # spy = STUB.spy(global.analytics,'view')
  # $log('global.analytics'.yellow, global.analytics.view)
  LOGIN 'admb', (s) ->
    uId = ObjectId(s._id)
    viewCheck = => DB.docsByQuery 'View', {uId}, (r) ->
      # $log('spy.callCount', spy.callCount)
      # $log('spy.called', spy.called)
      # expect(spy.callCount).to.equal(1)
      expect(r.length).to.equal(1)
      expect(r[0].uId).eqId(uId)
      expect(r[0].sId).to.exist
      {utm} = r[0]
      expect(utm.source).to.be.undefined
      expect(utm.content).to.be.undefined
      expect(utm.medium).to.be.undefined
      expect(utm.term).to.be.undefined
      expect(utm.campaign).to.equal('test2nm')
      DONE()
    PAGE "#{postUrl}?utm_campaign=test2nm", {}, ->
      _.delay(viewCheck, 250)


IT 'Track anonymous ad (click) view', ->
  # spy = STUB.spy(analytics, 'view')
  ANONSESSION (s) ->
    sId = s.sessionID
    viewCheck = => DB.docsByQuery 'View', {sId}, (r) ->
      expect(r.length).to.equal(1)
      expect(Object.keys(r[0]).length).to.equal(9)
      expect(r[0]._id).to.exist
      expect(r[0].app).to.equal('apcom')
      expect(r[0].oId).eqId("56f97837b60d99e0d793cafc")
      expect(r[0].sId).to.equal(sId)
      expect(r[0].uId).to.be.undefined
      expect(r[0].type).to.equal('ad')
      expect(r[0].ip).to.exist
      expect(r[0].ua).to.exist
      expect(r[0].ref).to.equal('https://www.airpair.com/js/js-framework-comparison')
      expect(r[0].url).to.equal('https://signup.heroku.com/nodese?c=70130000000NYVFAA4&utm_campaign=Display%20-Endemic%20-Airpair%20-Node%20-%20Signup&utm_medium=display&utm_source=airpair&utm_term=node&utm_content=deploy-free')
      DONE()

    PAGE "/visit/heroku-160328-node.js", {status:302,referer:'https://www.airpair.com/js/js-framework-comparison'}, ->
      # expect(spy.callCount).to.equal(1)
      # expect(spy.args[0][1]).to.equal('ad')
      # expect(spy.args[0][2]).to.exist
      # expect(spy.args[0][2].tag).to.equal('node.js')
      # expect(spy.args[0][2].utm).to.be.undefined
      _.delay(viewCheck, 100)
