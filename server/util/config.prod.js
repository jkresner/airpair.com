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
    unauthorizedUrl:      '/unauthorized',
    defaultRedirectUrl:   '/',
    oauth: {
      appKey:             'apcom',
      callbackHost:       'http://localhost:3333' },
    masterpass:           'youshallpass',
    local: {
      passReqToCallback:  true,
      usernameField:      'email',
      passwordField:      'password'
    },
    password: {
      resetSalt:          '$2a$08$Qn0unnOa4XH0pN.IRZHB4u'
    },
    google: {
      login: true,
      signup: true,
      short: 'gp',
      clientID: '140030887085-c7ffv2q96gc56ejmnbpsp433anvqaukf.apps.googleusercontent.com',
      clientSecret: '1iB16yFbTgF4iJ3kB7C1lUwj',
      scope: [ 'profile', 'email',
        'https://www.googleapis.com/auth/plus.profile.emails.read']        },
    twitter: {
      short: 'tw',
      consumerKey: '',
      consumerSecret: '' },
    github: {
      short: 'gh',
      clientID: '',
      clientSecret: '',
      adminAccessToken: '', //jkyahoo
      org: '',
      scope: [ 'user' ]                                             },
      //, 'public_repo'
    paypal: {
      mode: 'live',
      clientID: 'EF8UrxDIY-WXj0t2IJcZwC4atSd-p9YaoxrpaDe-xtGLBxuUZRKKHdSSAohs',
      clientSecret: '',
      scope: [ 'profile', 'email', 'address', 'openid',
        'https://uri.paypal.com/services/paypalattributes']                },
    linkedin: {
      short: 'in',
      consumerKey: '',
      consumerSecret: ''                                   },
    bitbucket: {
      short: 'bb',
      consumerKey: '',
      consumerSecret: ''                   },
    stackexchange: {
      short: 'so',
      clientID: '',
      clientSecret: '',
      key: ''                                      },
    angellist: {
      short: 'al',
      clientID: '',
      clientSecret: '',
      scope: ['email','talent']                                            },
    slack: {
      short: 'sl',
      team: 'T02ATFDPL',
      clientID: '2367523802.6058607536',
      clientSecret: '02c808589fe7509cdcc2d458af63948a',
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
      ownerRefreshToken: '1/KnuiUHQhLIfCmMgL3uSkfAUnqCkSJpfmSlCtOonZJ2U',
      owner: 'team@airpair',
      calendarId: 'airpair.co_19t01n0gd6g7548k38pd3m5bm0@group.calendar.google.com',
    }
  },
  chat: {
    slackin:      { host: 'http://slackin.airpair.com' },
    slack: {
      owner:      { id: 'U02ASLW2Z', token: 'xoxp-2367523802-2367523804-11049525957-367b77b228' },
      support:    { id: 'U06UD6SES', token: 'xoxp-2367523802-6965230502-7019618566-08a8f0' },
      jk:         { id: 'U02ASLW2Z', token: 'xoxp-2367523802-2366710101-6062466245-08c388' },
      pairbot:    { id: 'U061TMK98', token: 'xoxb-6061733314-KGswXDnCCRZoLiNuIxxMFxTF' },
      channels:   {
        pipeline: { id: 'G03KMNM5N' },
        posts:    { id: 'C04UTP71U' } } }
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

  mail: {
    sender: {
      ap: 'AP <team@airpair.com>',  //-- admin / sys
      jk: 'Jonathon Kresner <team@airpair.com>',
      team: 'AirPair <team@airpair.com>',
      pairbot: 'Pairbot <team@airpair.com>' },
    mailchimp: { apiKey: 'b888ee9284cd0d57f425867c0bde3fe0-us7' },
    transport: {
      default: 'ses',
      ses: { accessKeyId: 'AKIAJBD6AXFQDTUIPQ6A', secretAccessKey: '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' },
      smtp: { service: 'Gmail', auth: { user: 'team@airpair.com', pass: 'UX6BbgZg' } }
    },
  },
  mongoUrl: 'mongodb://heroku:PQDUBfuFXxtCHT-LpObnI_pS_nx7bEzs2vGtbP3pqxhZUeMGo1p7WXwAYLK9RqhiqD6ftG9-zmQ1CVWnWqeTEQ@candidate.14.mongolayer.com:10507/app33053049',
  payments: {
    braintree: {
      environment: '',
      verifyCards: false,
      merchantId: '',
      publicKey: '',
      privateKey: ''                  },
    stripe: {
      publishedKey: '',
      secretKey: ''                   }
  },
  port:     process.env.PORT || 3333,
  redirects: { on: true },
  share: {
    tw: { access_token: 'test', access_token_secret: 'test' },
  },
  session: { secret: 'airyv1' },
  timezone: { google: { apiKey: 'AIzaSyANXimipzhyZ-Mp2_RrzjKKp4nXq5VpMGk' } },
  youtube: {
    refreshTokens: 'team@airpair.com:1/KnuiUHQhLIfCmMgL3uSkfAUnqCkSJpfmSlCtOonZJ2U::experts@airpair.com:1/C8qjEkXQ7YZug-63UsViQ-asvNUrCQEB6qeR5MA0YCMMEudVrK5jSpoR30zcRFq6',
  },
}

