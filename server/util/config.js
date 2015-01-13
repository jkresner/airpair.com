var cfg = {
  analytics: {
    on: false,
    segmentio: { writekey: '9793xyfxat', options: { flushAt: 1 } }
  },
  auth: {
    loginUrl: '/v1/auth/login',
    unauthorizedUrl: '/v1/auth/unauthorized',
    defaultRedirectUrl: '/v1',
    oAuth: { callbackHost: 'http://localhost:3333' },
    local: {
      usernameField : 'email',
      passwordField : 'password'
    },
    firebase: {
      url: 'https://airpair-chat-dev.firebaseio.com/',
      secret: 'BKE9PP6DP4k06Es10nD6Rvh9443Fz7XBstb6fg54'
    },
    google: {
      clientID: '1019727294613-rjf83l9dl3rqb5courtokvdadaj2dlk5.apps.googleusercontent.com',
      clientSecret: 'Kd6ceFORVbABH7p5UbKURexZ',
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
      ]
    },
    twitter: {
      consumer_key: 'Tfw8PWs5LcxqrWlFJWUhXf8i8',
      consumer_secret: 'yoA38VC94a2gcxJ7ewCyNn8nPu7bHVVVMTauZTanlvkgXBWNOE',
      access_token: 'test',
      access_token_secret: 'test'
    },
    paypal: {
      mode: 'sandbox',
      clientID: 'AVk7JRBmL3kzKnxrLC8Ze98l2rg__gK1PhASloHmd0wsDvsvkSJd_QnWx3xE',
      clientSecret: 'EGLE0xD3MJO4dY6GxGVngdU8ssl5cHke1vVmuCzmmS0KD4QFjvHEpmb2YgRT',
      scope: [
        'https://uri.paypal.com/services/paypalattributes',
        'profile',
        'email',
        'address',
        'openid'
      ]
    }
  },
  bitly:  {
    shortDomain: 'http://airpa.ir/',
    accessToken: 'b93731e13c8660c7700aca6c3934660ea16fbd5f' },
  build:  { version: '1.09', deployed: 'Oct 17' },
  bundle: {
    indexScript: '/static/js/index.js',
    admScript: '/static/js/adm.js',
    homeScript: '/static/js/home.js',
    indexCss: '/static/styles/index.css',
    admCss: '/static/styles/adm.css',
    libCss: '/styles/libs.css'
  },
  calendar: {
    on: true,
    google: {
    }
  },
  chat: {
    on: false,
  },
  log: {},
  mail: {
    on: false, // we don't send mail in dev
    ses: {
      access_key: process.env.MAIL_SES_ACCESS_KEY || "none",
      secret_key: process.env.MAIL_SES_SECRET_KEY || "none"
    }
  },
  mongoUri: process.env.MONGOHQ_URL || "mongodb://localhost/airpair_dev",
  port:     process.env.PORT || 3333,
  payments: {
    braintree: {
      environment: 'Sandbox',
      verifyCards: false,
      merchantId: 'chkr49r8yxk5y65p',
      publicKey: '3pwpby7rrfdr3x3m',
      privateKey: '7d5586d4be9ba9e36daebfa814f0584a'
    },
    stripe: {
      publishedKey: 'pk_test_aj305u5jk2uN1hrDQWdH0eyl',
      secretKey: 'sk_test_8WOe71OlRWPyB3rDRcnthSCc'
    }
  },
  redirects: { on: false },
  session: { secret: 'airyv1' }
}

