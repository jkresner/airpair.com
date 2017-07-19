var Views = {
  edit:         '_id title tags assetUrl by._id history md slug stats repo', //github.repoInfo  created published submitted tags assetUrl  synced
  details:      '_id type title tags imgur assetUrl slug by history meta.lastTouch stats',
  submit:       '_id type title tags slug submission history stats',
  forking:      '_id title tags by slug forking',
  publishing:   '_id title tags by slug history reviews',
  previewable:  '_id title tags assetUrl by body references toc', // created published submitted
  reviewable:   '_id title tags assetUrl by body references toc review stats', // created published submitted
  collab:       '_id title tags assetUrl by slug history reviews forkers PRs stats',
  pr:           ' url html_url id number state title user.login user.avatar_url created_at updated_at closed_at n merged_at n merge_commit_sha statuses_url'.replace(/ /g,' pullRequests.').replace(/$ /,''),
}

var imgurMatch = /^https:\/\/imgur.com\//
var lib = {
  post: require('../../../es/post')
}

const Projections = ({inflate,select},{chain,view}) => ({

  author: u => {
    var gravatar = _.get(u, 'auth.gh.gravatar_id')
    var avatar = gravatar ? `https://0.gravatar.com/avatar/${gravatar}` : u.auth.gh.avatar_url
    if (avatar.indexOf('?')!=-1) avatar = avatar.split('?')[0]
    return assign(select(u,'_id name avatar bio email'), {avatar})
  },

  avatar: d =>
    (d.by.avatar||'').indexOf('?') > 0 ? d :
      assign(d, {by: assign(d.by, {avatar:d.by.avatar.split('?')[0]})}),

  forking: r =>
    chain(r, 'avatar', select.forking),

  // collab: r =>
    // select.collab(chain(r, 'url', inflate.tags)),

  imgur: r =>
    assign(r, { imgur:
      imgurMatch.test(r.assetUrl) ?
        r.assetUrl.replace(imgurMatch,'').split('.')[0] : ''}),

  info: r =>
    chain(r, 'posts.url', 'imgur', inflate.tags, view.details),
  // activity: r =>
    // select.activity(chain(r, 'url', '$activity.stats')),

  todo: r =>
    assign(r, { todo: { next: lib.post.todo(r)} }),

  edit: d => {
    var r = { todo: chain(d.post, 'todo').todo }
    // console.log('edit'.yellow, d.post)
    r.md = { live:d.post.md, head:d.headMD }
    r.post = select(chain(d.post, inflate.tags, 'posts.toHtml'), '_id title by html history stats tags assetUrl references')
    r.post.tmpl = 'v2'
    // console.log('edit'.yellow, r)
    return r
  },

  submit: r =>
    assign(view.submit(chain(r, inflate.tags), { slug: r.slug || lib.post.defaultSlug(r) })),

  displayReview: r =>
    chain(r, '$post.displayReview'),

  previewable: r => {
    var {markdown,references} = lib.post.extractSupReferences(r.headMD)
    r.references = references
    r.md = r.headMD

    // $log('previewable.r'.yellow, r.references)
    return view.previewable(chain(r, inflate.tags, 'posts.bodyHtml', 'posts.tocHtml', 'posts.url'))
  },

  reviewable: r => {
    var {markdown,references} = lib.post.extractReferences(r.md)
    r.references = references
    // $log('r'.yellow, r.references)
    return view.reviewable(chain(r, inflate.tags, 'posts.bodyHtml', 'posts.tocHtml', 'posts.url', 'activity.stats'))
  },

  viewable: r =>
    r

})


module.exports = { Views, Projections }
