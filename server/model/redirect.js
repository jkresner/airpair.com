module.exports = ({ Id, Enum },
  { asSchema, required, trim, lowercase, unique }) =>


asSchema({

    url:       { type: String, required, trim, lowercase, unique },
    to:        { type: String, required, trim, lowercase },
    type:      { type: String, required, enum: Enum.REDIRECT.TYPE, default: '301' }

})


