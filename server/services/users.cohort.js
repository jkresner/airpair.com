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

          cb(null, _.map(r,(l)=>_.pick(l, 'name', 'subscribed', 'description')))

          var subscribed = _.pluck(_.filter(r, (l) => l.subscribed),'name')
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
      //-- Just return what's in the users session because we can't tell
      //-- if they have verified anyway
      cb(null, this.session.maillists)
    }
  },

  toggleMaillist(body, cb) {
    var {name} = body
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
      var {email} = body

      this.session.maillists = this.session.maillists || []
      if (_.contains(this.session.maillists, name)) {
        cb('Unsubscribe not supported for anonymous users. Please login.')
        // this.session.maillists = _.without(this.session.maillists, name)
        // MailChimp.unsubscribe(name, email, (e,r) => cb(e,this.session.maillists))
      }
      else {
        this.session.maillists.push(name)
        MailChimp.subscribe(name, email, {}, 'html', true, false, (e,r) => cb(e,this.session.maillists))
      }

      this.session.anonData.email = email
    }
  }

}
