// function $$log(action, data, user, sessionID, ctx) {
  // console.log('$$log'.gray, action, data, user, sessionID, ctx)
  // var uid = user ? user.name.gray || user._id.toString().gray
    // : `${(ctx&&ctx.ip)?ctx.ip.replace(':ffff','').split(',')[0]:''}\t ${sessionID.substring(0,12)}`.cyan

  // uid = uid+"                                     ".substring(0,37-uid.length)+' '

  // switch (action.toUpperCase()) {
  //   case 'FIRST':
  //     $log(uid, `FIRST   > ${data.url}`.cyan+ref)
  //     break
  //   case 'VIEW':
  //     $log(uid, `VIEW    > ${data.url}`.cyan+ref)
  //     break
  //   case 'LOGIN':
  //     $log(uid, `LOGIN   > ${data._id}`.green)
  //     break
  //   case 'SIGNUP':
  //     $log(uid, `SINGUP  > ${data._id}`.green)
  //     break
  //   case 'REQUEST':
  //     $log(uid, `REQUEST > ${data.action}`, `http://adm.airpa.ir/r/${data._id}`.white)
  //     break
  //   case 'ORDER':
  //     $log(uid, `ORDER   > $${data.total}`, `http://adm.airpa.ir/o/${data._id}`.white)
  //     break
  //   case 'PAYMENT':
  //     $log(uid, `PAYMENT > $${data.total}`, `http://adm.airpa.ir/o/${data.orderId}`.white)
  //     break
  //   case 'SAVE':
  //     if (data.type == 'paymethod')
  //       $log(uid, `PAYM    > ${data.method} ${data.cardType} SAVED!!!`.yellow)
  //     else if (data.type == 'email')
  //       $log(uid, `EMAILC  > ${data.email} << ${data.previous}[${data.previousVerified}] `.green)
  //     else if (data.type == 'emailVerified')
  //       $log(uid, `EMAILV  > ${data.email}`.green)
  //     else
  //       $log(uid, `${action.toUpperCase()}  > ${JSON.stringify(data)}`.yellow)
  //     break
  //   default:
  //     $log(uid, `${action.toUpperCase()} > ${JSON.stringify(data)}`.yellow)
  // }
// }

module.exports = function(type, d, {sId,ip,ua,ud,user,ref}) {
  // console.log('confg', config.analytics)
  // - used for quieter testing
  if (type == 'impression') return
  // if (!((global.config.analytics.log.trk||{})[type]) return

  var label = ''
  var info = ''
  if (/event/.test(type)) {
    label = d.name.toUpperCase().yellow
    info = JSON.stringify(d.data||{}).replace(/^\{/,'').replace(/\}$/,'').replace(/\"([^(\")"]+)\":/g,"$1:".dim).gray
  }
  else if (/issue/.test(type)) {
    label = `${d.type.dim} ${d.name} ${ua}`.red
    info = JSON.stringify(_.omit(d.data,'headers')).white
  }
  else if (/view/.test(type)) {
    if (/ad/.test(d.type))
      label = `AD:CLK  `.yellow
    else if (/landing/.test(d.type))
      label = `PAGE   `.cyan.dim
    else
      label = `${d.type.toUpperCase()}`.cyan + '       '.substr(0, 7-d.type.length)
    info = `${(d.url||'').cyan} ${ref?ref.replace(/(https|http)\:\/\//g,'<< ').replace('www.','').blue:''}`
  }

  var uID = !user ? `anon${ud=='other'?'':':'+ud}`.cyan : `${user.name||user._id}`.white

  var str = `${(sId||'_ _ _ _ _ _ _').substr(0,11)} ${ip+'                '.slice(ip, 16-ip.length).dim}`.cyan
            + `${label} ${uID} ${info}`

  if (config.log.it.trk[type])
    console.log(str)

  return str
}
