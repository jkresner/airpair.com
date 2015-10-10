origMailman      = global.mailman
send             = null

raw = ->

  IT 'Get rendered markdown without sending', ->
    d = { tagsString: "angularjs", expertFirstName: "Jony", requestByFullName:"Jane Dow",_id:"55371ce4b38fc91937086df7",accountManagerName:"Jonathon Kresner" }
    mailman.get 'expert-suggest', d, (e,r) ->
      expect(e).to.be.null
      expectStartsWith(r.subject,"angularjs AirPair?")
      md = r.markdown
      expectContains(md,"Hi Jony,")
      expectContains(md,"for Jane Dow")
      expectContains(md,"/review/55371ce4b38fc91937086df7")
      expectContains(md,"Jonathon Kresner")
      DONE()


  IT 'Send raw markdown', ->
    d = { tagsString: "angularjs", expertFirstName: "Jony", requestByFullName:"Jane Dow",_id:"55371ce4b38fc91937086df7",accountManagerName:"Jonathon Kresner" }
    md = "Hi Jony,\n\nfor Jane Dow\n\nhttps://www.ap.com/review/55371ce4b38fc91937086df7"
    mailman.sendMarkdown "angularJS Test AirPair?", md, {email:'jkresner@gmail.com',name:"Jony Expert"}, 'team', (e,r) ->
      expect(e).to.be.null
      expectContains(r.from,'AirPair <team@airpair.com>')
      expectStartsWith(r.subject,"angularJS Test AirPair?")
      expectContains(r.html, "<p>Hi Jony,</p>\n")
      expectContains(r.html, "<p>for Jane Dow</p>\n")
      DONE()









#   describe 'Users auto: ', ->

# # 'expert-available'
# # 'expert-booked'
# # 'user-password-change'
# # 'user-signup-nopass'
# # 'user-verify-email'

#   describe 'Pipeliners auto: ', ->

# # 'pipeliner-notify-addpaymethod'
# # 'pipeliner-notify-purchase'
# # 'pipeliner-notify-booking'
# # 'pipeliner-notify-request'
# # 'pipeliner-notify-reply'
# # 'expert-suggest'
# # 'customer-got-credit'


#     it 'Pipeliners notify purchase mass database template to pipeliners', itDone ->
#       _id = ObjectId("55371ce4b38fc91937086df7")
#       d = { byName:"Jony 5", total:17332, _id }
#       mailman.sendGroupMail 'pipeliner-notify-purchase', d, 'pipeliners', (e, r) ->
#         expect(e).to.be.null
#         expect(send.callCount).to.equal(1)
#         mail = send.args[0][0]
#         # $log('mail'.cyan, mail)
#         expectStartsWith(mail.subject,'{Payment} $17332 by Jony 5')
#         # expect(mail.text).to.be.null
#         # expect(mail.html).to.be.null
#         expect(mail.to.constructor).to.equal(Array)
#         expect(send.args[0][1].constructor).to.equal(Function)
#         expect(send.args[0][2]).to.be.undefined
#         expectContains(r.from,'AP <team@airpair.com>')
#         expectContains(r.text,'http://adm.airpa.ir/o/55371ce4b38fc91937086df7')
#         expectContains(r.text,'$17332')
#         expectContains(r.text,'Jony 5')
#         expectContains(r.html,'55371ce4b38fc91937086df7')
#         DONE()


#   # it.skip 'Pipeliners notify payment added', itDone ->
#   #   d = {byName:"Jonyisalive 5"}
#   #   mailman.send 'pipeliners', 'pipeliner-notify-addpaymethod', d, ->

#     it.skip 'Admin can give credit', itDone ->



#   describe 'Spinners auto: ', ->

#     it 'Pipeliners notify booking', itDone ->
#       SETUP.addAndLoginLocalUserWhoCanMakeBooking 'ckni', (s) ->
#         airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
#         POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
#           expect(send.callCount).to.equal(3)
#           expectStartsWith(send.args[1][0].subject, "{Booking} by #{s.name} for #{booking1.participants[1].info.name}")
#           expectContains(send.args[1][0].text, "/#{booking1._id}")
#           expectContains(send.args[1][0].text, "http://adm.airpa.ir/b/#{booking1._id}")
#           expectContains(send.args[1][0].text, 'Daniel Roseman')
#           expectContains(send.args[1][0].text, s.name)
#           expectContains(send.args[1][0].html, booking1._id)
#           expectContains(send.args[1][0].from,'AP <team@airpair.com>')
#           expectStartsWith(send.args[2][0].subject, "You got booked to AirPair with #{s.name}")
#           expectContains(send.args[2][0].from,'Pairbot <team@airpair.com>')
#           DONE()


