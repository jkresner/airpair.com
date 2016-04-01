raw = ->

  IT 'Get rendered markdown without sending', ->
    d = { tagsString: "angularjs", expertFirstName: "Jony", requestByFullName:"Jane Dow",_id:"55371ce4b38fc91937086df7",accountManagerName:"Jonathon Kresner" }
    mailman.get 'expert-suggest', d, (e,r) ->
      expect(e).to.be.null
      EXPECT.startsWith(r.subject,"angularjs AirPair?")
      md = r.markdown
      EXPECT.contains(md,"Hi Jony,")
      EXPECT.contains(md,"for Jane Dow")
      EXPECT.contains(md,"/review/55371ce4b38fc91937086df7")
      EXPECT.contains(md,"Jonathon Kresner")
      DONE()


  IT 'Send raw markdown', ->
    d = { tagsString: "angularjs", expertFirstName: "Jony", requestByFullName:"Jane Dow",_id:"55371ce4b38fc91937086df7",accountManagerName:"Jonathon Kresner" }
    md = "Hi Jony,\n\nfor Jane Dow\n\nhttps://www.ap.com/review/55371ce4b38fc91937086df7"
    mailman.sendMarkdown "angularJS Test AirPair?", md, {email:'jkresner@gmail.com',name:"Jony Expert"}, 'team', (e,r) ->
      expect(e).to.be.null
      EXPECT.contains(r.from,'AirPair <team@airpair.com>')
      EXPECT.startsWith(r.subject,"angularJS Test AirPair?")
      EXPECT.contains(r.html, "<p>Hi Jony,</p>\n")
      EXPECT.contains(r.html, "<p>for Jane Dow</p>\n")
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
#         EXPECT.startsWith(mail.subject,'{Payment} $17332 by Jony 5')
#         # expect(mail.text).to.be.null
#         # expect(mail.html).to.be.null
#         expect(mail.to.constructor).to.equal(Array)
#         expect(send.args[0][1].constructor).to.equal(Function)
#         expect(send.args[0][2]).to.be.undefined
#         EXPECT.contains(r.from,'AP <team@airpair.com>')
#         EXPECT.contains(r.text,'http://adm.airpa.ir/o/55371ce4b38fc91937086df7')
#         EXPECT.contains(r.text,'$17332')
#         EXPECT.contains(r.text,'Jony 5')
#         EXPECT.contains(r.html,'55371ce4b38fc91937086df7')
#         DONE()


#   # it.skip 'Pipeliners notify payment added', itDone ->
#   #   d = {byName:"Jonyisalive 5"}
#   #   mailman.send 'pipeliners', 'pipeliner-notify-addpaymethod', d, ->

#     it.skip 'Admin can give credit', itDone ->



spinners = ->


  IT 'Expert gets notification on booking', ->
    send = @send
    _id = ObjectId("55555ae4b38fc91937086df7")
    d = {byName:"Jonyisalive 5", expertName:"Jonathon Kaye", bookingId:_id,minutes:60}
    mailman.sendTemplate 'expert-booked', d, {name:'Karan Kurani',email:'karankurani@testmail.com'}, ->
      expect(send.callCount).to.equal(1)
      mail = send.args[0][0]
      EXPECT.startsWith(mail.subject,'You got booked to AirPair with Jonyisalive 5')
      EXPECT.contains(mail.from,'Pairbot <team@airpair.com>')
      EXPECT.contains(mail.text,'https://www.airpair.com/bookings/55555ae4b38fc91937086df7')
      EXPECT.contains(mail.text,'60 minutes')
      EXPECT.contains(mail.html,'55555ae4b38fc91937086df7')
      DONE()


  IT 'Pipeliners notify booking', ->
    send = @send
    STORY.newUser 'phlf', {paymethod:true,login:true}, (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{FIXTURE.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(send.callCount).to.equal(3)
        EXPECT.startsWith(send.args[1][0].subject, "{Booking} by #{s.name} for #{booking1.participants[1].info.name}")
        EXPECT.contains(send.args[1][0].text, "/#{booking1._id}")
        EXPECT.contains(send.args[1][0].text, "http://adm.airpa.ir/b/#{booking1._id}")
        EXPECT.contains(send.args[1][0].text, 'Daniel Roseman')
        EXPECT.contains(send.args[1][0].text, s.name)
        EXPECT.contains(send.args[1][0].html, booking1._id)
        EXPECT.contains(send.args[1][0].from,'AP <team@airpair.com>')
        EXPECT.startsWith(send.args[2][0].subject, "You got booked to AirPair with #{s.name}")
        EXPECT.contains(send.args[2][0].from,'Pairbot <team@airpair.com>')
        DONE()

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
#         EXPECT.startsWith(mail.subject,'4 Star Review for ExpressJS and PassportJS Sessions Deep Dive')
#         EXPECT.contains(mail.from,'Pairbot <team@airpair.com>')
#         EXPECT.contains(mail.text,'http://author.airpa.ir/contributors/541a36c3535a850b00b05697')
#         EXPECT.contains(mail.text,'Karan Kurani')
#         EXPECT.contains(mail.html,'541a36c3535a850b00b05697')
#         DONE()


#   describe 'Other: ', ->
# # expert-farm



module.exports = ->


  before (done) ->
    global.origMailman      = global.mailman
    global.config.log.mail = true
    DB.ensureExpert 'dros', ->
      DB.ensureDoc 'User', FIXTURE.users.admin, ->
        LOGIN 'admin', (s) ->
          GET '/adm/requests/active', (r) ->
            # phlfKey = s.userKey
            # phlfExp = exp
            global.mailman = require('../../../server/util/mailman')()
            done()


  beforeEach ->
    @send = STUB.spy(global.mailman,'send')
    STUB.SlackCommon()
    STUB.BraintreeCharge()

  after ->
    global.mailman = global.origMailman
    global.origMailman = undefined




  DESCRIBE "Raw", raw
  DESCRIBE "Spinners", spinners


