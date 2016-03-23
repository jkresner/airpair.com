function $$log(action, data, user, sessionID, ctx) {
  // console.log('$$log'.gray, action, data, user, sessionID, ctx)
  var uid = user ? user.name.gray || user._id.toString().gray
    : `${(ctx&&ctx.ip)?ctx.ip.replace(':ffff','').split(',')[0]:''}\t ${sessionID.substring(0,12)}`.cyan

  uid = uid+"                                     ".substring(0,37-uid.length)+' '

  var ref = ((data.ref) ? (` <<< `.cyan+`${data.ref}`.replace(/\/+$/, '').blue) : '')
    .replace('https://','').replace('http://','').replace('www.','');

  switch (action.toUpperCase()) {
    case 'FIRST':
      $log(uid, `FIRST   > ${data.url}`.cyan+ref)
      break
    case 'VIEW':
      $log(uid, `VIEW    > ${data.url}`.cyan+ref)
      break
    case 'LOGIN':
      $log(uid, `LOGIN   > ${data._id}`.green)
      break
    case 'SIGNUP':
      $log(uid, `SINGUP  > ${data._id}`.green)
      break
    case 'REQUEST':
      $log(uid, `REQUEST > ${data.action}`, `http://adm.airpa.ir/r/${data._id}`.white)
      break
    case 'ORDER':
      $log(uid, `ORDER   > $${data.total}`, `http://adm.airpa.ir/o/${data._id}`.white)
      break
    case 'PAYMENT':
      $log(uid, `PAYMENT > $${data.total}`, `http://adm.airpa.ir/o/${data.orderId}`.white)
      break
    case 'SAVE':
      if (data.type == 'paymethod')
        $log(uid, `PAYM    > ${data.method} ${data.cardType} SAVED!!!`.yellow)
      else if (data.type == 'email')
        $log(uid, `EMAILC  > ${data.email} << ${data.previous}[${data.previousVerified}] `.green)
      else if (data.type == 'emailVerified')
        $log(uid, `EMAILV  > ${data.email}`.green)
      else
        $log(uid, `${action.toUpperCase()}  > ${JSON.stringify(data)}`.yellow)
      break
    default:
      $log(uid, `${action.toUpperCase()} > ${JSON.stringify(data)}`.yellow)
  }
}

global.wrapAnalytics = function() {
  var {view,event} = global.analytics

  global.analytics.view = function(type, obj, cb) {
    view.apply(this, arguments)
    // if (!req.firstRequest) // anoying in the logs
      // $$log('View', obj, this.user, this.sessionID, this)
  }
  global.analytics.event = function(name, data, cb) {
    event.apply(this, arguments)
    $$log(name, data, this.user, this.sessionID, this)
  }
  delete global.wrapAnalytics
}

module.exports = ({select,assign,inflate,chain}) => ({

})
