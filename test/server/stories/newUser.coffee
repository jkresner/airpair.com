
UNIQUIFY_USER = (key) ->
  uniqueKey = FIXTURE.uniquify('users', key, 'name email linked.gh.id key')
  Object.assign(FIXTURE.users[uniqueKey],{key:uniqueKey})


module.exports = (key, opts, done) ->
  {data,paymethod,login} = opts
  userId = new ObjectId()
  user = _.extend(UNIQUIFY_USER(key),data||{})
  user._id = userId

  paymethodId = if paymethod is true then new ObjectId() else null
  if paymethodId
    paymethod = _.extend({_id:paymethodId,userId}, FIXTURE.paymethods.braintree_visa)
    user.primaryPayMethodId = paymethodId
    DB.Collections.paymethods.insert paymethod, ->

  # temporary stuff
  user.emailVerified = true
  user.localization = FIXTURE.wrappers.localization_melbourne

  DB.Collections.users.insert user, (e, r) ->
    if login
      LOGIN user, (session) ->
        if (paymethodId)
          session.primaryPayMethodId = paymethodId # convinience
        done session
    else
      done user.key


