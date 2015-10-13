module.exports = ({ Id, Enum, Touch, Reftag, Note, Location },
  { asSchema, required, trim, lowercase, unique, sparse }) => {


var github = {
  login:                     { type: String, trim, required },
  id:                        { type: Number, required },
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
  tokens:                    { type: {}, required }
}

var google = {
  id:                        { type: Number, required, unique },
  email:                     { type: String, trim },
  emails:                    { type: [] },
  displayName:               { type: String, trim },
  verified_email:            { type: Boolean },
  tokens:                    { type: {}, required }
}

return asSchema({

  email:                    { type: String, unique, sparse, trim, lowercase },
  emailVerified:            { type: Boolean, required, default: false },
  primaryPayMethodId:       { type: Id, ref: 'PayMethod' }, // null indicates user has no payMethod

  name:                     { type: String, required, trim },
  initials:                 { type: String, lowercase, trim },
  username:                 { type: String, lowercase, unique, sparse },
  roles:                    { type:[String]},
  bio:                      { type: String }, // Used for blog posts

  cohort: {                  // Data that effects app behavior by user segments
    engagement: {
      visit_first:           { type : Date },
      visit_last:            { type : Date },     // user this to see if we need to update visit array
      visit_signup:          { type : Date },
      visits:                { type :[Date]},   // array of dates the user came to the site
    },
    aliases:                 { type :[String]},  // list of anonymous sessionIDs that logged in as user
    firstRequest:            {}                  // used to target users arriving from specific campains
  },

  location:                  { type: Location },
  raw: {
    locationData:            { type: {}, required: false } // Used to recalcuate timeZone
  },

  auth: {                               // Full copies of profile data from oAuth
    password: {
      value:                 { type: String }
    },   // to login in conjunction with any verified email in user.emails
    tw:                      { type: {}, required: false },
    so:                      { type: {}, required: false },
    gh:                      { type: github, required: false },
    gp:                      { type: google, required: false },
    in:                      { type: {}, required: false },
    bb:                      { type: {}, required: false },
    al:                      { type: {}, required: false },
    sl:                      { type: {}, required: false },
  },


  siteNotifications:    [],
  tags:                 [],
  bookmarks:            [],
})

}

