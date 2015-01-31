module.exports = {

  select: {
    list: {
      'by.userId': 1,
      'by.name': 1,
      'by.avatar': 1,
      'meta.canonical': 1,
      'meta.description': 1,
      'meta.ogImage': 1,
      'title':1,
      'slug': 1,
      'created': 1,
      'published': 1,
      'reviewReady': 1,
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
      'by.name': 1,
      'by.avatar': 1,
      'title': 1,
      'meta.canonical': 1,
      'meta.ogImage': 1
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

    //posts published before now or readyForReview
    publishedReviewReady: function(){
      var query = {$or: [
        {'reviewReady' : {'$exists': true}},
        {$and:
          [{'published' : { '$exists': true }},
          {'published': { '$lt': new Date() }}]}]}

      return query
    },

    updated: {
      'updated' : { '$exists': true }
    }
  }

}
