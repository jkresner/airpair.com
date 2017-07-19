module.exports = ({Id},{required,index,sparse}) => ({

  // required
  by:            { type: Id, ref: 'User', required, index },
  val:           { type: {}, required },

  // optional
  to:            { type: Id, ref: 'User', index, sparse },
  for:           { type: String }

})
