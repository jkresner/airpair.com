var ObjectId = require('mongoose').Types.ObjectId


function tokenize(term, wildcardStart, wildcardEnd) {
  if (!term) return '.*';

  var regex = '';
  if (wildcardStart) regex += '.*';

  var tokens = term.split(' ');
  if (tokens) regex += tokens.join('.*');
  else regex += term;

  if (wildcardEnd) regex += '.*';

  return regex;
}


export default function(model, logging)
{
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
    newTouch(action) {
      return {
        action,
        utc: new Date(),
        by: { _id: this.user._id, name: this.user.name }
      }
    },
    newId: () => {
      return new ObjectId()
    },
    idFromString: (id) => {
      return ObjectId(id.toString())
    },
    searchMany: searchMany,
    searchOne: searchOne,
    getAll: (cb) => { searchMany({}, null, cb) },
    getById: (id, cb) => { searchOne({_id:id}, null, cb) },
    getByUseId: (id, cb) => { searchOne({userId:id}, null, cb) },
    getManyById: (ids, cb) => { searchMany({_id:{$in:ids}}, null, cb) },
    search(term, fields, limit, select, andQuery, cb) {
      var encodedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}+]/g, '\\$&');
      var query = { '$or': [] }
      if (andQuery) query = _.extend(query, andQuery)
      var regex = new RegExp(tokenize(encodedTerm, true, true), 'i');
      for (var f of fields) {
        var match = {}
        match[f] = regex
        query['$or'].push(match)
      }
      var opts = { options: { limit } }
      if (select) opts.fields = select
      searchMany(query, opts, cb)
    },
    create(o, cb) {
      new model( o ).save( (e,r) => {
        if (e) $log('svc.create.error', e)
        if (logging) $log('svc.create', o)
        if (r) r = r.toObject()
        if (cb) cb(e, r)
      })
    },
    update(id, data, cb) {
      if (!id) return cb(new Error('Cannot update object by null id'), null)
      var ups = _.omit(data, '_id') // so mongo doesn't complain
      model.findByIdAndUpdate(id, ups).lean().exec( (e, r) => {
        if (e) $log('svc.update.error', id, e, data)
        if (logging) $log('svc.updated', r)
        if (cb) cb(e, r)
      })
    },
    updateBulk(list, cb) {
      var bulk = model.collection.initializeOrderedBulkOp()
      for (var item of list) {
        bulk.find({_id:item._id}).updateOne(item)
      }
      bulk.execute(cb)
    },
    updateAndInsertOneBulk(updateList, insert, cb) {
      var bulk = model.collection.initializeOrderedBulkOp()
      bulk.insert(insert)
      for (var item of updateList) {
        bulk.find({_id:item._id}).updateOne(item)
      }
      bulk.execute(cb)
    },
    deleteById(id, cb) {
      if (!id) return cb(new Error('Cannot delete object by null id'), null)
      model.findByIdAndRemove(id, (e) => {
        if (e) $log('svc.delete.error', id, e)
        if (logging) $log('svc.delete', id)
        if (cb) cb(e)
      })
    }
  }
}

