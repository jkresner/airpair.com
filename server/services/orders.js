import Svc from './_service'
import * as Validate from '../../shared/validation/billing.js'
import Order from '../models/order'
import * as Braintree from './wrappers/braintree'
// import * as UserSvc from './users'

var logging = false
var svc = new Svc(Order, logging)

export function create(o, payMethod, cb) {
	o.userId = this.user._id

  return cb(`${o.userId} not supported a payment type`)
}
