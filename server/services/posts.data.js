module.exports = {

	select: {
		list: {
			'by.name': 1,
			'by.avatar': 1,
			'meta.description': 1,
			'title':1,
			'slug': 1,
			'created': 1,
			'published': 1,
			'tags': 1
		},
  	listAdmin: {
  		'by.name': 1,
  		'by.avatar': 1,
  		'meta.description': 1,
  		'title':1,
  		'slug': 1,
  		'created': 1,
  		'published': 1,
  		'publishedBy': 1,
  		'updated': 1,
  		'tags': 1
  	}

  query: {
		published: function() {
			return {  '$and': [
    								{'published' : { '$exists': true }} ,
    								{'published': { '$lt': new Date() }}
  							] }
  	},
  	updated: {
  		'updated' : { '$exists': true }
  	}
  }

}
