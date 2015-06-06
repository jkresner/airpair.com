var logging                 = false
var RequestsSvc             = require('../services/requests')
var OrdersSvc               = require('../services/orders')
import Svc                  from '../services/_service'
import Booking              from '../models/booking'
import Order                from '../models/order'
var svc                     = new Svc(Booking, logging)
var {select,query,options}  = require('./bookings.data')
var {setAvatarsCB}          = select.cb
var Roles                   = require('../../shared/roles')


var get = {

  getById(id, cb) {
    svc.getById(id, setAvatarsCB((e,r)=>{
      if (r && !Roles.isAdmin(this.user)) {
        var isParticipant = false
        for (var p of r.participants) {
          if (_.idsEqual(p.info._id, this.user._id)) isParticipant = true
        }
        if (!isParticipant) return cb(Error(`You[${this.user._id}] are not a participants to this booking[${r._id}]`))
      }
      cb(e,r)
    }))
  },

  getByIdForAdmin(id, cb) {
    svc.getById(id, (e,r) => {
      if (!r.orderId) return setAvatarsCB(cb)(e,r) //is a migrated booking from v0 call
      OrdersSvc.getByIdForAdmin(r.orderId, (ee,order) => {
        r.order = order
        if (!order.requestId) return setAvatarsCB(cb)(e,r)
        RequestsSvc.getByIdForAdmin(order.requestId, (eee,request) => {
          r.request = request
          setAvatarsCB(cb)(eee,r)
        })
      })
    })
  },

  getByUserId(id, cb) {
    var opts = {}
    svc.searchMany({ customerId: id }, opts, cb)
  },

  getByExpertId(expertId, cb) {
    svc.searchMany({ expertId }, { fields: select.experts }, select.cb.inflateAvatars(cb))
  },

  getByQueryForAdmin(start, end, userId, cb) {
    var q = query.inRange(start,end)
    if (userId) q['participants.info._id'] = userId

    Booking.find(q, select.listAdmin)
      .populate('orderId', 'lineItems.info.paidout lineItems.info.released')
      .sort(options.orderByDate.sort)
      .lean().exec(select.cb.inflateAvatars((e,r)=>{
        for (var b of r) {
          if (!b.orderId)
            $log('no order', b._id)
          else
            b.paidout = _.find(b.orderId.lineItems||[],(li)=>
              li.info!=null&&li.info.paidout!=null)

          if (b.paidout) b.paidout = b.paidout.info
          if (b.orderId) delete b.orderId.lineItems
        }
        cb(e,r)
      }))
  }

}


function create(e, r, user, expert, time, minutes, type, cb) {
  if (e) return cb(e)

  var participants = [
    {role:"customer",info: { _id: user._id, name: user.name, email: user.email } },
    {role:"expert",info: { _id: expert.userId, name: expert.name||expert.user.name, email: expert.email||expert.user.email } }
  ]

  var booking = {
    _id: svc.newId(),
    createdById: user._id,
    customerId: user._id, // consider use case of expert creating booking
    expertId: expert._id,
    participants,
    type,
    minutes,
    status: 'pending',
    datetime: time,
    gcal: {},
    orderId: r._id
  }

  var d = {byName:user.name,expertName:expert.name, bookingId:booking._id}
  mailman.send('pipeliners', 'pipeliner-notify-booking', d, ()=>{})

  svc.create(booking, setAvatarsCB(cb))
}

var save = {

  createBooking(expert, time, minutes, type, credit, payMethodId, requestId, dealId, cb)
  {
    var createCB = (e, r) => create(e, r, this.user, expert, time, minutes, type, cb)
    OrdersSvc.createBookingOrder.call(this, expert, time, minutes, type, credit, payMethodId, requestId, dealId, createCB)
  },

  updateByAdmin(original, update, cb) {
    // $log('updateByAdmin', original, update)
    if (original.datetime != update.datetime)
    {
      $log('changing the date yea!', original.datetime, update.datetime)
      original.datetime = update.datetime
      original.minutes = update.minutes
    }

    original.status = update.status

    if (update.sendGCal) {
      var attenddees = []
      for (var p of update.participants) attenddees.push({email:p.info.email})
      var cust = _.find(update.participants, (a)=>a.role=='customer')
      var exp = _.find(update.participants, (a)=>a.role=='expert')
      var name = `AirPair ${util.firstName(cust.info.name)} + ${util.firstName(exp.info.name)}`
      var description = `Your matchmaker, will set up a Google
hangout for this session and share the link with you a few
minutes prior to the session.

You are encouraged to make sure beforehand your mic/webcam are working
on your system. Please let your matchmaker know if you'd like to do
a dry run.

Booking: https://airpair.com/booking/${original._id}`
      console.log('update.sendGCal.notify', update.sendGCal.notify)

      if (original.gcal) cb("GCal updated not yet built")
      else {
        Wrappers.Calendar.createEvent(name, update.sendGCal.notify, moment(update.datetime), update.minutes, attenddees, description, 'pg', (e,r) => {
          $log('event created', e, r)
          if (e) return cb(e)
          original.gcal = r
          svc.update(original._id, original, (e,r) => {
            if (e || !r) return cb(e,r)
            get.getByIdForAdmin(r._id,cb)
          })
        })
      }
    }
    else
      svc.update(original._id, original, (e,r) => {
        if (e || !r) return cb(e,r)
        get.getByIdForAdmin(r._id,cb)
      })
  },


  //-- Short cut needs to be replaced by something much more robust
  cheatExpertSwap(booking, order, request, suggestionId, cb) {

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

  addYouTubeData(original, youTubeId, cb){
    Wrappers.YouTube.getVideoInfo(youTubeId, function(err, response){
      if (err){
        return cb(Error(err),data)
      }
      original.status = "followup"
      var data = {}
      data = response.snippet;
      data.youTubeId = response.id;
      delete(data.thumbnails) //can be derived from YouTube ID
      original.recordings.push({type: "youTube", data})
      svc.update(original._id, original, (e,r) => {
        if (e || !r) return cb(e,r)
          get.getByIdForAdmin(r._id,cb)
      })
    });
  },

  addHangout(original, youTubeId, youTubeAccount, hangoutUrl, cb){
    Wrappers.YouTube.getVideoInfo(youTubeId, function(err, response){
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
      svc.update(original._id, original, (e,r) => {
        if (e || !r) return cb(e,r)
          get.getByIdForAdmin(r._id,cb)
        })
      });
  },

  confirmBooking()
  {
    cb(Error('confirmBooking not implemented'))
  }
}


module.exports = _.extend(get, save)
