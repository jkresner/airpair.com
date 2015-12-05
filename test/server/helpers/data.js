
var dataHelpers = {


  // expertUserData(userKey)
  // {
  //   var seed = _.clone(data.users[userKey])
  //   if (!seed || !seed.email) $log('getNewExpertUserData failed need seed user with email'.red)

  //   seed._id = new ObjectId

  //   var suffix = moment().format('X')
  //   seed.email = seed.email.replace('@',suffix+'@'),
  //   seed.name = seed.name+suffix
  //   seed.username = seed.name.replace(/ /g,'').toLowerCase()
  //   seed.password = 'testpass'+suffix
  //   seed.userKey = userKey + suffix
  //   seed.localization = data.wrappers.localization_melbourne
  //   seed.initials = "ap-#{timeSeed()}"

  //   if (seed.google) {
  //     seed.google.id = seed.google.id + suffix
  //     seed.googleId = seed.google.id
  //   }

  //   return seed
  // },

  // expertData(userKey, user)
  // {
  //   var seed = _.clone(data.experts[userKey])
  //   if (!seed) $log('getNewExpertData failed, need seed expert'.red)

  //   seed._id = new ObjectId
  //   seed.userId = user._id
  //   seed.user = user
  //   return seed
  // },

  // lotsOfWords(seed)
  // {
  //   var words = (seed || "Start")
  //   for (var i = 0; i < 501; i++) {
  //     words += " stuff "
  //   }
  //   return words
  // }

}

module.exports = dataHelpers
