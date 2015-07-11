var logging                 = false
var RequestsSvc             = require('../services/requests')
var OrdersSvc               = require('../services/orders')
var ChatsSvc                = require('../services/chats')
var TemplateSvc             = require('../services/templates')
import Svc                  from '../services/_service'
import Booking              from '../models/booking'
import Order                from '../models/order'
var User                    = require('../models/user')
var svc                     = new Svc(Booking, logging)
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
        $callSvc(save.associateChat,this)(booking, 'slack', match.info.id, (e,r) => {
          $log('auto.associateChat.success'.update, match.info.name)
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
    svc.searchOne({_id}, {options:opts.getById}, cb)
  },

  getForParticipant(booking, cb)
  {
    cb(null, booking)
  },

  getByUserId(id, cb)
  {
    var fields = select.listIndex
    svc.searchMany({ customerId: id }, { fields, options: opts.orderByDate}, select.cb.listIndex(cb))
  },

  getByExpertId(user, cb)
  {
    if (!user.cohort || ! user.cohort.expert) return cb(null,null)
    var fields = select.listIndex
    svc.searchMany({ expertId: user.cohort.expert._id }, { fields, options: opts.orderByDate}, select.cb.listIndex(cb))
  },

  //-- TODO: differentiate between admin getByExpertID and just the expert getting by their own Id
  getByExpertIdForMatching(expertId, cb)
  {
    svc.searchMany({ expertId }, { fields: select.expertMatching }, cb)
  },

  getByIdForParticipant(_id, callback)
  {
    var cb = select.cb.itemIndex(callback)
    svc.searchOne({_id}, {options:opts.forParticipant}, (eee,r) => {
      if (eee) return cb(eee)
      if (!r.order) return cb(null,r) // an edgecase migrated booking from v0 call
      // var chatSync = false
      // if (Roles.isExpert(this.user,r)) chatSync = {mode:'expert'}
      getChat.call(this, r, 'auto', callback, (ee,r)=>{
        if (!r.order.requestId || ee) return cb(ee,r)
        $callSvc(RequestsSvc.getByIdForBookingInflate,this)(r.order.requestId, (e,request) =>
          cb(e,_.extend(r,{request})))
      })
    })
  },

  getByIdForAdmin(_id, callback)
  {
    var cb = select.cb.inflate(callback)
    svc.searchOne({_id}, {options:opts.forAdmin}, (eee,r) => {
      if (eee) return cb(eee)
      if (!r.order) return cb(null,r) // an edgecase migrated booking from v0 call
      getChat.call(this, r, 'all', callback, (ee,r) => {
        if (!r.order.requestId || ee) return cb(ee,r)
        $callSvc(RequestsSvc.getByIdForBookingInflate, this)(r.order.requestId, (e,request) =>
          cb(e,_.extend(r,{request})))
      })
    })
  },

  getByQueryForAdmin(start, end, userId, cb) {
    var q = query.inRange(start,end)
    if (userId) q['participants.info._id'] = userId

    svc.searchMany(q, { fields: select.listAdmin, options: opts.adminList },
      select.cb.listAdmin(cb))
  }

}


