module.exports = ({ Id, Enum },
  { asSchema, required, index, sparse }) =>


asSchema({

  name:       { type: String, required }, // to help users choose between methods at purchase
  type:       { type: String, required, enum: Enum.PAYMETHOD.TYPE },
  info:       { type: {}, required },
  userId:     { type: Id, ref: 'User', index, sparse },
  companyId:  { type: Id, ref: 'Company', index, sparse }

})
