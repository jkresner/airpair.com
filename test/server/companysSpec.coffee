ObjectId = require('mongoose').Schema.Types.ObjectId

module.exports = -> describe "Companys", ->

  before (done) ->
    stubAnalytics()
    done()


  after (done) ->
    resotreAnalytics()
    done()


  it.skip 'Can create a company', (done) ->


  it.skip 'Can invite team members', (done) ->


  it.skip 'Can find a company by userId', (done) ->


  it.skip 'Admin can set company adminId', (done) ->


  it.skip 'Can add team member to a company', (done) ->

  it 'Admin can migrate a company to v1 and add a 2nd team member', (done) ->
    addAndLoginLocalUser 'mthm', (smthm) ->
      comp = _.clone(data.v0.companys.ldhm)
      comp.contacts[0].userId = smthm._id
      testDb.ensureDocs 'Company', [comp], (r) ->
        addAndLoginLocalUser 'ktom', (sktom) ->
          LOGIN 'admin', data.users.admin, ->
            GET "/adm/companys/search/#{comp.name}", {}, (rc) ->
              c = _.find(rc,(o) -> _.idsEqual(smthm._id, o.contacts[0].userId))
              expect(c._id).to.exist
              PUT "/adm/companys/migrate/#{c._id}", {type:'smb'}, {}, (mc) ->
                expect(mc.type).to.equal('smb')
                expect(mc.members.length).to.equal(1)
                PUT "/adm/companys/member/#{c._id}", {user:sktom}, {}, (mc2) ->
                  expect(mc2.members.length).to.equal(2)
                  done()

    # copy name, url, about
    # require type


  it.skip 'Can buy credit for company', (done) ->
    addAndLoginLocalUser 'mthm', (smthm) ->
      comp = _.clone(data.v0.companys.ldhm)
      comp.contacts[0].userId = smthm._id
      testDb.ensureDocs 'Company', [comp], (r) ->
        addAndLoginLocalUser 'ktom', (sktom) ->
          LOGIN 'admin', data.users.admin, ->
            GET "/adm/companys/search/#{comp.name}", {}, (rc) ->
              c = _.find(rc,(o) -> _.idsEqual(smthm._id, o.contacts[0].userId))
              expect(c._id).to.exist
              PUT "/adm/companys/migrate/#{c._id}", {type:'smb'}, {}, (mc) ->
                expect(mc.type).to.equal('smb')
                expect(mc.members.length).to.equal(1)
                PUT "/adm/companys/member/#{c._id}", {user:sktom}, {}, (mc2) ->
                  expect(mc2.members.length).to.equal(2)
                  done()


  it.skip 'Can get company and credit by team member', (done) ->
    addAndLoginLocalUser 'math', (s) ->

    # show in account page

  it.skip 'Can book using company credit by team member', (done) ->
    # show in account page


