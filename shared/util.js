var botPattern = /googlebot|gurujibot|twitterbot|yandexbot|slurp|msnbot|bingbot|QuerySeekerSpider|facebookexternalhit/i

var idsEqual = (id1, id2) =>
  id1.toString() == id2.toString()

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


module.exports = {


  idsEqual: idsEqual,


  ObjectId2Date: (id) => {
    return new Date(parseInt(id.toString().slice(0, 8), 16) * 1000)
  },


  toggleItemInArray: (array, item, comparator) => {
    if (!array) return [item]
    else
    {
      if (!comparator) { comparator = (i) => idsEqual(i._id,item._id) }
      var existing = _.find(array, comparator)
      if (existing) return _.without(array, existing)
      else {
        return _.union(array,[item])
      }
    }
  },


combineItems: (array1, array2, compareProp) => {
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


  sessionCreatedAt: (session) => {
    return new moment(session.cookie._expires).subtract(session.cookie.originalMaxAge,'ms').toDate()
  },


  dateWithDayAccuracy: (mom) => {
    if (!mom) mom = moment()
    return moment(mom.format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate()
  },


  firstName: (name) => {
    return name.split(' ')[0]
  },


  lastName: (name) => {
    return name.replace(name.split(' ')[0]+ '' , '')
  },


  selectFromObject: (obj, selectList) => {
    if (!obj || !selectList) return obj
    else return nestedPick(obj, _.keys(selectList))
  },


  isBot: (useragent) => {
    if (!useragent) return true // browser and even bots should have a defined user agent
    var source = useragent.replace(/^\s*/, '').replace(/\s*$/, '')
    return botPattern.test(source)
  }

}
