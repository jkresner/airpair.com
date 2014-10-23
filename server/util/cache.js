import * as TagSvc from '../services/tags'
import * as PostsSvc from '../services/posts'

var svcs = {
	tags: TagSvc,
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
  	itemReady('posts', cb)
  })
}

cache.flush = function(key, cb)
{
	delete cache[key]
}


// cache.tag = function(id)
// {
// 	var tags = cache.get('tags')
// 	if (tags)
// 		return tags(id)
// 	else {
// 	}
// }
