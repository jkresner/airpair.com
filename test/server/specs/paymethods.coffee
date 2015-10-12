braintree_test_nouce = 'fake-valid-nonce'


noAnalytics = ->

  before ->
    @braintreeTokenStub = STUB.stubWrapperInnerAPI 'Braintree', 'clientToken.generate'
    @braintreeCustomerStub = STUB.stubWrapperInnerAPI 'Braintree', 'customer.find'
    @braintreeCreateStub = STUB.stubWrapperInnerAPI 'Braintree', 'customer.find'
    @braintreeCB = (key) -> (params, cb) -> cb(null, FIXTURE.wrappers[key])


  IT 'Gets braintree token on new loggedin user get-paymethods', ->
    stub = @braintreeTokenStub @braintreeCB('braintree_newuser_token')
    STORY.newUser 'nkig', {login:true}, (s) ->
      GET '/billing/paymethods', (r) ->
        expect(r.btoken).to.exist
        DONE()


  IT 'Can add braintree payment method to new user', ->
    STORY.newUser 'evan', {login:true}, (s) ->
      d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, (r) ->
        # $log('uncomment and copy result:: '.cyan, _.omit(r,'__v','_id','userId'))
        expect(r).to.exist
        expect(r.type).to.equal('braintree')
        expect(r.name).to.equal('Default Card')
        expect(_.idsEqual(r.info.customerId, s._id)).to.be.true
        GET '/billing/paymethods', (pms) ->
          expect(pms).to.exist
          expect(pms.length).to.equal(1)
          expect(pms[0].type).to.equal('braintree')
          expect(pms[0].name).to.equal('Default Card')
          GET '/session/full', (s1) ->
            expect(s1.primaryPayMethodId).to.equal(pms[0]._id)
            DONE()


  IT 'Can add multiple braintree payment methods to new user', ->
    STORY.newUser 'elld', {login:true}, (s) ->
      d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, (r1) ->
        d2 = type: 'braintree', token: braintree_test_nouce, name: 'Backup Card'
        POST '/billing/paymethods', d2, (r2) ->
          GET '/billing/paymethods', (pms2) ->
            expect(pms2.length).to.equal(2)
            GET '/session/full', (s1) ->
              expect(s1.primaryPayMethodId).to.equal(r1._id)
              DONE()


  IT 'Can add company payment method', ->
    STORY.newUser 'abeh', {login:true}, (s) ->
      comp = FIXTURE.v0.companys.urbn
      DB.ensureDocs 'Companie', [comp], ->
        d = type: 'braintree', token: braintree_test_nouce, name: "#{comp.name} Card", companyId: comp._id
        POST '/billing/paymethods', d, (pm) ->
          expect(pm._id).to.exist
          expect(_.idsEqual(pm.companyId, comp._id)).to.be.true
          # expect(_.idsEqual(pm.info.customerId, comp._id)).to.be.true
          DONE()



  # it.skip 'Company payment methods appear in getPayMethods', ->
  #   # findStub = SETUP.stubBraintree('customer','find',null,null)
  #   ld = data.v0.companys.ldhm
  #   createResp = _.extend({id:ld._id}, data.wrappers.braintree_add_company_card)
  #   createStub = SETUP.stubBraintree('customer','create',null,createResp)
  #   findStub = @braintreeCustomerStub @braintreeCB(null)
  #   SETUP.setupCompanyWithPayMethodAndTwoMembers 'ldhm', 'math', 'edub', (cid, pmid, cAdm, cMem) ->
  #     findStub.restore()
  #     createStub.restore()
  #     LOGIN cMem.userKey, (scMem) ->
  #       GET '/billing/paymethods', {}, (cMemPMs) ->
  #         expect(cMemPMs.length).to.equal(1)
  #         expect(_.idsEqual(cMemPMs[0]._id,pmid)).to.be.true
  #         DONE()


  IT 'Can delete braintree payment method', ->
    STORY.newUser 'edud', {login:true}, (s) ->
      d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
      POST '/billing/paymethods', d, (r) ->
        expect(r._id).to.exist
        GET '/session/full', (s1) ->
          expect(s1.primaryPayMethodId).to.equal(r._id)
          DELETE "/billing/paymethods/#{s1.primaryPayMethodId}", {}, () ->
            GET '/session/full', (s2) ->
              expect(s2.primaryPayMethodId).to.be.undefined
              GET '/billing/paymethods', (pms) ->
                expect(pms.btoken).to.exist
                DONE()


withAnalytics = ->

  before -> SETUP.analytics.on()
  after -> SETUP.analytics.off()

  IT 'Can add braintree payment method to new user with Analytics', ->
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


payouts = ->

  IT 'Can get expert payout methods', ->
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


  IT 'Fail to add unverified paypal payout method', ->
    SETUP.newLoggedInExpert 'admb', (expert, sTmot) ->
      SETUP.injectOAuthPayoutMethod sTmot,'paypal','payout_paypal_enus_unverified', (pm) ->
        expect(pm).to.be.undefined
        DONE()


module.exports = ->

  @timeout(10000)

  DESCRIBE("Analytics off", noAnalytics)
  # DESCRIBE("Analytics on", withAnalytics)
  # DESCRIBE("Payouts", payouts)


