injectOAuthPayoutMethod = (user, providerName, pmKey,cb) ->
  require('../../../server/services/paymethods').addOAuthPayoutmethod.call({user},
    providerName, FIXTURE.clone('paymethods.'+pmKey),{},(e,r)->cb(r))

newUser = require('./newUser')


module.exports = (key, opts, done) ->
  timeSeed = DATA.timeSeed()

  if !done and opts.constructor is Function
    done = opts
    opts = {login:false}

  {data,login} = opts

  user = newUser(key, opts, )

  # $log('STORY.newExpert.user.key'.white, user.key, user)
  DB.ensureDoc 'User', user, (e, r) ->
    FIXTURE.users[user.key] = user
    LOGIN user.key, {retainSession:false}, (s) ->
      s.userKey = user.key
      d = rate: 70, breif: 'yo', tags: [FIXTURE.tags.angular], userId: r._id, _id: new ObjectId()
      DB.ensureDoc 'Expert', d, (e, expert) ->
        # $log('STORY.newExpert.expert', expert)
        expect(expert._id, "no expert id")
        FIXTURE.experts[user.key] = expert
        if !opts.payoutmethod
          done(s, expert)
        else
          injectOAuthPayoutMethod s, 'paypal', 'payout_paypal_enus_verified', (payoutmethod) ->
            done expert, s, payoutmethod
