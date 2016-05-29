postUrl = '/javascript/posts/mastering-es6-higher-order-functions-for-arrays'


IT 'Aliases anonymous sessionId with new signup user._id', ->
  ANONSESSION (s) ->
    sId = s.sessionID
    utms = 'utm_campaign=testSingup&utm_source=test8src&utm_content=test8ctn'
    PAGE "#{postUrl}?#{utms}", {}, ->
      spy = STUB.spy(analytics,'event')
      SIGNUP 'tmot', (sFull) ->
        expect(spy.callCount).to.equal(1)
        expect(sFull._id).to.exist
        expect(sFull.name).to.match(/^Todd Motto/)
        expect(spy.args[0][0].user).to.exist
        expect(spy.args[0][0].ctx.sId).to.equal(sId)
        expect(spy.args[0][0].ctx).to.exist
        expect(spy.args[0][0].ctx.user._id).to.exist
        expect(spy.args[0][0].analytics).to.exist
        expect(spy.args[0][1]).to.equal("signup:oauth:gh")
        expect(spy.args[0][2].user.name.indexOf('Todd Motto')).to.equal(0)
        EXPECT.equalIds(spy.args[0][2].user._id, sFull._id)
        uId = ObjectId(sFull._id)
        # expect(spy.args[0][1]).to.equal(s.sessionID)
        # expect(spy.args[0][2]).to.equal('signup')
        viewCheck = => DB.docsByQuery 'View', {uId}, (r) ->
          expect(r.length).to.equal(1)
          expect(Object.keys(r[0]).length).to.equal(10)
          EXPECT.equalIds(r[0].uId, uId)
          EXPECT.equalIds(r[0].sId, s.sessionID)
          expect(r[0].app).to.equal('apcom')
          EXPECT.equalIds(r[0].oId, FIXTURE.posts.higherOrder._id)
          expect(r[0].type).to.equal('post')
          expect(r[0].ref).to.be.undefined
          expect(r[0].url).to.equal(postUrl)
          expect(r[0].ip).to.exist
          expect(r[0].ua).to.exist
          expect(Object.keys(r[0].utm).length).to.equal(3)
          expect(r[0].utm.campaign).to.equal('testSingup')
          expect(r[0].utm.source).to.equal('test8src')
          expect(r[0].utm.content).to.equal('test8ctn')
          DONE()
        _.delay(viewCheck, 150)



IT 'sessionID is not duplicate in aliases with multiple logins', ->
  utms = ''
  ANONSESSION (anon) ->
    {sessionID} = anon
    expect(sessionID).to.exist
    PAGE "#{postUrl}?#{utms}", {}, ->
      SIGNUP 'dros', (s) ->
        expect(s._id).to.exist
        DB.docById 'User', s._id, (rUser1) ->
          expect(rUser1.cohort.aliases.length).to.equal(1)
          expect(rUser1.cohort.aliases[0]).to.equal(sessionID)
        PAGE '/auth/logout', { status:302 }, ->
          spyAlias = STUB.spy(analytics,'event')
          LOGIN s.username, (s2) ->
            expect(spyAlias.callCount).to.equal(1)
            # $log('spyAlias.args[0][0].analytics', spyAlias.args[0][0].analytics)
            expect(spyAlias.args[0][1]).to.equal('login:oauth:gh')
            expect(spyAlias.args[0][0].analytics.alias).to.exist
            EXPECT.equalIds(spyAlias.args[0][0].analytics.alias._id, s._id)
            EXPECT.equalIds(spyAlias.args[0][2].user._id, s._id)
            dbCheck = ->
              DB.docsByQuery 'View', {sId:sessionID}, (r) ->
                expect(r.length).to.equal(1)
                EXPECT.equalIds(r[0].uId, s._id)
                DB.docsByQuery 'Event', {sId:sessionID}, (r2) ->
                  expect(r2.length).to.equal(3)
                  # $log('r2', r2)
                  EXPECT.equalIds(r2[0].uId, s._id)
                  EXPECT.equalIds(r2[1].uId, s._id)
                  EXPECT.equalIds(r2[2].uId, s._id)
                  DB.docById 'User', s._id, (rUser2) ->
                    expect(rUser2.cohort.aliases.length).to.equal(1)
                    expect(rUser2.cohort.aliases[0]).to.equal(sessionID)
                    DONE()
            _.delay(dbCheck, 250)


IT 'Two sessionIDs added from unique sessions', ->
  DB.removeDocs 'User', { 'auth.gh.id': 465691 }, ->
  sessionId1 = null
  sessionId2 = null

  session2Callback = () -> ANONSESSION (s2) ->

    sessionId2 = s2.sessionID
    expect(sessionId2).to.not.equal(sessionId1)

    PAGE "/job/#{FIXTURE.requests.aJob._id}", {}, ->
      PAGE "/review/#{FIXTURE.requests.aJob._id}", {}, ->

        DB.docsByQuery 'views', {sId:sessionId2}, (v2) ->
          expect(v2.length).to.equal(2)
          expect(v2[0].uId).to.be.undefined
          expect(v2[1].uId).to.be.undefined
          expect(v2[0].sId).to.equal(sessionId2)
          expect(v2[1].sId).to.equal(sessionId2)

          LOGIN 'mkod', ->
            # expect(spyAlias.callCount).to.equal(1)
            # expect(spyAlias.args[0][2]).to.equal('Login')

            # expect(spyIdentify.called).to.be.true
            # expect(spyAlias.called).to.be.true
            # expect(spyAlias.args[0][2]).to.equal('Login')

            GET '/auth/session', (s3) ->
              userId = ObjectId(s3._id)
              viewCheck = => DB.docsByQuery 'View', {uId:userId}, (v3) ->
                expect(v3.length).to.equal(4)
                DB.docById 'User', s3._id, (rUser) ->
                  expect(rUser.cohort.aliases.length).to.equal(2)
                  expect(rUser.cohort.aliases[0]).to.equal(sessionId1)
                  expect(rUser.cohort.aliases[1]).to.equal(sessionId2)
                  DONE()
              _.delay(viewCheck, 50)

  ANONSESSION (s) ->
    sessionId1 = s.sessionID
    PAGE "/job/#{FIXTURE.requests.aJob._id}", {}, ->
      PAGE "/review/#{FIXTURE.requests.aJob._id}", {}, ->
        DB.docsByQuery 'View', {sId:sessionId1}, (v1) ->
          expect(v1.length).to.equal(2)
          expect(v1[0].ud).to.be.undefined
          expect(v1[1].uId).to.be.undefined
          expect(v1[0].sId).to.equal(sessionId1)
          expect(v1[1].sId).to.equal(sessionId1)
          expect(v1[0].type).to.equal('job')
          expect(v1[1].type).to.equal('job')
        LOGIN 'mkod', (s) ->
          session2Callback()
