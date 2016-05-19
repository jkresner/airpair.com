module.exports = ({ Id, Enum, Touch, Reftag, Note, Htmlhead, Meta },
  { asSchema, required, trim, lowercase, index, unique, sparse }) => {


return asSchema({

  //-- un-nest userId
  by:              {},
  // info: {
    title:            { type: String, required, trim },
    slug:             { type: String, unique, sparse, lowercase, trim },
    tags:             [Reftag],
    //-- rename to tileUrl ?
    assetUrl:         { type: String, trim },
    htmlHead:         Htmlhead,
  // }

  reviews:         [{}],
  forkers:         [asSchema({
    userId:        { type: Id, ref: 'User', required, index }
  })],
  subscribed:      [asSchema({
    userId:        { type: Id, ref: 'User', required, index },
    mail:          { type: String, required }
        // "off" for no emails, "primary" for user.email or an address
  })],

  stats:           {},

  // content: {
    md:               { type: String, required },
    tmpl:             { type: String, enum: Enum.POST.TEMPLATE },
  // }

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

  //-- new
  meta:             Meta,
  history:          {},
    // created:          { type: Date, required, 'default': Date },
    //-- consider removing 'updated' as supersceded by lastTouch
    // updated:          { type: Date, required, 'default': Date },
    // submitted:        { type: Date },
    // published:        { type: Date }, // first time
    // live: {
      // by:            { type: Id, ref: 'User' },
      // commit:        { type: {} }, // sha hash or whole commit object
      // published:     { type: Date }, // lasttime timestamp of update
    // }
  // },

})

}
