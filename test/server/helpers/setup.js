var UserService = require('../../../server/services/users')


global.addLocalUser = function(userKey, done)
{      
  var seed = data.users[userKey];
  var suffix = moment().format('X')
  var clone = {
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


module.exports = {

  init: function(done)
  {      
    addAdmin('adm', done)
  },

  initTags: function(done)
  {
    Tag = require('../../../server/models/tag');
    Tag.findOne({slug:'angularjs'}, function(e,r) {
      if (!r) {
        var tags = [data.tags.angular,data.tags.node,data.tags.mongo]
        Tag.create(tags, done)
      }
      else 
        done()
    })

  },

  upsertProviderProfile: function(provider, userKey, done)
  {
    var user = data.oauth[userKey]
    UserService.upsertProviderProfile(null, provider, user, done)
  }

}


