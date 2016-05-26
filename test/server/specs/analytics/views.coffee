{canonical} = FIXTURE.posts.higherOrder.htmlHead
postUrl = canonical.replace('https://www.airpair.com', '')


IT 'Track anonymous post view', ->
  ANONSESSION (s) ->
    sId = s.sessionID
    viewCheck = => DB.docsByQuery 'View', {sId}, (r) ->
      expect(r.length).to.equal(1)
      expect(r[0].uId).to.be.undefined
      expect(r[0].sId).to.equal(sId)
      EXPECT.equalIds(r[0].oId, "55c02b22d131551100f1f0da")
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
    _.delay(viewCheck, 300)
    PAGE "#{postUrl}?utm_source=test1src&utm_content=test1ctn", {referer:'http://airpair.com/posts'}, ->



IT 'Track authed post view', ->
  DB.removeDocs 'User', { 'auth.gh.id': 215283 }, ->
  LOGIN 'admb', (s) ->
    spy = STUB.spy(analytics,'view')
    uId = ObjectId(s._id)
    viewCheck = => DB.docsByQuery 'View', {uId}, (r) ->
      expect(spy.callCount).to.equal(1)
      expect(r.length).to.equal(1)
      EXPECT.equalIds(r[0].uId,uId)
      expect(r[0].sId).to.exist
      {utm} = r[0]
      expect(utm.source).to.be.undefined
      expect(utm.content).to.be.undefined
      expect(utm.medium).to.be.undefined
      expect(utm.term).to.be.undefined
      expect(utm.campaign).to.equal('test2nm')
      DONE()
    _.delay(viewCheck, 150)
    PAGE "#{postUrl}?utm_campaign=test2nm", {}, ->



IT 'Track anonymous ad (click) view', ->
  spy = STUB.spy(analytics, 'view')
  ANONSESSION (s) ->
    sId = s.sessionID
    viewCheck = => DB.docsByQuery 'View', {sId}, (r) ->
      expect(r.length).to.equal(1)
      expect(Object.keys(r[0]).length).to.equal(9)
      expect(r[0]._id).to.exist
      expect(r[0].app).to.equal('apcom')
      EXPECT.equalIds(r[0].oId,"56f97837b60d99e0d793cafc")
      expect(r[0].sId).to.equal(sId)
      expect(r[0].uId).to.be.undefined
      expect(r[0].type).to.equal('ad')
      expect(r[0].ip).to.exist
      expect(r[0].ua).to.exist
      expect(r[0].ref).to.equal('https://www.airpair.com/js/js-framework-comparison')
      expect(r[0].url).to.equal('https://signup.heroku.com/nodese?c=70130000000NYVFAA4&utm_campaign=Display%20-Endemic%20-Airpair%20-Node%20-%20Signup&utm_medium=display&utm_source=airpair&utm_term=node&utm_content=deploy-free')
      DONE()

    PAGE "/visit/heroku-160328-node.js", {status:302,referer:'https://www.airpair.com/js/js-framework-comparison'}, ->
      expect(spy.callCount).to.equal(1)
      expect(spy.args[0][1]).to.equal('ad')
      expect(spy.args[0][2]).to.exist
      expect(spy.args[0][2].tag).to.equal('node.js')
      expect(spy.args[0][2].utm).to.be.undefined
      _.delay(viewCheck, 100)



IT 'Track anon workshop view', ->
  ANONSESSION (s) ->
    sId = s.sessionID
    spy = sinon.spy(analytics,'view')
    PAGE "/ruby-on-rails/workshops/simplifying-rails-tests", { 'referer':'http://airpair.com/workshops' }, (html) ->
      expect(spy.callCount).to.equal(1)
      expect(spy.args[0][1]).to.equal('workshop')
      EXPECT.equalIds(spy.args[0][2]._id, '53dc048a6a45650200845f23')
      expect(spy.args[0][2].url).to.equal("/ruby-on-rails/workshops/simplifying-rails-tests")
      viewCheck = => DB.docsByQuery 'View', {sId}, (r) ->
        expect(r.length).to.equal(1)
        expect(r[0].uId).to.be.undefined
        expect(r[0].utm).to.be.undefined
        expect(Object.keys(r[0]).length).to.equal(9)
        EXPECT.equalIds(r[0].sId, s.sessionID)
        expect(r[0].app).to.equal('apcom')
        EXPECT.equalIds(r[0].oId, '53dc048a6a45650200845f23')
        expect(r[0].type).to.equal('workshop')
        expect(r[0].ref).to.equal('http://airpair.com/workshops')
        expect(r[0].url).to.equal("/ruby-on-rails/workshops/simplifying-rails-tests")
        expect(r[0].ua).to.exist
        expect(r[0].ip).to.exist
        expect(r[0]._id).to.exist
        DONE()
      _.delay(viewCheck, 150)
