module.exports = (Id, Enum, {required,trim,lowercase,index,sparse}) => {

  let Reftag = {
    _id:                     { type: Id, ref: 'Tag' },
    sort:                    { type: Number }
  }

  let Reply = {
    by:            { type: Id, ref: 'User', required, index },
    said:          { type: String, required }
  }

  let Vote = {
    // required
    by:            { type: Id, ref: 'User', required, index },
    val:           { type: {}, required },
    // optional
    to:            { type: Id, ref: 'User', index, sparse },
    for:           { type: String }
  }

  return {Reftag,Reply,Vote}

}