var save = {

  createBooking(expert, datetime, minutes, type, credit, payMethodId, requestId, dealId, cb)
  {
    var getParticipants = (callback) => {
      User.findOne({_id:expert.userId},{localization:1,name:1,email:1}, (e, expertUser) => {
        if (e) return callback(e)
        callback(null,[
          BookingdUtil.participantFromUser("customer", this.user),
          BookingdUtil.participantFromUser("expert", expertUser)
        ])
      })
    }

    getParticipants((ee, participants)=>{
      if (ee) return cb(ee)
      var bookingId = svc.newId()
      OrdersSvc.createBookingOrder.call(this, bookingId, expert, datetime, minutes, type, credit, payMethodId, requestId, dealId, (e, order) => {
        if (e) return cb(e)

        var {user} = this
        var touch = svc.newTouch.call(this, 'create')
        var booking = {
          _id: bookingId,
          createdById: user._id,
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
        mailman.send('pipeliners', 'pipeliner-notify-booking', d, ()=>{})
        mailman.send(expert, 'expert-booked', d, ()=>{}) // todo add type && instructions to email

        svc.create(booking, select.cb.itemIndex(cb))
      })
    })
  },

  suggestTime(original, time, cb)
  {
    var {suggestedTimes,lastTouch,activity} = original
    suggestedTimes.push({time,byId:this.user._id})
    lastTouch = svc.newTouch.call(this, 'suggest-time')
    activity.push(lastTouch)
    svc.updateWithSet(original._id, {suggestedTimes,lastTouch,activity}, (e,r) => {
      $callSvc(get.getByIdForParticipant,this)(original._id,cb)
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
      if (original.chat) {
        var multitime = BookingdUtil.multitime(original)
        var d = {multitime,byName:this.user.name,bookingId:original._id}
        pairbot.sendSlackMsg(original.chat.providerId, 'booking-confirm-time', d)
      }

      svc.updateWithSet(original._id,
        {suggestedTimes,lastTouch,activity,datetime,status,gcal},(e,r) => {
        $callSvc(get.getByIdForParticipant,this)(original._id,cb)
      })
    })
  },

  customerFeedback(original, review, expert, expertReview, cb)
  {
    if (expertReview) throw Error("expertReview not implemented")

    review.by = svc.userByte.call(this)
    review.type = 'booking-feedback'
    original.reviews = original.reviews || []
    // TODO deal with update case gracefully
    original.reviews.push(review)
    // $log('customerFeedback'.magenta, review, expert._id, expertReview)
    svc.update(original._id, original, inflate(cb,select.itemIndex))
  },


  createChat(original, type, groupchat, cb)
  {
    select.inflateParticipantInfo(original.participants)
    $callSvc(ChatsSvc.createCreate, this)(type, groupchat, original.participants, (e,chat)=>{
      if (e) return cb(e)
      var {activity,lastTouch} = original
      lastTouch = svc.newTouch.call(this, 'create-chat')
      activity.push(lastTouch)
      svc.updateWithSet(original._id, {chatId:chat._id,activity}, (e,r)=>{
        get.getByIdForParticipant(original._id,cb)
      })
    })
  },

  associateChat(original, type, providerId, cb)
  {
    $callSvc(ChatsSvc.createSync, this)(type, providerId, (e,chat)=>{
      if (e) return cb(e)
      var {activity,lastTouch} = original
      lastTouch = svc.newTouch.call(this, 'associate-chat')
      activity.push(lastTouch)
      svc.updateWithSet(original._id, {chatId:chat._id,activity}, (e,r)=>{
        get.getByIdForParticipant(original._id, cb)
      })
    })
  }
}


function updateForAdmin(thisCtx, booking, cb) {
  svc.update(booking._id, booking, (e,r)=>{
    if (e) return cb(e)
    if (!r.chatId)
      $callSvc(get.getByIdForAdmin, thisCtx)(r._id, cb)
    else {
      var groupInfo = BookingdUtil.chatGroup(r)
      $callSvc(ChatsSvc.sync, thisCtx)(r.chatId, groupInfo, (ee,chat)=>{
        if (ee) return cb(ee)
        $callSvc(get.getByIdForAdmin, thisCtx)(r._id, cb)
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

function updateBookingGoogleCalendarEvent(booking, sendNotifications,cb) {
  var {gcal,datetime,minutes} = booking
  $log('going'.magenta, gcal.id, sendNotifications, datetime, minutes)
  //Calculate start end
  Wrappers.Calendar.updateEvent(gcal.id, sendNotifications, datetime, minutes, (e,r) => {
    if (logging) $log('calendar event updated'.yellow, e, r)
    if (e) return cb(e)
    booking.gcal = r
    cb(this, booking)
  })
}

var admin = {

  updateByAdmin(original, update, cb) {
    var shouldUpdateGal = false

    if (!moment(original.datetime).isSame(moment(update.datetime)))
    {
      if (logging) $log('changing the date yea!', original.datetime, update.datetime)
      original.datetime = update.datetime
      original.minutes = update.minutes
      shouldUpdateGal = original.gcal != null
    }
    else if (original.gcal && !moment(original.gcal.start.dateTime).isSame(original.datetime))
      shouldUpdateGal = true

    if (original.status != update.status) {
      if (logging) $log('changing the status yea!'.cyan, original.status, update.status)
      original.status = update.status
    }


    // the sendGCal flag prevent double-submission from client
    if (update.sendGCal)
      createBookingGoogleCalendarEvent(update, cb, (gcal) =>
        updateForAdmin(this, _.extend(update,{gcal}), cb) )

    else if (shouldUpdateGal) {
      var updateCB = (ctx,bk) => updateForAdmin(ctx,bk,cb)
      var sendNotification = false //always false for now
      if (logging) $log('updating cgal', 'notify', sendNotification)
      updateBookingGoogleCalendarEvent.call(this, update, sendNotification, updateCB)
    }
    else
      updateForAdmin(this, original, cb)
  },



  addYouTubeData(original, youTubeId, cb) {
    if (logging) $log('bookings.addYouTubeData'.cyan, original._id, youTubeId)
    Wrappers.YouTube.getVideoInfo(youTubeId, (err, response) => {
      if (err){
        return cb(Error(err),data)
      }
      original.status = "followup"
      var data = {}
      data = response.snippet;
      data.youTubeId = response.id;
      delete(data.thumbnails) //can be derived from YouTube ID
      original.recordings.push({type: "youTube", data})
      updateForAdmin(this, original, cb)
    });
  },

  addHangout(original, youTubeId, youTubeAccount, hangoutUrl, cb){
    if (logging) $log('bookings.addHangout'.cyan, original._id, youTubeId, youTubeAccount, hangoutUrl)
    Wrappers.YouTube.getVideoInfo(youTubeId, (err, response) => {
      //TODO mark video as private if booking.type is private
      if (err){
        return cb(Error(err),data)
      }
      original.status = "followup"
      var data = {}
      data = response.snippet;
      data.youTubeId = response.id;
      delete(data.thumbnails) //can be derived from YouTube ID
      original.recordings.push({type: "YouTube", data, hangoutUrl, youTubeAccount})
      updateForAdmin(this, original, (e,r)=>{
        if (!e) pairbot.sendSlackMsg(r.chat.providerId, 'hangout-started-slack', {hangoutUrl})
        cb(e,r)
      })
    })
  },

  deleteRecording(original, recordingId, cb)
  {
    var recordings = _.filter(original.recordings, (r)=>!_.idsEqual(r._id,recordingId))
    original.recordings = recordings
    updateForAdmin(this, original, cb)
  },

  addNote(original, note, cb)
  {
    var notes = original.notes || []
    notes.push({body:note,by:{_id:this.user._id,name:this.user.name}})
    original.notes = notes
    updateForAdmin(this, original, cb)
  },

  //-- Short cut needs to be replaced by something much more robust
  cheatExpertSwap(booking, order, request, suggestionId, cb)
  {

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

    // {
    //   "_id": "54c952a3f2c7f80900554313",
    //   "type": "airpair",
    //   "qty": 1,
    //   "unitPrice": 106,
    //   "total": 106,
    //   "balance": 0,
    //   "profit": 33,
    //   "info": {
    //     "expert": {
    //       "userId": "53640d621c67d1a4859d3090",
    //       "avatar": "//0.gravatar.com/avatar/9257dbb2fdd9d164711aa191420ef621",
    //       "name": "Dominic Barnes",
    //       "_id": "53640d81c1acca0200000021"
    //     },
    //     "paidout": false,
    //     "minutes": "60",
    //     "time": "2015-02-28T21:20:22.266Z",
    //     "type": "private",
    //     "name": "60 min (Dominic Barnes)"
    //   }
    // }
    var lineItems = order.lineItems
    var suggestion = _.find(request.suggested, (s)=> _.idsEqual(suggestionId,s._id))
    var expert = suggestion.expert
    var bookingLine = _.find(lineItems,(li)=>li.type=='airpair'&&_.idsEqual(li.info.expert._id,booking.expertId))
    var prevExpert = bookingLine.info.expert
    bookingLine.info.swapped = [_.extend({utc:moment(),prevExpert})]
    bookingLine.info.name = bookingLine.info.name.replace(prevExpert.name,suggestion.expert.name)
    bookingLine.info.expert = _.pick(expert,['_id','userId','name','avatar'])
    booking.gcal = null

    //-- After updating order, change booking
    //---- expertId
    //----
    //---- Find and update expert participant

    booking.expertId = expert._id
    var toRemove = _.find(booking.participants,(p)=>_.idsEqual(p.info._id,prevExpert.userId))
    booking.participants = _.without(booking.participants,toRemove)
    booking.participants.push({ role:"expert", info:{ _id: expert.userId, name: expert.name, email: expert.email } })
    // {
    //     "_id" : ObjectId("54c952a4f2c7f80900554316"),
    //     "createdById" : ObjectId("53a75e911c67d1a4859d3636"),
    //     "customerId" : ObjectId("53a75e911c67d1a4859d3636"),
    //     "expertId" : ObjectId("53640d81c1acca0200000021"),
    //     "type" : "private",
    //     "minutes" : 60,
    //     "status" : "pending",
    //     "datetime" : ISODate("2015-02-28T21:20:22.266Z"),
    //     "orderId" : ObjectId("54c952a3f2c7f80900554315"),
    //     "recordings" : [],
    //     "participants" : [
    //         {
    //             "role" : "customer",
    //             "_id" : ObjectId("54c952a4f2c7f80900554318"),
    //             "info" : {
    //                 "_id" : ObjectId("53a75e911c67d1a4859d3636"),
    //                 "name" : "Leslie Pound",
    //                 "email" : "lesliedpound@gmail.com"
    //             }
    //         },
    //         {
    //             "role" : "expert",
    //             "_id" : ObjectId("54c952a4f2c7f80900554317"),
    //             "info" : {
    //                 "_id" : ObjectId("53640d621c67d1a4859d3090"),
    //                 "name" : "Dominic Barnes",
    //                 "email" : "dominic@dbarnes.info"
    //             }
    //         }
    //     ],
    //     "__v" : 0
    // }

    Order.findByIdAndUpdate(order._id,{ $set:{ lineItems } }, (e,r)=>{
      svc.update(booking._id, booking, (ee,rr)=>{
        get.getByIdForAdmin(booking._id, cb)
      })
    })
  },

}


module.exports = _.extend(get, _.extend(save,admin))
