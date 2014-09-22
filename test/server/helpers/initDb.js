global.addLocalUser = function(userKey, done)
{      
  var seed = data.users[userKey];
  var suffix = moment().format('X')
  clone = {
    email: seed.email.replace('@',suffix+'@'),
    name: seed.name+suffix
  }

  // Add an administrator
  UserService.tryLocalSignup(clone.email, 'testpass', clone.name, function(e,r){
    userKey = userKey + suffix;
    data.users[userKey] = r;
    done(userKey)
  })
}

function addAdmin(userKey, done)
{      
  // Add an administrator
  UserService.upsertProviderProfile(null, 'google', data.oauth[userKey], function(e,r){
    if (!r.roles || !r.roles.length) {
      UserService.toggleUserInRole.call({user:r}, r._id,'admin', function(e,rr) {
        data.users['admin'] = rr;
        done()
      })       
    }
    else {
      data.users.admin = r;
      done()
    }
  })
}


module.exports.init = function(done)
{      
  addAdmin('adm', done)
}


