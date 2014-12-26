var botPattern = /googlebot|gurujibot|twitterbot|yandexbot|slurp|msnbot|bingbot|rogerbot|MetaURI|Hatena|PaperLiBot|QuerySeekerSpider|AhrefsBot|EmailMarketingRobot|ShowyouBot|facebookexternalhit/i


var nestedPick = (object, keys) => {
  if (!object) return null

  // Pick out elements marked as pick
  var copy  = {}
  for (var key of keys)
  {
    var props = key.split('.')
    if (props.length === 1)
    {
      // Pick the marked element
      if (typeof object[key] !== "undefined" && object[key] !== null)
        copy[key] = object[key]
    }
    else
    {
      // Pick recursively and apply only if something was picked
      var result = nestedPick(object[props[0]], [key.replace(`${props[0]}.`,'')])
      if (!_.isEmpty(result))
        copy[props[0]] = result
    }
  }

  return copy
}


var util = {

  dateInRange(date, start, end)
  {
    var isAfterStart = (start) ? date.isAfter(start) : true
    var isBeforeEnd = (end) ? date.isBefore(end) : true
    return isAfterStart && isBeforeEnd
  },


  idsEqual(id1, id2) {
    return id1.toString() == id2.toString()
  },


  ObjectId2Date(id) {
    return new Date(parseInt(id.toString().slice(0, 8), 16) * 1000)
  },


  ObjectCreatedInRange(obj, start, end) {
    var created = util.ObjectId2Date(obj._id)
    return dateInRange(created, start, end)
  },


  ObjectCreatedToday(obj) {
    var today = moment().startOf('day')
    return util.ObjectCreatedInRange(obj, today, today.add(1, 'days'))
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
       (i) => idsEqual(i[compareProp],item[compareProp]))

     if (!existing) array1.push(item)
   }

   return array1
  },


  momentSessionCreated(session) {
    return new moment(session.cookie._expires).subtract(session.cookie.originalMaxAge,'ms')
  },


  dateWithDayAccuracy(mom) {
    if (!mom) mom = moment()
    return moment(mom.format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate()
  },


  firstName(name) {
    return name.split(' ')[0]
  },


  lastName(name) {
    return name.replace(name.split(' ')[0]+ '' , '')
  },


  selectFromObject(obj, selectList) {
    if (!obj || !selectList) return obj
    else return nestedPick(obj, _.keys(selectList))
  },


  isBot(useragent) {
    if (!useragent) return true // browser and even bots should have a defined user agent
    var source = useragent.replace(/^\s*/, '').replace(/\s*$/, '')
    return botPattern.test(source)
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
