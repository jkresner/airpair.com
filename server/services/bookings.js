var logging                 = false
var RequestsSvc             = require('../services/requests')
var OrdersSvc               = require('../services/orders')
var ChatsSvc                = require('../services/chats')
// var TemplateSvc             = require('../services/templates')
var {Booking,User,Expert}   = DAL
var Roles                   = require('../../shared/roles').booking
var BookingdUtil            = require('../../shared/bookings')
var {select,query,opts}     = require('./bookings.data')
var {inflate}               = select.cb


function getChat(booking, syncMode, exitCB, cb) {

  if (booking.chatId)
    return ChatsSvc.getById(booking.chatId, (e,r) =>
      cb(e, (r) ? _.extend(booking,{chat:r}) : booking))

  select.inflateParticipantInfo(booking.participants)

  if (syncMode == 'all')
    return ChatsSvc.searchSyncOptions(BookingdUtil.searchBits(booking), (e,r) =>
        cb(e, (r) ? _.extend(booking,{chatSyncOptions:r}) : booking))

  if (syncMode == 'auto')
    return ChatsSvc.searchParticipantSyncOptions(booking.participants, (e,match,chatSyncOptions) => {
      if (match) {
        save.associateChat.call(this, booking, 'slack', match.info.id, (e,r) => {
          $log('auto.associateChat.success', match.info.name)
          exitCB(e, r)
        })
      }
      else
        cb(e, (chatSyncOptions) ? _.extend(booking,{chatSyncOptions}) : booking)
    })
}


