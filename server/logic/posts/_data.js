var views = {
  display: '_id by stats htmlHead meta.lastTouch github.repoInfo'
           + ' reviews forkers title tmpl slug tags assetUrl'
           + ' url html toc similar adtag submitted published',
  list:    '_id by history htmlHead.canonical htmlHead.description htmlHead.ogImage github.repoInfo title url slug tags stats',
  cache:   '_id by.name by.avatar title htmlHead.canonical htmlHead.ogImage history.subscribed history.published'
}

var postUtil                = require('../../../shared/posts')
// var postUtil            = require('../../../../author/shared/posts')
var generateToc         = require('../../../../author/server/logic/post/lib/toc')()


module.exports = new LogicDataHelper(

  views,

  ({chain, select, inflate, md5}) => ({  //, {posts}) => ({

    subscribedHash: d => {
      // $log('subHash'.yellow, d.subscribed)
      if (!d.subHash) {
        d.subHash = {}
        d.subscribed = d.subscribed || [{userId:d.by._id,mail:'primary'}]
        for (var sub of d.subscribed) {
          d.subHash[sub.userId] = _.omit(sub,'_id','userId','auth','photos', 'email', 'mail', 'username', 'name')
          d.subHash[sub.userId].name = sub.username || sub.name
          assign(d.subHash[sub.userId], {
           // _id: sub.userId,
            pic: sub.photos ? sub.photos[0].value : `//0.gravatar.com/avatar/${md5(sub.email)}` })
          if (sub.auth && sub.auth.gh) d.subHash[sub.userId].gh = sub.auth.gh.login
        }
      }
      return d
    },

    reviews: d => {
      // $log('reviews'.yellow, d.reviews)
      d.reviews = (d.reviews||[]).map(rev => assign(rev, {
        by: d.subHash[rev.by],
        votes: (rev.votes||[]).map(v => assign(v,{by:d.subHash[v.by]})),
        replies: (rev.replies||[]).map(r => assign(r,{by:d.subHash[r.by]}))
      }))
      return d
    },

    other: d => {
      // $log('other'.yellow, d)
      var {submitted,published} = d.history

      if (submitted) {
        d.submitted = submitted
        d.stats = d.stats || postUtil.calcStats(d)
        d.publishReady = (d.stats.reviews > 2) && (d.stats.rating > 3.5)
      }

      if (!published)
        d.htmlHead = { noindex: true }
      else {
        d.published = published
        //-- Stop using disqus once deployed the review system
        d.showDisqus = moment(d.published) < moment('20150201', 'YYYYMMDD')
      }

      d.htmlHead.ogTypePost = true

      d.forkers = (d.forkers||[]).map(f => assign(f,d.subHash[f.userId]))
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

      var hasMatch = pattern => _.find(d.tags, t => pattern.test(t.slug))
      var override = d.adtag ? d.adtag.slug : false

      // Set of tags valid for the campaign
      var campaign = /(ruby|node.js|java|php|python)$/i
      var defaulttag = 'ruby'

      // Starts with the default catch all tag when we don't match any rules
      var adtag = defaulttag

      // Override value can set ahead of time on a specific piece of content
      // * Allows full control when content matches multiple campaign tags
      // * Must be a valid campaign tag else its ignored
      var overridetag = override && override.match(campaign) ? override : null

      // If we've match a custom chosen override tag we've done
      if (overridetag)
        adtag = overridetag

      // Looks at each tag of the content/post and matches if on the values
      // is anywhere in the tag name (case insensitive)
      // E.g. node| matches: "node.js", "nodejs" "node.version.6.0" "server-node"

      // Only looks at this set if no match above (..|angular|node|etc.)
      // If no match Will continue to the next (..php|laravel|etc.)
      else if (hasMatch(/java|android|spring|jvm|clojure/i))
        adtag = 'java'

      else if (hasMatch(/node|mean|npm|express|mongoose/i))
        adtag = 'node.js'

      // If no match found here, we've already set the default - ruby
      else if (hasMatch(/(php|laravel|wordpress|joomla)/i))
        adtag = 'php'

      else if (hasMatch(/python|flask|django|google/i))
        adtag = 'python'

      return assign(d, {adtag})
    },


    tocHtml: d => {
      // $log('tocHtml'.yellow)
      return assign(d, {toc:marked(generateToc(d.md))})
    },

    bodyHtml: d => {
      // $log('bodyHtml'.yellow, d.tags, cache.tags.length)
      var supped = postUtil.extractSupReferences(d.md)
      d.references = postUtil.markupReferences(supped.references, marked)

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

    otherByAuthor: d => {
      var other = []
      for (var id in cache['posts']) {
        if (!_.idsEqual(d._id, id)) {
          var p = cache['posts'][id]
          if (_.idsEqual(d.by._id, p.by))
            other.push({_id:id,by:d.by,url:p.url,ogImg:p.ogImg,title:p.title})
        }
      }
      return assign(d, other.length > 0 ? {other} : {})
    },

    displayPublished: d => {
      // $log('displayPublished'.yellow, d.by.name, d.adtag, d.tags)
      var r =
      chain(d, inflate.tags, 'bodyHtml', 'url', 'tocHtml', 'tmpl', 'adTag', 'subscribedHash', 'reviews', 'other', select.display, 'otherByAuthor')
      for (var sim of r.similar) sim.url = sim.htmlHead.canonical
      if (!r.similar || r.similar.length == 0) r.similar = false
      for (var tag of r.tags) tag.url = tag.slug == 'angularjs' ? '/angularjs/posts' : `/${tag.slug}`
      // $log('displayPublished'.magenta, d.reviews.length)
      return r
    },

    displayReview: d => {
      if (d.history.published)
        return select(chain(d, inflate.tags, 'url'), '_id url title history')

      var r = chain(d, inflate.tags, 'bodyHtml', 'url', 'tocHtml', 'tmpl', 'subscribedHash', 'reviews', select.display)
      r.tmpl = 'post_inreview'
      return r
    },

    url: d => assign(d, { url :
      d.history.submitted && !d.history.published ? `/posts/review/${d._id}` :
      `${d.htmlHead ? d.htmlHead.canonical : '/posts/preview/'+d._id }`
    }),


    tileList: d =>
      chain(d, inflate.tags, 'url', select.list),


    submitted: d =>
      chain(d, inflate.tags, 'url', select.list),


    byTag: d => {
      var tag = select(cache['tags'][d._id], 'name short url')
      var htmlHead = {
        ogType: "technology",
        title:`${tag.name} Programming Guides and Tutorials from Top ${tag.short} Developers and expert consultants`,
        canonical: `https://www.airpair.com${tag.url}`
      }

      // var workhops = cache.workshops.filter(w => w.tags.indexOf(d.slug))
      var posts = chain(d.posts, inflate.tags, 'url', select.list)
      var related = _.sortBy((_.uniq(_.flatten(_.pluck(posts, 'tags')), t => t.slug)), t => t.slug)
                     .map(t => cache['tags'][t._id])
      if (related.length > 16) related = _.take(_.sortBy(related, t => -1*t.posts), 16)

      // if (workhops.length>0) r.workhops = workhops
      return assign({ htmlHead, related, posts: {latest:posts} }, tag)
    }

  }),

  //-- Queries
  {
    cached: { $or: [
      { 'history.submitted' : {'$exists': true }},
      { 'history.published' : {'$exists': true }}] },

    published(andQuery) { return assign(andQuery||{}, {
        'history.published' : { '$exists': 1 },
        'history.published' : { '$lt': new Date() }
      })
    },

    latest: { $and: [ {'history.published' : { '$exists': true }},
                      {'history.published': { '$lt': new Date() }},
                      {'tmpl' : { '$ne': 'blank' }},
                      {'tmpl' : { '$ne': 'faq' }},
                      {'by._id' : { '$ne': '52ad320166a6f999a465fdc5' }} ]},

    submitted(opts) {
      opts = opts || {}
      // var [amount,measure] = config.authoring.stale.split(':')
      // var staleTime = moment().add(amount, measure).toDate()

      // var $or = [      { 'meta.lastTouch.utc': { '$gt': staleTime } },
                       // { 'history.submitted':  { '$gt': staleTime } } ]
      var q = { $and: [{ 'history.submitted' : {'$exists': true }},
                       { 'history.published' : {'$exists': false }},
                       // { $or }
                       ] }

          return q
    },


  },

  //-- Query Opts
  {
    latest: { select: views.list, sort: { 'history.published': -1, 'stats.reviews': -1, 'stats.rating': -1 } },
    inreview: { select: `${views.display} md slug subscribed history` },
    published: { select: `${views.display} md slug subscribed history` },
    publishedNewest: limit => ({ limit, select: views.list, sort: { 'history.published': -1 } }),
    submitted: limit => ({ limit, select: views.list, sort: { 'meta.lastTouch._id': -1 } })
  }

)
.addCacheInflate('tags', ['name','url','short'])


// //-- Could make this generic, but we don't want to allow the cache to start
// //-- accepting arbitary things
// cache.pullRequests = function(repo, getterCB, cb)
// {
//   if (!cache['post_prs']) cache['post_prs'] = {}
//   if (cache['post_prs'][repo])
//     return cb(null, cache['post_prs'][repo])
//   getterCB((e,r)=>{
//     if (e) return cb(e)
//     cache['post_prs'][repo] = r
//     $log("set cache['post_prs']".trace, repo)
//     cb(null,r)
//   })
// }

