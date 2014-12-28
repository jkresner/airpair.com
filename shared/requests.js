var util = require('./util')

module.exports = {
  buildDefaultFarmTweet(request) {
    var tags = util.tagsString(request.tags)
    return `Get paid $${request.budget-30}/hr to help w ${ tags } over video chat`
  }
}
