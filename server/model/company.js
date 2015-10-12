module.exports = ({ Id, Enum, Touch },
  { asSchema, required, index, sparse }) => {

var type = ['enterpise','individual','startup','smb']


var Member = asSchema({
  userId:        { type: Id, ref: 'User', required, index },
  name:          { type: String, required },
  companyEmail:  { type: String, required },
  enabled:       { type: String, required, default: true }
})



return asSchema({

  name:         { type: String, required },
  url:          { type: String },
  about:        { type: String },
  type:         { type: String, required, enum: type },
  adminId:      { type: Id, ref: 'User', index, sparse },
  contacts:     { type: [] },         //-- v0 need to migrate and remove
  members:      { type: [Member] }    //-- Members belonging to the company

})


}
