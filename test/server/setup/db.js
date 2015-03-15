var mongoose            = require('mongoose')
var BSON                = require("bson").BSONPure.BSON
var fs                  = require("fs")
var {Settings}          = require('../../../server/models/v0')
var Models = {
  Settings,
  Tag: require('../../../server/models/tag'),
  Workshop: require('../../../server/models/workshop'),
  View: require('../../../server/models/view'),
  User: require('../../../server/models/user'),
  Expert: require('../../../server/models/expert'),
  PayMethod: require('../../../server/models/paymethod'),
  Post: require('../../../server/models/post'),
  Request: require('../../../server/models/request'),
  Order: require('../../../server/models/order'),
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

  Models,

  RestoreBSONData(done) {
    var bsonDir = __dirname.replace('server', 'data').replace('setup','bson')
    var collections = fs.readdirSync(bsonDir);
    var last = collections.length, index = 0;
    collections.forEach(function(collectionName) {
      var bson = fs.readFileSync(`${bsonDir}/${collectionName}`, { encoding: null })
      var docs = []
      var bsonIndex = 0
      while (bsonIndex < bson.length)
        bsonIndex = BSON.deserializeStream(bson,bsonIndex,1,docs,docs.length)
      var modelName = collectionName.replace('s.bson','')
      modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
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

  readUser(id, cb) {
    Models.User.findOne({_id:id}, (e,r)=> { r.toObject(); cb(e,r); })
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
