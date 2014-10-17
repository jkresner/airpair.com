module.exports = -> describe "PayMethods", ->

  before (done) ->
    stubAnalytics()
    done()

  after (done) ->
    resotreAnalytics()
    done()


  it '401 on unauthenticated getPayMethods', (done) ->
    opts = status: 401, unauthenticated: true
    GET('/billing/paymethods', opts, -> done() )


  it 'Empty result for getPayMethods on new user', (done) ->
    addAndLoginLocalUser 'nkig', (s) ->
      GET '/billing/paymethods', {}, (r) ->
        expect(r).to.exist
        expect(r.length).to.equal(0)
        done()

  it 'Gets migrated stripe result for v0 user from settings', (done) ->
    addAndLoginLocalUser 'jmel', (s) ->
      testDb.ensureSettings s, data.v0.settings.jk, (e, r) ->
        GET '/billing/paymethods', {}, (r) ->
          expect(r).to.exist
          expect(r.length).to.equal(1)
          expect(r[0].type).to.equal('stripe')
          expect(r[0].name).to.exist
          expect(r[0].info.default_card).to.equal(data.v0.settings.jk.paymentMethods[1].info.default_card)
          done()

    # LOGIN 'admin', data.users.admin, (s) ->
    #   GET '/tags/angularjs', {}, (t) ->
    #     expect(t.slug).to.equal('angularjs')
    #     expect(t.name).to.equal('AngularJS')
    #     expect(t.short).to.equal('Angular')
    #     done()


  it.skip 'Can add payment braintree payment method', (done) ->
    # opts = { unauthenticated: true }
    # GET '/tags/search/mon', opts, (s) ->
    #   expect(s.length).to.equal(1)
    #   expect(s[0].name).to.equal('MongoDB')
    #   expect(s[0].slug).to.equal('mongodb')
    #   expect(s[0].desc).to.exist
    #   expect(s[0]._id).to.exist
    #   done()


describe.skip "COMPANY PayMethods", ->

  it 'Can add company paymethod', (done) ->
    expect(p.companyId).to.exist
    expect(p.userId).to.exist

describe.skip "ORDER HISTORY", ->


  it.skip 'Empty result for orderHistory on new user', (done) ->
    # opts = status: 401, unauthenticated: true
    # GET('/tags/angularjs', opts, -> done() )


  it.skip 'Empty result for orderHistory on new user', (done) ->
    # opts = status: 401, unauthenticated: true
    # GET('/tags/angularjs', opts, -> done() )
