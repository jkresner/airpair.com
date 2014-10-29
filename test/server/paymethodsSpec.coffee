module.exports = -> describe "PayMethods", ->

  @timeout(5000)

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
            expect(s1.primaryPayMethodId).to.equal(r[0]._id)
            done()


  it 'Can add braintree payment method to new user', (done) ->
    addAndLoginLocalUser 'evan', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (r) ->
        expect(r).to.exist
        expect(r.type).to.equal('braintree')
        expect(r.name).to.equal('Default Card')
        expect(_.idsEqual(r.info.customerId, s._id)).to.be.true
        GET '/billing/paymethods', {}, (pms) ->
          expect(pms).to.exist
          expect(pms.length).to.equal(1)
          expect(pms[0].type).to.equal('braintree')
          expect(pms[0].name).to.equal('Default Card')
          GET '/session/full', {}, (s1) ->
            expect(s1.primaryPayMethodId).to.equal(pms[0]._id)
            done()


  it 'Can add multiple braintree payment methods to new user', (done) ->
    addAndLoginLocalUser 'elld', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (r1) ->
        d2 = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Backup Card'
        POST '/billing/paymethods', d2, {}, (r2) ->
          GET '/billing/paymethods', {}, (pms2) ->
            expect(pms2.length).to.equal(2)
            GET '/session/full', {}, (s1) ->
              expect(s1.primaryPayMethodId).to.equal(r1._id)
              done()


  it 'Can add company payment method', (done) ->
    addAndLoginLocalUser 'abeh', (s) ->
      testDb.ensureCompany s, data.v0.companys.urbn, (e,r) ->
        d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: "#{r.name} Card", companyId: r._id
        POST '/billing/paymethods', d, {}, (pm) ->
          expect(pm._id).to.exist
          expect(_.idsEqual(pm.companyId, r._id)).to.be.true
          expect(_.idsEqual(pm.info.customerId, r._id)).to.be.true
          done()



  it.skip 'Company payment methods appear in getPayMethods', () ->
    ## Need to impl company functionality first


  it 'Can delete braintree payment method', (done) ->
    addAndLoginLocalUser 'edud', (s) ->
      d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, {}, (r) ->
        expect(r._id).to.exist
        GET '/session/full', {}, (s1) ->
          expect(s1.primaryPayMethodId).to.equal(r._id)
          DELETE "/billing/paymethods/#{s1.primaryPayMethodId}", {}, () ->
            GET '/session/full', {}, (s2) ->
              expect(s2.primaryPayMethodId).to.be.undefined
              GET '/billing/paymethods', {}, (pms) ->
                expect(pms.length).to.equal(0)
                done()