var get = {

  getById(_id, cb)
  {
    Booking.getById(_id, opts.getById, cb)
  },

  getForParticipant(booking, cb)
  {
    // $log('getForParticipant'.yellow, booking)
    cb(null, booking)
  },

  getByUserId(id, cb)
  {
    var options = _.extend({select:select.listIndex},opts.orderByDate)
    Booking.getManyByQuery({ customerId: id }, options, select.cb.listIndex(cb))
  },

  getByExpertId(user, cb)
  {
    Expert.getByQuery({userId:user._id}, (e,expert) => {
      if (!expert) return cb(null,null)
      var options = _.extend({select:select.listIndex},opts.orderByDate)
      Booking.getManyByQuery({ expertId: expert._id }, options, select.cb.listIndex(cb))
    })
  },

  //-- TODO: differentiate between admin getByExpertID and just the expert getting by their own Id
  getByExpertIdForMatching(expertId, cb)
  {
    Booking.getManyByQuery({ expertId }, { select: select.expertMatching }, cb)
  },

  getByIdForParticipant(_id, callback)
  {
    // $log('getByIdForParticipant'.yellow, _id, this.user)
    var {query} = this
    if (query && query.refresh) cache.flush('slack_users')

    var cb = select.cb.itemIndex(callback)
    Booking.getById(_id, opts.forParticipant, (eee,r) => {
      r.slackin = config.wrappers.chat.slackin
      if (eee) return cb(eee)
      if (!r.order) return cb(null,r) // an edgecase migrated booking from v0 call
      getChat.call(this, r, 'auto', callback, (ee, chat) => {
        if (!r.order.requestId || ee) return cb(ee, r)
        RequestsSvc.getByIdForBookingInflate.call(this, r.order.requestId,
          (e,request) => cb(e,_.extend(r,{request})))
      })
    })
  },

  getByIdForSpinning(_id, pemail, cb)
  {
    Booking.getById(_id, (e,r) => {
      if (e || !r ||
          // !r.status != 'confirmed' || !r.status != 'followup' ||
          !r.datetime || !util.dateInRange(moment(),moment(r.datetime).add(-45,'minutes'),moment(r.datetime).add(45,'minutes')) )
      {
        cb(null,null) // => Feature only works for bookings that are about to start
      }
      else if (!this.user)
      {
        if (!_.find(r.participants,(p)=>p.info.email==pemail))
          cb(null,{handshake:'supply-email',noemail:true, _id })  // => Get participant email for security check
        else
          cb(null,{handshake:'sign-in',login:config.hangout.login, _id })
      }
      else
      {
        if (this.user.email == 'support@airpair.com') {
          var booking = util.selectFromObject(r,select.itemIndex)
          cb(null,_.extend({hangoutAppId:config.hangout.appId},booking))
        }
        else {
          var meParticipant = _.find(r.participants,(p)=>_.idsEqual(p.info._id, this.user._id))
          var email = (meParticipant) ? meParticipant.info.email : null
          cb(null,{ handshake:'logout', goincognito: true, _id, email }) // => "Hit this url in a new incongnito window.
        }
      }
    })
  },

  getByIdForAdmin(_id, callback)
  {
    var cb = select.cb.inflate(callback)
    Booking.getById(_id, opts.forAdmin, (eee,r) => {
      if (eee) return cb(eee)
      if (!r.order) return cb(null,r) // an edgecase migrated booking from v0 call
      getChat.call(this, r, 'all', callback, (ee,r) => {

      function slackMSGSync(key, data) {
        var tmpl = cache.templates[`slack-message:${key}`]

        if (!tmpl)
          $log(`template slack-message:${key} not found in cache`.warning)

        else if (tmpl.subtype == 'message')
          return {
            type: 'message',
            text: tmpl.markdownFn(data)
          }

        else if (tmpl.subtype == 'attachment')
          return {
            type: 'attachment',
            fallback: tmpl.fallbackFn(data),
            color:  tmpl.color,
            pretext: tmpl.subjectFn(data),
            thumb_url: tmpl.thumbnailFn(data),
            title: data.title,
            title_link: tmpl.linkFn(data),
            text: tmpl.markdownFn(data),
          }
        }
        function slackMSGsforBookingStatus(data) {
          var {status} = data
          var msgs = {}
          for (var tmlpKey of _.keys(cache.templates)) {
            if (tmlpKey.indexOf(`slack-message:booking-${status}-`)==0)
            {
              var type = cache.templates[tmlpKey].subtype
              var msgKey = tmlpKey.replace(`slack-message:booking-${status}-`,'')
              msgs[msgKey] = slackMSGSync(`booking-${status}-${msgKey}`,data)  //message|attachment
            }
          }
          return msgs
        }

        if (r.chat)
          r.botMsgs = slackMSGsforBookingStatus(select.slackMsgTemplateData(r))


        if (!r.order.requestId || ee)
          return cb(ee,r)
        RequestsSvc.getByIdForBookingInflate.call(this, r.order.requestId, (e,request) =>
          cb(e,_.extend(r,{request})))
      })
    })
  },

  getByQueryForAdmin(start, end, userId, cb) {
    var q = query.inRange(start,end)
    if (userId) q['participants.info._id'] = userId
    var options = _.extend({select:select.listAdmin},opts.adminList)
    Booking.getManyByQuery(q, options, select.cb.listAdmin(cb))
  }

}


