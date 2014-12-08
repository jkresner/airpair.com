import Svc from '../services/_service'
import Company from '../models/company'
import * as UserSvc from '../services/users'

var logging = false
var svc = new Svc(Company, logging)


var fields = {
  search: { '_id': 1, 'name': 1 }
}


export function getById(id, cb) {
  svc.getById(id, cb)
}



export function getUsersCompany(cb) {
  svc.searchOne({'members.userId':this.user._id,'members.enabled':true}, null, cb)
}



export function search(searchTerm, cb) {
  svc.searchMany({name: new RegExp(searchTerm, 'i')}, {}, cb)
}


export function create(o, cb) {
  svc.create(o,null, cb)
}


export function addMember(id, user, cb) {
  // TODO CHECK user does not belong to another company that's enabled

  getById(id, (e,company) => {
    if (!company || !company.members) return cb("Company does not exist or is not migrated")
    var mem = [{
      userId: user._id,
      name: user.name,
      companyEmail: user.email
    }]
    var ups = { members: _.union(company.members, mem) }
    svc.update(company._id, ups, cb)
  })
}


export function migrate(id, type, cb) {
  getById(id, (e,company) => {
    if (!company || company.members) return cb("Company does not exist or already migrated")
    var ups = {type}
    ups.adminId = company.contacts[0]._id
    ups.members = [{
        userId: company.contacts[0]._id,
        name: company.contacts[0].fullName,
        companyEmail: company.contacts[0].email
    }]

    svc.update(company._id, ups, cb)
  })
}
