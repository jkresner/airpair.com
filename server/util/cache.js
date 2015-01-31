import * as PostsSvc from '../services/posts'
import * as WorkshopsSvc from '../services/workshops'
var TagSvc               = require('../services/tags')

var svcs = {
  tags: TagSvc,
  workshops: WorkshopsSvc,
  posts: PostsSvc
}

global.cache = {}

//-- For O(1) access instead of O(N)
function hashEm(list, objectName, hashAttributeName) {
  // $log(`hashing.${objectName}`, hashAttributeName, list.length)
  var hash = []
  for (var o of list) {
    var id = o[hashAttributeName]
    hash[id] = o
  }
  return hash
}


function itemReady(key, cb)
{
  if (cache[key] != null) return cb()
  else {
    svcs[key].getAllForCache( (e, list) => {
      cache[key] = hashEm(list, key, '_id')
      cb()
    })
  }
}

cache.ready = function(keys, cb)
{
  itemReady('tags', () => {
    itemReady('workshops', () => {
      itemReady('posts', cb)
    })
  })
}

cache.flush = function(key, cb)
{
  delete cache[key]
}


cache.bookmark = function(type, id)
{
  if (!cache[type+'s']) return { url: 'cache no loaded', title: '' }
  return cache[type+'s'][id]
}
