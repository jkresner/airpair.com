var UserService = require('../../../server/services/users')
var Tag = require('../../../server/models/tag')
var Workshop = require('../../../server/models/workshop')
var View = require('../../../server/models/view')
var User = require('../../../server/models/user')
var Expert = require('../../../server/models/expert')
var PayMethod = require('../../../server/models/paymethod')
var {Settings,Company} = require('../../../server/models/v0')
var util = require('../../../shared/util')



function ensureDocument(Model, doc, cb)
{
  Model.findByIdAndRemove(doc._id, function(e, r) { new Model(doc).save(cb); })
}

module.exports = {

  ensureUser: function(user, cb) {
  	ensureDocument(User, user, cb)
  },

  ensureExpert: function(user, expert, cb) {
  	ensureDocument(User, user, () => {
	  	ensureDocument(Expert, expert, cb)
  	})
  },

  ensureSettings: function(user, settings, cb) {
  	settings.userId = user._id
    ensureDocument(Settings, settings, cb)
  },

  ensureCompany: function(user, company, cb) {
  	company.contacts[0].fullName = user.name
  	company.contacts[0].userId = user._id
    ensureDocument(Company, company, cb)
  },

  ensurePost: function(post, cb) {
  	ensureDocument(Post, post, cb)
  }

}
