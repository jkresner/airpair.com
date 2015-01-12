var mongoose = require('mongoose')
var {Settings} = require('../../../server/models/v0')
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
  Session: mongoose.model('Session', {_id: String, session: String, expires: Date}, 'v1sessions')
}


function ensureDocument(Model, doc, cb, refresh)
{
  //if (refresh) return
  Model.findByIdAndRemove(doc._id, function(e, r) {
    new Model(doc).save((e,r)=> {
      if (e) $log('ensureDoc'.red, e)
      r.toObject();
      cb(e,r);
    });
  })
}


var db = {
  ObjectId: mongoose.Types.ObjectId,

  Models,

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

  ensureExpert(userKey, cb) {
    var user = data.users[userKey]
    var expert = data.experts[userKey]
    ensureDocument(Models.User, user, () => {
      ensureDocument(Models.Expert, expert, cb)
    })
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
    var bulk = Models[modelName].collection.initializeOrderedBulkOp()
    for (var o of docs) { bulk.insert(o) }
    bulk.execute(cb)
  },

  findAndRemove(modelName, query, cb) {
    Models[modelName].remove(query, cb)
  }
}


module.exports = db
