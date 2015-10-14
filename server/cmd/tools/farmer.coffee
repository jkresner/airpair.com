"""
  mocha server/cmd/tools/farmer.coffee
"""

require('../../../test/server/setup/flavor')

{initGlobals,initConfig,colors} = require('../../util/_setup')
colors.APPLOAD = colors.white
colors.setTheme({
  appload: 'APPLOAD'
})

initGlobals(initConfig('prod'))

global.config.mongoUrl = "mongodb://localhost/airpair_dev"
global.config.mail =
  sender:
    jk: 'Jonathon Kresner <team@airpair.com>',
    ap: 'AP <team@airpair.com>',
    team: 'AirPair <team@airpair.com>',
    pairbot: 'Pairbot <pairbot@airpair.com>'
  mailchimp: { apiKey: '' },
  transport:
    default: 'smtp'
    ses: {
      access_key: "AKIAJBD6AXFQDTUIPQ6A",
      secret_key: "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"
    }
    smtp: {
      service: 'Gmail',
      auth: { user: 'team@airpair.com', pass: 'UX6BbgZg' }
    }


# Here's me mentoring on Backbone.js recently: http://youtu.be/QFszSx8vgEA
outReach =
  rId: "55ce0f9bdcb9e91100e834bb"
  tagSlug: "swagger"
  tagName: "Swagger"
  hrRate: "120"
  problemDescription: "on incorporating swagger into a codebase"
  customerName: "Karen Adkins"
  experts: [
    { n: 'Will Oemler', e: 'willoemler@gmail.com', so: '1458983/willoem' }
    { n: 'Mohsen Azimi', e: 'me@azimi.me', so: '650722/mohsen' }
    { n: 'Adam Clark', e: 'adamclerk@gmail.com', so: '201766/adamclerk' }
    { n: 'Marty Pitt', e: 'martypitt@me.com', so: '59015/marty-pitt' }
    { n: 'Mike Mertsock', e: 'mmertsock@trackabout.com', so: '795339/esker' }
  ]

describe 'Farmer: ', ->

  @timeout(4000000)

  before (done) ->
    global.app = require('../../../index').run(done)


  it 'Send all outReach', (done) ->
    sent = 0
    toSend = outReach.experts.length
    isDone = (e, r) ->
      $log("sent #{++sent}/#{toSend}".green, e)
      done() if sent == toSend

    dat = _.omit(outReach,'experts')
    for exp in outReach.experts
      tmplData = _.extend({firstName:exp.f||util.firstName(exp.n)},dat)
      mailman.sendTemplate('expert-farm', tmplData, {email:exp.e,name:exp.n}, isDone)


# outReach =
#   rId: "55c7743820a5da1100d50e08"
#   tagSlug: "prolog"
#   tagName: "Prolog"
#   hrRate: "170"
#   problemDescription: "to review and learn how to modify another person's c++ / prolog code"
#   customerName: "Peter Rowley"
#   experts: [
#     { n: 'Chip Eastham', e: 'hardmath@gmail.com', so: '487781/hardmath' }
#     { n: 'Sergey Dymchenko', e: 'kit1980@gmail.com', so: '220700/sergey-dymchenko' }
#     { n: 'Kaarel Kaljurand', e: 'kaljurand@gmail.com', so: '12547/kaarel' }
#     { n: 'Thanos Tintinidis', e: 'thanosqr@gmail.com', so: '730252/thanosqr' }
#     { n: 'Hugo Mougard', e: 'mog@crydee.eu', so: '1027951/m09' }
#     { n: 'Paulo Moura', e: 'pmoura@logtalk.org', so: '634629/paulo-moura' }
#     { n: 'Gustavo Brown', e: 'gbrown@fing.edu.uy', so: '463243/gusbro' }
#     { n: 'lurker', e: 'wadmin@codekinesis.com', so: '980550/lurker' }
#     { n: 'Lars Buitinck', e: 'larsmans@gmail.com', so: '166749/larsmans' }
#     { n: 'Carlo Capelli', e: 'cc.carlo.cap@gmail.com', so: '874024/capellic' }
#   ]

# outReach =
#   rId: "55ca07e977e9bc110078501e"
#   tagSlug: "liferay"
#   tagName: "Liferay"
#   hrRate: "80"
#   problemDescription: "and mentoring on how to setup users and shared permissions"
#   customerName: "Yulia Vydra"
#   experts: [
#     { n: 'Olaf Kock', e: 'pebble@olafkock.de', so: '13447/olaf-kock' }
#     { n: 'Mark Stien', e: 'm.stein@mosst.de',  so: '597624/mark' }
#     { n: 'Pankaj Kathiriya', e: 'pmkathiria@gmail.com',  so: '859518/pankajkumar-kathiriya' }
#     { n: 'Adam Brandizzi', e: 'adam@brandizzi.com.br',  so: '287976/brandizzi' }
#     { n: 'Jakub Liska', e: 'liska.jakub@gmail.com', so: '306488/lisak' }
#     { n: 'Dimitri Mestdagh', e: 'me@g00glen00b.be', so: '1915448/g00glen00b' }
#   ]


# outReach =
#   rId: "55c8d2318ca8bf11003b9556"
#   tagSlug: "ebay"
#   tagName: "the eBay API"
#   hrRate: "120"
#   problemDescription: "figuring out how to get buyer info after a sale api call"
#   customerName: "Kelly Ford"
#   experts: [
#     { f: 'David', n: 'David Sadler', e: 'davidtsadler@googlemail.com', so: '2066189/david-t-sadler' }
#     { n: 'Jonathan Frazier', e: 'jonathan@squidtech.co', so: '30921/squidscareme' }
#     { n: 'Ryan Elkins', e: 'ryan@iactionable.com',  so: '180516/ryan-elkins' }
#     { n: 'Lars Huttar', e: 'lars@huttar.net',  so: '423105/larsh' }
#     { n: 'Steve Severance', e: 'sseverance@alphaheavy.com',  so: '41717/steve' }
#   ]
