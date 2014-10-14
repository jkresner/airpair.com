module.exports = -> describe "API", ->

  before (done) ->
    stubAnalytics()
    testDb.initTags(done)


  after (done) ->
    resotreAnalytics()
    done()


  it '403 for non admin on get redirects', (done) ->
    opts = status: 403
    addAndLoginLocalUser 'dily', (s) ->
      GET '/adm/redirects', opts, ->
        done()


  it 'can create redirect as admin', (done) ->
    LOGIN 'admin', data.users.admin, (s) ->
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
            done()
