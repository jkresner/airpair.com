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


// cache.get = function(key, cb)
// {
// 	$log('cache.get', key)
// 	if (cache[key] != null) return cache[key]

// 	svcs[key].getAllForCache( (e, list) => {
// 		cache[key] = hashEm(list, key, '_id')
// 		cb()
// 	})

// 	return null
// }

// cache.tag = function(id)
// {
// 	var tags = cache.get('tags')
// 	if (tags)
// 		return tags(id)
// 	else {

// 	}
// }


// {
// 	$log('cache.get', key)
// 	if (cache[key] != null) return cache[key]

// 	// if (key == 'tags')
// 	// 	new Promise((resolve, reject) => {
// 	// 		TagSvc.getAllForCache((e, tags) => {
// 	// 			cache.tags = hashEm(tags, 'tags', '_id')
// 	// 			resolve()
// 	// 		})
// 	// 	})

// 	svcs[key].getAllForCache( (e, list) => cache[key] = hashEm(list, key, '_id') )

//  	var i = 1
//   var j = 1
// 	var count = _.debounce(function() { i=i+1; $log('wait.i', i); return cache[key] }, 1000)
// 	while (count() == null)
// 	{
// 		j = j + 1
// 		// $log('wait.j', j)
// 	}

// 	// $log('ho')
// 	// var count =	_.throttle(function() { i=i+1; $log('wait', i)}, 1000)
// 	// while(cache[key] == null)
// 	// {
// 	// 	count()
// 	// }
// 	// $log('hey')

// 	return cache[key]
// }
