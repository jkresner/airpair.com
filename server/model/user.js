module.exports = ({ Id, Enum, Touch, Reftag, Note, Location },
  { asSchema, required, trim, lowercase, index, unique, sparse }) => {

Enum.USER = {
  SCOPES: ['admin','spinner','pipeliner','post:editor','post:moderator','expert:trusted','expert:approved'],
  EMAIL_SOURCE: ['manual:input','oauth:github','oauth:google','connect:company'],
  EMAIL_CONVERT_TYPE: ['open','click','goal']
}

var authGithub = {
  login:                     { type: String, trim },
  id:                        { type: Number, index, sparse, unique },
  avatar_url:                { type: String, trim },
  gravatar_id:               { type: String, trim },
  name:                      { type: String, trim },
  company:                   { type: String, trim },
  blog:                      { type: String, trim, lowercase },
  location:                  { type: String, trim },
  email:                     { type: String, trim },
  hireable:                  { type: Boolean },
  bio:                       { type: String, trim },
  public_repos:              { type: Number },
  public_gists:              { type: Number },
  followers:                 { type: Number },
  following:                 { type: Number },
  created_at:                { type: String, trim },
  updated_at:                { type: String, trim },
  private_gists:             { type: Number },
  total_private_repos:       { type: Number },
  owned_private_repos:       { type: Number },
  plan: {
    name:                    { type: String, trim, lowercase },
    collaborators:           { type: Number },
    private_repos:           { type: Number }
  },
  tokens:                    { type: {} }
}

var authGoogle = {
  id:                        { type: String, index, unique, sparse },
  displayName:               { type: String, trim },
  picture:                   { type: String, trim, lowercase },
  gender:                    { type: String, trim, lowercase },
  emails:                    { type: [] },
  verified:                  { type: Boolean },
  url:                       { type: String, trim, lowercase },
  link:                      { type: String, trim, lowercase },
  //-- legacy
  name:                      {}, //{ type: String, trim },
  email:                     { type: String, trim },
  verified_email:            { type: Boolean },
  tokens:                    { type: {} }
}

var email = {
  _id:                     { type: Id },
  value:                   { type: String, required, lowercase, trim }, //, unique, sparse: false },
  verified:                { type: Boolean, required },
  origin:                  { type: String, enum: Enum.USER.EMAIL_SOURCE },
  primary:                 { type: Boolean, required },
  removed:                 { type: Date },   // Stop email being used / shown by AirPair
//-- Start: Would be nice to oursouce these features
  lists:                   { type: [String] },  // (whitelist) 'AirPair Newsletter' / 'AirPair Content Digest'
  // silenced:                { type: [String] },  // (blacklist) 'expert-available' / 'new-message'
  // activity: {
    // sent: [{
      // utc:                   { type: Date },
      // subject:               { type: String },
//-- mechanism to confirm msgs get to inbox and signal address is no longer being checked
      // conversion:            [{
        // _id:                  { type: Id },                   // _id force generated to stamp time
        // type:                 { type: String, enum: Enum.USER.EMAIL_CONVERT_TYPE },
        // value:                { type: String }
      // }]
    // }],
  // }
}

return asSchema({

  email:                    { type: String, unique, sparse, trim, lowercase },
  emailVerified:            { type: Boolean, required, default: false },

  emails:                   { type: [email] }, // requied true

  primaryPayMethodId:       { type: Id, ref: 'PayMethod' }, // null indicates user has no payMethod

  name:                     { type: String, required, trim },
  initials:                 { type: String, lowercase, trim },
  username:                 { type: String, lowercase, unique, sparse },
  bio:                      { type: String }, // Used for blog posts
  location:                 { type: Location },
  raw: {
    locationData:           { type: {}, required: false } // Used to recalcuate timeZone
  },


  auth: {                               // Full copies of profile data from oAuth
    password: {
      hash:                  { type: String }
    },   // to login in conjunction with any verified email in user.emails
    tw:                      { type: {}, required: false },
    so:                      { type: {}, required: false },
    gh:                      authGithub,
    gp:                      authGoogle,
    in:                      { type: {}, required: false },
    bb:                      { type: {}, required: false },
    al:                      { type: {}, required: false },
    sl:                      { type: {}, required: false },
  },

  cohort: {                  // Data that effects app behavior by user segments
    engagement: {
      visit_first:           { type : Date },
      visit_last:            { type : Date },     // user this to see if we need to update visit array
      visit_signup:          { type : Date },
      visits:                { type :[Date]},   // array of dates the user came to the site
    },
    aliases:                 { type :[String]},  // list of anonymous sessionIDs that logged in as user
    firstRequest:            { type: {}, required: false }  // used to target users arriving from specific campains
  },

  roles:                   { type: [String], required: false },

  legacy: {                  required:false, type: {
    siteNotifications:       { type: [], required: false },
    tags:                    { type: [], required: false },
    bookmarks:               { type: [], required: false }
  }}

})

}

