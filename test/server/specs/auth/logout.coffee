
IT 'Logout authd', ->
  stpv = FIXTURE.clone('users.stpv')
  DB.ensureDoc 'User', stpv, (e, uDB) =>
    LOGIN 'stpv', (s1) =>
      EXPECT.equalIdAttrs(stpv, s1)
      PAGE '/auth/logout', {status:302,contentType:/text/}, (txt) =>
        expect(txt).to.inc ['Found. Redirecting to /']
        DONE()


IT 'Logout anon', ->
  PAGE '/auth/logout', RES(302,/text/), (txt) =>
    expect(txt).to.inc ['Found. Redirecting to /']
    DONE()



