module.exports = ({ Id, Enum, Touch, Reftag, Note, Htmlhead, Meta },
  { asSchema, required, trim, lowercase, index, unique, sparse }) => {


var userId     = { type: Id, ref: 'User', required, index }
var forkers    = [asSchema({userId})]
var subscribed = [asSchema({userId, mail: { type: String, required }})]
var replies    = [asSchema(require('./cell/reply')({Id},{required,index,sparse}))]
var votes      = [asSchema(require('./cell/vote')({Id},{required,index,sparse}))]


var reviews    = [asSchema({
  by:            userId,
  val:           { type: Number },
  said:          { type: String },
  replies,
  votes,
  updated:       { type: Date } // Legacy ?
})]

var Author = {
  _id:              { type: Id, ref: 'User', required, index },
  avatar:           { type: String, required },
  bio:              { type: String },
  email:            { type: String },
  name:             { type: String, required },
  links: {
    al:             { type: String },
    ap:             { type: String },
    bb:             { type: String },
    gh:             { type: String },
    gp:             { type: String },
    in:             { type: String },
    so:             { type: String },
    tw:             { type: String }
  }
}


return asSchema({

  //-- un-nest userId
  by:               Author,

  // page: {
    type:           { type: String, enum: Enum.POST.TYPE },
    title:          { type: String, required, trim },
    slug:           { type: String, unique, sparse, lowercase, trim },
    tags:           [Reftag],
    htmlHead:       Htmlhead, //-- rename ?
    //-- rename to tileUrl ?
    assetUrl:         { type: String, trim },
  // }

  votes,
  reviews,
  forkers,
  subscribed,

  stats: {
    rating:           { type: Number },
    reviews:          { type: Number },
    comments:         { type: Number }, // includes reviews & replies
    forkers:          { type: Number },
    acceptedPRs:      { type: Number },
    closedPRs:        { type: Number },
    openPRs:          { type: Number },
    words:            { type: Number },
    views:            { type: Number }, // per week
    // shares:           { type: Number },
  },

  // content: {
    md:               { type: String, required },
    tmpl:             { type: String, enum: Enum.POST.TEMPLATE },
  // }
  media: {
    imgur:            { type: String },
  },

  // TO review in 0.6.5
  github: {
    repoInfo: {
      authorTeamId:   { type: String },
      authorTeamName: { type: String },
      author:         { type: String },
      url:            { type: String, lowercase },
      // SHA of file ?
    },
    events:           [],
    stats:            [] //Object?
  },

  meta:             Meta,
  history: {
    created:        { type: Date, required, 'default': Date },
    submitted:      { type: Date },
    published:      { type: Date }, // first time
    live: {
      by:           { type: Id, ref: 'User' },
      published:    { type: Date }, // time-stamp last live version updated
      commit:       { type: {} }, // sha hash or whole commit object
    },
    // consider what 'updated' represents - edited by author or other ?
    updated:        { type: Date, required, 'default': Date },
  },


})

}
