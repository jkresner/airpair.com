export default function(model, logging) {
  
  var searchOne = (query, opts, cb) => {
    if (!opts) { opts = { fields:null, options:null } }
    var {fields,options} = opts
    model.findOne(query,fields,options)
      .lean()
      .exec( (e, r) => {
        if (e || logging) { $log('svc.searchOne.err', query, e, cb) }
        cb(e, r)
      } )
  }
  
  var searchMany = (query, opts, cb) => {
    if (!opts) { opts = { fields:null, options:null } }
    var {fields,options} = opts
    model.find(query,fields,options)
      .lean()
      .exec( (e, r) => {
        if (e && logging) { $log('svc.searchMany.err', query, e, cb) }
        cb(e, r)
      } )
  }

  return {
    searchMany: searchMany,
    searchOne: searchOne,    
    getAll: (cb) => { searchMany({}, null, cb) },
    getById: (id, cb) => { searchOne({_id:id}, null, cb) },  
    getByUseId: (id, cb) => { searchOne({userId:id}, null, cb) },  
    create: (o, cb) => {
      new model( o ).save( (e,r) => {
        if (e || logging) { $log('svc.create', o, e) }
        if (r) { r = r.toObject() }
        cb(e, r)
      })
    },
    update: (id, data, cb) => {
      var ups = _.omit(data, '_id') // so mongo doesn't complain
      model.findByIdAndUpdate(id, ups).lean().exec( (e, r) => {
        if (e || logging) { $log('svc.update.error', e, data) }
        cb(e, r)
      })
    } 
  }  
}
  