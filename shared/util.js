var idsEqual = (id1, id2) =>
  id1.toString() == id2.toString()
 

module.exports = {


  idsEqual: idsEqual,


  ObjectId2Date: (id) => {
    return new Date(parseInt(id.toString().slice(0, 8), 16) * 1000)
  },


  toggleItemInArray: (array, item) => {
    if (!array) return [item] 
    else 
    {
      var existing = _.find(array, (i) => idsEqual(i._id,item._id))
      if (existing) return _.without(array, existing) 
      else return array.push(t)
    } 
  },


  sessionCreatedAt: (session) => {
    return new moment(session.cookie._expires).subtract(session.cookie.originalMaxAge,'ms').toDate()
  },


  dateWithDayAccuracy: () => {
    return moment('yyyy-MM-dd', moment().format('yyyy-MM-dd')).toDate()
  }


}