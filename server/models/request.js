var mongoose = require('mongoose')
var {ObjectId} = mongoose.Schema


var TagSlim = new mongoose.Schema({
  _id:          { required: true, type: ObjectId, ref: 'Tag'},
  slug:         { type: String, required: true },
  sort:         { type: Number, required: true },
})


var V0_REQUEST_STATUS = [
  'received',       //: requires review by airpair
  'incomplete',     //: more detail required
  'holding',        //: waiting for go ahead by customer
  'waiting',        //: no experts available yet
  'pending',        //: [bookme] customer put in request and expert has to confirm
  'review',         //: customer must review & choose one or more experts
  'scheduling',     //: call needs to be scheduled
  'scheduled',      //: one or more calls already scheduled
  'consumed',       //: feedback on all calls collected, but lead still warm for up-sell
  'complete',       //: transaction final and time to archive
  'canceled',       //: company has canceled the request
  'deferred',       //: customer indicated they need more time
]


var REQUEST_TYPE = [
  'troubleshooting',
  'mentoring',
  'code-review',
  'resources',
  'advice',
  'vetting',
  'other'
]


var REQUEST_EXPERIENCE = [
  'beginner',
  'proficient',
  'advanced'
]


var REQUEST_TIME = [
  'regular',
  'rush'
]



module.exports = mongoose.model('Request', new mongoose.Schema({

  userId:           { required: true, type: ObjectId, ref: 'User', index: true },
  by:               {},
  type:             { required: true, type: String, enum: REQUEST_TYPE },
  tags:             [TagSlim],
  experience:       { type: String, enum: REQUEST_EXPERIENCE },
  brief:            { type: String   },
  hours:            { type: String   },
  time:             { type: String, enum: REQUEST_TIME },
  budget:           { type: Number   },

  status:           { required: true, type: String, enum: V0_REQUEST_STATUS },
  suggested:        [], //Suggestion

  // New v1

  //company:          { required: true, type: {} }
  // contacts { userId, fullName, email }

  owner:            String,
  marketingTags:    { type: [{}], default: [] }

}))


// v0 attrs
// availability:     String
// timezone:         String
// calls:            [Call]
// canceledDetail:   String
// incompleteDetail: String
// events:           { required: true, type: [{}]     }
// pricing:          { required: true, type: String, enum: VALID_CALL_TYPES   }
