import Svc from '../services/_service'
import PayMethod from '../models/paymethod'
import Settings from '../models/settings'


var logging = false
var svc = new Svc(PayMethod, logging)


export function createPaymethod(o, cb) {
  svc.create(o, cb)
}


export function deletePaymethod(id, cb) {
  svc.getById(id, (e, r) => {
    // var inValid = Validate.deleteById(this.user, r)
    // if (inValid) return cb(svc.Forbidden(inValid))
    svc.deleteById(id, cb)
  })
}


export function getMyPaymethods(cb) {
  var companyIds = [] // TODO read companies user belongs too
	svc.searchMany({$or: [{userId:this.user._id},{companyId: {$in:companyIds}}]}, null, (e,r) => {
		if (e) return cb(e,r)
		if (r.length > 0) return cb(e,r)
		else {
			Settings.findOne({userId:this.user._id}, (ee, s) => {
				if (!s || !s.paymentMethods) return cb(e,r)
				var existing = _.find(s.paymentMethods, (pm) => pm.type == 'stripe')
				if (!existing) return cb(e,r)
				else {
					var {info,type} = existing
					createPaymethod({info,type,userId:this.user._id,name:`${this.user.name}'s card`}, (eee, pm) => {
						if (eee) return cb(eee)
						cb(null,[pm])
					})
				}
			})
		}
	})
}
