var logging = false

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
      // if (key == 'tags')
        // cache['tag_slugs'] = hashEm(list, key, 'slug')
      cb()
    })
  }
}

itemReady('posts', () => {
  // $log('CACHED.POSTS')
})


cache.flush = function(key, cb)
{
  if (key == 'posts') cache.postAllPublished = null
  delete cache[key]
}


cache.bookmark = function(type, id)
{
  if (!cache[type+'s']) return { url: 'cache not loaded', title: '' }
  return cache[type+'s'][id]
}


cache.tmpl = function(type, key, cb)
{
  // console.log(`cache['templates']`, cache['templates'].length, type, key,
    // cache['templates'][`${type}:${key}`])
  cb( cache['templates'][`${type}:${key}`] )
}


cache.tagBySlug = function(slug)
{
  if (!cache['tag_slugs']) {
    // $log('building.cache.tag_slugs', Object.keys(cache.tags).length)
    cache['tag_slugs'] = {}
    Object.keys(cache.tags).forEach( id =>
      cache['tag_slugs'][cache.tags[id].slug] = cache.tags[id])
  }

  return cache['tag_slugs'][slug]
}


// //-- Could make this generic, but we don't want to allow the cache to start
// //-- accepting arbitary things
// cache.pullRequests = function(repo, getterCB, cb)
// {
//   if (!cache['post_prs']) cache['post_prs'] = {}
//   if (cache['post_prs'][repo])
//     return cb(null, cache['post_prs'][repo])
//   getterCB((e,r)=>{
//     if (e) return cb(e)
//     cache['post_prs'][repo] = r
//     $log("set cache['post_prs']".trace, repo)
//     cb(null,r)
//   })
// }


// cache.slackUsers = function(getterCB, cb)
// {
//   if (cache['slack_users'])
//     return cb(null, cache['slack_users'])
//   getterCB((e,r)=>{
//     if (e) return cb(e)
//     cache['slack_users'] = r
//     $log("set cache['slack_users']".trace, r.length)
//     cb(null,r)
//   })
// }


cache.slackGroups = function(getterCB, cb)
{
  if (cache['slack_groups'])
    return cb(null, cache['slack_groups'])
  getterCB((e,r)=>{
    if (e) return cb(e)
    cache['slack_groups'] = r
    $log("set cache['slack_groups']".trace, r.length)
    cb(null,r)
  })
}
