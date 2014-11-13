module.exports = {

	select: {
		list: {
			'by.name': 1,
			'by.avatar': 1,
      'meta.canonical': 1,
      'meta.description': 1,
      'meta.ogImage': 1,
      'title':1,
      'slug': 1,
      'created': 1,
      'published': 1,
      'tags': 1,
		},
		listAdmin: {
			'by.name': 1,
			'by.avatar': 1,
      'meta.canonical': 1,
			'meta.description': 1,
      'meta.ogImage': 1,
			'title':1,
			'slug': 1,
			'created': 1,
			'published': 1,
			'publishedBy': 1,
			'updated': 1,
			'tags': 1
		},
		listCache: {
			'_id': 1,
			'title': 1,
      'meta.canonical': 1
		}
  },

  query: {
		published: function(andCondition) {
			var query = [
				{'published' : { '$exists': true }} ,
				{'published': { '$lt': new Date() }}
			]

			if (andCondition) query.push(andCondition)

			return { '$and': query }
  	},
  	updated: {
  		'updated' : { '$exists': true }
  	}
  }

}
