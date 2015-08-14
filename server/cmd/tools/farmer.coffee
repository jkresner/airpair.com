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

global.config.mongoUri = "mongodb://localhost/airpair_dev"
global.config.mail.provider = require('../../util/mail/smtp')

# Here's me mentoring on Backbone.js recently: http://youtu.be/QFszSx8vgEA


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
      mailman.send({email:exp.e,name:exp.n}, 'expert-farm', tmplData, isDone)


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
