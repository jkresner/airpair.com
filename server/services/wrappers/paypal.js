var paypal = global.paypal || require('paypal-rest-sdk')
var openIdConnect = paypal.openIdConnect
var {stringToJson}  = require('../../../shared/util')

paypal.configure({
  'mode': config.auth.paypal.mode,
  'client_id': config.auth.paypal.clientID,
  'client_secret': config.auth.paypal.clientSecret,
  'openid_client_id': config.auth.paypal.clientID,
  'openid_client_secret': config.auth.paypal.clientSecret,
  'openid_redirect_uri': `${config.auth.oAuth.callbackHost}/v1/auth/paypal/callback`
});

// With Refresh token
// openIdConnect.tokeninfo.refresh("Replace with refresh_token", function (error, tokeninfo) {
//     if (error) {
//         console.log(error);
//     } else {
//         openIdConnect.userinfo.get(tokeninfo.access_token, function (error, userinfo) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log(tokeninfo);
//                 console.log(userinfo);
//             }
//         });
//     }
// });



var pp = {

  scopeString: config.auth.paypal.scope.join().replace(/,/g,' '),

  loginUrl: (req) =>
    openIdConnect.authorizeUrl({'scope': pp.scopeString }),

  handleOAuthCallback(req, res, next) {
    var error = (e) => {
      $log('paypal.handleOAuthCallback.error: no user info'.red, e)
      res.redirect(`${req.session.returnToUrl}?fail=${e.message||e.toString()}`)
      res.end()
    }

    var authCode = req.query.code
    openIdConnect.tokeninfo.create(authCode, function (ee, tokeninfo) {
      if (ee) return error(ee)
      openIdConnect.userinfo.get(tokeninfo.access_token, function (e, userinfo) {
        if (e) return error(e)
        if (!userinfo) return error("no user info")
        // console.log('tokeninfo', tokeninfo, 'userinfo', userinfo)
        req.authInfo = {
          userinfo: stringToJson(userinfo),
          tokeninfo: stringToJson(tokeninfo)
        }
        next()
      })
    })
  },

  payout(receiver, amount, payoutId, note, cb) {

    var payload = {
      "sender_batch_header": {
        "email_subject": "You have an AirPair payment"
      },
      "items": [{
          "recipient_type": "EMAIL",
          "amount": {
              "value": amount,
              "currency": "USD"
          },
          receiver,
          note,
          "sender_item_id": payoutId.toString()
      }]
    };

    paypal.payout.create(payload, 'true', (e, payout) => {
      var logging = config.env != 'test'
      if (e) {
        if (logging) $log(`paypal.payout.error`.red, JSON.stringify(e).red, JSON.stringify(payload).white)
      }
      else if (payout && payout.items && payout.items[0].errors) {
        if (logging) $log(`paypal.payout.failed`.red, JSON.stringify(payout).red, JSON.stringify(payload).white)
        e = payout.items[0].errors
      }
      else {
        delete payout.items[0].links
        delete payout.links
        delete payout.httpStatusCode
        if (logging) $log(`paypal.payout`.yellow, JSON.stringify(payload).white)
      }

      cb(e, payout)
    })
  }

}


module.exports = pp


