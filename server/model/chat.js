module.exports = ({ Id, Enum },
  { asSchema, required, index, unique }) =>


asSchema({

  synced:       { type: Date,   required },
  // lastMgs:      { type: Date,   required: true },
  type:         { type: String, required, enum: Enum.CHAT.TYPE },
  provider:     { type: String, required, enum: Enum.CHAT.PROVIDER },
  providerId:   { type: String, required, index, unique },
  info:         { type: {},     required },
  history:      { type: []      },

})

