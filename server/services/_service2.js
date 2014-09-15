export default function(model, logging) {
  
  
  var searchMany = (query, opts, cb) => {
    if (!opts) { opts = { fields:null, options:null } }

    $log('searchMany', query, opts);    
    var {fields,options} = opts;
    model.find(query,fields,options)
      .lean()
      .exec( (e, r) => {
        if (e && logging) { $log('svc.searchMany.err', query, e, cb) }
        cb(e, r)
      } )
  }


  return {
    searchMany: searchMany,
    getAll: (cb) => {
      searchMany({}, null, cb)
    },
    create: (o, cb) => {
      new model( o ).save( (e,r) => {
        if (e || logging) { $log('svc.create', o, e) }
        cb(e, r)
      })
    }
  }  
}


// // searchOne(query, opts, cb) =>
// //   opts = {} if !opts?
// //   {fields,options} = opts
// //   @model.findOne(query,fields,options).lean().exec (e, r) =>
// //     if e && @logging then $log 'svc.searchOne.err', query, e
// //     cb e, r

// // getByUserId(userId, cb) => @searchMany {userId}, {}, cb
// // getById(id, cb) => @searchOne {_id: id}, {}, cb