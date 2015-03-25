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
    var svc = require(`../services/${key}`)
    svc.getAllForCache( (e, list) => {
      cache[key] = hashEm(list, key, '_id')
      if (key == 'tags')
        cache['tag_slugs'] = hashEm(list, key, 'slug')
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
  if (!cache[type+'s']) return { url: 'cache not loaded', title: '' }
  return cache[type+'s'][id]
}


cache.tmpl = function(type, key, cb)
{
  itemReady('templates', () =>
    cb( cache['templates'][`${type}:${key}`] )
  )
}

cache.tagBySlug = function(slug, cb)
{
  if (!cache['tag_slugs']) return { slug: 'cache-not-loaded', name: 'tagBySlug' }
  return cache['tag_slugs'][slug]
}
