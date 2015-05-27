module.exports = -> describe "Admin".subspec, ->

  before (done) ->
      done()


  it 'Get orders revenue report request', itDone ->
    LOGIN 'admin', (sAdmin) ->
      GET "/adm/reports/orders", {}, (r) ->
        expect(r.wkRev).to.exist
        expect(r.wkRev.count>0).to.be.true
        DONE()
