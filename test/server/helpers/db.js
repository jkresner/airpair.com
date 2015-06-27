var mongoose            = require('mongoose')
var Models = {
  Settings: require('../../../server/models/v0').Settings,
  Tag: require('../../../server/models/tag'),
  Workshop: require('../../../server/models/workshop'),
  View: require('../../../server/models/view'),
  User: require('../../../server/models/user'),
  Expert: require('../../../server/models/expert'),
  PayMethod: require('../../../server/models/paymethod'),
  Post: require('../../../server/models/post'),
  Request: require('../../../server/models/request'),
  Order: require('../../../server/models/order'),
  Booking: require('../../../server/models/booking'),
  Company: require('../../../server/models/company'),
  Template: require('../../../server/models/template'),
  Session: mongoose.model('Session', {_id: String, session: String, expires: Date}, 'v1sessions')
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

  RestoreBSONData(done) {
    //-- Require inline for faster tests running
    var BSON                = require("bson").BSONPure.BSON
    var fs                  = require("fs")

    var bsonDir = __dirname.replace('server', 'data').replace('helpers','bson')
    var bsonFiles = _.where( fs.readdirSync(bsonDir), (c) => c.indexOf('.bson') != -1 )
    var last = bsonFiles.length, index = 0;
    bsonFiles.forEach(function(bsonFile) {
      var bson = fs.readFileSync(`${bsonDir}/${bsonFile}`, { encoding: null })
      var docs = []
      var bsonIndex = 0
      while (bsonIndex < bson.length)
        bsonIndex = BSON.deserializeStream(bson,bsonIndex,1,docs,docs.length)

      var modelName = bsonFile.replace('s.bson','')
      modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1)
      $log(`Mongo.BSON.Restore: ${modelName} (${docs.length})`.cyan)
      db.ensureDocs(modelName, docs, (e,r) => {
        if (e) return done(e)
        if (last === ++index) return done(null)
      })
    })
  },

  initCollectionData(modelName, initalizedCheck, initalizationEntries, done) {
    Models[modelName].findOne(initalizedCheck, function(e,r) {
      if (!r) {
        var bulk = Models[modelName].collection.initializeOrderedBulkOp()
        for (var entry of initalizationEntries) {
          bulk.insert(entry)
        }
        bulk.execute(done)
        $log(`initalized ${modelName} with ${initalizationEntries.length} entries`.cyan)
        cache.flush(modelName.toLowerCase())
      }
      else
        done()
    })
  },

  ModelById(modelName, id, cb) {
    Models[modelName].findOne({_id:id}, cb)
  },

  viewsByUserId(userId, cb) {
    Models.View.find({userId}, cb)
  },

  viewsByAnonymousId(anonymousId, cb) {
    Models.View.find({anonymousId}, cb)
  },

  readDoc(modelName, _id, cb) {
    if (typeof _id === 'string') _id = ObjectId(_id)
    //-- We use the collection property so we don't get
    //-- Mongoose Model defaults and such, hence a pure view of
    //-- What's in the DB
    Models[modelName].collection.findOne({_id}, (e,r) => cb(r) )
  },

  readDocs(modelName, query, cb) {
    //-- We use the collection property so we don't get
    //-- Mongoose Model defaults and such
    Models[modelName].collection.find(query).toArray((e, r) => cb(r))
  },

  ensureSettings(user, settings, cb) {
    settings.userId = user._id
    ensureDocument(Models.Settings, settings, cb)
  },

  ensurePost(post, cb) {
    ensureDocument(Models.Post, post, cb)
  },

  ensureDoc(modelName, doc, cb) {
    ensureDocument(Models[modelName], doc, cb)
  },

  ensureDocs(modelName, docs, cb) {
    var bulk = Models[modelName].collection.initializeUnorderedBulkOp()
    for (var o of docs) {
      bulk.find({_id:o._id}).upsert().replaceOne(o)
    }
    bulk.execute(cb)
  },

  findAndRemove(modelName, query, cb) {
    Models[modelName].remove(query, cb)
  }
}


module.exports = db
