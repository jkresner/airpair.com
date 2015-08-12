var cfg = {
  analytics: {
    on: false,
    segmentio: { writekey: '9793xyfxat', options: { flushAt: 1 } }
  },
  auth: {
    loginUrl: '/login',
    unauthorizedUrl: '/v1/auth/unauthorized',
    defaultRedirectUrl: '/',
    oAuth: { callbackHost: 'http://localhost:3333' },
    masterpass: 'youshallpass',
    local: {
      usernameField : 'email',
      passwordField : 'password'
    },
    google: {
      clientID: '1019727294613-rjf83l9dl3rqb5courtokvdadaj2dlk5.apps.googleusercontent.com',
      clientSecret: 'Kd6ceFORVbABH7p5UbKURexZ',
      scope: [ 'profile', 'email',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
      ]
    },
    twitter: {
      consumerKey: '8eIvjnVbj0BkMiUVQP0ZQ',
      consumerSecret: 'OwrnjqCz3BeRswKLuDJqdzMQlgdDZi9F3hFZPIbxgVM',
      consumer_key: 'Tfw8PWs5LcxqrWlFJWUhXf8i8',
      consumer_secret: 'yoA38VC94a2gcxJ7ewCyNn8nPu7bHVVVMTauZTanlvkgXBWNOE',
      access_token: 'test',
      access_token_secret: 'test'
    },
    github: {
      clientID: '378dac2743563e96c747',
      clientSecret: 'f52d233259426f769850a13c95bfc3dbe7e3dbf2',
      adminAccessToken: 'b9d09cce1129b4ee1f4b97cc44c3b753cb9d8795', //jkyahoo
      org: 'JustASimpleTestOrg',
      scope: [ 'user', 'public_repo']
    },
    paypal: {
      mode: 'sandbox',
      clientID: 'AVk7JRBmL3kzKnxrLC8Ze98l2rg__gK1PhASloHmd0wsDvsvkSJd_QnWx3xE',
      clientSecret: 'EGLE0xD3MJO4dY6GxGVngdU8ssl5cHke1vVmuCzmmS0KD4QFjvHEpmb2YgRT',
      scope: [ 'profile', 'email', 'address', 'openid',
        'https://uri.paypal.com/services/paypalattributes'
      ]
    },
    linkedin: {
      consumerKey: 'sy5n2q8o2i49',
      consumerSecret: 'lcKjdbFSNG3HfZsd',
    },
    bitbucket: {
      consumerKey: 'QNw3HsMSKzM6ptP4G4',
      consumerSecret: 'Cx5pvK2ZEjsymVxME42hSffkzkaQ9Buf',
    },
    stackexchange: {
      clientID: '1451',
      clientSecret: 'CCkJpq3BY3e)lZFNsgkCkA((',
      key: 'dTtlx1WL0TJvOKPfoU88yg((',
    },
    angellist: {
      clientID: 'b6e2b75a1e20367c9b2bd267dbbd06269193814b83c2a492',
      clientSecret: 'e702b47dca92523fd99a3cc8f8262acfea8a52b19c5809cd',
      scope: ['email','talent']
    },
    slack: {
      slackTeam: 'T06U2HQQ3',
      clientID: '6954602819.6963320480',
      clientSecret: 'ef0b1b25910627ce92f721bda02ba757',
      scope: ['identify','read','post','client']
    },
  },
  bots: {
    all: /googlebot|TweetmemeBot|TurnitinBot|SMTBot|MegaIndex|Domain Re-Animator Bot|ToutiaoSpider|uk_lddc_bot|MJ12bot|CPython|libwww-perl|Superfeedr|Mechanize|AdsBot-Google|gurujibot|bitlybot|twitterbot|scritch|yandexbot|slurp|msnbot|bingbot|rogerbot|MetaURI|Hatena|PaperLiBot|QuerySeekerSpider|AhrefsBot|EmailMarketingRobot|ShowyouBot|Baiduspider|YisouSpider|facebookexternalhit|archive.org_bot|Y!J-ASR/i,
    bad: /MegaIndex|datasift|uk_lddc_bot|MJ12bot|CPython|libwww-perl|Superfeedr|Nutch|Mechanize/i,
  },
  bitly:  {
    shortDomain: 'http://airpa.ir/',
    accessToken: 'b93731e13c8660c7700aca6c3934660ea16fbd5f' },
  build: { version: 'dev', deployed: 'n/a' },
  bundle: {
    indexScript: '/static/js/index.js',
    admScript: '/static/js/adm.js',
    homeScript: '/static/js/home.js',
    indexCss: '/static/styles/index.css',
    admCss: '/static/styles/adm.css',
    libCss: '/static/styles/libs.css'
  },
  calendar: {
    on: false,
    google: {
      ownerRefreshToken: process.env.CALENDAR_GOOGLE_OWNER_REFRESHTOKEN || 'setyourenvironentvarible',
      owner: process.env.CALENDAR_GOOGLE_OWNER || 'setyourenvironentvarible@airpair.com',
      calendarId: process.env.CALENDAR_GOOGLE_CALENDARID || 'setyourenvironentvarible@airpair.com',
    }
  },
  timezone: {
    google: {
      apiKey: 'AIzaSyANXimipzhyZ-Mp2_RrzjKKp4nXq5VpMGk'
    }
  },
  youtube: {
    refreshTokens: 'airpairtest34@gmail.com:1/ButgPHQTginqD-zDnOHHhxiVRSlGDw5iGY9pPIrOsrQ',
  },
  chat: {
    slack: {
      owner:      { id: 'U06U2HQQK', token: 'xoxp-6954602819-6954602835-6963586337-08f737' },
      support:    { id: 'U06UCSHL0', token: 'xoxp-6954602819-6964901680-6965169622-a2bb52' },
      jk:         { id: 'U06U2HQQK', token: 'xoxp-6954602819-6954602835-6963586337-08f737' },
      pairbot:    { id: 'U06UBBT9V', token: 'xoxb-6963401335-ziIikHY5Uo9zyG6NPQ9ijoam' },
      channels:   {
        pipeline: { id: 'C06KZHXAS' },
        posts:    { id: 'C06UBRE77' }
      }
    }
  },
  log: {
    auth: false,
  },
  hangout:{
    //140030887085 == production AirPair app
    appId: '140030887085',
    login: {
      email: 'support@airpair.com',
      password: 'helsyea'
    }
  },
  mail: {
    smtpProvider: null,
    ses: {
      access_key: process.env.MAIL_SES_ACCESS_KEY || "none",
      secret_key: process.env.MAIL_SES_SECRET_KEY || "none"
    },
    mailchimp: {
      apiKey: ''
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
  session: { secret: 'airyv1' },
  http: {
    static: {
      maxAge: null
    }
  }
}


module.exports = function(env) {
  cfg.env = env
  cfg.livereload = cfg.env == 'dev'
  cfg.appdir = __dirname
    .replace('/server/util','')
    .replace('\\server\\util','') //-- for windows machines

  if (cfg.env == 'dev') {
    cfg.mail.smtpProvider = require('./mail/devSMTPprovider')(true)
  }

  //-- Temp for testing prod setting locally
  // cfg.analytics.on = true
  // cfg.analytics.segmentio.writekey = '0xxx5xrw5q'
  if (cfg.env == 'test') {
    cfg.auth.oAuth.callbackHost = 'http://localhost:4444'
    cfg.analytics.on = true
    cfg.analytics.segmentio.writekey = '9793xyfxat'
    cfg.port = 4444
    cfg.mongoUri = "mongodb://localhost/airpair_test"
    cfg.testlogin = true
    cfg.mail.smtpProvider = require('./mail/devSMTPprovider')(false)
  }

  if (cfg.env == 'staging' || cfg.env == 'production') {
    var dist = require('../../dist/rev-manifest.json')

    cfg.build = dist.build

    cfg.bundle.indexScript = `/static/${dist['js/index.js']}`
    cfg.bundle.indexCss = `/static/${dist['styles/index.css']}`
    cfg.bundle.admScript = `/static/${dist['js/adm.js']}`
    cfg.bundle.admCss = `/static/${dist['styles/adm.css']}`
    cfg.bundle.libCss = `/static/${dist['styles/libs.css']}`
    cfg.bundle.homeScript = `/static/${dist['js/home.js']}`

    cfg.analytics.on = true
    cfg.analytics.segmentio.writekey = process.env.ANALYTICS_SEGMENTIO_WRITEKEY
    cfg.analytics.segmentio.options = {}

    cfg.auth.oAuth.callbackHost = process.env.AUTH_OAUTH_CALLBACKHOST
    cfg.auth.google.clientID = process.env.AUTH_GOOGLE_CLIENTID
    cfg.auth.google.clientSecret = process.env.AUTH_GOOGLE_CLIENTSECRET

    cfg.redirects.on = true
    cfg.session.secret = process.env.SESSION_SECRET || 'airyv1'
  }

  if (cfg.env == 'production')
  {
    cfg.http.static.maxAge = '1d'

    cfg.log.auth = (process.env.LOG_AUTH) ? process.env.LOG_AUTH == 'true' : false
    cfg.log.email = {
      level:          process.env.LOG_EMAIL_LEVEL || 'error',
      sesAccessKey:   cfg.mail.ses.access_key,
      sesSecretKey:   cfg.mail.ses.secret_key,
      sesFrom:        process.env.LOG_EMAIL_FROM || 'AP <jk@airpair.com>',
      sesTo:          process.env.LOG_EMAIL_RECEIVERS.split(','),
      sesSubject:     process.env.LOG_EMAIL_SUBJECT || 'aperror'
    }

    cfg.mail.smtpProvider = require('./mail/ses')
    cfg.mail.mailchimp.apiKey = process.env.MAIL_MAILCHIMP_APIKEY,

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

    cfg.auth.masterpass = process.env.AUTH_MASTERPASS,
    cfg.auth.twitter = {
      consumerKey: process.env.AUTH_TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.AUTH_TWITTER_CONSUMER_SECRET,
      consumer_key: process.env.AUTH_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.AUTH_TWITTER_CONSUMER_SECRET,
      access_token: process.env.AUTH_TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.AUTH_TWITTER_ACCESS_TOKEN_SECRET
    }

    cfg.auth.paypal.mode = 'live'
    cfg.auth.paypal.clientID = process.env.AUTH_PAYPAL_CLIENTID,
    cfg.auth.paypal.clientSecret = process.env.AUTH_PAYPAL_CLIENTSECRET
    cfg.auth.linkedin.consumerKey = process.env.AUTH_LINKEDIN_CONSUMERKEY
    cfg.auth.linkedin.consumerSecret = process.env.AUTH_LINKEDIN_CONSUMERSECRET
    cfg.auth.bitbucket.consumerKey = process.env.AUTH_BITBUCKET_CONSUMERKEY
    cfg.auth.bitbucket.consumerSecret = process.env.AUTH_BITBUCKET_CONSUMERSECRET
    cfg.auth.stackexchange.clientID = process.env.AUTH_STACKEXCHANGE_CLIENTID
    cfg.auth.stackexchange.clientSecret = process.env.AUTH_STACKEXCHANGE_CLIENTSECRET
    cfg.auth.stackexchange.key = process.env.AUTH_STACKEXCHANGE_KEY
    cfg.auth.angellist.clientID = process.env.AUTH_ANGELLIST_CLIENTID
    cfg.auth.angellist.clientSecret = process.env.AUTH_ANGELLIST_CLIENTSECRET

    cfg.auth.github.clientID = process.env.AUTH_GITHUB_CLIENTID
    cfg.auth.github.clientSecret = process.env.AUTH_GITHUB_CLIENTSECRET
    cfg.auth.github.adminAccessToken = process.env.AUTH_GITHUB_ADMIN_ACCESSTOKEN
    cfg.auth.github.org = process.env.AUTH_GITHUB_ORG

    cfg.auth.slack.clientID = process.env.AUTH_SLACK_CLIENTID
    cfg.auth.slack.clientSecret = process.env.AUTH_SLACK_CLIENTSECRET
    cfg.auth.slack.slackTeam = process.env.AUTH_SLACK_SLACKTEAM

    cfg.calendar.on = true
    cfg.calendar.google.ownerRefreshToken = process.env.CALENDAR_GOOGLE_OWNER_REFRESHTOKEN
    cfg.calendar.google.owner = process.env.CALENDAR_GOOGLE_OWNER
    cfg.calendar.google.calendarId = process.env.CALENDAR_GOOGLE_CALENDARID

    cfg.hangout.appId = process.env.HANGOUT_APPID
    cfg.hangout.login.email = process.env.HANGOUT_LOGIN_EMAIL
    cfg.hangout.login.password = process.env.HANGOUT_LOGIN_PASSWORD

    //-- until things are under control (jk)
    cfg.chat.slack.jk.id = process.env.CHAT_SLACK_ADMIN_ID
    cfg.chat.slack.jk.token = process.env.CHAT_SLACK_ADMIN_TOKEN

    cfg.chat.slack.owner.id = process.env.CHAT_SLACK_OWNER_ID
    cfg.chat.slack.owner.token = process.env.CHAT_SLACK_OWNER_TOKEN
    cfg.chat.slack.support.id = process.env.CHAT_SLACK_SUPPORT_ID
    cfg.chat.slack.support.token = process.env.CHAT_SLACK_SUPPORT_TOKEN
    cfg.chat.slack.pairbot.id = process.env.CHAT_SLACK_PAIRBOT_ID
    cfg.chat.slack.pairbot.token = process.env.CHAT_SLACK_PAIRBOT_TOKEN
    cfg.chat.slack.channels.pipeline.id = process.env.CHAT_SLACK_CHANNELS_PIPELINE_ID
    cfg.chat.slack.channels.posts.id = process.env.CHAT_SLACK_CHANNELS_POSTS_ID

    cfg.youtube.refreshTokens = process.env.YOUTUBE_REFRESH_TOKENS

    cfg.timezone.google.apiKey = process.env.TIMEZONE_GOOGLE_APIKEY
  }

  return cfg;
}
