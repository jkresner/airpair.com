const Util = require('../../../es/post')


const Views = {
  display: '_id by stats htmlHead log.last github.repoInfo'
           + ' reviews forkers title tmpl slug tags assetUrl'
           + ' url html toc similar adtag history',
  list:    '_id by history htmlHead.canonical htmlHead.description htmlHead.ogImage github.repoInfo title url slug tags stats',
  cache:   '_id by.name by.avatar title htmlHead.canonical htmlHead.ogImage history.submitted history.published',
  sub:     '_id name email avatar username auth.gh.login photos'
}


const Query = {

  byUrl: url => ({ 'htmlHead.canonical':
    new RegExp(`${url.split('?')[0].replace(/\+\+/g,'\\+\\+')}$`, 'i') }),

  cached: { $or: [
    { 'history.submitted' : {'$exists': true }},
    { 'history.published' : {'$exists': true }}] },

  published(andQuery) { return assign(andQuery||{}, {
      'history.published' : { '$exists': true },
      'history.published' : { '$lt': new Date() }
    })
  },

  latest: { $and: [ {'history.published' : { '$exists': true }},
                    {'history.published': { '$lt': new Date() }},
                    {'tmpl' : { '$ne': 'blank' }},
                    {'tmpl' : { '$ne': 'faq' }},
                    {'by._id' : { '$ne': '52ad320166a6f999a465fdc5' }} ]},

  submitted: () =>
    ({ $and: [{ 'history.submitted' : {'$exists': true }},
              { 'history.published' : {'$exists': false }}
  //   history.updated': {'$gt': moment().add(-10,'day').toDate() }}
                     ] })
}


const Opts = {
  latest: { select: Views.list, sort: { 'history.published': -1, 'stats.reviews': -1, 'stats.rating': -1 } },
  inreview: { select: `${Views.display} md slug subscribed history` },
  published: { select: `${Views.display} md slug subscribed history` },
  publishedNewest: limit => ({ limit, select: Views.list, sort: { 'history.published': -1 } }),
  submitted: limit => ({ limit, select: Views.list, sort: { 'log.last._id': -1 } }),
  subscribedUsers: { select: Views.sub }
// recentlyUpdated: { select: Views.activity, sort: { 'updated': 1 }, limit: 15 },
// stale: { sort: { 'stats.reviews': -1, 'stats.rating': -1 }, 'limit': 9 }
}


