// "post-repo-readme": {
//   "_id" : "54ddc48fa779e09fc45b3b89",
//   // "type" : "md-file",
//   "key" : "post-repo-readme",
//   "description" : "Used for README.md for repos backing AirPair posts",
//   "markdown" : "## Developer Community Content on [AirPair.com](https://www.airpair.com/)\n\n[This post was submitted and published on AirPair by {{by.name}} ({{by.social.gh.username}})\n ![{{slug}}](https://www.airpair.com/posts/thumb/{{_id}})](https://www.airpair.com/posts/review/{{_id}})\n\nContent on AirPair is stored using git so we can collaboratively improve it using Pull Requests.\n\n### To edit / contribute\n\n#### Manually\n\n1. Fork this post\n2. Edit your fork's `post.md` file on the `edit` branch\n3. Create a pull request from your fork's `edit` branch to the parent repo's `edit` branch\n\n** ***Please do not merge the `edit` branch into `master`!***\n\n#### The easy way\n\n1. [Fork this post on AirPair\n![Fork on AirPair](https://airpair.github.io/posts/fork.png)\n](https://www.airpair.com/posts/fork/{{_id}})\n\n2. [Edit on AirPair  using the live editor\n![Edit on AirPair](https://airpair.github.io/posts/edit.png)\n](https://www.airpair.com/posts/edit/{{_id}})\n\n3. [Create one-click Pull Requests from the live editor\n![Pull Request on AirPair](https://airpair.github.io/posts/pr.png)\n](https://www.airpair.com/posts/edit/{{_id}})\n\n### Accepting / merging contributions\n\nAll contributions come in the form of Pull Requests. Use GitHub to view and merge or reject Pull Requests.\n\n### Publishing\n\nAirPair does not automatically \"sync\" with the master repo. As an author you may sync your post while it is still in community review. Once fully published, find an editor in AirPair chat to sync HEAD with the live version published on airpair.com\n\n## Licensing of Content\n\nContent submitted to AirPair with no monetary exchange belongs to the author. If a financial exchange has occured between the author and AirPair, AirPair assumes ownership of this content. This content may not be published anywhere other than airpair.com without the owners consent.\n\nContributors are granted rights to copy this content for the purpose of contributing, however under no circumstances do contributions grant co-ownership rights with the owner of this content.\n"
// },
// "post-submit-notify": {
//   "_id" : "54ddc556a779919fc45b6c99",
//   // "type" : "slack-message",
//   "description" : "Bot announcing new post submitted for review",
//   "key" : "post-submitted-slack",
//   slack: {
//     "markdown" : "New post for review: *{{title}}*. \nPlease tell us what you think: https://wwww.airpair.com/posts/review/{{_id}}"
//   }
// }

module.exports = (DAL, Data, DRY) => ({


  validate(user, original, slug)
  {
    if (!DRY.role.author(user, original))
      return `Post[${original._id}] belongs to another user`
    if (original.history.submitted)
      return `Already submitted [${original.history.submitted}]`
    if (!slug)
      return `Slug required`
    if (!DRY.validSlug(slug))
      return `Slug [${slug}] not a valid repo name`
    if (slug.length > 50)
      return `Slug ${slug} is too long`
    if (slug.indexOf('--') != -1)
      return `Double '--' in slugs is too ugly for your post's url`

    var minwcount = parseInt(config.authoring.wordcount)
    var wcount = honey.util.String.wordcount(original.md)
    if (!original.history.published && wcount < minwcount)
      return `Min ${minwcount} words required for peer review. [${wcount}] so far!`

      //-- Consider checking tags / assetUrl ?
  },


  exec(original, slug, cb) {
    let {user} = this
    let {_id,md,htmlHead,history} = original
    let log = DRY.logAct(original, 'submit', user)
    history.submitted = new Date()
    htmlHead = htmlHead || {}
    htmlHead.ogImage = original.assetUrl

    // TODO add subscribed
    let tmpl = honey.templates.get('repo:post-readme')
    let readmeMD = tmpl.raw(original)

    // $log('Queue.postSubmit'.magenta, original.stats)
    Wrappers.GitPublisher.setupPostRepo(user, slug, _id, md, readmeMD, (e, repoInfo) => {
      if (e) return cb(e)
      let stats = {reviews:0,comments:0,forkers:0,acceptedPRs:0,closedPRs:0,openPRs:0,views:0}

      DAL.Post.updateSet(_id, {htmlHead,log,slug,history,github:{repoInfo},stats}, cb)
      // $log('Queue.postSubmit'.magenta, original.title, 'nothing impl yet')
      // Queue.postSubmit(assign(original,{slug,stats}))
    })
  },


  project: Data.Project.details


})



