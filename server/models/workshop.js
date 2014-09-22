//-- Coffee Compiled from ap.v0
var Attendee, Mixed, ObjectId, Schema, mongoose, schema, _ref;

mongoose = require('mongoose');

Schema = mongoose.Schema;

_ref = Schema.Types, ObjectId = _ref.ObjectId, Mixed = _ref.Mixed;

Attendee = new Schema({
  userId: {
    required: true,
    type: ObjectId,
    ref: 'User'
  },
  orderId: {
    required: true,
    type: ObjectId,
    ref: 'Order'
  }
});

schema = new Schema({
  slug: {
    required: true,
    type: String,
    unique: true,
    lowercase: true
  },
  title: String,
  description: String,
  difficulty: String,
  speakers: {
    required: true,
    type: [Mixed]
  },
  time: Date,
  attendees: {
    type: [Attendee],
    "default": []
  },
  duration: String,
  updatedAt: {
    type: Date,
    "default": Date
  },
  price: {
    required: true,
    type: Number
  },
  tags: {
    type: [String],
    "default": []
  },
  "public": {
    type: Boolean,
    "default": false
  },
  youtube: String
});

export default mongoose.model('Workshop', schema);