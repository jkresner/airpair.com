module.exports = ({ Id, Enum, Touch, Reftag, Note },
  { asSchema, required, trim, lowercase, unique, sparse }) =>

asSchema({

  email:                { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  emailVerified:        { type: Boolean, required: true, default: false },
  primaryPayMethodId:   { type: Id, ref: 'PayMethod' }, // null indicates user has no payMethod

  name:                     { type: String, trim },
  initials:                 { type: String, lowercase, trim },
  username:                 { type: String, lowercase, unique, sparse },
  roles:                    [String],
  bio:                      { type: String }, // Used for blog posts

  cohort: {
    engagement: {
      visit_first:          { type: Date },
      visit_last:           { type: Date },    // user this to see if we need to update visit array
      visit_signup:         { type: Date },
      visits:               { type: [Date] },  // array of dates the user came to the site
    },
    maillists:              { type: [String] },
    expert:                 {
      // _id:                  { type: Id, ref: 'Expert' },
      // applied:              { type: Date },
    },
    aliases:                { type: [String] },
    firstRequest:           {}
  },

  localization: {
    location:           String,
    locationData:       {},
    timezone:           String,
    timezoneData:       {}
  },

  local: {
    changeEmailHash:        String,
    emailHashGenerated:     Date,
    password :              String,
    changePasswordHash:     String,
    passwordHashGenerated:  Date
  },

  siteNotifications:    [],
  tags:                 [],
  bookmarks:            [],

  googleId:             { type: String, sparse: true, unique: true, dropDups: true },
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

  social: {
    tw: {},
    so: {},
    gh: {},
    in: {},
    bb: {},
    al: {},
    gp: {},
    sl: {}
  }

});
