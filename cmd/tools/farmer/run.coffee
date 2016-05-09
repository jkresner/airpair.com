"""
  mocha --compilers coffee:coffee-script/register cmd/tools/farmer/run.coffee
"""

setup = require('../../../server/util/_setup')
setup.colors.APPLOAD = setup.colors.white
setup.colors.setTheme({appload: 'APPLOAD'})
global.config = setup.initConfig('test')
config.mongoUrl = 'mongodb://localhost/airpair_dev'
  # mongoUrl: 'mongodb://localhost/meanair-auth-migrate'
config.mail =
  sender:
    jk: 'Jonathon Kresner <team@airpair.com>',
    ap: 'AP <team@airpair.com>',
    team: 'AirPair <team@airpair.com>',
    pairbot: 'Pairbot <pairbot@airpair.com>'
  transport:
    default: 'smtp'
    ses:
      access_key: "AKIAJBD6AXFQDTUIPQ6A",
      secret_key: "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"
    smtp:
      service: 'Gmail',
      auth: { user: 'team@airpair.com', pass: 'UX6BbgZg' }


outReach =
  rId: "566981e222649211006d1bdc"
  tagSlug: "propel"
  tagName: "Propel"
  hrRate: "180"
  problemDescription: "refactoring a WordPress Multisite using Propel."
  customerName: "Lakeshore RV"
  experts: [
    { n: 'William Durand', e: 'will@drnd.me', so: '636505/william-durand' }
    { n: 'Jan Fabry', e: 'jan.fabry@monkeyman.be', so: '74619/jan-fabry' }
    { n: 'Jon', e: 'jonblog.20111018.ws@jondh.me.uk', so: '472495/halfer' }
    { n: 'Gabor de Mooij', e: 'gabor@redbeanphp.com', so: '237628/gabor-de-mooij' }
    { n: 'Sebastian Krebs', e: 'krebs@kingcrunch.de', so: '421223/kingcrunch' }
  ]


describe 'Farmer: ', ->

  @timeout(4000000)


  before (done) ->
    setup.initGlobals(config)
    global.app = require('../../../server/app').run(config, done)


  it 'Send all outReach', (done) ->
    $log('running test')
    sent = 0
    toSend = outReach.experts.length
    isDone = (e, r) ->
      $log("sent #{++sent}/#{toSend}".green, e)
      done() if sent == toSend

    dat = _.omit(outReach,'experts')
    for exp in outReach.experts
      tmplData = _.extend({firstName:exp.f||util.firstName(exp.n)},dat)
      mailman.sendTemplate('expert-farm', tmplData, {email:exp.e,name:exp.n}, isDone)
