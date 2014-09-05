var Schema, VALID_LEVELS, mongoose, schema;

mongoose = require('mongoose');

Schema = mongoose.Schema;

VALID_LEVELS = ['beginner', 'intermediate', 'expert'];

schema = new Schema({
  name: {
    required: true,
    type: String
  },
  short: {
    required: true,
    type: String
  },
  desc: String,
  soId: {
    type: String,
    unique: true,
    sparse: true
  },
  so: {},
  ghId: {
    type: String,
    unique: true,
    sparse: true
  },
  gh: {},
  tokens: String, // extra comma separated strings to assist search
  levels: [String]
});

module.exports = mongoose.model('Tag', schema);