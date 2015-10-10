var Svc                = require('./_service')
var Company            = require('../models/company')
// var UserSvc = require('./users')

var logging = false
var svc = new Svc(Company, logging)


var fields = {
  search: { '_id': 1, 'name': 1 }
}


function getById(id, cb) {
  cb(V2DeprecatedError('Companies.getById'))
  // svc.getById(id, cb)
}



 function getUsersCompany(cb) {
  svc.searchOne({'members.userId':this.user._id,'members.enabled':true}, null, cb)
}



 function search(searchTerm, cb) {
  cb(V2DeprecatedError('Companies.search'))
  // svc.searchMany({name: new RegExp(searchTerm, 'i')}, {}, cb)
}


 function create(o, cb) {
  cb(V2DeprecatedError('Companies.create'))
  // svc.create(o,null, cb)
}


 function addMember(id, user, cb) {
  cb(V2DeprecatedError('Companies.addMember'))
  // TODO CHECK user does not belong to another company that's enabled

  // getById(id, (e,company) => {
  //   if (!company || !company.members) return cb("Company does not exist or is not migrated")
  //   var mem = [{
  //     userId: user._id,
  //     name: user.name,
  //     companyEmail: user.email
  //   }]
  //   var ups = { members: _.union(company.members, mem) }
  //   svc.update(company._id, ups, cb)
  // })
}


 function migrate(id, type, cb) {
  cb(V2DeprecatedError('Companies.migrate'))
  // getById(id, (e,company) => {
  //   if (!company || company.members) return cb("Company does not exist or already migrated")
  //   var ups = {type}
  //   ups.adminId = company.contacts[0].userId
  //   ups.members = [{
  //       userId: company.contacts[0].userId,
  //       name: company.contacts[0].fullName,
  //       companyEmail: company.contacts[0].email
  //   }]

  //   svc.update(company._id, ups, cb)
  // })
}


module.exports = { getById, getUsersCompany, search, create, addMember, migrate }
