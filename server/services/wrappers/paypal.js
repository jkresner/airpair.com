var paypal = require('paypal-rest-sdk')
var openIdConnect = paypal.openIdConnect

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
        req.authInfo = { userinfo, tokeninfo }
        next()
      })
    })
  },

  payout(toEmail, amount, payoutId, note, cb) {
    return cb (null, {success:true})
    // var payload = {
    //   "sender_batch_header": {
    //     "email_subject": "You have an AirPair payment",
    //     "sender_batch_id": payoutId.toString().substring(0,9)
    //   },
    //   "items": [{
    //     "recipient_type": "EMAIL",
    //     "receiver": "expert_engb_verified@airpair.com", //toEmail,
    //     "amount": {
    //       "value": "10.90",
    //       "currency": "USD"
    //     },
    //     "note": "thank you.", // note,
    //     "sender_item_id": payoutId.toString()
    //   }]
    // }

    var sender_batch_id = Math.random().toString(36).substring(9);

    var payload = {
        "sender_batch_header": {
            "sender_batch_id": sender_batch_id,
            "email_subject": "You have a payment"
        },
        "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": 0.90,
                    "currency": "USD"
                },
                "receiver": "shirt-supplier-three@mail.com",
                "note": "Thank you.",
                "sender_item_id": "item_3"
            }
        ]
    };

    paypal.payout.create(payload, 'true', (e, payout) => {
      if (e)
        $log(`paypal.payout.error`.red, JSON.stringify(e).red, JSON.stringify(payload).white);
      else
        $log(`paypal.payout`.yellow, JSON.stringify(payload).white)

      cb(e, payout)
    })
  }

}


module.exports = pp


