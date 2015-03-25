module.exports = -> describe "API".subspec, ->


  it '403 for non admin on get redirects', itDone ->
    opts = status: 403
    SETUP.addAndLoginLocalUser 'dily', (s) ->
      GET '/adm/redirects', opts, ->
        DONE()


  it 'can create redirect as admin', itDone ->
    LOGIN 'admin', (s) ->
      GET '/adm/redirects', {}, (r1) ->
        beforeCount = r1.length
        suffix = moment().format('X')
        d = previous: "/previous-#{suffix}", current: "/current-#{suffix}"
        POST '/adm/redirects', d, {}, (redirect) ->
          expect(redirect._id).to.exist
          expect(redirect.previous).to.equal(d.previous)
          GET '/adm/redirects', {}, (r2) ->
            expect(beforeCount+1).to.equal(r2.length)
            expect(_.find(r2,(r)->r.previous==d.previous)).to.exist
            DONE()
