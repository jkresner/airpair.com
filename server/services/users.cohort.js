import BaseSvc      from '../services/_service'
import User         from '../models/user'
var util            = require('../../shared/util')
var Data            = require('./users.data')
var logging         = config.log.auth || false
var svc             = new BaseSvc(User, logging)
var cbSession       = Data.select.cb.fullSession
var MailChimp       = require('./wrappers/mailchimp')


// var mailListNames = ['AirPair Newsletter', 'AirPair Experts', 'AirPair Authors', 'AirPair Dev Digest']


module.exports = {

  getMaillists(cb) {
    if (this.user)
    {
      $callSvc(svc.getById, this)(this.user._id, (e,user) => {
        var currentLists = (user.cohort) ? user.cohort.maillists : []
        MailChimp.subscriptions(user.email, (e,r) => {
          var subscribed = []
          var maillists = []
          for (var list of r) {
            maillists.push({name:list.name,subscribed:list.subscribed,description:list.description})
            if (list.subscribed) {
              subscribed.push(list.name)
            }
          }
          cb(null,maillists)

          if (_.difference(currentLists,subscribed).length > 0 ||
            _.difference(subscribed,currentLists).length > 0
          )
            var cohort =  _.extend(user.cohort || {},{maillists:subscribed})
            svc.updateWithSet(user._id, {cohort}, (ee,rr)=>{})
        })
      })
    }
    else
    {
      throw Error('anonymous list to be implemented')
    }
  },

  toggleMaillist(name, cb) {
    if (this.user)
    {
      $callSvc(svc.getById, this)(this.user._id, (ee,user) => {
        var maillists = (user.cohort) ? user.cohort.maillists : []
        if (_.contains(maillists, name)) {
          MailChimp.unsubscribe(name, user.email, (e,r) => cb(e,{name,subscribed:false}))
          maillists = _.without(maillists, name)
        }
        else {
          var FNAME = util.firstName(user.name)
          var LNAME = user.name.replace(FNAME+' ','')
          MailChimp.subscribe(name, user.email, {FNAME,LNAME}, 'html', false, false, (e,r) => cb(e,{name,subscribed:true}))
          maillists.push(name)
        }
        var cohort =  _.extend(user.cohort || {},{maillists})
        svc.updateWithSet(user._id, {cohort}, (ee,rr)=>{})
      })
    }
    else
    {
      throw Error('anonymous list to be implemented')
    }
  }

}