#     it 'Pipeliners notify request and reply', itDone ->
#       SETUP.newCompleteRequest 'jkjk', {}, (r,s) ->
#         expect(send.callCount).to.equal(1)
#         expectStartsWith(send.args[0][0].subject, "{Request} RUSH $100 #{s.name}")
#         expectContains(send.args[0][0].text, "/#{r._id}")
#         expectContains(send.args[0][0].text, "http://adm.airpa.ir/r/#{r._id}")
#         expectContains(send.args[0][0].text, "RUSH")
#         expectContains(send.args[0][0].text, s.name)
#         LOGIN 'snug', (sExp) ->
#           reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
#           PUT "/requests/#{r._id}/reply/#{data.experts.snug._id}", reply, {}, (r2) ->
#             expect(send.callCount).to.equal(3)
#             # $log(send.args[1][1].subject)
#             expectStartsWith(send.args[1][0].subject, "[Reply] AVAILABLE by Ra'Shaun Stovall for #{s.name}")
#             expectContains(send.args[1][0].text, "http://adm.airpa.ir/r/#{r._id}")
#             expectContains(send.args[1][0].text, "/#{r._id}")
#             expectContains(send.args[1][0].from, 'AP <team@airpair.com>')
#             expectStartsWith(send.args[2][0].subject, "[AirPair] Ra'Shaun Stovall is bookable for 24 hours")
#             expectContains(send.args[2][0].text, "https://www.airpair.com/review/#{r._id}")
#             expectContains(send.args[2][0].from, 'Pairbot <team@airpair.com>')
#             DONE()


#     it 'Expert gets notification on booking', itDone ->
#       _id = ObjectId("55555ae4b38fc91937086df7")
#       d = {byName:"Jonyisalive 5", expertName:"Jonathon Kaye", bookingId:_id,minutes:60}
#       mailman.sendTemplate 'expert-booked', d, {name:'Karan Kurani',email:'karankurani@testmail.com'}, ->
#         expect(send.callCount).to.equal(1)
#         mail = send.args[0][0]
#         expectStartsWith(mail.subject,'You got booked to AirPair with Jonyisalive 5')
#         expectContains(mail.from,'Pairbot <team@airpair.com>')
#         expectContains(mail.text,'https://www.airpair.com/bookings/55555ae4b38fc91937086df7')
#         expectContains(mail.text,'60 minutes')
#         expectContains(mail.html,'55555ae4b38fc91937086df7')
#         DONE()




#   describe 'Posts: ', ->

# # 'post-review-notification'
# # 'post-review-reply-notification'

#     it 'Sends review notificaton', itDone ->
#       d =
#         _id: "541a36c3535a850b00b05697",
#         title: "ExpressJS and PassportJS Sessions Deep Dive" ,
#         comment: "## Pretty cool\n\nYou should update it thought",
#         rating: 4,
#         reviewerFullName: 'Karan Kurani'
#       mailman.sendTemplate 'post-review-notification', d, {name:"Jonathon Kresner",email:'jk@airpair.com'}, (e, mail) ->
#         expect(send.callCount).to.equal(1)
#         mail = send.args[0][0]
#         expectStartsWith(mail.subject,'4 Star Review for ExpressJS and PassportJS Sessions Deep Dive')
#         expectContains(mail.from,'Pairbot <team@airpair.com>')
#         expectContains(mail.text,'http://author.airpa.ir/contributors/541a36c3535a850b00b05697')
#         expectContains(mail.text,'Karan Kurani')
#         expectContains(mail.html,'541a36c3535a850b00b05697')
#         DONE()


#   describe 'Other: ', ->
# # expert-farm



module.exports = ->


  before (done) ->
    # @braintreepaymentStub = SETUP.stubBraintreeChargeWithMethod()
    global.config.log.mail = true
    global.mailman = require('../../../server/util/mailman')()
    # global.mailman.getGroupList 'spinners', ->
      # global.mailman.getGroupList 'pipeliners', ->
        # SETUP.initExperts done
    done()

  after ->
    # @braintreepaymentStub.restore()
    global.mailman = origMailman


  beforeEach ->
    send = sinon.spy(global.mailman,'send')

  afterEach ->
    send.restore()


  DESCRIBE "Raw", raw

