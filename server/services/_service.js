export default function(model, logging) {
  
  var searchOne = (query, opts, cb) => {
    if (!opts) { opts = { fields:null, options:null } }
    var {fields,options} = opts
    model.findOne(query,fields,options)
      .lean()
      .exec( (e, r) => {
        if (e && logging) { $log('svc.searchOne.err', query, e, cb) }
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
    Forbidden: (message) => {
      var e = new Error(message)
      e.status = 403
      return e
    },
    searchMany: searchMany,
    searchOne: searchOne,    
    getAll: (cb) => { searchMany({}, null, cb) },
    getById: (id, cb) => { searchOne({_id:id}, null, cb) },  
    getByUseId: (id, cb) => { searchOne({userId:id}, null, cb) },  
    create: (o, cb) => {
      new model( o ).save( (e,r) => {
        if (e && logging) { $log('svc.create', o, e) }
        if (r) { r = r.toObject() }
        if (cb) cb(e, r)
      })
    },
    update: (id, data, cb) => {
      if (!id) return cb(new Error('Cannot update object by null id'), null) 
      var ups = _.omit(data, '_id') // so mongo doesn't complain
      model.findByIdAndUpdate(id, ups).lean().exec( (e, r) => {
        if (e && logging) { $log('svc.update.error', id, e, data) }
        if (cb) cb(e, r)
      })
    },
    deleteById: (id, cb) => {
      if (!id) return cb(new Error('Cannot delete object by null id'), null) 
      model.findByIdAndRemove(id, (e) => {
        if (e || logging) { $log('svc.delete', e) }
        if (cb) cb(e)
      })
    }
  }  
}
  