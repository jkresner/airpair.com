var Schema, User, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

objectType = ['post','workshop','expert']

var Note = {  
  utc:          { type: Date, required: true },  
  byId:         { required: true, type: ObjectId, ref: 'User'},  
  content:      { required: true, type: String, trim: true }
}

var TagSlim = {  
  _id:          { required: true, type: ObjectId, ref: 'Tag'},  
  name:         { required: true, type: String, trim: true },
  slug:         { required: true, type: String, lowercase: true, trim: true }  
}


var Bookmark = new Schema({  
  utc:          { type: Date, required: true },  
  objectId:     { type: ObjectId, required: true },
  objectType:   { enum: objectType, type: String, required: true },  
  url:          { type: String, required: true },  
  priority:     { type: Number, required: true },    
  name:         { type: String, required: true }
})

var Cohort = {  
  stack:        { type: [TagSlim], 'default': [] },  
  bookmarks:    { type: [Bookmark], 'default': [] },  
  requests:     { type: Number, required: true },    
  notes:        { type: [String] },    
  engagement:   {
    first_visit:    { type: Date },  
    last_visit:     { type: Date },    // user this to see if we need to update visit array
    visits:         { type: [Date] },
    spend:          { type: Number, required: true },    
    hrs_on_air:     { type: Number, required: true },        
    airpairs:       { type: Number, required: true },
    emails:         {
      sent:           [{}],
      lists:          {}
    },
    social:         { following: ['fb', 'tw'] }
  }
};


User = new Schema({

  email: {
    type: String,
    index: {
      unique: true,
      dropDups: true
    },
    trim: true
  },
  emailVerified: { type: Boolean, required: true, default: false },
  name: { type: String, trim: true },
  initialis: { type: String, lowercase: true, trim: true },

  username: {
    type: String,
    index: {
      sparse: true,      
      unique: true,
      dropDups: true
    },
    lowercase: true
  },

  roles: { type: [String] },

  // Track user behavior / profile
  cohort: { type: Cohort },

  bio: String, // Used for blog posts

  local : {
    password : String
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
    dropDups: true
  },
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

export default mongoose.model('User', User);