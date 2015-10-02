
module.exports = () => describe("Authorization: ".subspec, function() {


  IT('Cannot grant roles as non-admin', function() {
    SETUP.addLocalUser('joem', {}, function(userKey) {
      LOGIN(userKey, function() {
        PUT(`/adm/users/${data.users[userKey]._id}/role/admin`, {}, {status: 403}, function(s) {
          expect(_.isEmpty(s)).to.be.true // new users have undefined roles
          DONE()
        })
      })
    })
  })


  IT('Can grant role as admin', function() {
    SETUP.addAndLoginLocalUser('ilap', function(s) {
      expect(s.roles).to.be.undefined // new users have undefined roles
      LOGIN('admin', function() {
        PUT(`/adm/users/${data.users[s.userKey]._id}/role/spinner`, {}, {}, function(s) {
          expect(s.roles.length).to.equal(1)
          expect(s.roles[0]).to.equal('spinner')
          DONE()
        })
      })
    })
  })


  IT('Cannot grant invalid role as admin', function() {
    SETUP.addLocalUser('adap', {}, function(userKey) {
      LOGIN('admin', function() {
        PUT(`/adm/users/${data.users[userKey]._id}/role/goodlookin`, {}, {status:403}, function(s) {
          expect(s.message).to.equal('goodlookin is not a valid role')
          DONE()
        })
      })
    })
  })


  IT('Can get users in role', itDone(function() {
    SETUP.addLocalUser('pgap', {}, function(pgKey) {
      SETUP.addLocalUser('scap', {}, function(scKey) {
        LOGIN('admin', function() {
          PUT(`/adm/users/${data.users[pgKey]._id}/role/pipeliner`, {}, {}, function(s) {
            PUT(`/adm/users/${data.users[scKey]._id}/role/pipeliner`, {}, {}, function(s2) {
              expect(false).to.be.true
              // UserService.getUsersInRole('pipeliner', function(e, r) {
              //   expect(r.length >= 2).to.be.true
              //   var rIds = _.map(_.pluck(r, '_id'),function(id){ return id.toString() })
              //   expect(_.contains(rIds, data.users[pgKey]._id.toString() )).to.be.true
              //   expect(_.contains(rIds, data.users[scKey]._id.toString() )).to.be.true
              //   DONE()
              // })
            })
          })
        })
      })
    })
  })


  IT('Can access pipeline with pipeliner role but not admin', function() {
    SETUP.addLocalUser('jjel', {}, function(userKey) {
      LOGIN('admin', function() {
        PUT(`/adm/users/${data.users[userKey]._id}/role/pipeliner`, {}, {}, function(s) {
          expect(s.roles.length).to.equal(1)
          expect(s.roles[0]).to.equal('pipeliner')
          LOGIN(userKey, function(ss) {
            GETP('/adm/orders').expect(403).end(function() {
              GETP('/adm/bookings').expect(200).end(function() {
                SETUP.addAndLoginLocalUser('jaje', function(ss) {
                  GETP('/adm/orders').expect(403).end(function() {
                    GETP('/adm/bookings').expect(403).end(function() {
                      DONE()
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })


})
