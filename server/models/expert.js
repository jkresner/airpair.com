var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var Coupon = {
  code:           { required: true, type: String },
  rate:           { required: true, type: Number }
}

var Bookme = {

  enabled:        { required: true, type: Boolean    },  // allow us or the expert to turn themselves off
  urlSlug:        { required: true, type: String, index: true }, // https://www.airpair.com/@domenic (urlSlug == 'domnic')
  noIndex:        { type: Boolean, default: false    },  // no index for crawlers
  rate:           { required: true, type: Number     },  // experts external rate
  rake:           { required: true, type: Number     },  // allow the expert commission deals
  coupons:        [Coupon],                              // allow the expert to hand out promotions
  urlBlog:        String,                                // www.airpair.com/node.js/expert-training-domenic-denicola
  youTubeId:      String,                                // youtube movie
  // creditRequestIds: { type: [ObjectId] },  # Requests that credits can be applied for

}

module.exports = mongoose.model('Expert', new Schema({

  userId:         { required: true, type: ObjectId, ref: 'User' },
  name:           { required: true, type: String },
  username:       { required: true, type: String },
  email:          { required: true, type: String },
  gmail:          { required: true, type: String },
  pic:            { required: true, type: String },
  homepage:       String,
  sideproject:    String,
  other:          String,
  gp:             {},          // googleplus
  gh:             {},          // github
  so:             {},          // stackoverflow
  bb:             {},          // bitbucket
  in:             {},          // linkedIn
  tw:             {},          // twitter
  tags:           [{}],
  rate:        		Number,
  minRate:        Number,
  timezone:       String,
  location:       String,
  brief:          String,
  status:         String,
  availability:   String,
  hours:          String,
  bookMe:         { required: false, type: Bookme },
  busyUntil:      { type: Date, default: Date },
  updatedAt:      { type: Date, default: Date },
  karma:          { required: true, type: Number, default: 0 }

}))
