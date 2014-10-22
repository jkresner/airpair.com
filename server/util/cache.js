import * as TagSvc from '../services/tags'

global.cache = {
	tags: 			null,
	posts: 			null
}


//-- For O(1) access instead of O(N)
function hashEm(list, objectName, hashAttributeName) {
	$log(`hashing.${objectName}`, hashAttributeName, list.length)
	var hash = []
	for (var o of list) {
		var id = o[hashAttributeName]
		hash[id] = o
	}
	return hash
}

// Todo make async
TagSvc.getAllForCache((e, tags) => cache.tags = hashEm(tags, 'tags', '_id') )

cache.get = function(key)
{
	$log('cache.get', key)
	if (cache[key] != null) return cache[key]

	// if (key == 'tags')
	// 	TagSvc.getAllForCache((e, tags) => cache.tags = hashEm(tags, 'tags', '_id') )

	// while (cache[key] == null) {
	// 	$log('waiting')
	// }
	// $log('passed while')
	return cache[key]
}
