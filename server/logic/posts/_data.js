var views = {
  display: '_id by.userId by.name by.avatar by.expertId by.bio by.username by.social htmlHead github.repoInfo'
           + ' reviews._id reviews.by reviews.updated reviews.replies reviews.votes reviews.questions.key reviews.questions.answer'
           + ' forkers title tmpl slug stats created published submitted tags assetUrl'
           + ' lastTouch.utc lastTouch.action lastTouch.by._id lastTouch.by.name'
           + ' url html toc similar adtag',
  list:    '_id by.userId by.name by.avatar htmlHead.canonical htmlHead.description htmlHead.ogImage github.repoInfo title slug created published submitted tags stats'
}


var post                = require('../../../shared/posts')
var generateToc         = require('../../services/postsToc')


var md5                 = require('../../util/md5')
var userCommentByte = (byte) => {
  var avatar = byte.email ? md5.gravatarUrl(byte.email) :
    "/static/img/pages/posts/storm.png"
  return _.extend(_.pick(byte,'_id','name'), {avatar})
}
var PostsUtil = {
  mapReviews(reviews) {
    return _.map(reviews,(rev)=> {
      rev.by = userCommentByte(rev.by)
      rev.votes = _.map(rev.votes || [], (vote) =>
        _.extend(vote, {by: userCommentByte(vote.by)}) )
      rev.replies = _.map(rev.replies || [], (reply) =>
        _.extend(reply, {by: userCommentByte(reply.by)}) )
      return rev
    }) || []
  },
  mapForkers(forkers) {
    return _.map(forkers,(f)=> {
      var ff = userCommentByte(f)
      ff.username = f.social.gh.username
      ff.userId = f.userId
      return ff
    })
  },
  extendWithReviewsSummary(post) {
    post.stars = { total: 0 }
    post.reviews= _.map(post.reviews, (r) => {
      r.rating = _.find(r.questions,(q)=>q.key == 'rating').answer
      r.feedback = _.find(r.questions,(q)=>q.key == 'feedback').answer
      post.stars.total += parseInt(r.rating)
      return r
    })
    if (post.stars.total > 0) {
      post.stars.avg = post.stars.total/post.reviews.length
    }

    return post
  }
}