var save = {

  createBooking(expert, datetime, minutes, type, credit, payMethodId, requestId, dealId, cb)
  {
    var getParticipants = (callback) => {
      User.getById(expert.userId,'localization name email', (e, expertUser) => {
        if (e) return callback(e)
        callback(null,[
          BookingdUtil.participantFromUser("customer", this.user),
          BookingdUtil.participantFromUser("expert", expertUser)
        ])
      })
    }

    getParticipants((ee, participants)=>{
      if (ee) return cb(ee)
      var bookingId = Booking.newId()
      OrdersSvc.createBookingOrder.call(this, bookingId, expert, datetime, minutes, type, credit, payMethodId, requestId, dealId, (e, order) => {
        // $log('createBookingOrder.done'.trace, e, order)
        if (e) return cb(e)

        var {user} = this
        var touch = svc.newTouch.call(this, 'create')
        var booking = {
          _id: bookingId,
          // createdById: user._id,   GONE
          customerId: user._id, // consider use case of expert creating booking
          expertId: expert._id,
          participants,
          type,
          minutes,
          datetime,
          suggestedTimes:[{time:datetime,byId:user._id}],
          status: 'pending',
          gcal: {},
          orderId: order._id,
          lastTouch: touch,
          activity: [touch]
        }
        var d = {byName:user.name,expertName:expert.name, bookingId:booking._id,minutes,type}
        mailman.sendTemplate('pipeliner-notify-booking', d, 'spinners')
        mailman.sendTemplate('expert-booked', d, expert) // todo add type && instructions to email
        Booking.create(booking, select.cb.itemIndex(cb))
      })
    })
  },

  suggestTime(original, time, cb)
  {
    var {suggestedTimes,lastTouch,activity} = original
    suggestedTimes = suggestedTimes || []
    suggestedTimes.push({time,byId:this.user._id})
    lastTouch = svc.newTouch.call(this, 'suggest-time')
    activity.push(lastTouch)
    Booking.updateSet(original._id, {suggestedTimes,lastTouch,activity}, (e,r) => {
      get.getByIdForParticipant.call(this, original._id,cb)
      if (original.chat)
        pairbot.sendSlackMsg(original.chat.providerId, 'booking-suggest-time',
          select.slackMsgTemplateData(r,{byName:this.user.name,suggestedMultitime:BookingdUtil.multitime(r,time)},this.user._id) )
    })
  },

  removeSuggestedTime(original, timeId, cb)
  {
    var {suggestedTimes,lastTouch,activity,datetime,status} = original

    var suggestedTime = _.find(suggestedTimes,(t)=>_.idsEqual(t._id,timeId))
    suggestedTimes = _.without(suggestedTimes,suggestedTime)
    lastTouch = svc.newTouch.call(this, 'remove-time')
    activity.push(lastTouch)
    Booking.updateSet(original._id, {suggestedTimes,lastTouch,activity}, (e,r) => {
      get.getByIdForParticipant.call(this, original._id,cb)
    })
  },

  confirmTime(original, timeId, cb)
  {
    var {suggestedTimes,lastTouch,activity,datetime,status} = original

    var suggestedTime = _.find(suggestedTimes,(t)=>_.idsEqual(t._id,timeId))
    datetime = suggestedTime.time
    status = 'confirmed'

    lastTouch = svc.newTouch.call(this, 'confirm-time')
    activity.push(lastTouch)

    suggestedTime.confirmedById = this.user._id

    original.datetime = datetime
    createBookingGoogleCalendarEvent(original, cb, (gcal) => {
      var ups = {suggestedTimes,lastTouch,activity,datetime,status,gcal}
      Booking.updateSet(original._id, ups, (e,r) => {
        get.getByIdForParticipant.call(this, original._id,cb)
        if (original.chat)
          pairbot.sendSlackMsg(original.chat.providerId, 'booking-confirm-time',
            select.slackMsgTemplateData(r,{byName:this.user.name}) )
      })
    })
  },

  customerFeedback(original, review, expert, expertReview, cb)
  {
    if (expertReview) throw Error("expertReview not implemented")
    var {activity,lastTouch,status} = original
    var reviews = original.reviews || []

    // TODO deal with update case gracefully

    review.by = _.pick(this.user,'_id','name')
    review.type = 'booking-customer-feedback'
    reviews.push(review)

    // $log('customerFeedback'.magenta, review, expert._id, expertReview)
    lastTouch = svc.newTouch.call(this, 'customer-feedback')
    activity.push(lastTouch)

    OrdersSvc.getByIdForAdmin(original.orderId,(e,order) =>{
      var li = _.find(order.lines,(l)=>l.type == 'airpair')
      var paidout = (li) ? li.info.paidout : true
      // $log('original'.yellow, original, paidout)

      if (status != 'complete' && paidout)
        status = 'complete'

      Booking.updateSet(original._id, {status,reviews,activity,lastTouch}, (e,r)=>{
        get.getByIdForParticipant(original._id,cb)
      })
    })
  },


  createChat(original, type, groupchat, cb)
  {
    select.inflateParticipantInfo(original.participants)
    ChatsSvc.createCreate.call(this, type, groupchat, original.participants, (e,chat)=>{
      if (e) return cb(e)
      var {activity,lastTouch} = original
      lastTouch = svc.newTouch.call(this, 'create-chat')
      activity.push(lastTouch)
      Booking.updateSet(original._id, {chatId:chat._id,activity,lastTouch}, (e,r)=>{
        get.getByIdForParticipant(original._id,cb)
      })
    })
  },

  associateChat(original, type, providerId, cb)
  {
    ChatsSvc.createSync.call(this, type, providerId, (e,chat)  =>{
      if (e) return cb(e)
      var {activity,lastTouch} = original
      activity = activity || []
      lastTouch = svc.newTouch.call(this, 'associate-chat')
      activity.push(lastTouch)
      Booking.updateSet(original._id, {chatId:chat._id,activity,lastTouch}, (e,r)=>{
        get.getByIdForParticipant.call(this, original._id, cb)
      })
    })
  }
}