module.exports = { Views, Query, Opts, Util,

  Projections: ({select, inflate, md5, tmpl}, {chain, view}) => ({

    subscribedHash: d => {
      var hash = {}
      for (var u of d.subscribed)
        hash[u._id] = _.omit(u, '_id')

      var p = d.post
      // $log('subHash'.yellow, p)
      p.subscribed = (p.subscribed||[]).map(s=>assign(s,hash[s.userId]||{}))

      if (!p.subHash) {
        p.subHash = {}
        p.subscribed = p.subscribed || [{userId:d.by._id,mail:'primary'}]
        for (var sub of p.subscribed) {
          p.subHash[sub.userId] = _.omit(sub,'_id','userId','auth','photos', 'email', 'mail', 'username', 'name')
          p.subHash[sub.userId].name = sub.username || sub.name
          var pic = sub.photos ? sub.photos[0].value : `https://0.gravatar.com/avatar/${md5(sub.email)}`
          assign(p.subHash[sub.userId], {
           // _id: sub.userId,
            pic: pic.split('?')[0] })
          if (sub.auth && sub.auth.gh) p.subHash[sub.userId].gh = sub.auth.gh.login
        }
      }
      return d
    },


    words: d =>
      assign(d, {stats:assign(d.stats||{},{words:Util.wordcount(d)})}),


    // forker: f =>
      // assign(f,d.subHash[f.userId],{gh: f.gh || f.social.gh.username}),


    references: r =>
      assign(r, Util.indexReferences(r.md)),


    toc: r =>
      assign(r, { toc: Util.toc(r.md) }),


    reviews: d => {
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
        // d.stats = d.stats || postUtil.calcStats(d)
        var reviews = d.stats ? d.stats.reviews : 0
        d.publishReady = reviews > 2 && d.stats.rating > 3.5
      }

      if (!published)
        d.htmlHead = { noindex: true }
      else {
        d.published = published
        //-- Stop using disqus once deployed the review system
        // d.showDisqus = moment(d.published) < moment('20150201', 'YYYYMMDD')
      }

      d.htmlHead.ogTypePost = true

      d.forkers = (d.forkers||[]).map(f => assign(f,d.subHash[f.userId]))
      d.by.firstName = honey.util.String.firstName(d.by.name)

      return d
    },

    adTag: r => {
      d = r.post

      if (!d.tags || d.tags.length == 0) {
        $log(`post ${d.title} [${d._id}] has no tags`.red)
        return cb(null, r)
      }

      var adtag = CAL['tags'][d.tags[0]._id]

      // $log('adTag'.yellow, d.tags, adtag)
      var primarytag = adtag || _.find(d.tags, t => t.sort==0) || d.tags[0]
      // var topTagPage = _.find(topTapPages,(s) => d.primarytag.slug==s)
      // primarytag.postsUrl = // topTagPage ? `/${d.primarytag.slug}` :
        // `/posts/tag/${primarytag.slug}`

      var hasMatch = pattern => _.find(d.tags, t => pattern.test(t.slug))
      var override = d.adtag ? d.adtag.slug : false

      // Set of tags valid for the campaign
      var campaign = /(ruby|node.js|java|php|python)$/i
      var defaulttag = 'ruby'

      // Starts with the default catch all tag when we don't match any rules
      adtag = defaulttag

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
      else if (hasMatch(/java|android|spring|jvm|clojure/i) && !_.find(d.tags,t=>t.slug=='javascript'))
        adtag = 'java'

      else if (hasMatch(/node|mean|npm|express|mongoose/i))
        adtag = 'node.js'

      // If no match found here, we've already set the default - ruby
      else if (hasMatch(/(php|laravel|wordpress|joomla)/i))
        adtag = 'php'

      else if (hasMatch(/python|flask|django|google/i))
        adtag = 'python'

      return assign(r, {adtag})
    },


    toHtml: d => {
      var {md,references,toc} = chain(d, 'references', 'toc')
      var html = {}
      html.references = marked(references)
      html.toc = marked(toc)
      html.body = marked(md)
      return assign(d, {html})
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
        // d.html = marked(md)
        // marked.setOptions({highlight:null})
      // }
      // else
      // d.html = marked(md)
    },


    tmpl: d => {
      d.tmpl = !d.tmpl || d.tmpl == 'default' ? 'v1' : d.tmpl
      if (d.tmpl == 'v1')
        d.htmlHead.css = [] // ['/lib.css'] // grab archived css
      return d
    },


    otherByAuthor: d => {
      var {by} = d.post
      var other = []
      for (var id in cache['posts']) {
        if (!_.idsEqual(d.post._id, id)) {
          var p = cache['posts'][id]
          if (_.idsEqual(by._id, p.by))
            other.push({_id:id,by,url:p.url,htmlHead:{ogImage:p.ogImg},title:p.title})
        }
      }
      return assign(d, other.length > 0 ? {other} : {})
    },


    displayPublished: d => {
      // $log('d', d.other)
      for (var sim of d.similar) sim.url = sim.htmlHead.canonical
      if (!d.similar || d.similar.length == 0) d.similar = false
      var d2 = chain(d, 'subscribedHash', 'adTag', 'otherByAuthor')
      d2.post = chain(d.post, inflate.tags, 'toHtml', 'url', 'tmpl', 'reviews', 'other', view.display)
      for (var tag of d2.post.tags) tag.url = tag.slug == 'angularjs' ? '/angularjs/posts' : `/${tag.slug}`
      // $log('displayPublished'.magenta, d.reviews.length)
      d2.published = d2.post.history.published
      d2.submitted = d2.post.history.submitted
      // $log('d2', d2.post.reviews)
      // d2.htmlHead = d.post.htmlHead
      return d2
    },


    displayReview: d => {
      // console.log('displayReview', d.post.title)
      if (d.post.history.published)
        return select(chain(d.post, inflate.tags, 'url'), '_id url title history')

      var r = chain(d, 'subscribedHash')
      r.post = chain(d.post, inflate.tags, 'toHtml', 'url', 'tmpl', 'reviews', view.display)
      r.tmpl = 'inreview'
      // $log('displayReview'.yellow, r.post.title)
      return r
    },


    url: d => assign(d, { url :
      d.history.submitted && !d.history.published ? `/posts/review/${d._id}` :
      `${d.htmlHead ? d.htmlHead.canonical : '/posts/preview/'+d._id }`
    }),


    slug: d => assign(d, { slug : d.slug || Util.defaultSlug }),


    todo: d => assign(d, { todo: { next: Util.todo(d) } }),


    tileList: d =>
      chain(d, inflate.tags, 'url', view.list),


    submitted: d =>
      chain(d, inflate.tags, 'url', view.list),


    byTag: d => {
      let latest = chain(d.posts, inflate.tags, 'url', view.list)
      let related = _.sortBy(
                      _.uniqBy(_.flatten(latest.map(p=>p.tags)), t=>t.slug)
                       .filter(t=>t.slug!=d.slug)
                    , t => -1*t.posts)
      return assign({}, d, { posts: {latest},
        htmlHead: tmpl("page:tag-meta", d),
        related: related.length > 16 ? _.take(related, 16) : related })
    }

  })

}




