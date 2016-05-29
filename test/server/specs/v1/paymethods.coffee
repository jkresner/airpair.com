braintree_test_nouce = 'fake-valid-nonce'




before ->
  @timeout(10000)
  @brainAPI = STUB.wrapper('Braintree').api
  # @braintreeCustomerStub = brainAPI('customer.find')
  # @braintreeCreateStub = brainAPI('customer.find')
  # @braintreeCB = (key) -> (params, cb) -> cb(null, FIXTURE.wrappers[key])


IT 'Gets braintree token on new loggedin user get-paymethods', ->
  stub = @brainAPI('clientToken.generate').fix('braintree_api_newuser_testtoken')
  STORY.newUser 'nkig', {login:true}, (s) ->
    GET '/billing/paymethods', (r) ->
      expect(r.btoken).to.exist
      DONE()


IT 'Add braintree paymethod to new user', ->
  STORY.newUser 'evan', {login:true}, (s) ->
    expect(s._id).to.exist
    d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
    POST '/billing/paymethods', d, (r) ->
      # $log('uncomment and copy result:: '.cyan, _.omit(r,'__v','_id','userId'))
      expect(r).to.exist
      expect(r.type).to.equal('braintree')
      expect(r.name).to.equal('Default Card')
      EXPECT.equalIds(r.userId, s._id)
      GET '/billing/paymethods', (pms) ->
        expect(pms).to.exist
        expect(pms.length).to.equal(1)
        expect(pms[0].type).to.equal('braintree')
        expect(pms[0].name).to.equal('Default Card')
        GET '/auth/session', (s1) ->
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
          GET '/auth/session', (s1) ->
            expect(s1.primaryPayMethodId).to.equal(r1._id)
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


IT 'Delete braintree paymethod', ->
  STORY.newUser 'edud', {login:true}, (s) ->
    d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
    POST '/billing/paymethods', d, (r) ->
      expect(r._id).to.exist
      GET '/auth/session', (s1) ->
        expect(s1.primaryPayMethodId).to.equal(r._id)
        DELETE "/billing/paymethods/#{s1.primaryPayMethodId}", {}, () ->
          GET '/auth/session', (s2) ->
            expect(s2.primaryPayMethodId).to.be.undefined
            GET '/billing/paymethods', (pms) ->
              expect(pms.btoken).to.exist
              DONE()


# withAnalytics = ->

#   before -> STUB.analytics.on()
#   after -> STUB.analytics.off()

#   IT 'Can add braintree payment method to new user with Analytics', ->
#     SETUP.addAndLoginLocalUser 'evan', (s) ->
#       d = type: 'braintree', token: braintree_test_nouce, name: 'Default Card', makeDefault: true
#       POST '/billing/paymethods', d, {}, (r) ->
#         expect(r).to.exist
#         expect(r.type).to.equal('braintree')
#         expect(r.name).to.equal('Default Card')
#         expect(_.idsEqual(r.info.customerId, s._id)).to.be.true
#         GET '/billing/paymethods', {}, (pms) ->
#           expect(pms).to.exist
#           expect(pms.length).to.equal(1)
#           expect(pms[0].type).to.equal('braintree')
#           expect(pms[0].name).to.equal('Default Card')
#           GET '/auth/session', {}, (s1) ->
#             expect(s1.primaryPayMethodId).to.equal(pms[0]._id)
#             DONE()