function updateForAdmin(thisCtx, booking, updates, action, cb) {
  //-- todo consider calculating status here
  var {activity,lastTouch} = booking
  activity = activity || []
  lastTouch = svc.newTouch.call(thisCtx, action)
  activity.push(lastTouch)
  Booking.updateSet(booking._id, _.extend(updates,{lastTouch,activity}), (e,r)=>{
    if (e) return cb(e)
    if (!r.chatId)
      get.getByIdForAdmin.call(thisCtx, r._id, cb)
    else {
      var groupInfo = BookingdUtil.chatGroup(r)
      ChatsSvc.sync.call(thisCtx, r.chatId, groupInfo, (ee,chat)=>{
        if (ee) return cb(ee)
        get.getByIdForAdmin.call(thisCtx, r._id, cb)
      })
    }
  })
}

function createBookingGoogleCalendarEvent(booking, errorCB, cb) {
  var {minutes,datetime,participants} = booking
  var attendees = []
  for (var p of participants) attendees.push({email:p.info.email})
  var cust = _.find(participants, (a)=>a.role=='customer')
  var exp = _.find(participants, (a)=>a.role=='expert')
  var name = `AirPair ${util.firstName(cust.info.name)} + ${util.firstName(exp.info.name)}`
  var description = `Please be in your chat room or on the booking page 10 minutes before this invite.

=> https://www.airpair.com/bookings/${booking._id}

You are encouraged to make sure beforehand your mic/webcam are working
on your system. Please let your matchmaker know if you'd like to do
a dry run.`

  var adminInitials = "jk" // TODO un-hardcode
  var sendNotifications = true //always true for now
  Wrappers.Calendar.createEvent(name, sendNotifications, moment(datetime), minutes, attendees, description, adminInitials, (e,r) => {
    if (logging) $log('event created'.yellow, e, r)
    if (e) return errorCB(e)
    cb(r)
  })
}

function updateBookingGoogleCalendarEvent(booking, sendNotifications, errorCB, cb) {
  var {gcal,datetime,minutes} = booking
  // $log('booking.updateCalendarEvent'.trace, gcal.id, sendNotifications, datetime, minutes)
  Wrappers.Calendar.updateEvent(gcal.id, sendNotifications, datetime, minutes, (e,r) => {
    if (logging) $log('calendar event updated'.yellow, e, r)
    if (e) return errorCB(e)
    cb(r)
  })
}

