module.exports = -> describe "API", ->

  @timeout(6000)


  # double think if it's necessary to allow people to add cars when anonymous
  describe 'Anonymous', ->

    it.skip 'Gets braintree token on new anonymous get-paymethods', (done) ->
    it.skip 'Can create anonymous paymethod and migrate paymethod to new account creation', (done) ->


  describe 'No Analytics', ->

    before ->
      SETUP.analytics.stub()

    after ->
      SETUP.analytics.restore()

    it 'Gets braintree token on new loggedin user get-paymethods', (done) ->
      addAndLoginLocalUser 'nkig', (s) ->
        GET '/billing/paymethods', {}, (r) ->
          expect(r.btoken).to.exist
          done()


    it 'Gets migrated stripe result for v0 user from settings', (done) ->
      SETUP.addAndLoginLocalUser 'jmel', (s) ->
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
      SETUP.addAndLoginLocalUser 'evan', (s) ->
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
      SETUP.addAndLoginLocalUser 'elld', (s) ->
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
      SETUP.addAndLoginLocalUser 'abeh', (s) ->
        comp = data.v0.companys.urbn
        testDb.ensureDocs 'Company', [comp], (e,r) ->
          # $log('going yah', comp._id)
          d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: "#{r.name} Card", companyId: comp._id
          POST '/billing/paymethods', d, {}, (pm) ->
            expect(pm._id).to.exist
            expect(_.idsEqual(pm.companyId, comp._id)).to.be.true
            expect(_.idsEqual(pm.info.customerId, comp._id)).to.be.true
            done()



    it 'Company payment methods appear in getPayMethods', (done) ->
      SETUP.setupCompanyWithPayMethodAndTwoMembers 'ldhm', 'math', 'edub', (cid, pmid, cAdm, cMem) ->
        LOGIN 'edub', cMem, () ->
          GET '/billing/paymethods', {}, (cMemPMs) ->
            expect(cMemPMs.length).to.equal(1)
            expect(_.idsEqual(cMemPMs[0]._id,pmid)).to.be.true
            done()


    it 'Can delete braintree payment method', (done) ->
      SETUP.addAndLoginLocalUser 'edud', (s) ->
        d = type: 'braintree', token: braintree.Test.Nonces.Transactable, name: 'Default Card', makeDefault: true
        POST '/billing/paymethods', d, {}, (r) ->
          expect(r._id).to.exist
          GET '/session/full', {}, (s1) ->
            expect(s1.primaryPayMethodId).to.equal(r._id)
            DELETE "/billing/paymethods/#{s1.primaryPayMethodId}", {}, () ->
              GET '/session/full', {}, (s2) ->
                expect(s2.primaryPayMethodId).to.be.undefined
                GET '/billing/paymethods', {}, (pms) ->
                  expect(pms.btoken).to.exist
                  done()


  describe 'With Analytics', ->

    it 'Can add braintree payment method to new user with Analytics', (done) ->
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


  describe 'Payouts', ->

    before ->
      SETUP.analytics.stub()

    after ->
      SETUP.analytics.restore()


    it 'Can get expert payout methods', (done) ->
      SETUP.newLoggedInExpert 'abha', (expert, sAbha) ->
        GET '/billing/payoutmethods', {}, (pms) ->
          expect(pms.length).to.equal(0)
          SETUP.injectOAuthPayoutMethod sAbha,'paypal','payout_paypal_enus_verified', (pm) ->
            expect(pm._id).to.exist
            expect(pm.type).to.equal('payout_paypal')
            expect(pm.info.verified_account).to.equal('true')
            GET '/billing/payoutmethods', {}, (pms2) ->
              expect(pms2.length).to.equal(1)
              done()


    it 'Fail to add unverified paypal payout method', (done) ->
      SETUP.newLoggedInExpert 'admb', (expert, sTmot) ->
        SETUP.injectOAuthPayoutMethod sTmot,'paypal','payout_paypal_enus_unverified', (pm) ->
          expect(pm).to.be.undefined
          done()


