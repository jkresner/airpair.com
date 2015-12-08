var marked              = require('marked')
var generateToc         = require('./postsToc')
var md5                 = require('../util/md5')
var PostsUtil           = require('../../shared/posts')
var {selectFromObject}  = require('../../shared/util')

var selectFromObj = function(obj, fieldsString) {
  var fieldsObj = {}
  for (var f of fieldsString.split(' ')) fieldsObj[f] = 1
  return selectFromObject(obj, fieldsObj)
}

var topTapPages = ['angularjs']

var inflatedTags = (tags) => {
  if (!tags || !tags.length) return []
  var inflatedTags = []
  for (var tag of tags||[]) {
    if (cache.tags[tag._id])
      inflatedTags.push(Object.assign(tag, _.pick(cache.tags[tag._id],'name','slug','short','desc')))
  }
  return inflatedTags
}

var inflateHtml = function(isAnon, cb) {
  return (e,r) => {
    if (!r) return cb(e,r)
    r.tags = inflatedTags(r.tags)
    // $log('inflateHtml'.yellow, r.tags)
    r.toc = marked(generateToc(r.md))
    var supped = PostsUtil.extractSupReferences(r.md)
    r.references = PostsUtil.markupReferences(supped.references, marked)
    if (isAnon) {
      var odd = false
      marked.setOptions({highlight: function(code, lang) {
        odd = !odd
        if (odd) {
          var maxLines = 0
          var obs = ""
          for (var line of code.split('\n')) {
            if (++maxLines < 4)
              obs += '\n' + line.replace(/(\S\S)(\S\S)/g,'$1{}{}')
          }
          return obs.replace('\n','') // trim first \n
        }
        else
          return code
      }})
      r.html = marked(supped.markdown)
      marked.setOptions({highlight:null})
    }
    else
      r.html = marked(supped.markdown)

    cb(e,r)
  }
};

var userCommentByte = (byte) => {
  var avatar = byte.email ? md5.gravatarUrl(byte.email) :
    "/static/img/pages/posts/storm.png"
  return _.extend(_.pick(byte,'_id','name'), {avatar})
}


