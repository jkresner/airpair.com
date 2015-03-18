import BaseSvc      from '../services/_service'
import User         from '../models/user'
var util            = require('../../shared/util')
var Data            = require('./users.data')
var logging         = config.log.auth || false
var svc             = new BaseSvc(User, logging)
var cbSession       = Data.select.cb.fullSession
var MailChimp       = require('./wrappers/mailchimp')


module.exports = {

  fullUpdatedCohort(cb) {
    if (this.user)
    {
      MailChimp.lists(cb)
    }
    else
    {
      throw Error('anonymous list to be implemented')
    }
  }

}
