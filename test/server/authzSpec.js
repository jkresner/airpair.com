
module.exports = function()
{
  
  describe("Authorization: ", function() {

    before(function(done) {
      done()
    })

    
    it('Cannot grant roles as non-admin', function(done) {
      addLocalUser('joem', function(userKey) {
        login(userKey, data.users[userKey], function() {
          put('/adm/users/role/'+data.users[userKey]._id+'/admin', {}, {status: 403}, function(s) {
            expect(_.isEmpty(s)).to.be.true // new users have undefined roles
            done()
          })
        })
      })
    })


    it('Can grant role as admin', function(done) {
      addLocalUser('ilap', function(userKey) {
        login(userKey, data.users[userKey], function() {
          get('/session/full', {}, function(s) {
            expect(s.roles).to.be.undefined // new users have undefined roles
            login('admin', data.users.admin, function() {
              put('/adm/users/role/'+data.users[userKey]._id+'/admin', {}, {}, function(s) {
                expect(s.roles.length).to.equal(1)
                expect(s.roles[0]).to.equal('admin')                
                done()
              })
            })
          })
        })
      })
    })


    it('Cannot grant invalid role as admin', function(done) {
      addLocalUser('adap', function(userKey) {
        login('admin', data.users.admin, function() {
          put('/adm/users/role/'+data.users[userKey]._id+'/goodlookin', {}, {status:400}, function(s) {
            expect(s.message).to.equal('Invalid role')
            done()
          })
        })
      })
    })

    
    it('Can get users in role', function(done) {
      addLocalUser('pgap', function(pgKey) {   
        addLocalUser('scap', function(scKey) {   
          login('admin', data.users.admin, function() {
            put('/adm/users/role/'+data.users[pgKey]._id+'/pipeliner', {}, {}, function(s) {
              put('/adm/users/role/'+data.users[scKey]._id+'/pipeliner', {}, {}, function(s) {
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

}
