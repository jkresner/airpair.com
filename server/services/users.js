// import BaseService from './_service'
import User from '../models/user'

var logging = false

//-- TODO, move upsert fn into the UserService class
// Add the user if new, or updating if existing base on the search
// If a new user we intelligently link analytics and track signup 
var upsertSmart = (search, update, done) => {
  User.findOne(search, (e, r) => {
    if (e) { return done(e) }
    if (!r)
    {
      console.log('alias')
      console.log('track','signup')
    }
    User.findOneAndUpdate(search, update, { upsert: true }, (err, user) => {
      $log('User.upsert', err && err.stack, JSON.stringify(user))
      done(err, user)
    })
  })
}

class UserService {

  // constructor(user) {
  //   super(user)
  // }

  upsertProviderProfile(loggedInUser, providerName, profile, done) {

    var search = {}
    search[providerName+'Id'] = profile.id
    if (loggedInUser) {
      search = { '_id': loggedInUser._id }
    }

    var update = {}
    update[providerName+'Id'] = profile.id
    update[providerName] = profile

    upsertSmart(search, update, done)
  }

  getById(id, cb) {
    User.findOne({_id:id},null,null)
      .lean()
      .exec( (e, r) => {
        cb(e, r)
      })
  }  
}

export default UserService