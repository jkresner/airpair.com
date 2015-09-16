var mongoose            = require('mongoose')
var Models = {
  settings: require('../../../server/models/v0').Settings,
  tag: require('../../../server/models/tag'),
  workshop: require('../../../server/models/workshop'),
  view: require('../../../server/models/view'),
  user: require('../../../server/models/user'),
  expert: require('../../../server/models/expert'),
  paymethod: require('../../../server/models/paymethod'),
  post: require('../../../server/models/post'),
  request: require('../../../server/models/request'),
  order: require('../../../server/models/order'),
  booking: require('../../../server/models/booking'),
  company: require('../../../server/models/company'),
  template: require('../../../server/models/template'),
  chat: require('../../../server/models/chat'),
  session: mongoose.model('Session', {_id: String, session: String, expires: Date}, 'v1sessions'),
  v1test: mongoose.model('V1Tests', {}, 'v1tests')
}


function ensureDocument(Model, doc, cb, refresh)
{
  //if (refresh) return
  Model.findByIdAndRemove(doc._id, function(e, r) {
    new Model(doc).save((e,r)=> {
      if (e) $log('ensureDoc'.red, e)
      if (r) r = r.toObject()
      cb(e,r)
    })
  })
}




var db = {

  ObjectId: mongoose.Types.ObjectId,
  ISODate(isoStr) {
    return new Date(isoStr)
  },

  Models,

  ModelById(modelName, id, cb) {
    Models[modelName.toLowerCase()].findOne({_id:id}, cb)
  },

  readDoc(modelName, _id, cb) {
    if (typeof _id === 'string') _id = ObjectId(_id)
    //-- We use the collection property so we don't get
    //-- Mongoose Model defaults and such, hence a pure view of
    //-- What's in the DB
    Models[modelName.toLowerCase()].collection.findOne({_id}, (e,r) => cb(r) )
  },

  readDocs(modelName, query, cb) {
    //-- We use the collection property so we don't get
    //-- Mongoose Model defaults and such
    Models[modelName.toLowerCase()].collection.find(query).toArray((e, r) => cb(r))
  },

  ensureSettings(user, settings, cb) {
    settings.userId = user._id
    ensureDocument(Models.settings, settings, cb)
  },

  ensurePost(post, cb) {
    ensureDocument(Models.post, post, cb)
  },

  ensureDoc(modelName, doc, cb) {
    ensureDocument(Models[modelName.toLowerCase()], doc, cb)
  },

  ensureDocs(modelName, docs, cb) {
    var ordered = false
    var upsert = true

    var upserts = _.map(docs,(update)=>{
      var q = {_id:update._id}
      return { updateOne: { q, u:update, upsert } }
    })

    Models[modelName.toLowerCase()].collection.bulkWrite(upserts, {ordered}, cb)
  },

  ensureTestDocs(testKey, cb) {
    var ensured = 0
    db.readDocs('v1test',{test:testKey},(docs)=>{
      for (var doc of docs) {
        if (true || logging) $log('doc'.cyan, util.ObjectId2Date(doc._id), doc.objectType.gray, doc._id)
        db.ensureDoc(doc.objectType,_.omit(doc,'test','objectType'),(e,r)=>{
          if (++ensured==docs.length) cb(docs)
        })
      }
    })
  },

  findAndRemove(modelName, query, cb) {
    Models[modelName.toLowerCase()].remove(query, cb)
  }
}


module.exports = db
