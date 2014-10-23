
var idsEqual = (id1, id2) =>
  id1.toString() == id2.toString()


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
      	array.push(item)
      	return array
      }
    }
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
  }


}
