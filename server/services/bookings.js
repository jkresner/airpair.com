import Svc              from '../services/_service'
import Booking          from '../models/booking'
import User             from '../models/user'
import Expert           from '../models/expert'
var OrdersSvc =         require('../services/orders')
var Data =              require('./bookings.data')
var logging =           false
var svc =               new Svc(Booking, logging)
var youTube =           require('./wrappers/youtube')
var util =              require('../../shared/util')

var setAvatarsCB = (cb) =>
  (e, booking) => {
    Data.select.setAvatars(booking)
    cb(e,booking)
  }



var get = {
  getById(id, cb) {
    svc.getById(id, setAvatarsCB(cb))
  },
  getByIdForAdmin(id, cb) {
    svc.getById(id, (e,r) => {
      OrdersSvc.getByIdForAdmin(r.orderId, (ee,order) => {
        r.order = order
        setAvatarsCB(cb)(e,r)
      })
    })
  },
  getByUserId(id, cb) {
    var opts = {}
    svc.searchMany({ customerId: id }, opts, cb)
  },
  getByExpertId(id, cb) {
    var opts = {}
    svc.searchMany({ expertId: id }, opts, cb)
  },
  getByQueryForAdmin(start, end, userId, cb)
  {
    var opts = { fields: Data.select.listAdmin, options: Data.options.orderByDate }
    var query = Data.query.inRange(start,end)
    if (userId) query.customerId = userId
    svc.searchMany(query, opts, (e,r) => {
      for (var o of r) {
        Data.select.setAvatars(o)
      }
      cb(null, r)
    })
  }
}


function create(e, r, user, expert, time, minutes, type, cb) {
  if (e) return cb(e)

  var participants = [
    {role:"customer",info: { _id: user._id, name: user.name, email: user.email } },
    {role:"expert",info: { _id: expert.userId, name: expert.name, email: expert.email } }
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

  mailman.sendPipelinerNotifyBookingEmail(user.name, expert.name, booking._id, ()=>{})

  svc.create(booking, setAvatarsCB(cb))
}

var save = {
  createBooking(expert, time, minutes, type, credit, payMethodId, requestId, cb)
  {
    var createCB = (e, r) => create(e, r, this.user, expert, time, minutes, type, cb)
    OrdersSvc.createBookingOrder.call(this, expert, time, minutes, type, credit, payMethodId, requestId, createCB)
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
  // cheatSwapAnExpert(original, newExpert, requestId, cb){

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

    //-- After updating order, change booking
    //---- expertId
    //----
    //---- Find and update expert participant

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

  // },

  addYouTubeData(original, youTubeId, cb){
    youTube.getVideoInfo(youTubeId, function(err, response){
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
    youTube.getVideoInfo(youTubeId, function(err, response){
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
