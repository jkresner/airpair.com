// var nestedPick = (object, keys) => {
//   if (!object) return null

//   // Pick out elements marked as pick
//   var copy  = {}
//   var arrayKeys = {}
//   for (var key of keys)
//   {
//     var props = key.split('.')
//     if (props.length === 1)
//     {
//       // Pick the marked element
//       if (typeof object[key] !== "undefined" && object[key] !== null)
//         copy[key] = object[key]
//     }
//     else if (object[props[0]])
//     {
//       var nestedKey = key.replace(`${props[0]}.`,'')
//       // Pick recursively and apply only if something was picked
//       if (object[props[0]].constructor === Array) {
//         arrayKeys[props[0]] = arrayKeys[props[0]] || {}
//         arrayKeys[props[0]][nestedKey] = 1
//       }
//       else
//       {
//         //-- If an array
//         var result = nestedPick(object[props[0]], [nestedKey])
//         // $log('result'.yellow, props[0].yellow, result)
//         if (!_.isEmpty(result)) {
//           if (!copy[props[0]]) copy[props[0]] = result
//           else {
//             // $log('result', props[0].white, nestedKey.yellow, result)
//             // $log('copy[props[0]]', nestedKey.yellow, copy[props[0]])
//             if (nestedKey.indexOf('.') == -1) {
//               copy[props[0]] = _.extend(copy[props[0]],result)
//               // $log(`copy[${props[0]}]`.cyan, copy[props[0]])
//             } else {
//               var topProp = nestedKey.split('.')[0]
//               // $log(`topProp[${props[0]}]`.cyan, topProp, result)
//               if (copy[props[0]][topProp] && result[topProp])
//                 copy[props[0]][topProp] = _.extend(copy[props[0]][topProp],result[topProp])
//               else if (result[topProp])
//                 copy[props[0]][topProp] = result[topProp]
//               // $log(`topProp[${props[0]}]`.cyan, topProp, copy[props[0]])
//             }
//           }
//         }
//       }
//     }
//   }
//   for (var arrayKey of _.keys(arrayKeys))
//   {
//     copy[arrayKey] = []
//     // $log('arrayKeys[arrayKey]'.cyan, object[arrayKey], _.keys(arrayKeys[arrayKey]))
//     for (var i=0;i<object[arrayKey].length;i++) {
//       // $log('array item nestedKey'.red, arrayKeys[arrayKey], i, arrayKeys[arrayKey])
//       // $log('blue'.blue, object[arrayKey][i], _.keys(arrayKeys[arrayKey]))
//       var result = nestedPick(object[arrayKey][i], _.keys(arrayKeys[arrayKey]))
//       // $log('result'.red, result)
//       if (!_.isEmpty(result))
//         copy[arrayKey][i] = result
//     }
//   }

//   return copy
// }


var util = {

  // endsWith(str, suffix) {
  //   return str.indexOf(suffix, str.length - suffix.length) !== -1;
  // },


  datetime: {
    dawn: () => moment('20121225','YYYYMMDD'),
    anHourAgo: () => moment().add(-1,'hour'),
    today: () => moment(moment().format('YYYY MMM DD'), 'YYYY MMM DD'),
    now: () => moment(),
    in48hours: () => moment().add(48,'hours'),
    firstOfMonth: (add) => moment(moment().format('YYYY MMM'), 'YYYY MMM').add(add,'months'),
    inRange: (datetime, start, end) =>
      util.dateInRange(moment(datetime),util.datetime[start](),util.datetime[end]())
  },

  dehumanize(durationStr) {
    if (!durationStr) return moment.duration()
    if (durationStr == "a minute") durationStr = "1 minutes"
    if (durationStr == "an hour") durationStr = "1 hours"
    var d = {}
    var bits = durationStr.split(' ')
    d[bits[1]] = parseInt(bits[0])
    return moment.duration(d)
  },

  dateInRange(date, start, end)
  {
    var isAfterStart = (start) ? date.isAfter(start) : true
    var isBeforeEnd = (end) ? date.isBefore(end) : true
    return isAfterStart && isBeforeEnd
  },


  dateWithDayAccuracy(mom) {
    if (!mom) mom = moment()
    return moment(mom.format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate()
  },

  idsEqual(id1, id2) {
    return id1.toString() == id2.toString()
  },

  ObjectId2Date(id) {
    return new Date(parseInt(id.toString().slice(0, 8), 16) * 1000)
  },


  ObjectId2Moment(id) {
    return moment(util.ObjectId2Date(id))
  },


  ObjectCreatedInRange(obj, start, end) {
    var created = util.ObjectId2Date(obj._id)
    return dateInRange(created, start, end)
  },


  ObjectCreatedToday(obj) {
    var today = moment().startOf('day')
    return util.ObjectCreatedInRange(obj, today, today.add(1, 'days'))
  },

  // http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
  htmlEscape(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  },
  codeblockUnescape(str) {
    if (!str) return
    var blocks = str.match(/\<pre\>[\s\S]*\<\/pre\>/)
    if (!blocks) return str
    blocks.forEach(function(m){
      var clean = m
        .replace(/&amp;/g,'&')
      str = str.replace(m,clean)
    })
    return str
  },

  toggleItemInArray(array, item, comparator) {
    if (!array) return [item]
    else
    {
      if (!comparator) { comparator = (i) => util.idsEqual(i._id,item._id) }
      var existing = _.find(array, comparator)
      if (existing) return _.without(array, existing)
      else {
        return _.union(array,[item])
      }
    }
  },


  combineItems(array1, array2, compareProp) {
   if (!array1 && !array2) return []
   if (!array1 || array1.length == 0) return array2
   if (!array2 || array2.length == 0) return array1

   for (var item of array2) {
     var existing = _.find(array1,
       (i) => util.idsEqual(i[compareProp],item[compareProp]))

     if (!existing) array1.push(item)
   }

   return array1
  },


  // momentSessionCreated(session) {
  //   return new moment(session.cookie._expires).subtract(session.cookie.originalMaxAge,'ms')
  // },



  firstName(name) {
    return name.split(' ')[0]
  },


  lastName(name) {
    return name.replace(name.split(' ')[0]+ '' , '').trim()
  },


  // selectFromObject(obj, selectList) {
  //   if (!obj || !selectList) return obj
  //   var keys = selectList
  //   if (selectList.constructor == Object) keys = _.keys(selectList)
  //   return nestedPick(obj, keys)
  // },


  // isBot(useragent, pattern) {
  //   // $log('isBot?', !useragent || useragent == "null", pattern)
  //   if (!useragent || useragent == "null" || useragent == "") return true // browser and even bots should have a defined user agent
  //   var source = useragent.replace(/^\s*/, '').replace(/\s*$/, '')
  //   return pattern.test(source)
  // },

  stringToJson(content) {
    return (typeof content == 'string') ? JSON.parse(content) : content
  },


  tagsString(tags,limit,braces) {
    // if nobraces then return tagsStringNobraces tags, limit
    var oBrace = '', cBrace = '';
    if (braces) var oBrace = '{', cBrace = '}';

    var t = tags
    if (!t || t.length == 0) return
    if (t.length == 1) return `${oBrace}${t[0].slug}${cBrace}`

    if (limit && t.length > limit) t = t.slice(0, limit)

    var ts = `${oBrace}${t[0].slug}${cBrace}`
    for (var i=1;i<t.length;i++) {
      if (i == t.length - 1)
        ts += ` and ${oBrace}${t[i].slug}${cBrace}` // and instead of & to fix urls
      else
        ts += `, ${oBrace}${t[i].slug}${cBrace}`
    }
    return ts
  }

}

module.exports = util
