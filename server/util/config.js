var cfg = {
  ads: {
    on:                   true,
    staticDir:            '/static/img/ads'                          },
  analytics: {
    on:                   true,
    mongoUrl:             'mongodb://localhost/airpair_analytics'
  },
  auth: {
    loginUrl:             '/login',
    unauthorizedUrl:      '/v1/auth/unauthorized',
    defaultRedirectUrl:   '/',
    oauth: {
      appKey:             'apcom',
      callbackHost:       'http://localhost:3333',
      github: {
        emails: {
          hostname:         'api.github.com',
          path:             '/user/emails',
          headers:          { 'User-Agent': 'airpair.com' }
        }
      }
    },
    masterpass:           'youshallpass',
    local: {
      passReqToCallback:  true,
      usernameField:      'email',
      passwordField:      'password'
    },
    password: {
      resetSalt:          '$2a$08$Qn0unnOa4XH0pN.IRZHB4u'
    },
    github: {
      short: 'gh',
      login: true,
      signup: true,
      clientID: '378dac2743563e96c747',
      clientSecret: 'f52d233259426f769850a13c95bfc3dbe7e3dbf2',
      adminAccessToken: 'b9d09cce1129b4ee1f4b97cc44c3b753cb9d8795', //jkyahoo
      org: 'JustASimpleTestOrg',
      scope: [ 'user' ]                                             },
      //, 'public_repo'
    google: {
      short: 'gp',
      login: true,
      signup: true,
      clientID: '1019727294613-rjf83l9dl3rqb5courtokvdadaj2dlk5.apps.googleusercontent.com',
      clientSecret: 'Kd6ceFORVbABH7p5UbKURexZ',
      scope: [ 'profile', 'email',
        'https://www.googleapis.com/auth/plus.profile.emails.read']        },
    twitter: {
      short: 'tw',
      consumerKey: 'Tfw8PWs5LcxqrWlFJWUhXf8i8',
      consumerSecret: 'yoA38VC94a2gcxJ7ewCyNn8nPu7bHVVVMTauZTanlvkgXBWNOE' },
    paypal: {
      mode: 'sandbox',
      clientID: 'AVk7JRBmL3kzKnxrLC8Ze98l2rg__gK1PhASloHmd0wsDvsvkSJd_QnWx3xE',
      clientSecret: 'EGLE0xD3MJO4dY6GxGVngdU8ssl5cHke1vVmuCzmmS0KD4QFjvHEpmb2YgRT',
      scope: [ 'profile', 'email', 'address', 'openid',
        'https://uri.paypal.com/services/paypalattributes']                },
    linkedin: {
      short: 'in',
      consumerKey: 'sy5n2q8o2i49',
      consumerSecret: 'lcKjdbFSNG3HfZsd'                                   },
    bitbucket: {
      short: 'bb',
      consumerKey: 'QNw3HsMSKzM6ptP4G4',
      consumerSecret: 'Cx5pvK2ZEjsymVxME42hSffkzkaQ9Buf'                   },
    stackexchange: {
      short: 'so',
      clientID: '1451',
      clientSecret: 'CCkJpq3BY3e)lZFNsgkCkA((',
      key: 'dTtlx1WL0TJvOKPfoU88yg((',
      scope: []
    },
    angellist: {
      short: 'al',
      clientID: 'b6e2b75a1e20367c9b2bd267dbbd06269193814b83c2a492',
      clientSecret: 'e702b47dca92523fd99a3cc8f8262acfea8a52b19c5809cd',
      scope: ['email','talent']                                            },
    slack: {
      short: 'sl',
      team: 'T06U2HQQ3',
      clientID: '6954602819.6963320480',
      clientSecret: 'ef0b1b25910627ce92f721bda02ba757',
      scope: ['identify','read','post','client']                           },
  },
  bots: {
    all: /googlebot|TweetmemeBot|TurnitinBot|SMTBot|MegaIndex|Domain Re-Animator Bot|ToutiaoSpider|uk_lddc_bot|MJ12bot|CPython|libwww-perl|Superfeedr|Mechanize|AdsBot-Google|gurujibot|bitlybot|twitterbot|scritch|yandexbot|slurp|msnbot|bingbot|rogerbot|MetaURI|Hatena|PaperLiBot|QuerySeekerSpider|AhrefsBot|EmailMarketingRobot|ShowyouBot|Baiduspider|YisouSpider|facebookexternalhit|archive.org_bot|Y!J-ASR/i,
    bad: /MegaIndex|datasift|uk_lddc_bot|MJ12bot|CPython|libwww-perl|Superfeedr|Nutch|Mechanize/i,
  },
  bitly:  {
    shortDomain: 'http://airpa.ir/',
    accessToken: 'b93731e13c8660c7700aca6c3934660ea16fbd5f'               },
  build: { version: 'dev', deployed: 'n/a' },
  bundle: {
    indexScript: '/static/js/index.js',
    admScript: '/static/js/adm.js',
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
  chat: {
    slackin:      { host: 'http://slackin.airpair.com' },
    slack: {
      owner:      { id: 'U06U2HQQK', token: 'xoxp-6954602819-6954602835-7019593206-19f426' },
      support:    { id: 'U06UCSHL0', token: 'xoxp-6954602819-6964901680-6965169622-a2bb52' },
      jk:         { id: 'U06U2HQQK', token: 'xoxp-6954602819-6954602835-7019593206-19f426' },
      pairbot:    { id: 'U06UBBT9V', token: 'xoxb-6963401335-ziIikHY5Uo9zyG6NPQ9ijoam' },
      channels:   {
        pipeline: { id: 'C06KZHXAS' },
        posts:    { id: 'C06UBRE77' } } }
  },
  hangout:{
    appId: '140030887085', //140030887085 == production AirPair app
    login: { email: 'support@airpair.com', password: 'helsyea' }
  },
  http: {
    static:               { dir: 'public', maxAge: null },
    sessionStore: {
      autoReconnect:      true,
      collection:         'v1sessions'
    }
  },
  log: {
    ads:                  process.env.LOG_ADS || false,
    auth:                 process.env.LOG_AUTH || false,
    mail:                 process.env.LOG_MAIL || false,
    redirects:            process.env.LOG_REDIRECTS || false,
    error:                { email: null },
  },
  mail: {
    sender: {
      ap: 'AP <team@airpair.com>',  //-- admin / sys
      jk: 'Jonathon Kresner <team@airpair.com>',
      team: 'AirPair <team@airpair.com>',
      pairbot: 'Pairbot <team@airpair.com>' },
    mailchimp: { apiKey: '' },
    transport: {
      default: 'stub',
      ses: { accessKeyId: '', secretAccessKey: '' },
      smtp: { service: '', auth: { user: '', pass: '' } }
    },
  },
  mongoUrl: 'mongodb://localhost/airpair_dev',
  payments: {
    braintree: {
      environment: 'Sandbox',
      verifyCards: false,
      merchantId: 'chkr49r8yxk5y65p',
      publicKey: '3pwpby7rrfdr3x3m',
      privateKey: '7d5586d4be9ba9e36daebfa814f0584a'                  },
    stripe: {
      publishedKey: 'pk_test_aj305u5jk2uN1hrDQWdH0eyl',
      secretKey: 'sk_test_8WOe71OlRWPyB3rDRcnthSCc'                   }
  },
  port:     process.env.PORT || 3333,
  redirects: { on: false },
  share: {
    tw: { access_token: 'test', access_token_secret: 'test' },
  },
  session: { secret: 'airyv1' },
  timezone: { google: { apiKey: 'AIzaSyANXimipzhyZ-Mp2_RrzjKKp4nXq5VpMGk' } },
  youtube: {
    refreshTokens: 'airpairtest34@gmail.com:1/ButgPHQTginqD-zDnOHHhxiVRSlGDw5iGY9pPIrOsrQ',
  },
}


module.exports = function(env) {

  cfg.env = env
  cfg.livereload = cfg.env == 'dev'
  cfg.appdir = __dirname
    .replace('/server/util','')
    .replace('\\server\\util','') //-- for windows machines

  if (env == 'dev') {
    cfg.log.mail = true
  }

  //-- Temp for testing prod setting locally
  if (env == 'test') {
    cfg.ads.on = false
    cfg.analytics.on = true
    cfg.analytics.mongoUrl = 'mongodb://localhost/airpair_test'
    cfg.auth.oauth.callbackHost = 'http://localhost:4444'
    cfg.port = 4444
    cfg.mongoUrl = "mongodb://localhost/airpair_test"
    cfg.testlogin = true
    cfg.log.mail = false
    cfg.http.sessionStore.collection = 'sessions'
  }

  if (env == 'staging' || env == 'production') {
    var dist = require('../../dist/rev-manifest.json')
    cfg.http.static.maxAge = '1d'
    cfg.http.static.dir = `dist`

    cfg.analytics.on = true
    cfg.analytics.mongoUrl = process.env.ANALYTICS_MONGOURL
    cfg.mongoUrl = process.env.MONGOURL

    cfg.auth.masterpass = process.env.AUTH_MASTERPASS,
    cfg.auth.oauth.callbackHost = process.env.AUTH_OAUTH_CALLBACKHOST
    cfg.auth.google.clientID = process.env.AUTH_GOOGLE_CLIENTID
    cfg.auth.google.clientSecret = process.env.AUTH_GOOGLE_CLIENTSECRET

    cfg.auth.twitter.consumerKey = process.env.AUTH_TWITTER_CONSUMER_KEY,
    cfg.auth.twitter.consumerSecret = process.env.AUTH_TWITTER_CONSUMER_SECRET

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
    cfg.auth.slack.team = process.env.AUTH_SLACK_SLACKTEAM

    cfg.build = dist.build
    cfg.bundle.indexScript = `/static/${dist['js/index.js']}`
    cfg.bundle.indexCss = `/static/${dist['styles/index.css']}`
    cfg.bundle.admScript = `/static/${dist['js/adm.js']}`
    cfg.bundle.admCss = `/static/${dist['styles/adm.css']}`
    cfg.bundle.libCss = `/static/${dist['styles/libs.css']}`


    cfg.redirects.on = true
    cfg.session.secret = process.env.SESSION_SECRET

    cfg.log.mail = true
    cfg.log.error.email = {
      from:        process.env.LOG_EMAIL_FROM || 'ERR <team@airpair.com>',
      to:          process.env.LOG_EMAIL_RECEIVERS.split(','),
      subject:     process.env.LOG_EMAIL_SUBJECT || '{ERROR}'
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

    cfg.calendar.on = true
    cfg.calendar.google.ownerRefreshToken = process.env.CALENDAR_GOOGLE_OWNER_REFRESHTOKEN
    cfg.calendar.google.owner = process.env.CALENDAR_GOOGLE_OWNER
    cfg.calendar.google.calendarId = process.env.CALENDAR_GOOGLE_CALENDARID

    cfg.hangout.appId = process.env.HANGOUT_APPID
    cfg.hangout.login.email = process.env.HANGOUT_LOGIN_EMAIL
    cfg.hangout.login.password = process.env.HANGOUT_LOGIN_PASSWORD

    //-- until things are under control (jk)
    cfg.chat.slackin.host = 'https://slackin.airpair.com'
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

    cfg.mail.mailchimp.apiKey = process.env.MAIL_MAILCHIMP_APIKEY,
    cfg.mail.transport.default = process.env.MAIL_TRANSPORT_DEFAULT
    cfg.mail.transport.ses.accessKeyId = process.env.MAIL_TRANSPORT_SES_ACCESSKEYID
    cfg.mail.transport.ses.secretAccessKey = process.env.MAIL_TRANSPORT_SES_SECRETKEY
    cfg.mail.transport.smtp.service = process.env.MAIL_TRANSPORT_SMTP_SERVICE
    cfg.mail.transport.smtp.auth.user = process.env.MAIL_TRANSPORT_SMTP_AUTHUSER
    cfg.mail.transport.smtp.auth.pass = process.env.MAIL_TRANSPORT_SMTP_AUTHPASS

    cfg.timezone.google.apiKey = process.env.TIMEZONE_GOOGLE_APIKEY
    cfg.youtube.refreshTokens = process.env.YOUTUBE_REFRESH_TOKENS

    cfg.share.tw.access_token = process.env.AUTH_TWITTER_ACCESS_TOKEN,
    cfg.share.tw.access_token_secret = process.env.AUTH_TWITTER_ACCESS_TOKEN_SECRET
  }

  cfg.share.tw.consumer_key  = cfg.auth.twitter.consumerKey
  cfg.share.tw.consumer_secret = cfg.auth.twitter.consumerSecret

  cfg.http.appStaticDir = `${cfg.appdir}/${cfg.http.static.dir}`
  cfg.ads.staticDir = `${cfg.appdir}/public/${cfg.ads.staticDir}`

  //v2 temp settings
  cfg.appModelDir = `${cfg.appdir}/server/model`

  return cfg;
}
