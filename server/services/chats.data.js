var select = {
  team: {
    'id': 1,
    'name':1
  },
  slackGroup: {
    'id': 1,
    'purpose.value': 1,
    'topic.value': 1,
    'members': 1,
    'is_archived': 1,
    'creator': 1,
    'created':1,
    'name':1
  },
  slackIM: {
    'id': 1,
    'user':1,
    'created':1,
    'is_user_delete':1,
  },
  slackUser: {
    'id': 1,
    'name':1,
    'deleted':1,
    'real_name':1,
    'tz_label': 1,
    'profile.email': 1
  },
}

var query = {}
var options = {}

module.exports = {select,query,options}
