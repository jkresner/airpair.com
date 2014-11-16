var cfg = {
  build:  { version: '1.09', deployed: 'Oct 17' },
  port:     process.env.PORT || 3333,
  mongoUri: process.env.MONGOHQ_URL || "mongodb://localhost/airpair_dev",
  session: { secret: 'airyv1' },
  analytics: {
		on: false,
		segmentio: { writekey: '9793xyfxat' }
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
    google: {
      clientID: '1019727294613-rjf83l9dl3rqb5courtokvdadaj2dlk5.apps.googleusercontent.com',
      clientSecret: 'Kd6ceFORVbABH7p5UbKURexZ',
      scope: [
      	'profile',
      	'email',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
      ]
    }
  },
  bundle: {
    indexScript: '/v1/js/index.js',
    indexCss: '/v1/styles/index.css',
    libCss: '/styles/libs.css'
  },
  log: {},
  mail: {
  	on: false, // we don't send mail in dev
    ses: {
      access_key: process.env.MAIL_SES_ACCESS_KEY || "none",
      secret_key: process.env.MAIL_SES_SECRET_KEY || "none"
    }
  },
  payments: {
  	braintree: {
  		environment: 'Sandbox',
  		verifyCards: false,
  		merchantId: 'chkr49r8yxk5y65p',
  		publicKey: '3pwpby7rrfdr3x3m',
  		privateKey: '7d5586d4be9ba9e36daebfa814f0584a'
  	}
  },
  redirects: { on: false }
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
    cfg.analytics.segmentio. writekey = '9793xyfxat'
    cfg.port = 4444
    cfg.mongoUri = "mongodb://localhost/airpair_test"
    cfg.testlogin = true
    cfg.auth.oAuth.callbackHost = 'http://localhost:4444'
  }

  if (cfg.env == 'staging' || cfg.env == 'production') {
    var dist = require('../../dist/rev-manifest.json')
    cfg.bundle.indexScript = `/v1/${dist['js/index.js']}`
    cfg.bundle.indexCss = `/v1/${dist['styles/index.css']}`
    cfg.bundle.libCss = `/v1/${dist['styles/libs.css']}`
    cfg.mail.on = true
    cfg.analytics.on = true
    cfg.analytics.segmentio.writekey = process.env.ANALYTICS_SEGMENTIO_WRITEKEY

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
      sesFrom:        process.env.LOG_EMAIL_FROM || '<jk@airpair.com>',
      sesTo:          process.env.LOG_EMAIL_RECEIVERS.split(','),
      sesSubject:     process.env.LOG_EMAIL_SUBJECT || 'aperror'
    }
  }

  return cfg;
}
