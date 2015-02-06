var marked              = require('marked')
import generateToc      from './postsToc'

var topTapPages = ['angularjs']

var inflateHtml = function(cb) {
  return (e,r) => {
    if (r)
    {
      r.html = marked(r.md)
      r.toc = marked(generateToc(r.md))
    }
    cb(e,r)
  }
};

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
            if (p.submitted && !p.published)
              p.url = `/posts/review/${p._id}`
            else if (p.meta)
              p.url = p.meta.canonical
          }
          cb(e,r)
        }
      },
      inflateHtml,
      displayView(cb, similarFn) {
        return inflateHtml((e,r) => {
          if (e || !r) return cb(e,r)
          if (!r.tags || r.tags.length == 0) {
            $log(`post [{r._id}] has no tags`.red)
            cb(null,r)
          }

          r.primarytag = _.find(r.tags,(t) => t.sort==0) || r.tags[0]
          var topTagPage = _.find(topTapPages,(s) => r.primarytag.slug==s)
          r.primarytag.postsUrl = (topTagPage) ? `/${r.primarytag.slug}` : `/posts/tag/${r.primarytag.slug}`
          r.forkers = r.forkers || []

          if (!r.published) r.meta = { noindex: true }
          similarFn(r.primarytag.slug, (ee,similar) => {
            r.similar = similar
            cb(null,r)
          })
        })
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

    inReview(_id) {
      var query = { $and:[
        { 'submitted': {'$exists': true } },
        { 'published': {'$exists': false } }
      ]}
      if (_id)
        query['$and'].push({_id})
      return query
    },

    inDraft(_id, userId) {
      return { $and:[
        { _id },
        { 'tags': {'$exists': true } },
        { 'assetUrl': {'$exists': true } },
        { 'by.userId': userId }
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
