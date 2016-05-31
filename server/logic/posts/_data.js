var views = {
  display: '_id by stats htmlHead meta.lastTouch github.repoInfo'
           + ' reviews forkers title tmpl slug tags assetUrl'
           + ' url html toc similar adtag submitted published',
  list:    '_id by history htmlHead.canonical htmlHead.description htmlHead.ogImage github.repoInfo title slug tags stats',
  cache:   '_id by.name by.avatar title htmlHead.canonical htmlHead.ogImage history.subscribed history.published'
}


var postUtil                = require('../../../shared/posts')
var generateToc         = require('../../services/postsToc')


module.exports = new LogicDataHelper(

  views,

  ({chain, select, inflate, md5}) => ({

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

      var hasMatch = pattern => _.find(d.tags, t => t.slug.match(pattern))
      var override = d.adtag ? d.adtag.slug : false

      // Set of tags valid for the campaign
      var campaign = /(ruby|node.js|java|php)$/i
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
      else if (hasMatch(/javascript|angular|node|mean|npm/i))
        adtag = 'node.js'

      // Only looks at this set if no match above (..|angular|node|etc.)
      // If no match Will continue to the next (..php|laravel|etc.)
      else if (hasMatch(/java|android|spring|jvm|clojure/i))
        adtag = 'java'

      // If no match found here, we've already set the default - ruby
      else if (hasMatch(/(php|laravel|wordpress|joomla)/i))
        adtag = 'php'

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


    displayPublished: d => {
      // $log('displayPublished'.yellow, d.by.name, d.adtag, d.tags)
      var r =
      chain(d, inflate.tags, 'bodyHtml', 'url', 'tocHtml', 'tmpl', 'adTag', 'subscribedHash', 'reviews', 'other', select.display)
      for (var sim of r.similar) sim.url = sim.htmlHead.canonical
      if (!r.similar || r.similar.length == 0) r.similar = false
      for (var tag of r.tags) tag.url = tag.slug == 'angularjs' ? '/angularjs/posts' : `/${tag.slug}`
      // $log('displayPublished'.magenta, d.reviews.length)
      return r
    },


    url: d => assign(d, { url :
      d.history.submitted && !d.history.published ? `/posts/review/${d._id}` :
      `${d.htmlHead ? d.htmlHead.canonical : '/posts/preview/'+d._id }`
    }),


    tileList: r =>
      chain(r, inflate.tags, select.list, 'url')


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
    }
  },

  //-- Query Opts
  {
    published: { select: `${views.display} md slug subscribed history` },
    publishedNewest: (limit) => ({ limit, select: views.list, sort: { 'history.published': -1 } })
  }

)
.addCacheInflate('tags', ['name','slug','short','desc'])