module.exports = new LogicDataHelper(

  views,

  ({chain, select, inflate}) => ({


    other: d => {
      if (d.submitted) {
        d.stats = d.stats || PostsUtil.calcStats(d)
        d.publishReady = (d.stats.reviews > 2) && (d.stats.rating > 3.5)
      }

      if (!d.published)
        d.htmlHead = { noindex: true }
      else
        //-- Stop using disqus once deployed the review system
        d.showDisqus = moment(d.published) < moment('20150201', 'YYYYMMDD')

      d.htmlHead.ogTypePost = true

      d.forkers = PostsUtil.mapForkers(d.forkers || [])
      d.reviews = PostsUtil.mapReviews(d.reviews)
      if (d.reviews.length > 0)
        d = PostsUtil.extendWithReviewsSummary(d)

      // if (!similarFn)
        // similarFn = (p, done) => done(null,[])

      //-- Temporarily fix broken posts
      if (d.by.social) {
        if (typeof d.by.social.gh == 'string') d.by.social.gh = { username: d.by.social.gh }
        if (typeof d.by.social.tw == 'string') d.by.social.tw = { username: d.by.social.tw }
        if (typeof d.by.social.so == 'string') d.by.social.so = { link: d.by.social.so }
        if (typeof d.by.social.in == 'string') d.by.social.in = { id: d.by.social.in }
        if (typeof d.by.social.bb == 'string') d.by.social.bb = { id: d.by.social.bb }
        if (typeof d.by.social.al == 'string') d.by.social.al = { username: d.by.social.al }
        if (typeof d.by.social.gp == 'string') d.by.social.gp = { link: d.by.social.gp }
      }

      d.by.firstName = util.firstName(d.by.name)

      return d
    },

    adTag: d => {
      if (!d.tags || d.tags.length == 0) {
        $log(`post ${d.title} [${d._id}] has no tags`.red)
        return cb(null, d)
      }

      // $log('adTag'.yellow, d.tags, d.adtag)
      d.primarytag = d.adtag || _.find(d.tags, t => t.sort==0) || d.tags[0]
      // var topTagPage = _.find(topTapPages,(s) => d.primarytag.slug==s)
      d.primarytag.postsUrl = // topTagPage ? `/${d.primarytag.slug}` :
        `/posts/tag/${d.primarytag.slug}`

      var adtag = 'ruby'
      if (d.adtag && d.adtag.slug.match(/(ruby|node.js|java|php)$/i))
        adtag = d.adtag.slug
      else if (_.find(d.tags, t => t.slug.match(/javascript|angular|node|mean/i)))
        adtag = 'node.js'
      else if (_.find(d.tags, t => t.slug.match(/java|spring/i) && !t.slug.match(/javascript/i)))
        adtag = 'java'
      else if (_.find(d.tags, t => t.slug.match(/(php|wordpress)/i)))
        adtag = 'php'

      return assign(d, {adtag})
    },



    tocHtml: d => {
      // $log('tocHtml'.yellow, d.tags)
      return assign(d, {toc:marked(generateToc(d.md))})
    },

    bodyHtml: d => {
      // $log('bodyHtml'.yellow, d.tags, cache.tags.length)
      var supped = post.extractSupReferences(d.md)
      d.references = post.markupReferences(supped.references, marked)

      return assign(d, {html:marked(supped.markdown)})
      // $log('inflateHtml'.yellow, d.tags)
      // d.toc = marked(generateToc(d.md))
      // var supped = PostsUtil.extractSupReferences(d.md)
      // d.references = PostsUtil.markupReferences(supped.references, marked)
      // if (isAnon) {
        // var odd = false
        // marked.setOptions({highlight: function(code, lang) {
          // odd = !odd
          // if (odd) {
            // var maxLines = 0
            // var obs = ""
            // for (var line of code.split('\n')) {
              // if (++maxLines < 4)
                // obs += '\n' + line.replace(/(\S\S)(\S\S)/g,'$1{}{}')
            // }
            // return obs.replace('\n','') // trim first \n
          // }
          // else
            // return code
        // }})
        // d.html = marked(supped.markdown)
        // marked.setOptions({highlight:null})
      // }
      // else
      // d.html = marked(supped.markdown)
    },

    tmpl: d => {
      // $log('tmpl'.yellow)
      d.tmpl = !d.tmpl || d.tmpl == 'default' ? 'post_v1' : d.tmpl
      if (d.tmpl == 'post_v1')
        d.htmlHead.css = [] // ['/lib.css'] // grab archived css
      return d
    },


    displayPublished: d => {
      // $log('displayPublished'.yellow, d.by.name, d.adtag)
      var r =
      chain(d, inflate.tags, 'bodyHtml', 'url', 'tocHtml', 'tmpl', 'adTag', select.display, 'other')
      for (var sim of r.similar) sim.url = sim.htmlHead.canonical
      // chain(d, select.display, 'bodyHtml', 'tocHtml', 'tmpl', 'url', 'inflate.tags')
      // $log('displayPublished'.magenta, d.reviews.length)
      return r
    }
    ,


    url: d => assign(d, { url :
      d.submitted && !d.published ? `/posts/review/${d._id}` :
      `${d.htmlHead ? d.htmlHead.canonical : '/posts/preview/'+d._id }`
    }),


  }),

  //-- Queries
  {
    published: (andQuery) => _.assign(andQuery||{},
      {'published': { '$exists': 1 }},
      {'published': { '$lt': new Date() }}),
  },

  //-- Query Opts
  {
    published: { select: `${views.display} md slug'` },
    publishedNewest: (limit) => ({ limit, select: views.list, sort: { 'published': -1 } })
  }

)
.addCacheInflate('tags', ['name','slug','short','desc'])

