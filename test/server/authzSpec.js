var UserService = require('../../server/services/users')

module.exports = () => describe("Authorization: ".subspec, function() {


  before(function(done) {
    SETUP.analytics.stub()
    SETUP.initTags(done)
  })

  after(function() {
    SETUP.analytics.restore()
  })


  it('Cannot grant roles as non-admin', function(done) {
    SETUP.addLocalUser('joem', {}, function(userKey) {
      LOGIN(userKey, function() {
        PUT(`/adm/users/${data.users[userKey]._id}/role/admin`, {}, {status: 403}, function(s) {
          expect(_.isEmpty(s)).to.be.true // new users have undefined roles
          done()
        })
      })
    })
  })


  it('Can grant role as admin', function(done) {
    SETUP.addAndLoginLocalUser('ilap', function(s) {
      expect(s.roles).to.be.undefined // new users have undefined roles
      LOGIN('admin', function() {
        PUT(`/adm/users/${data.users[s.userKey]._id}/role/admin`, {}, {}, function(s) {
          expect(s.roles.length).to.equal(1)
          expect(s.roles[0]).to.equal('admin')
          done()
        })
      })
    })
  })


  it('Cannot grant invalid role as admin', function(done) {
    SETUP.addLocalUser('adap', {}, function(userKey) {
      LOGIN('admin', function() {
        PUT(`/adm/users/${data.users[userKey]._id}/role/goodlookin`, {}, {status:403}, function(s) {
          expect(s.message).to.equal('goodlookin is not a valid role')
          done()
        })
      })
    })
  })


  it('Can get users in role', function(done) {
    SETUP.addLocalUser('pgap', {}, function(pgKey) {
      SETUP.addLocalUser('scap', {}, function(scKey) {
        LOGIN('admin', function() {
          PUT(`/adm/users/${data.users[pgKey]._id}/role/pipeliner`, {}, {}, function(s) {
            PUT(`/adm/users/${data.users[scKey]._id}/role/pipeliner`, {}, {}, function(s2) {
              UserService.getUsersInRole('pipeliner', function(e, r) {
                expect(r.length >= 2).to.be.true
                var rIds = _.map(_.pluck(r, '_id'),function(id){ return id.toString() })
                expect(_.contains(rIds, data.users[pgKey]._id.toString() )).to.be.true
                expect(_.contains(rIds, data.users[scKey]._id.toString() )).to.be.true
                done()
              })
            })
          })
        })
      })
    })
  })


})
