// import * as md5           from '../util/md5'
var util =    require('../../shared/util')


var selectFields = {
  matches: {
    '_id': 1,
    'name': 1,
    'email': 1,
    'tags._id': 1,
    'rate': 1
  }
}

module.exports = {

  select: {
    matches: selectFields.matches
  },

  query: {
  }

}
