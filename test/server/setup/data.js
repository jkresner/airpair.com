var {momentSessionCreated}    = require('../../../shared/util')
var {ObjectId}                = require('mongoose').Types


var dataHelpers = {

  ObjectId,

  newId: () => new ObjectId(),

  timeSeed: () => moment().format('X'),

  userSession(userKey)
  {
    var suffix = dataHelpers.timeSeed()
    var session = { cookie: {
      originalMaxAge: 2419200000,
      _expires: moment().add(2419200000, 'ms').subtract(1,'s') }
    }
    //?? not the best setting global here ....
    cookieCreatedAt = momentSessionCreated(session)
    return {user:null,sessionID:`test${userKey}${suffix}`,session}
  },

  userData(userKey)
  {
    var seed = data.users[userKey]
    var suffix = dataHelpers.timeSeed()
    return {
      email: seed.email.replace('@',suffix+'@'),
      name: seed.name+suffix,
      password: 'testpass'+suffix,
      userKey: userKey+suffix
    }
  },

  expertUserData(userKey)
  {
    var seed = _.clone(data.users[userKey])
    if (!seed || !seed.email) $log('getNewExpertUserData failed need seed user with email'.red)

    seed._id = new ObjectId

    var suffix = moment().format('X')
    seed.email = seed.email.replace('@',suffix+'@'),
    seed.name = seed.name+suffix
    seed.username = seed.name.replace(/ /g,'').toLowerCase()
    seed.password = 'testpass'+suffix
    seed.userKey = userKey + suffix

    if (seed.google) {
      seed.google.id = seed.google.id + suffix
      seed.googleId = seed.google.id
    }

    return seed
  },

  expertData(userKey, user)
  {
    var seed = _.clone(data.experts[userKey])
    if (!seed || !seed.email) $log('getNewExpertData failed, need seed expert'.red)

    seed._id = new ObjectId
    seed.userId = user._id
    seed.name = user.name
    seed.username = user.name.replace(/ /g,'').toLowerCase()
    return seed
  },

  postReview(user)
  {
    return { by: user, type: 'post-survey-inreview', questions: [
      { idx: 0, key: 'rating', promt: 'How many stars?', answer: 4 },
      { idx: 1, key: 'feedback', promt: 'Explain your star rating', answer: 'Good but not great' }
    ] }
  },

  postMeta(post)
  {
    return { title: post.title, description: 'desc',
      canonical: `https//www.airpair.com/v1/posts/{post.slug}`,
      ogTitle: post.title,
      ogImage: post.assetUrl,
      ogDescription: 'desc'
    }
  },

  lotsOfWords(seed)
  {
    var words = (seed || "Start")
    for (var i = 0; i < 501; i++) {
      words += " stuff "
    }
    return words
  }

}

module.exports = dataHelpers
