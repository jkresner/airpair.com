braintree = require('braintree')


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
      testDb.ensureSettings s, data.v0.settings.jk, ->
        GET '/billing/paymethods', {}, (r) ->
          expect(r).to.exist
          expect(r.length).to.equal(1)
          expect(r[0].type).to.equal('stripe')
          expect(r[0].name).to.exist
          expect(r[0].info.default_card).to.equal(data.v0.settings.jk.paymentMethods[1].info.default_card)
          GET '/session/full', {}, (s1) ->
            $log('sesh', s1)
            expect(s1.primaryPayMethodId).to.equal(r[0]._id)
            done()


  it 'Can add braintree payment method to new user', (done) ->
    addAndLoginLocalUser 'evan', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (r) ->
        expect(r).to.exist
        expect(r.type).to.equal('braintree')
        expect(r.name).to.exist
        GET '/billing/paymethods', {}, (pms) ->
          expect(pms).to.exist
          expect(pms.length).to.equal(1)
          expect(pms[0].type).to.equal('braintree')
          expect(pms[0].name).to.equal('Default Card')
          GET '/session/full', {}, (s1) ->
            expect(s1.primaryPayMethodId).to.equal(pms[0]._id)
            done()


  it 'Can add multiple braintree payment methods to new user', (done) ->
    @timeout(3000)
    addAndLoginLocalUser 'elld', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (r1) ->
        d2 = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Backup Card'
        POST '/billing/paymethods', d2, {}, (r2) ->
          $log('go2', r2._id)
          GET '/billing/paymethods', {}, (pms2) ->
            expect(pms2.length).to.equal(2)
            GET '/session/full', {}, (s1) ->
              expect(s1.primaryPayMethodId).to.equal(r1._id)
              done()


  it.skip 'Can add company payment method to new user', (done) ->



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
