const Views = {
  edit:         '_id title tags assetUrl by._id history md slug stats repo', //github.repoInfo  created published submitted tags assetUrl  synced
  details:      '_id type title tags imgur assetUrl slug by history log.last stats',
  submit:       '_id type title tags slug submission history stats',
  forking:      '_id title tags by slug forking',
  publishing:   '_id title tags by slug history reviews',
  previewable:  '_id title tags assetUrl by body references toc', // created published submitted
  reviewable:   '_id title tags assetUrl by body references toc review stats', // created published submitted
  collab:       '_id title tags assetUrl by slug history reviews forkers PRs stats',
  pr:           ' url html_url id number state title user.login user.avatar_url created_at updated_at closed_at n merged_at n merge_commit_sha statuses_url'.replace(/ /g,' pullRequests.').replace(/$ /,''),
  by:           '_id avatar bio email name links.al links.ap links.bb links.gh links.gp links. links.so links.tw'
}




var imgurMatch = /^https:\/\/imgur.com\//


const Projections = ({inflate,select,util},{chain,view}) => ({

  // activity: r =>
    // select.activity(chain(r, 'url', '$activity.stats')),


  avatar: d =>
    (d.by.avatar||'').indexOf('?') > 0 ? d :
      assign(d, {by: assign(d.by, {avatar:d.by.avatar.split('?')[0]})}),


  by: d => {
    var email = d.emails.filter(({primary}) => primary)[0].value
    var links = {}
    if (d.auth.al) links.al = d.auth.al['profile_url']
    if (d.auth.ap) links.ap = d.auth.ap['avatar']
    if (d.auth.bb) links.bb = d.auth.bb['profile_url']
    if (d.auth.fb) links.fb = d.auth.fb['profile_url']
    if (d.auth.gh) links.gh = d.auth.gh['profile_url']
    if (d.auth.gp) links.gp = d.auth.gp['profile_url']
    if (d.auth.in) links.in = d.auth.in['profile_url']
    if (d.auth.so) links.so = d.auth.so['profile_url']
    if (d.auth.tw) links.tw = d.auth.tw['profile_url']
    var gravatar = _.get(d, 'auth.gh.gravatar_id')
    var avatar = gravatar ? `https://0.gravatar.com/avatar/${gravatar}` : d.auth.gh.avatar_url
    if (avatar.indexOf('?')!=-1) avatar = avatar.split('?')[0]

    return assign(view.by(d), {avatar,email,links})
  },


  // collab: r =>
    // select.collab(chain(r, 'url', inflate.tags)),

  forking: r =>
    chain(r, 'avatar', view.forking),


  edit: d => {
    var r = { todo: chain(d.post, 'posts.words', 'posts.todo').todo }
    r.md = { live:d.post.md, head:d.headMD }
    r.post = select(chain(d.post, inflate.tags, 'posts.toHtml'), '_id title by html history stats tags assetUrl references')
    r.post.tmpl = 'v2'
    // r.repo = `${owner}/${r.slug}`
    // if (overrideMD) r.synced = r.md == overrideMD
    return r
  },


  imgur: r =>
    assign(r, { imgur:
      imgurMatch.test(r.assetUrl) ?
        r.assetUrl.replace(imgurMatch,'').split('.')[0] : ''}),


  info: r =>
    chain(r, 'posts.url', 'imgur', inflate.tags, view.details),


  submit: r =>
    chain(r, inflate.tags, 'posts.slug', view.submit),


  previewable: r =>
    chain(r, inflate.tags, 'posts.toHtml', 'posts.url', view.previewable),


  reviewable: r =>
    chain(r, inflate.tags, 'posts.toHtml', 'posts.url', 'activity.stats', view.reviewable),


  viewable: r =>
    r

})


module.exports = { Views, Projections }
