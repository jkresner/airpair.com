const Views = {
  // activity:          '_id title meta.lastTouch history by.name by.avatar url tags htmlHead slug stats reviews', // pullRequests reviews forkers
  forks:             '_id title meta.lastTouch history by url tags htmlHead.canonical slug stats',
  home:              '_id title meta.lastTouch history by url stats forkers reviews htmlHead.canonical',
  tile:              '_id title meta.lastTouch history by.name by.avatar htmlHead tags stats',
  // pr:                ' url html_url id number state title user.login user.avatar_url created_at updated_at closed_at n merged_at n merge_commit_sha statuses_url'.replace(/ /g,' pullRequests.').replace(/$ /,''),
  profile:           '_id name username photos emails initials bio ' +
                     'auth.gh.login auth.so.link auth.bb.username auth.in.id auth.tw.screen_name auth.al.angellist_url auth.gp.id auth.gp.link auth.gp.url auth.gp.email auth.sl.username'
}


var $exists = { $exists: true }
var $undefined = { $exists: false }

const Query =  {
  drafts(userId) {

    // var [amount,measure] = config.authoring.stale.split(':')
    // var staleTime = moment().add(amount, measure).toDate()

    // var $or = [ /     { 'meta.lastTouch.utc': { '$gt': staleTime } },
                     // { 'history.submitted':  { '$gt': staleTime } } ]
    var q = { $and: [{ 'by._id': userId },
                     { 'history.published':  $undefined },
                     // { $or }
                     ]}
    // if (opts.exclude)
      // q['$and'].push({_id:{$nin:_.pluck(opts.exclude,'_id')}})

    return q
  },

  published(userId) {

    var q = { $and: [{ 'by._id': userId },
                     { 'history.published':  $exists },
                     ]}
    return q
  },

  reviewedBy(_id) {
    return           { 'reviews.by': _id }
  },

  forked(userId) {
    return           { 'forkers': { $elemMatch: {userId} } }
  },

  byCommunity() {
    return           { 'history.submitted': $exists,
                       'tmpl': { '$ne': 'blank' },
                       'tmpl': { '$ne': 'faq' } }
  },

  home(_id) {
    return           { '$or': [ { 'by._id': _id },
                                { 'reviews.by': _id },
                                { 'forkers': { $elemMatch: { userId: _id } } }  ] }
  }
}

const Opts = {
  forks: { select: Views.forks, sort: { 'meta.lastTouch._id': -1 } },
    // 'updated': 1

  drafts: {
    sort: { 'meta.lastTouch._id': -1 },
  },

  published: {
    sort: { 'meta.lastTouch._id': -1 },
  },

  home: {
    select: Views.home,
    sort: { 'meta.lastTouch._id': -1 },
  },

  suggests: {
    limit: 7
  }
}


