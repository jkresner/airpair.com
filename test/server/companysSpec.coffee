
module.exports = -> describe "Companys".subspec, ->

  before () ->
    SETUP.analytics.stub()

  after ->
    SETUP.analytics.restore()


  it.skip 'Can create a company', (done) ->


  it.skip 'Can invite team members', (done) ->


  it.skip 'Can find a company by userId', (done) ->


  it.skip 'Admin can set company adminId', (done) ->


  it.skip 'Can add team member to a company', (done) ->


  it 'Admin can migrate a company to v1 and add a 2nd team member', (done) ->
    SETUP.addAndLoginLocalUser 'mthm', (smthm) ->
      comp = _.clone(data.v0.companys.ldhm)
      comp.contacts[0].userId = smthm._id
      comp._id = newId()
      db.ensureDocs 'Company', [comp], (r) ->
        SETUP.addAndLoginLocalUser 'ktom', (sktom) ->
          LOGIN 'admin', ->
            GET "/adm/companys/search/#{comp.name}", {}, (rc) ->
              c = _.find(rc,(o) -> _.idsEqual(smthm._id, o.contacts[0].userId))
              expect(c._id).to.exist
              PUT "/adm/companys/migrate/#{c._id}", {type:'smb'}, {}, (mc) ->
                expect(mc.type).to.equal('smb')
                expect(mc.members.length).to.equal(1)
                PUT "/adm/companys/member/#{c._id}", {user:sktom}, {}, (mc2) ->
                  expect(mc2.members.length).to.equal(2)
                  done()


  it.skip 'Can buy credit for company', (done) ->
    SETUP.addAndLoginLocalUser 'mthm', (smthm) ->
      comp = _.clone(data.v0.companys.ldhm)
      comp.contacts[0].userId = smthm._id
      db.ensureDocs 'Company', [comp], (r) ->
        SETUP.addAndLoginLocalUser 'ktom', (sktom) ->
          LOGIN 'admin', ->
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
    SETUP.addAndLoginLocalUser 'math', (s) ->

    # show in account page

  it.skip 'Can book using company credit by team member', (done) ->
    # show in account page


