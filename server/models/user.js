var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId


var objectType = ['post','workshop','expert']


var Bookmark = new Schema({
  type:   			{ type: String, required: true,  enum: objectType },
  objectId:     { type: ObjectId, required: true },
  sort: 		    { type: Number, required: true }
})


var TagSlim = new Schema({
  tagId:        { required: true, type: ObjectId, ref: 'Tag'},
  sort:     		{ type: Number, required: true },
})


var Cohort = {
  engagement:   {
    visit_first:          { type: Date },
    visit_last:           { type: Date },    // user this to see if we need to update visit array
    visit_signup:         { type: Date },
    visits:               { type: [Date] },  // array of dates the user came to the site
  },
  aliases:      { type: [String] }
  // requests:     Get by query from Requests
  // orders:       Get by query from Order
  // spend:        Get by query from Orders
  // hrs_on_air:   Get by query from Calls
  // utms          Get by query from Views
}

var Membership = {
  expires:      { type: Date }
}


var User = new Schema({

  email: 								{ type: String, index: { unique: true, sparse: true }, trim: true },
  emailVerified:   			{ type: Boolean, required: true, default: false },
  primaryPayMethodId: 	{ type: ObjectId, ref: 'PayMethod' }, // null indicates user has no payMethod
  membership: 					Membership,

  name: 								{ type: String, trim: true },
  initialis: 						{ type: String, lowercase: true, trim: true },

  username: {
    type: String,
    index: { sparse: true, unique: true, dropDups: true },
    lowercase: true
  },

  roles:           { type: [String] },
  tags:            { type: [TagSlim], 'default': [] },   //-- Stack of the user
  bookmarks:       { type: [Bookmark], 'default': [] },

  cohort:          Cohort,

  bio: String, // Used for blog posts

  local : 							{ password : String, email: String },
  googleId: 						{ type: String, sparse: true, unique: true, dropDups: true },
  google: {},
  githubId: Number,
  github: {},
  twitterId: Number,
  twitter: {},
  linkedinId: String,
  linkedin: {},
  stackId: Number,
  stack: {},
  bitbucketId: String,
  bitbucket: {},

});


// ap v.0 schema
  // name: String,
  // email: String,
  // pic: String,
  // githubId: Number,
  // github: {},
  // googleId: {
  //   required: true,
  //   type: String,
  //   index: {
  //     unique: true,
  //     dropDups: true
  //   }
  // },
  // google: {},
  // twitterId: Number,
  // twitter: {},
  // linkedinId: String,
  // linkedin: {},
  // stackId: Number,
  // stack: {},
  // bitbucketId: String,
  // bitbucket: {},
  // referrer: {}

module.exports = mongoose.model('User', User)
