module.exports = {

  REDIRECT: {
    TYPE: [
      '301',                 // 301 forward (string/pattern) from => to
      '302',                 // 302 forward (string/pattern) from => to
      '410',                 // forward (string/pattern) from => to
      '501',                 // 501 Not implemented
      'bait',                // 418 teapot (RFC 2324) url.match(from:regex)
      // 'canonical-cached',    // Resolve custom url -> cached item (no redirect)
      // 'canonical-post',      // Resolve custom url -> post (no redirect)
      // 'canonical-tag',
      'rewrite'              // 301 forward string.replace from(regex), to(string)
    ]
  },

  REQUEST: {
    REPLY_STATUS: ['waiting','opened','busy','abstained','underpriced','available','chosen','released'],
    TYPE:  ['troubleshooting', 'mentoring', 'code-review', 'resources', 'advice', 'vetting', 'other' ],
    EXPERIENCE: ['beginner','proficient','advanced'],
    TIME: ['regular', 'rush', 'later'],
    STATUS: [
  //     //v1
      'received',       //: requires review by airpair
      'waiting',        //: no experts available yet
      'review',         //: customer must review & choose one or more experts
      'booked',      //: one or more calls already scheduled
      'consumed',       //: feedback on all calls collected, but lead still warm for up-sell
      'complete',       //: transaction final and time to archive
      'canceled',       //: company has canceled the request
      'deferred',       //: customer indicated they need more time
      'junk',
      //v0
      'holding',        //: waiting for go ahead by customer
      'scheduling',     //: call needs to be scheduled
      'scheduled',      //: one or more calls already scheduled
      'incomplete',     //: more detail required
      'pending'        //: [bookme] customer put in request and expert has to confirm
    ]
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

  CHAT: {
    TYPE: ['im','group'],
    PROVIDER: ['slack']
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

  POST: {
    TEMPLATE: ['post','blank','landing','faq'],
    COMP: ['2015_q1']
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
