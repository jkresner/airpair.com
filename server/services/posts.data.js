var marked              = require('marked')
import generateToc      from './postsToc'
import * as md5         from '../util/md5'
var {selectFromObject}  = require('../../shared/util')

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

var userCommentByte = (byte) =>
  _.extend(_.pick(byte,'_id','name'), {avatar: md5.gravatarUrl(byte.email)})


var select = {
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
    'meta': 1,
    'title':1,
    'slug': 1,
    'github.repoInfo': 1,
    'github.stats': 1,
    'created': 1,
    'submitted': 1,
    'published': 1,
    'publishedBy': 1,
    'updated': 1,
    'lastTouch': 1,
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
  edit: {
    '_id': 1,
    'by': 1,
    'meta': 1,
    'github.repoInfo': 1,
    'title':1,
    'slug': 1,
    'created': 1,
    'published': 1,
    'submitted': 1,
    'tags': 1,
    'assetUrl': 1,
    'md': 1
  },
  stats: {
    '_id': 1,
    'by': 1,
    'meta': 1,
    'github': 1,
    'forkers':1,
    'reviews._id': 1,
    'reviews.by': 1,
    'reviews.replies': 1,
    'reviews.votes': 1,
    'reviews.questions.key': 1,
    'reviews.questions.answer': 1,
    'created': 1,
    'published': 1,
    'submitted': 1,
    'tags': 1,
    'assetUrl': 1
  },
  generateToc(md) {
    marked(generateToc(md))
  },
  cb: {
    inflateHtml,
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
    editView(cb) {
      return (e,r) => {
        if (e || !r) return cb(e,r)
        r = selectFromObject(r, select.edit)
        cb(null,r)
      }
    },
    statsView(cb) {
      return (e,r) => {
        if (e || !r) return cb(e,r)
        r = selectFromObject(r, select.stats)
        r.reviews = _.map(r.reviews, (rev) => {
          rev.by = userCommentByte(rev.by)
          rev.votes = _.map(rev.votes || [], (vote) =>
            _.extend(vote, {by: userCommentByte(vote.by)}) )
          rev.replies = _.map(rev.replies || [], (reply) =>
            _.extend(reply, {by: userCommentByte(reply.by)}) )
          return rev
        })
        cb(null,r)
      }
    },
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


        if (!similarFn)
          similarFn = (p, done) => done(null,[])

        similarFn(r, (ee,similar) => {
          r.similar = similar
          cb(null,r)
        })
      })
    }
  }
}


var andQuery = (query, andCondition) => {
  if (andCondition) query.push(andCondition)
  return { '$and': query }
}

var query = {

  published(andCondition) {
    var query = [
      {'published' : { '$exists': true }} ,
      {'published': { '$lt': new Date() }}
    ]

    return andQuery(query, andCondition)
  },

  //posts published before now or readyForReview
  publishedReviewReady(andCondition) {
    var query = {$or: [
      {'submitted' : {'$exists': true}},
      {$and:
        [{'published' : { '$exists': true }},
        {'published': { '$lt': new Date() }}]}]}

    return andQuery(query, andCondition)
  },

  inReview(andCondition) {
    var query = [
      { 'submitted': {'$exists': true } },
      { 'published': {'$exists': false } }
    ]
    return andQuery(query, andCondition)
  },

  inDraft(andCondition) {
    return { $and:[
      { _id },
      { 'tags': {'$exists': true } },
      { 'assetUrl': {'$exists': true } },
      { 'by.userId': userId }
    ]}
  },

  updated: {
    updated : { '$exists': true }
  },

  forker(userId) {
    return {
      forkers: {
        $elemMatch: {
          userId: userId
        }
      }
    }
  }
}


var opts = {
  publishedNewest(limit) {
    var o = { sort: { 'published': -1 } }
    if (limit) o.limit = limit
    return o
  }
}

module.exports = {select,query,opts}
