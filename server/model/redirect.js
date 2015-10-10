module.exports = ({ Id, Enum },
  { asSchema, required, trim, lowercase, unique }) =>


  asSchema({
    previous:  { type: String, required, trim, lowercase, unique },
    current:   { type: String, required, trim, lowercase },
    type:      { type: String, required, enum: Enum.REDIRECT.TYPE, default: '301' }
  })