module.exports = function(env, appdir) {
  cfg.env = env
  cfg.appdir = appdir
  cfg.livereload = cfg.env == 'dev'

  //-- Temp for testing prod setting locally
  // cfg.analytics.on = true
  // cfg.analytics.segmentio. writekey = '0xxx5xrw5q'

  if (cfg.env == 'test') {
    cfg.mail.on = false   // always leave this off
    cfg.analytics.on = true
    cfg.analytics.segmentio.writekey = '9793xyfxat'
    cfg.port = 4444
    cfg.mongoUri = "mongodb://localhost/airpair_test"
    cfg.testlogin = true
    cfg.auth.oAuth.callbackHost = 'http://localhost:4444'
  }

  if (cfg.env == 'staging' || cfg.env == 'production') {
    var dist = require('../../dist/rev-manifest.json')
    cfg.bundle.indexScript = `/static/${dist['js/index.js']}`
    cfg.bundle.indexCss = `/static/${dist['styles/index.css']}`
    cfg.bundle.admScript = `/static/${dist['js/adm.js']}`
    cfg.bundle.admCss = `/static/${dist['styles/adm.css']}`
    cfg.bundle.libCss = `/static/${dist['styles/libs.css']}`
    cfg.bundle.homeScript = `/static/${dist['js/home.js']}`
    cfg.mail.on = true
    cfg.analytics.on = true
    cfg.analytics.segmentio.writekey = process.env.ANALYTICS_SEGMENTIO_WRITEKEY
    cfg.analytics.segmentio.options = {}

    cfg.auth.oAuth.callbackHost = process.env.AUTH_OAUTH_CALLBACKHOST
    cfg.auth.google.clientID = process.env.AUTH_GOOGLE_CLIENTID
    cfg.auth.google.clientSecret = process.env.AUTH_GOOGLE_CLIENTSECRET

    cfg.redirects.on = true
    cfg.session.secret = process.env.SESSION_SECRET || 'airyv1'
  }

  if (cfg.env == 'production') {
    cfg.log.email = {
      level:          process.env.LOG_EMAIL_LEVEL || 'error',
      sesAccessKey:   cfg.mail.ses.access_key,
      sesSecretKey:   cfg.mail.ses.secret_key,
      sesFrom:        process.env.LOG_EMAIL_FROM || 'AP <jk@airpair.com>',
      sesTo:          process.env.LOG_EMAIL_RECEIVERS.split(','),
      sesSubject:     process.env.LOG_EMAIL_SUBJECT || 'aperror'
    }

    cfg.payments.stripe = {
      publishedKey: process.env.PAYMENTS_STRIPE_PUBLISHEDKEY,
      secretKey: process.env.PAYMENTS_STRIPE_SECRETKEY
    }
    cfg.payments.braintree = {
      environment: 'Production',
      verifyCards: false,
      merchantId: process.env.PAYMENTS_BRAINTREE_MERCHANTID,
      publicKey: process.env.PAYMENTS_BRAINTREE_PUBLICKEY,
      privateKey: process.env.PAYMENTS_BRAINTREE_PRIVATEKEY,
    }

    cfg.auth.twitter = {
      consumer_key: process.env.AUTH_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.AUTH_TWITTER_CONSUMER_SECRET,
      access_token: process.env.AUTH_TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.AUTH_TWITTER_ACCESS_TOKEN_SECRET
    }
    
    cfg.auth.firebase = {
      url: process.env.FIRBEASE_URL,
      secret: process.env.FIREBASE_SECRET
    };

    cfg.auth.paypal.mode = 'live'
    cfg.auth.paypal.clientID = process.env.AUTH_PAYPAL_CLIENTID,
    cfg.auth.paypal.clientSecret = process.env.AUTH_PAYPAL_CLIENTSECRET

    cfg.calendar.on = true
    cfg.calendar.google.clientId = process.env.CALENDAR_GOOGLE_CLIENTID
    cfg.calendar.google.clientSecret = process.env.CALENDAR_GOOGLE_CLIENTSECRET
    cfg.calendar.google.calendarId = process.env.CALENDAR_GOOGLE_CALENDARID
    cfg.calendar.google.access_token = process.env.CALENDAR_GOOGLE_ACCESS_TOKEN
  }

  if (cfg.calendar.on){
    // example AUTH_GOOGLE_REFRESH_TOKEN
    // "mike@madeye.io:1/eljaJDHqLRqI5z81h3PcAeFOG9Te2f7OAQhPkX8azRAMEudVrK5jSpoR30zcRFq6"
    var refreshTokenUsersString = process.env.AUTH_GOOGLE_REFRESH_TOKEN;
    cfg.auth.google.refreshTokenUsers = [];
    cfg.auth.google.refreshTokens = {};
    for (var pair of refreshTokenUsersString.split('::'))
    {
      var email = pair.split(":")[0];
      var token = pair.split(":")[1];
      cfg.auth.google.refreshTokens[email] = token;
      cfg.auth.google.refreshTokenUsers.push(email);
    }
    cfg.calendar.google.calendarId = cfg.auth.google.refreshTokenUsers[0];
  }
  return cfg;
}
