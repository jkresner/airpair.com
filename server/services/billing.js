import Svc from './_service'
import * as Validate from '../../shared/validation/billing.js'
import PayMethod from '../models/paymethod'
import * as Braintree from './wrappers/braintree'
import * as UserSvc from './users'
var Settings = require('../models/v0').Settings

// Approach:
// Since our system allows multiple pay methods by different providers (braintree / stripe)
// We do not allow multiple paymethods by one provider unless they are adding a company card
// Users can have as many company cards as they like ...
// But if they add multiple company cards then the company itself need to store multiple cards.

// payMethod._id === braintree.customerId
// customFields
// {
//		createdByuserId: ''
//		companyId: ''
// }

var logging = false
var svc = new Svc(PayMethod, logging)

export function createMembershipSubscription(o, cb) {
  cb('Not Implemented')
  // svc.create(o, cb)
}


export function addPaymethod(o, cb) {
	var user = this.user
	var customerId = (o.companyId != null) ? o.companyId : user._id

	var savePayMethod = (ee, payMethodInfo) => {
		if (ee) return cb(ee)
		else {
			o.userId = user._id
			o.companyId = o.companyId
			o.info = payMethodInfo
			if (logging) $log('savePayMethod', payMethodInfo)

  		svc.create(o, (e,r) => {
				if (logging) $log('savePayMethod', o.makeDefault, user._id, o)
				analytics.identify(user, {}, 'Save PayMethod', { type: o.type })
  			if (o.makeDefault) UserSvc.update.call(this, user._id, { primaryPayMethodId: r._id })
  			cb(e, r)
  		})
		}
	}

  if (o.type == 'braintree')
  	Braintree.addPaymentMethod(customerId, user, null, o.token, savePayMethod)
  else if (o.type == 'stripe')
  	savePayMethod(null, o.info)
  else
    return cb(`${o.type} not supported a payment type`)
}


export function deletePaymethod(id, cb) {
  UserSvc.getSessionFull.call(this, (e, user) => {
	  svc.getById(id, (e, r) => {
	    var inValid = Validate.deletePayMethodById(this.user, r)
	    if (inValid) return cb(svc.Forbidden(inValid))
	    svc.deleteById(id, cb)
	  	if (_.idsEqual(user.primaryPayMethodId,id))
	  		UserSvc.update.call(this, user._id, { primaryPayMethodId: null })
	  })
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
					addPaymethod.call(this, {info,type,userId:this.user._id,name:`${this.user.name}'s card`,makeDefault:true}, (eee, pm) => {
						if (eee) return cb(eee)
						cb(null,[pm])
					})
				}
			})
		}
	})
}