var select = {
  list: {
    'by.userId': 1,
    'by.name': 1,
    'by.avatar': 1,
    'htmlHead.canonical': 1,
    'htmlHead.description': 1,
    'htmlHead.ogImage': 1,
    'github.repoInfo': 1,
    'title':1,
    'slug': 1,
    'created': 1,
    'published': 1,
    'submitted': 1,
    'tags': 1,
    'stats': 1,
    'prize': 1,
  },
  listAdmin: {
    'by.name': 1,
    'by.avatar': 1,
    'meta': 1,
    'htmlHead': 1,
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
  listComp: {
    'by.name': 1,
    'by.avatar': 1,
    'htmlHead.canonical': 1,
    'htmlHead.ogImage': 1,
    'title':1,
    'slug': 1,
    'stats': 1,
    'prize': 1,
  },
  listCache: {
    '_id': 1,
    'by.name': 1,
    'by.avatar': 1,
    'title': 1,
    'htmlHead.canonical': 1,
    'htmlHead.ogImage': 1
  },
  display: {
    '_id': 1,
    'by.userId':1,
    'by.name': 1,
    'by.avatar': 1,
    'by.expertId':1,
    'by.bio': 1,
    'by.username': 1,
    'by.social': 1,
    'social.gh.username':1,
    'social.so.link': 1,
    'social.bb.username':1,
    'social.in.id': 1,
    'social.tw.username':1,
    'social.al.username': 1,
    'social.gp.link': 1,
    'htmlHead': 1,
    'github.repoInfo': 1,
    'reviews._id': 1,
    'reviews.by': 1,
    'reviews.updated': 1,
    'reviews.replies': 1,
    'reviews.votes': 1,
    'reviews.questions.key': 1,
    'reviews.questions.answer': 1,
    'forkers':1,
    'title':1,
    'tmpl':1,
    'slug': 1,
    'stats': 1,
    'created': 1,
    'published': 1,
    'submitted': 1,
    'tags': 1,
    'assetUrl': 1,
    'md': 1,
    'lastTouch.utc':1,
    'lastTouch.action':1,
    'lastTouch.by._id':1,
    'lastTouch.by.name':1,
  },
  // edit: {
  //   '_id': 1,
  //   'by.userId':1,
  //   'by.name': 1,
  //   'by.avatar': 1,
  //   'htmlHead': 1,
  //   'github.repoInfo': 1,
  //   'title':1,
  //   'slug': 1,
  //   'created': 1,
  //   'published': 1,
  //   'submitted': 1,
  //   'tags': 1,
  //   'assetUrl': 1,
  //   'repo': 1,
  //   'stats': 1, //-- To know if the post is publishable
  //   'synced': 1,
  //   'md': 1
  // },
  // editInfo:
  //   '_id by title created published submitted tags assetUrl',
    // 'github.repoInfo': 1,
  stats: {
    '_id': 1,
    'title': 1,
    'by.userId':1,
    'by.name': 1,
    'by.avatar': 1,
    'slug': 1,
    'htmlHead': 1,
    'forkers':1,
    'reviews._id': 1,
    'reviews.by': 1,
    'reviews.updated': 1,
    'reviews.replies': 1,
    'reviews.votes': 1,
    'reviews.questions.key': 1,
    'reviews.questions.answer': 1,
    'created': 1,
    'published': 1,
    'submitted': 1,
    'tags': 1,
    'assetUrl': 1,
    'stats': 1,
    'pullRequests': 1,
    'lastTouch.utc': 1,
    'lastTouch.action': 1,
    'lastTouch.by.name': 1
  },
  // pr: {
  //   'pullRequests.url':1,
  //   'pullRequests.html_url':1,
  //   'pullRequests.id':1,
  //   'pullRequests.number':1,
  //   'pullRequests.state':1,
  //   'pullRequests.title':1,
  //   'pullRequests.user.login':1,
  //   'pullRequests.user.avatar_url':1,
  //   'pullRequests.created_at':1,
  //   'pullRequests.updated_at':1,
  //   'pullRequests.closed_at': null,
  //   'pullRequests.merged_at': null,
  //   'pullRequests.merge_commit_sha': 1,
  //   'pullRequests.statuses_url': 1
  // },
  generateToc(md) {
    marked(generateToc(md))
  },
  mapReviews(reviews) {
    return _.map(reviews,(rev)=> {
      rev.by = userCommentByte(rev.by)
      rev.votes = _.map(rev.votes || [], (vote) =>
        _.extend(vote, {by: userCommentByte(vote.by)}) )
      rev.replies = _.map(rev.replies || [], (reply) =>
        _.extend(reply, {by: userCommentByte(reply.by)}) )
      return rev
    })
  },
  mapForkers(forkers) {
    return _.map(forkers,(f)=> {
      var ff = userCommentByte(f)
      ff.username = f.social.gh.username
      ff.userId = f.userId
      return ff
    })
  },
  url(post) {
    if (post.submitted && !post.published) return `/posts/review/${post._id}`
    else if (post.htmlHead) return post.htmlHead.canonical
  },
  tmpl: {
    reviewNotify(post, review) {
      var {_id,title} = post
      var rating = _.find(review.questions,(q)=>q.key=='rating').answer
      var comment = _.find(review.questions,(q)=>q.key=='feedback').answer
      return { _id, title , comment, rating, reviewerFullName: review.by.name }
    },
    reviewReplyNotify(post, reply) {
      var {_id,title} = post
      var {comment,by} = reply
      return { _id, title , comment, replierFullName: by.name }
    },
  },
  cb: {
    inflateHtml,
    addUrl(cb) {
      return (e,r) => {
        for (var p of r)
          p.url = select.url(p)
        cb(e,r)
      }
    },
    editInfoView(cb) {
      return (e,r) => {
        if (e || !r) return cb(e,r)
        cb(null, selectFromObj(r, select.editInfo))
      }
    },
    editView(cb, overrideMD, owner) {
      return (e,r) => {
        if (e && !r) return cb(e,r)
        else if (e) {
          if (e.message.indexOf("Not Found") != -1)
            return cb(Error(`Could not read ${r.slug} repo`))
          return cb(e,r)
        }
        r = selectFromObject(r, select.edit)
        r.repo = `${owner}/${r.slug}`
        if (overrideMD) {
          r.synced = r.md == overrideMD
          r.md = overrideMD // hack for front-end editor to show latest edit
        }
        cb(null,r)
      }
    },
    statsView(cb) {
      return (e,r) => {
        if (e || !r) return cb(e,r)
        r = selectFromObject(r, select.stats)
        r.reviews = select.mapReviews(r.reviews)
        r.forkers = select.mapForkers(r.forkers || [])
        r.url = select.url(r)
        cb(null,r)
      }
    },
    statsViewList(cb) {
      return (e,posts) => {
        var statsR = []
        for (var p of posts) {
          var url = select.url(p),
            wordcount = PostsUtil.wordcount(p.md),
            reviews = select.mapReviews(p.reviews),
            forkers = select.mapForkers(p.forkers || [])
          p.lastTouch = p.lastTouch || { utc: moment().add(-3,'months').toDate() }
          statsR.push(_.extend(selectFromObject(p, select.stats),
            { url, reviews, forkers, wordcount }))
        }

       cb(null,statsR)
      }
    },
    displayView(isAnon, similarFn, cb) {
      return inflateHtml(isAnon, (e,r) => {
        // $log('inflateHtml', isAnon, e)

        if (e || !r) return cb(e,r)

        // if (isAnon) {
          // for (var m of r.html.match(/<pre(?:[\s\S]*)<\/pre>/)) {
        //     $log(`<div class="signup"></div>${m.split('\n')[0]}</code></pre>`.cyan)
        //     // r.html = r.html.replace(m,`<div class="signup"></div>${m.split('\n')[0]}</code></pre>`)
        //   }
          // r.html = r.html.replace(/<pre/g,'<pre signup ')

        // }

        if (!r.tags || r.tags.length == 0) {
          $log(`post ${r.title} [${r._id}] has no tags`.red)
          return cb(null,r)
        }

        r.primarytag = _.find(r.tags,(t) => t.sort==0) || r.tags[0]
        var topTagPage = _.find(topTapPages,(s) => r.primarytag.slug==s)
        r.primarytag.postsUrl = (topTagPage) ? `/${r.primarytag.slug}` : `/posts/tag/${r.primarytag.slug}`

        r.adtag = 'node.js'
        if (_.find(r.tags, t => t.slug.match(/java/i) && !t.slug.match(/javascript/i)))
          r.adtag = 'java'
        if (_.find(r.tags, t => t.slug.match(/(php|wordpress)/i)))
          r.adtag = 'php'


        if (r.submitted) {
          r.stats = r.stats || PostsUtil.calcStats(r)
          r.publishReady = (r.stats.reviews > 2) && (r.stats.rating > 3.5)
        }
        if (!r.published)
          r.htmlHead = { noindex: true }
        else
          //-- Stop using disqus once deployed the review system
          r.showDisqus = moment(r.published) < moment('20150201', 'YYYYMMDD')


        r.forkers = select.mapForkers(r.forkers || [])
        r.reviews = select.mapReviews(r.reviews)
        if (r.reviews.length > 0)
          r = PostsUtil.extendWithReviewsSummary(r)

        if (!similarFn)
          similarFn = (p, done) => done(null,[])

        //-- Temporarily fix broken posts
        if (r.by.social) {
          if (typeof r.by.social.gh == 'string') r.by.social.gh = { username: r.by.social.gh }
          if (typeof r.by.social.tw == 'string') r.by.social.tw = { username: r.by.social.tw }
          if (typeof r.by.social.so == 'string') r.by.social.so = { link: r.by.social.so }
          if (typeof r.by.social.in == 'string') r.by.social.in = { id: r.by.social.in }
          if (typeof r.by.social.bb == 'string') r.by.social.bb = { id: r.by.social.bb }
          if (typeof r.by.social.al == 'string') r.by.social.al = { username: r.by.social.al }
          if (typeof r.by.social.gp == 'string') r.by.social.gp = { link: r.by.social.gp }
        }

        r.by.firstName = util.firstName(r.by.name)

        similarFn(r, (ee,similar) => {
          for (var p of similar) p.tags = inflatedTags(p)
          r.similar = similar
          cb(null, r)
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

  cached() {
    return { $or: [
      {'submitted' : {'$exists': true}},
      {'published' : { '$exists': true }}]}
  },

  published(andCondition) {
    var query = [
      {'published' : { '$exists': true }} ,
      {'published': { '$lt': new Date() }}
    ]

    return andQuery(query, andCondition)
  },

  comp2015winners() {
    return {
      'prize' : { '$exists': true },
      'prize.comp': '2015_q1'
    }
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
      { 'published': {'$exists': false } },
      { '$or': [
          {'submitted': {'$gt': moment().add(-10,'day').toDate() }},
          {'updated':   {'$gt': moment().add(-10,'day').toDate() }}
        ]
      }
    ]
    return andQuery(query, andCondition)
  },

  stale(andCondition) {
    var query = [
      { 'submitted': {'$exists': true } },
      { 'submitted': {'$lt': moment().add(-10,'day').toDate() } },
      { 'published': {'$exists': false } },
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
  },

  myPosts(userId) {
    return {$or: [
      { forkers: { $elemMatch: { userId } } },
      { 'by.userId':userId }
    ]}
  }
}


var opts = {
  publishedNewest(limit) {
    var o = { sort: { 'published': -1 } }
    if (limit) o.limit = limit
    return o
  },
  highestRating: {
    sort: { 'stats.reviews': -1, 'stats.rating': -1 }
  },
  allPublished: {
    sort: { 'published': -1, 'stats.reviews': -1, 'stats.rating': -1 }
  },
  stale: {
    sort: { 'stats.reviews': -1, 'stats.rating': -1 }, 'limit': 9
  }
}


var data = {
  featured: [
    'ten-ways-to-secure-wordpress',
    'mastering-es6-higher-order-functions-for-arrays',
    'transclusion-template-scope-in-angular-directives'
  ],
  popular: [
    'angularjs-tutorial',
    'hybrid-apps-ionic-famous-f7-onsen',
    'nodejs-framework-comparison-express-koa-hapi',
    'python-tips-and-traps',
    'top-10-mistakes-nodejs-developers-make',
    'comprehensive-guide-to-building-scalable-web-app-on-amazon-web-services--part-1',
    'swift-tutorial-building-an-ios-applicationpart-1',
    'understand-javascript-array-reduce-in-1-minute',
    'creating-a-photo-gallery-in-android-studio-with-list-fragments'
  ],
  comp: [
    'switching-from-ios-to-ionic',
    'how-to-create-a-complete-expressjs--nodejs--mongodb-crud-and-rest-skeleton',
    'ntiered-aws-docker-terraform-guide',
    'unit-testing-angularjs-applications',
    'the-legend-of-canvas',
    'moving-from-sql-to-rethinkdb'
  ]
}


module.exports = {select,query,opts,data}








