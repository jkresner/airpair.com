var marked              = require('marked')
import generateToc      from './postsToc'

module.exports = {

  select: {
    list: {
      'by.userId': 1,
      'by.name': 1,
      'by.avatar': 1,
      'meta.canonical': 1,
      'meta.description': 1,
      'meta.ogImage': 1,
      'github.repoInfo': 1,
      'title':1,
      'slug': 1,
      'created': 1,
      'published': 1,
      'submitted': 1,
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
    },
    generateToc(md) {
      marked(generateToc(md))
    },
    cb: {
      addUrl(cb) {
        return (e,r) => {
          for (var p of r) {
            if (p.meta) p.url = p.meta.canonical
          }
          cb(e,r)
        }
      },
      inflateHtml(cb) {
        return (e,r) => {
          if (r)
          {
            r.html = marked(r.md)
            r.toc = marked(generateToc(r.md))
          }
          cb(e,r)
        }
      }
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
        {'submitted' : {'$exists': true}},
        {$and:
          [{'published' : { '$exists': true }},
          {'published': { '$lt': new Date() }}]}]}

      return query
    },

    inReview() {
      return { $and:[
        { 'submitted': {'$exists': true } },
        { 'published': {'$exists': false } }
        ]}
    },

    updated: {
      'updated' : { '$exists': true }
    },

    forker: function(userId){
      return {
        forkers: {
          $elemMatch: {
            userId: userId
          }
        }
      }
    }
  }

}
