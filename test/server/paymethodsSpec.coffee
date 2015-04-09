braintree_test_nouce = 'fake-valid-nonce'


module.exports = -> describe "API".subspec, ->

  @timeout(10000)


  # double think if it's necessary to allow people to add cars when anonymous
  describe 'Anonymous', ->

    it 'Gets braintree token on new anonymous get-paymethods'
    it 'Can create anonymous paymethod and migrate paymethod to new account creation'


  describe 'No Analytics', ->

    it 'Gets braintree token on new loggedin user get-paymethods', itDone ->
      tokenStub = SETUP.stubBraintree('clientToken','generate',null,data.wrappers.braintree_newuser_token)
      SETUP.addAndLoginLocalUser 'nkig', (s) ->
        GET '/billing/paymethods', {}, (r) ->
          expect(r.btoken).to.exist
          tokenStub.restore()
          DONE()


    it 'Gets migrated stripe result for v0 user from settings', itDone ->
      SETUP.addAndLoginLocalUser 'jmel', (s) ->
        db.ensureDoc 'Settings', _.extend({userId:s._id},data.v0.settings.jk), ->
          GET '/billing/paymethods', {}, (r) ->
            expect(r).to.exist
            expect(r.length).to.equal(1)
            expect(r[0].type).to.equal('stripe')
            expect(r[0].name).to.exist
            expect(r[0].info.default_card).to.equal(data.v0.settings.jk.paymentMethods[1].info.default_card)
            GET '/session/full', {}, (s1) ->
              expect(s1.primaryPayMethodId).to.equal(r[0]._id)
              DONE()


    it 'Can add braintree payment method to new user', itDone ->
      SETUP.addAndLoginLocalUser 'evan', (s) ->
        d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
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
              DONE()


    it 'Can add multiple braintree payment methods to new user', itDone ->
      SETUP.addAndLoginLocalUser 'elld', (s) ->
        d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
        POST '/billing/paymethods', d, {}, (r1) ->
          d2 = type: 'braintree', token: braintree_test_nouce, name: 'Backup Card'
          POST '/billing/paymethods', d2, {}, (r2) ->
            GET '/billing/paymethods', {}, (pms2) ->
              expect(pms2.length).to.equal(2)
              GET '/session/full', {}, (s1) ->
                expect(s1.primaryPayMethodId).to.equal(r1._id)
                DONE()


    it 'Can add company payment method', itDone ->
      SETUP.addAndLoginLocalUser 'abeh', (s) ->
        comp = data.v0.companys.urbn
        db.ensureDocs 'Company', [comp], ->
          d = type: 'braintree', token: braintree_test_nouce, name: "#{comp.name} Card", companyId: comp._id
          POST '/billing/paymethods', d, {}, (pm) ->
            expect(pm._id).to.exist
            expect(_.idsEqual(pm.companyId, comp._id)).to.be.true
            # expect(_.idsEqual(pm.info.customerId, comp._id)).to.be.true
            DONE()



    it 'Company payment methods appear in getPayMethods', itDone ->
      findStub = SETUP.stubBraintree('customer','find',null,null)
      ld = data.v0.companys.ldhm
      createResp = _.extend({id:ld._id} ,data.wrappers.braintree_add_company_card)
      createStub = SETUP.stubBraintree('customer','create',null,createResp)
      SETUP.setupCompanyWithPayMethodAndTwoMembers 'ldhm', 'math', 'edub', (cid, pmid, cAdm, cMem) ->
        findStub.restore()
        createStub.restore()
        LOGIN cMem.userKey, (scMem) ->
          GET '/billing/paymethods', {}, (cMemPMs) ->
            expect(cMemPMs.length).to.equal(1)
            expect(_.idsEqual(cMemPMs[0]._id,pmid)).to.be.true
            DONE()


    it 'Can delete braintree payment method', itDone ->
      SETUP.addAndLoginLocalUser 'edud', (s) ->
        d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
        POST '/billing/paymethods', d, {}, (r) ->
          expect(r._id).to.exist
          GET '/session/full', {}, (s1) ->
            expect(s1.primaryPayMethodId).to.equal(r._id)
            DELETE "/billing/paymethods/#{s1.primaryPayMethodId}", {}, () ->
              GET '/session/full', {}, (s2) ->
                expect(s2.primaryPayMethodId).to.be.undefined
                GET '/billing/paymethods', {}, (pms) ->
                  expect(pms.btoken).to.exist
                  DONE()


  describe 'With Analytics', ->

    before -> SETUP.analytics.on()
    after -> SETUP.analytics.off()

    it 'Can add braintree payment method to new user with Analytics', itDone ->
      SETUP.addAndLoginLocalUser 'evan', (s) ->
        d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
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
              DONE()


  describe 'Payouts', ->

    it 'Can get expert payout methods', itDone ->
      SETUP.newLoggedInExpert 'abha', (expert, sAbha) ->
        GET '/billing/payoutmethods', {}, (pms) ->
          expect(pms.length).to.equal(0)
          SETUP.injectOAuthPayoutMethod sAbha,'paypal','payout_paypal_enus_verified', (pm) ->
            expect(pm._id).to.exist
            expect(pm.type).to.equal('payout_paypal')
            expect(pm.info.verified_account).to.equal('true')
            GET '/billing/payoutmethods', {}, (pms2) ->
              expect(pms2.length).to.equal(1)
              DONE()


    it 'Fail to add unverified paypal payout method', itDone ->
      SETUP.newLoggedInExpert 'admb', (expert, sTmot) ->
        SETUP.injectOAuthPayoutMethod sTmot,'paypal','payout_paypal_enus_unverified', (pm) ->
          expect(pm).to.be.undefined
          DONE()


