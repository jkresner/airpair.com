var logging = false


class BaseService {
  
  constructor(user) {
    // Idea is that all our logic services are identity aware of the
    // user that is executing code via this.usr
    this.usr = user
  }

  searchMany(query, opts, cb) {
    if (!opts) { opts = { fields:null, options:null } }

    $log('searchMany', query, opts);    
    var {fields,options} = opts;
    $log(fields,options);
    this.model.find(query,fields,options)
      .lean()
      .exec( (e, r) => {
        // if (e && logging) 
        $log('svc.searchMany.err', query, e, cb)

        cb(e, r)
      } )
  }

  // searchOne(query, opts, cb) =>
  //   opts = {} if !opts?
  //   {fields,options} = opts
  //   @model.findOne(query,fields,options).lean().exec (e, r) =>
  //     if e && @logging then $log 'svc.searchOne.err', query, e
  //     cb e, r

  getAll(cb) {
    $log('getAll', this)
    this.searchMany({}, null, cb)
  }

  // getByUserId(userId, cb) => @searchMany {userId}, {}, cb
  // getById(id, cb) => @searchOne {_id: id}, {}, cb
}

export default BaseService