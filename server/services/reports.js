// import User                from '../models/user'
// import Order                from '../models/order'
// import Request              from '../models/request'
// var colors = require('colors')

// var condP = (val, truth, tCol, fCol) => {
//   if (truth)
//     return colors[tCol](val.toString())
//   else
//     return colors[fCol](val.toString())
// }


// var get = {

//   getOrderReports(cb) {
//     var {select,query,opts} = require('./orders.data')
//     var end = moment().format("x")
//     var startOfWeek = moment().startOf('week').add(-1, 'day')
//     var start = moment(startOfWeek).add(-28, 'day')
//     var q = query.inRange(start.format("x"),end)

//     // $log('q', start.toDate(), end, startOfWeek.toDate())
//     Order.find(q, select.listAdminReport, opts.orderByNewest)
//       .lean().exec( (e,r)=>{

//       var zeroOrdersCount=0,total=0,profit=0,count=0,cust=0
//       var customers = {}
//       var wks = {}
//       var bucket = 0
//       for (var o of r) {
//         if (o.total == 0)
//         {
//           zeroOrdersCount++
//         }
//         else
//         {
//           count++
//           total = total+o.total
//           profit = profit+o.profit
//           if (!customers[o.by.email]) {
//             cust++
//             customers[o.by.email] = {total: o.total, count: 1}
//           }
//           else {
//             customers[o.by.email].total+=o.total
//             customers[o.by.email].count++
//           }

//           if (moment(o.utc).isBefore(startOfWeek))
//           {
//             bucket++
//             startOfWeek = startOfWeek.add(-7,'day')
//           }
//           var bk = bucket.toString()

//           // $log('bucket', moment(o.utc).isAfter(startOfWeek), bk.magenta, o.utc, startOfWeek.toString().blue)
//           // $log('cust', o.by)
//           if (!wks[bk]) wks[bk] = {
//             start: moment(startOfWeek),
//             end: moment(startOfWeek).add(6,'day'),
//             total:0,profit:0,count:0,customers:{},cust:0
//           }
//           wks[bk].count ++
//           wks[bk].total = wks[bucket].total+o.total
//           wks[bk].profit = wks[bucket].profit+o.profit
//           if (!wks[bk].customers[o.by.email]) {
//             wks[bk].cust++
//             wks[bk].customers[o.by.email] = {total: o.total, count: 1}
//           }
//           else {
//             wks[bk].customers[o.by.email].total+=o.total
//             wks[bk].customers[o.by.email].count++
//           }
//         }
//       }

//       cb(null,{ wkRev: {zeroOrdersCount,cust,count,total,profit,wks}})
//     })
//   },

//   updateCohorts(cb) {
//     var usersWorders = {}
//     Order.find({total:{'$gt':0}}, {userId:1,utc:1,total:1})
//       .lean().exec( (e,orders)=>{
//         $log(orders.length)
//         for (var o of orders) {
//           if (!usersWorders[o.userId])
//             usersWorders[o.userId] = { count: 1, total: o.total }
//           else {
//             usersWorders[o.userId].count++
//             usersWorders[o.userId].total = o.total
//           }
//           cb()
//         }
//     })
//     // User.find({}, {name:1,cohort:1})
//     //   .lean().exec( (e,users)=>{
//     //     $log(users.length)
//     //     cb()
//     // })
//   },

//   getRequestReports(cb) {
//     var {calcMeta} = require('../../shared/requests')
//     var {select,query,opts} = require('./requests.data')
//     var startOfWeek = moment().startOf('week').add(-1, 'day')
//     var start = moment(startOfWeek).add(-21, 'day')
//     var end = moment(startOfWeek).add(-14, 'day')
//     var qq = query.submittedInRange(start.format("x"),end.format("x"))
//     $log('start', start.toString(), 'end', end.toString())
//     Request.find(qq, select.pipeline)
//       .populate('userId', 'email primaryPayMethodId cohort.engagement localization.location')
//       .lean().exec( (e,reqs)=>{

//         var wkSummary = {
//           time: { regular: 0, rush: 0, later: 0  },
//           status: { complete: 0, canceled: 0, booked: 0, review: 0, waiting: 0 }
//         }

//         var requests = []
//         for (var r of _.sortBy(reqs,'time')) {
//           r.meta = calcMeta(r)
//           wkSummary.time[r.time]++
//           wkSummary.status[r.status]++

//           var minToSubmit = util.dehumanize(r.meta.timeToSubmit).asMinutes()
//           var timeToReceived = util.dehumanize(r.meta.timeToReceived).asMinutes()
//           var timeToReviewable = util.dehumanize(r.meta.timeToReviewable).asMinutes()
//           var timeToBook = util.dehumanize(r.meta.timeToBook).asHours()
//           var avail = _.filter(r.suggested,(s)=>s.expertStatus == 'available').length

//           $log(moment(r.adm.submitted).format('MM.DD:HH').white,
//             r.time.toUpperCase(),
//             r.budget.toString().cyan,
//             r.status,
//             moment(r.userId.cohort.engagement.visit_first).format('YYYY.MM.DD').yellow,
//             `[${r.suggested.length}|${avail}]`,
//             condP(minToSubmit,minToSubmit<5,'blue','cyan'),
//             condP(timeToReceived,timeToReceived>15,'red','green'),
//             condP(timeToReviewable,timeToReviewable>180||timeToReviewable==0,'red','cyan'),
//             condP(timeToBook,timeToBook>12||timeToBook==0,'red','green'),
//             r.by.name.yellow,
//             (r.userId.primaryPayMethodId) ? "Y".green : "_".gray,
//             (r.userId.localization) ? r.userId.localization.location.white : "unknown".gray
//           )

//           var {_id,budget,suggested,status,time,adm,by,tags} = r
//           requests.push({
//               _id,budget,suggested,status,time,adm,by,tags,
//               user:r.userId,
//               minToSubmit,timeToReceived,timeToReviewable,timeToBook,avail
//             })
//         }
//         cb(null, { requests, wkSummary })
//     })
//   }
// }


// module.exports = get