var admin = {

  updateByAdmin(original, update, cb) {
    var shouldUpdateGal = false
    var {datetime,minutes,status} = update

    if (!moment(original.datetime).isSame(moment(datetime)))
    {
      if (logging) $log('changing the date yea!', original.datetime, datetime)
      shouldUpdateGal = original.gcal != null
    }
    else if (original.gcal && original.gcal.start && !moment(original.gcal.start.dateTime).isSame(original.datetime))
      shouldUpdateGal = true

    if (original.status != status) {
      if (logging) $log('changing the status yea!'.trace, original.status, status)
    }

    // the sendGCal flag prevent double-submission from client
    if (update.sendGCal)
      createBookingGoogleCalendarEvent(update, cb, (gcal) =>
        updateForAdmin(this, original, {datetime,minutes,status,gcal}, 'adm-create-cal', cb) )

    else if (shouldUpdateGal) {
      var sendNotification = false //always false for now
      if (logging) $log('updating cgal'.trace, 'notify', sendNotification)
      updateBookingGoogleCalendarEvent(update, sendNotification, cb, (gcal) =>
        updateForAdmin(this, original, {datetime,minutes,status,gcal}, 'adm-update-cal', cb) )
    }
    else
      updateForAdmin(this, original, {datetime,minutes,status}, 'adm-update', cb)
  },

  postChatMessage(original, chatMessage, cb)
  {
    var {providerId,provider} = original.chat
    var data = _.extend(select.slackMsgTemplateData(original),{text:chatMessage.text})
    pairbot.sendSlackMsg(providerId,`booking-${original.status}-${chatMessage.key}`, data, (e,msg) => {
      if (e) return cb(e)
      updateForAdmin(this, original, {}, 'adm-post-chat', cb)
    })
  },

  addYouTubeData(original, youTubeId, cb)
  {
    if (logging) $log('bookings.addYouTubeData', original._id, youTubeId)
    var {status,recordings} = original
    Wrappers.YouTube.getVideoInfo(youTubeId, (e, response) => {
      if (e) return cb(Error(e))
      recordings.push({
        type:'youtube',
        data:_.extend(_.omit(response.snippet,'thumbnails'),{youTubeId:response.id})})
      updateForAdmin(this, original, {status:'followup',recordings}, 'addYouTube', cb)
    });
  },

  addHangout(original, youTubeId, youTubeAccount, hangoutUrl, cb)
  {
    if (logging) $log('bookings.addHangout'.update, original._id, youTubeId, youTubeAccount, hangoutUrl)
    var {status,recordings} = original
    Wrappers.YouTube.getVideoInfo(youTubeId, (e, response) => {
      //TODO mark video as private if booking.type is private
      if (e) return cb(Error(e))
      recordings.push({
        type:'youtube', hangoutUrl, youTubeAccount,
        data:_.extend(_.omit(response.snippet,'thumbnails'),{youTubeId:response.id})})

      updateForAdmin(this, original, {status:'followup',recordings}, 'adm-start-hangout', (e,r) => {
        if (!e && r && r.chat)
          pairbot.sendSlackMsg(r.chat.providerId, 'hangout-started-slack', {hangoutUrl})
        cb(e,r)
      })
    })
  },

  deleteRecording(original, recordingId, cb)
  {
    var recordings = _.filter(original.recordings, (r)=>!_.idsEqual(r._id,recordingId))
    updateForAdmin(this, original, {recordings}, 'adm-del-recording', cb)
  },

  addNote(original, note, cb)
  {
    var notes = original.notes || []
    notes.push({body:note,by:{_id:this.user._id,name:this.user.name}})
    updateForAdmin(this, original, {notes}, 'adm-note', cb)
  },

  //-- Short cut needs to be replaced by something much more robust
  cheatExpertSwap(booking, order, request, suggestionId, cb)
  {
    var lines = order.lines
    var suggestion = _.find(request.suggested, (s)=> _.idsEqual(suggestionId,s._id))
    var expert = suggestion.expert
    var bookingLine = _.find(lines,(li)=>li.type=='airpair'&&_.idsEqual(li.info.expert._id,booking.expertId))
    var prevExpert = bookingLine.info.expert

    User.getById(expert.userId,'localization name email', (e, expertUser) => {
      if (e) return callback(e)

      //-- If there was a calendar invite, cancel and delete
      //-- Grab the expert details from the expert or optional requestId

      //-- We have to go to the order
      //-- Change the airpair lineItem for the booking
      //-- Adjust
      //---- profit
      //---- as the difference of
      //--   (unitPrice - expertRate) * profit
      //--
      //---- expert
      //--
      //---- name

      bookingLine.info.swapped = [_.extend({utc:moment(),prevExpert})]
      bookingLine.info.name = bookingLine.info.name.replace(prevExpert.name,suggestion.expert.name)
      bookingLine.info.expert = _.pick(expert,['_id','userId','name','avatar'])
      booking.gcal = null

      //-- After updating order, change booking
      //---- expertId
      //----
      //---- Find and update expert participant

      var expertId = expert._id
      var toRemove = _.find(booking.participants,(p)=>_.idsEqual(p.info._id,prevExpert.userId))
      var participants = _.without(booking.participants,toRemove)
      participants.push(BookingdUtil.participantFromUser("expert", expertUser))

      DAL.Order.updateSet(order._id, { lines }, (e,r) =>
        updateForAdmin(this, booking, {expertId,participants}, 'adm-swap-expert', cb))
    })
  },

}


module.exports = _.extend(get, _.extend(save,admin))