module.exports = { Views, Query, Opts,

  Projections: ({select,inflate,map,md5,util}, {chain,view}) => ({

    profile: d => {
      var r = view.profile(d)
      for (var email of d.emails)
        if (!_.find(d.photos,p=>p.value==md5(email.value)))
          r.photos.push({type:'gravatar',value:md5(email.value)})

      r.photos = d.photos.map(p => assign({url:
        p.type == 'github' ? p.value.split('?')[0]
                           : `https://0.gravatar.com/avatar/${p.value}`}, p))

      return r
    },

    // feedback: p =>
    //   assign(p, { reviews: map(p.reviews, r => assign(
    //     { on: p.title, pId: p._id, utc: Types.BSONID.toDate(r._id) }
    //     , r
    //     , { by: p.subHash ? p.subHash[r.by] : undefined }
    //   )) }),

    forks: ({userId,my,suggests}) => ({
      my: chain(my, inflate.tags, 'posts.url', view.forks),
      suggests: chain(suggests, inflate.tags, 'posts.url')
    }),


    drafts: d => {
      var r = {rough:[],inreview:[],stats:{words:0}}
      var posts = chain(d.posts,'posts.url','posts.words',inflate.tags, view.tile)
      for (var p of posts) {
        p.history.submitted ? r.inreview.push(p) : r.rough.push(p)
        r.stats.words += p.stats.words
        p.lastTouched = { action: `${p.meta.lastTouch.action}ed` }
        // console.log('p.stats'.yellow, p.title, p.stats, util)
        p.lastTouched.utc = p.meta.lastTouch.utc || util.BsonId.toDate(p.meta.lastTouch._id)
        delete p.meta
        // console.log('p.meta'.yellow, p.meta.lastTouch)
      }
      return r
    },

    published: d => {
      var unpublished = [], live = []
      var stars = 0, rated = 0
      var stats = {posts:d.posts.length,views:0,words:0,reviews:0,rating:0,comments:0,acceptedPRs:0}
      var posts = d.posts.map(p =>
        assign(select(chain(p, inflate.tags), '_id by title tags stats history'),
          { ogImage: p.htmlHead.ogImage, ogDesc: p.htmlHead.description, url: p.htmlHead.canonical }))

      for (var p of posts) {
        stats.acceptedPRs += p.stats.acceptedPRs||0
        stats.views += p.stats.views||0
        stats.words += p.stats.words||0
        stats.reviews += p.stats.reviews||0
        stats.comments += p.stats.comments||0
        stars += p.stats.rating||0
        rated = p.stats.rating ? rated+1 : rated
        moment(p.history.live.published) > moment() ? unpublished.push(p) : live.push(p)
      }
      stats.rating = stars/rated

      return {live,unpublished,stats}
    },

    home: ({user,posts,views}) => {
      var viewshash = { total: views.length }
      for (var v of views) {
        if (!viewshash[v.oId]) viewshash[v.oId] = {total:0,ref:{}}
        var ref = (v.ref||'noref').split('?')[0].replace(/^(http|https)\:\/\//,'').replace(/\/$/,'')
        viewshash[v.oId].ref[ref] = viewshash[v.oId].ref[ref] ? viewshash[v.oId].ref[ref] + 1 : 1
        viewshash[v.oId].total ++
      }

      // var feedback =   []
      var mine =  []
      var drafts =     []
      var inreview =   []
      var published =  []
      var forked = 0
      var reviewed = 0
      for (var p of posts) {
        if (_.idsEqual(user._id, p.by._id)) mine.push(p)
        if (_.find(p.forkers, f => _.idsEqual(user._id, f.userId))) ++forked
        if (_.find(p.reviews, r => _.idsEqual(user._id, r.by))) ++reviewed
      }

      mine = _.sortBy(mine, p => p.meta ? p.meta.lastTouch._id : 1)
      mine.forEach(p => {
        // if (!history.updated) p.history.updated = p.history.created
        // feedback = feedback.concat(chain(p, 'feedback').reviews||[])
        if (p.history.published) {
          var pviews = (viewshash[p._id]||{total:0,ref:{}})
          published.push({_id:p._id,title:p.title,views:pviews.total,
            ref: Object.keys(pviews.ref).filter(r=>pviews.ref[r]>2)
                                        .sort((a,b)=>pviews.ref[b]-pviews.ref[a])
                                        .map(r=>`${pviews.ref[r]}:${r}`)
          })

        }
        else if (p.history.submitted) inreview.push(p._id)
        else drafts.push(p._id)
      })
      // if (feedback.length > 0)
        // lib.feedback =  _.take(_.sortBy(feedback,r=>-1*r.utc), 10)
      // console.log('user', select(user,'_id username bio photos emails'))
      return {
        drafts, inreview, forked, reviewed,
        published: _.sortBy(published, p => -1 *p.views.total),
        mine:     mine.map(p=>select(p,'_id title stats')),
        user:     select(user,'_id bio email'),
        scopes:   user.auth.gh.scopes || false,
        // bookmarked: [] // futures
      }
    },

    // tagslugs: p => { p = chain(p, inflate.tags); p.tags = _.sortBy(p.tags, t => t.sort).map(t => t.slug); return p },
  })

}
// .addCacheInflate('tags', ['name','slug','short'])


// display:  '_id by.userId by.name by.avatar by.expertId by.bio by.username by.social social.gh.username social.so.link social.bb.username social.in.id social.tw.username social.al.username social.gp.link meta github.repoInfo reviews._id reviews.by reviews.updated reviews.replies reviews.votes reviews.questions.key reviews.questions.answer forkers title tmpl slug stats created published submitted tags assetUrl md lastTouch.utc lastTouch.action lastTouch.by._id lastTouch.by.name',
// list: 'by.userId by.name by.avatar meta.canonical meta.description meta.ogImage github.repoInfo title slug created published submitted tags stats prize'
// listCache: '_id by.name by.avatar title meta.canonical meta.ogImage'
// stats:    '_id title by.userId by.name by.avatar slug meta forkers reviews._id reviews.by reviews.updated reviews.replies reviews.votes reviews.questions.key reviews.questions.answer created published submitted tags assetUrl stats pullRequests lastTouch.utc lastTouch.action lastTouch.by.name'
// pr: {
//   'pullRequests.url pullRequests.html_url pullRequests.id pullRequests.number pullRequests.state pullRequests.title pullRequests.user.login pullRequests.user.avatar_url pullRequests.created_at pullRequests.updated_at pullRequests.closed_at': null,
//   'pullRequests.merged_at': null,
//   'pullRequests.merge_commit_sha pullRequests.statuses_url': 1
// },


// module.exports = new LogicDataHelper(views,

//   ({select,assign,map,chain}, TypesUtil) => ({

//     recent: r =>
//       select.recent(chain(r, '$post.url', 'stats')),
//     detail: r =>
//       select.activity(chain(r, '$post.url', 'pullRequests', 'stats')),
//     pullRequests: p =>
//       map(p.pullRequests, pr => select.pr(pr)),

//   }), {

//   published(andCondition) {
//     var query = [
//       {'published' : { '$exists': true }} ,
//       {'published': { '$lt': new Date() }}
//     ]

//     return andQuery(query, andCondition)
//   },

//     notBy(_id) {
//       return       { 'by._if': { $ne: _id } }
//     }

//   //posts published before now or readyForReview
//   publishedReviewReady(andCondition) {
//     var query = {$or: [
//       {'submitted' : {'$exists': true}},
//       {$and:
//         [{'published' : { '$exists': true }},
//         {'published': { '$lt': new Date() }}]}]}

//     return andQuery(query, andCondition)
//   },
//   publishedNewest(limit) {
//     var o = { sort: { 'published': -1 } }
//     if (limit) o.limit = limit
//     return o
//   },

//   allPublished: {
//     sort: { 'published': -1, 'stats.reviews': -1, 'stats.rating': -1 }
//   },

// )
