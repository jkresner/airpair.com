var Schema, User, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

User = new Schema({

  email: {
    type: String,
    index: {
      unique: true,
      dropDups: true
    }
  },
  emailVerified: { type: Boolean, required: true, default: false },
  name: String,
  initialis: String, 

  username: {
    type: String,
    index: {
      sparse: true,      
      unique: true,
      dropDups: true
    }
  },

  // Track user behavior / profile
  // cohort: {
  //   type: {},
  // },

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