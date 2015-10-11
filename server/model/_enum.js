module.exports = {

  REDIRECT: {
    TYPE: ['301','302','410','canonical-post']
  },

  TEMPLATE: {
    TYPE: ['mail','md-file','site-notification','site-content','tw-tweet','fb-share','in-share','slack-message','pageMeta']
  },

  PAYMETHOD: {
    TYPE: ['stripe','braintree','paypal',
           'payout_paypal','payout_veno','payout_coinbase']
  }

}
