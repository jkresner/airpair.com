"""
  coffee cmd/tools/farmer/run.coffee
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
  rId: "562333ba5bd2641100d20aaa"
  tagSlug: "tesseract"
  tagName: "Tesseract"
  hrRate: "190"
  problemDescription: "configure tesseract to read driver license images from 50 indian states."
  customerName: "Nikhil Sama"
  experts: [
    { n: '', e: '', so: ''}
    { n: '', e: '', so: ''}
    { n: '', e: '', so: ''}
    { n: '', e: '', so: ''}
    { n: '', e: '', so: ''}
    { n: '', e: '', so: ''}
    { n: '', e: '', so: ''}
    { n: '', e: '', so: ''}
    { n: '', e: '', so: ''}
  ]


describe 'Farmer: ', ->

  @timeout(4000000)


  before (done) ->
    setup.initGlobals(config)
    global.app = require('../../server/app').run(config, done)


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
