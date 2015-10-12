var {Survey} = require("../models/_shared")

module.exports = ({ Id, Enum, Touch, Reftag, Note, Htmlhead },
  { asSchema, required, trim, lowercase, index, unique, sparse }) => {


var Author = {
  userId:       { type: Id, ref: 'User', required, index },
  expertId:     { type: Id, ref: 'Expert' },
  name:         { type: String, required },
  avatar:       { type: String, required },
  bio:          { type: String, required },
  username:     { type: String, lowercase },
  social:       {
      gh: {     username: { type: String } },
      so: {     link: { type: String } },
      bb: {     username: { type: String } },
      in: {     id: { type: String } },
      tw: {     username: { type: String } },
      al: {     username: { type: String } },
      gp: {     link: { type: String } }
  }
}

var StatsSummary = {
  rating:           { type: Number },
  reviews:          { type: Number },
  comments:         { type: Number }, // includes reviews & replies
  forkers:          { type: Number },
  acceptedPRs:      { type: Number },
  closedPRs:        { type: Number },
  openPRs:          { type: Number },
  shares:           { type: Number },
  words:            { type: Number },
}

var Github =    {
  repoInfo:     {
    authorTeamId:   { type: String },
    authorTeamName: { type: String },
    author:         { type: String },
    url:            { type: String, lowercase },
    // SHA of file ?
  },
  events:           [],
  stats:            [] //Object?
}

var Forker = asSchema({
  userId:       { type: Id, ref: 'User', required, index },
  name:         { type: String, trim },
  email:        { type: String, trim, lowercase },
  social:       {
    gh:         { username: { type: String } }
  }
})


var PublishEvent = asSchema({
  touch:        Touch,
  commit:       { type: {} }, // sha hash
})


return asSchema({

  by:               Author,
  created:          { type: Date, required, 'default': Date },

  lastTouch:        Touch,
  //-- consider removing 'updated' as supersceded by lastTouch
  updated:          { type: Date, required, 'default': Date },

  submitted:        { type: Date },

  published:        { type: Date }, // first time
  publishedBy: {
    _id:            { type: Id, ref: 'User' },
    name:           { type: String },
  },
  publishedCommit:  { type: {} }, // sha hash or whole commit object
  publishedUpdated: { type: Date }, // lasttime timestamp of update

  reviews:          [asSchema(Survey)],
  forkers:          [Forker],
  github:           { type: Github },
  slug:             { type: String, unique, sparse, lowercase, trim },
  title:            { type: String, required, trim },
  md:               { type: String, required  },
  assetUrl:         { type: String, trim },
  tags:             [Reftag],
  tmpl:             { type: String, enum: Enum.POST.TEMPLATE },
  meta:             Htmlhead,

  editHistory:      [Touch],
  publishHistory:   [PublishEvent],

  stats:            StatsSummary,

  prize: {
    comp:       { type: String, enum: Enum.POST.COMP },
    sponsor:    { type: String },
    name:       { type: String },
    tag:        { type: String },
  }

})

}
