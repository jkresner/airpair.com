origMailman      = global.mailman
send             = null
stubMailProvider =
  send: (to, renderedEmail, cb) ->
    $log('fake send'.cyan, renderedEmail.Subject.white,  renderedEmail.Text)
    cb()


module.exports = -> describe "MailMan: ", ->

  before (done) ->
    @braintreepaymentStub = SETUP.stubBraintreeChargeWithMethod()
    global.mailman = require('../../server/util/mail/mailman')(stubMailProvider)
    SETUP.initExperts done

  after ->
    @braintreepaymentStub.restore()
    global.mailman = origMailman

  beforeEach ->
    send = sinon.spy(stubMailProvider,'send')

  afterEach ->
    send.restore()


  it 'Can get rendered template without sending', itDone ->
    d = { tagsString:"angularjs", expertFirstName:"Jony",requestByFullName:"Jane Dow",_id:"55371ce4b38fc91937086df7",accountManagerName:"Jonathon Kresner" }
    mailman.get 'expert-suggest', d, (e,r) ->
      expect(e).to.be.null
      expectStartsWith(r.Subject,"angularjs AirPair?")
      expectContains(r.Text,"Hi Jony,")
      expectContains(r.Text,"for Jane Dow")
      expectContains(r.Text,"/review/55371ce4b38fc91937086df7")
      expectContains(r.Text,"Jonathon Kresner")
      DONE()


  it 'Pipeliners notify puchase mass database template to pipeliners', itDone ->
    _id = ObjectId("55371ce4b38fc91937086df7")
    d = { byName:"Jony 5", total:17332, _id }
    mailman.send 'pipeliners', 'pipeliner-notify-purchase', d, ->
      expect(send.callCount).to.equal(1)
      expectStartsWith(send.args[0][1].Subject,'[Pipeline] $17332 Payment by Jony 5')
      expectContains(send.args[0][1].Text,'https://www.airpair.com/adm/orders/55371ce4b38fc91937086df7')
      expectContains(send.args[0][1].Text,'$17332')
      expectContains(send.args[0][1].Text,'Jony 5')
      expectContains(send.args[0][1].Html,'55371ce4b38fc91937086df7')
      DONE()


  it.skip 'Pipeliners notify payment added', itDone ->
    d = {byName:"Jonyisalive 5"}
    mailman.send 'pipeliners', 'pipeliner-notify-addpaymethod', d, ->


  it 'Pipeliners notify booking', itDone ->
    SETUP.addAndLoginLocalUserWithPayMethod 'ckni', (s) ->
      airpair1 = datetime: moment().add(2, 'day'), minutes: 120, type: 'private', payMethodId: s.primaryPayMethodId
      POST "/bookings/#{data.experts.dros._id}", airpair1, {}, (booking1) ->
        expect(send.callCount).to.equal(3)
        expectStartsWith(send.args[1][1].Subject, "[Pipeline] Booking by #{s.name} for #{booking1.participants[1].info.name}")
        expectContains(send.args[1][1].Text, "https://www.airpair.com/adm/bookings/#{booking1._id}")
        expectContains(send.args[1][1].Text, 'Daniel Roseman')
        expectContains(send.args[1][1].Text, s.name)
        expectContains(send.args[1][1].Html, booking1._id)
        expectStartsWith(send.args[2][1].Subject, "You got booked to AirPair with #{s.name}")
        DONE()


  it 'Pipeliners notify request and reply', itDone ->
    SETUP.newCompleteRequest 'jkjk', {}, (r,s) ->
      expect(send.callCount).to.equal(1)
      expectStartsWith(send.args[0][1].Subject, "[Request] RUSH $100 #{s.name}")
      expectContains(send.args[0][1].Text, "https://www.airpair.com/adm/pipeline/#{r._id}")
      expectContains(send.args[0][1].Text, "RUSH")
      expectContains(send.args[0][1].Text, s.name)
      LOGIN 'snug', (sExp) ->
        reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
        PUT "/requests/#{r._id}/reply/#{data.experts.snug._id}", reply, {}, (r2) ->
          expect(send.callCount).to.equal(3)
          $log(send.args[1][1].Subject)
          expectStartsWith(send.args[1][1].Subject, "[Reply] AVAILABLE by Ra&#x27;Shaun Stovall for #{s.name}")
          expectContains(send.args[0][1].Text, "https://www.airpair.com/adm/pipeline/#{r._id}")
          DONE()


  it 'Expert gets notification on booking', itDone ->
    _id = ObjectId("55555ae4b38fc91937086df7")
    d = {byName:"Jonyisalive 5", expertName:"Jonathon Kaye", bookingId:_id,minutes:60}
    mailman.send {name:'Karan Kurani',email:'karankurani@testmail.com'}, 'expert-booked', d, ->
      expect(send.callCount).to.equal(1)
      expectStartsWith(send.args[0][1].Subject,'You got booked to AirPair with Jonyisalive 5')
      expectContains(send.args[0][1].Text,'https://www.airpair.com/bookings/55555ae4b38fc91937086df7')
      expectContains(send.args[0][1].Text,'60 minutes')
      expectContains(send.args[0][1].Html,'55555ae4b38fc91937086df7')
      DONE()
