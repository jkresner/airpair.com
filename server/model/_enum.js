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
  },

  PAYOUT: {
    LINE_TYPE: ['airpair','post'] //,'social','referral','adjustment'
  },

  EXPERT: {
    DEAL_TYPE: ['airpair', 'offline', 'code-review', 'article', 'workshop'],
    DEAL_TARGET_TYPE: ['all','user','company','newsletter','past-customers','code']
  },

  ORDER: {
    LINE_TYPE: [
      'payg',           //-- Transaction that cosumes amount of transaction immediately
      'credit',         //-- By $1000, use it how you like before it expires
      'redeemedcredit',
      'deal',           //-- Block of time with a specific expert
      'redeemeddealtime',
      'airpair',        //-- Time (Booking) with an expert, can be redeemed using credit, payg or time
      'fee',            //-- Rescheduling
      'ticket',         //-- Attend a webinar
      'discount',       //-- Use a coupon to pay leff
      'refund'          //-- When we give money back
    ]
  },

  BOOKING: {
    TYPE:['opensource','private','offline','chat','workshop'],
    ATTENDEE_TYPE: ['expert','customer'],
    STATUS:[
      'pending',    // waiting for both parties to confirm time
      'confirmed',  // time agreed
      'followup',   // waiting to get feedback from customer (? and expert)
      'complete',   // all done
      'canceled'    // e.g. if the session was to be refunded
    ]
  }
}
