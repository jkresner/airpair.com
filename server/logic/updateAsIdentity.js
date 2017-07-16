function updateAsIdentity(data, trackData, cb) {
  if (!this.user) return cb(Error('User.anon.updateAsIdentity'))

  if (trackData)
    analytics.echo(this.user, this.sessionID, 'Save', trackData, {}, ()=>{})

  // var {user} = this

    // var unset = { bitbucketId: 1 }
    // svc.updateWithUnset(id, unset, (e,user) => {})

    // o.updated = new Date() ??
    // authorization etc.
  User.updateSet(this.user._id, data, {select:'_id name username emails photos location initials'}, (e,r) => {
    // console.log('user.updateAsIdentity e r'.white, e, r)
    if (e) return cb(e)
    if (!r) return cb(Error(`Failed to update user with id: ${this.user._id}`))

    var session = _.select(r, '_id name username')
    session.email = _.find(r.emails, em => em.primary).value
    session.avatar = (r.photos ? r.photos[0].value : md5.gravatarUrl(session.email)).split('?')[0]

    // console.log('user.updateAsIdentity'.white, r)
//      //-- Very magic important line
    // if (!_.isEqual(this.session.passport.user, sessionOfUser))
    this.session.passport.user = session
    console.log('user.updateAsIdentity'.yellow, this.session.passport.user)
    // console.log('user.updateAsIdentity session'.white, session)

    cb(e, r)
  })

 //      //-- Migrate social accounts to v1 structure
      {
        var migrate = false
        var social = user.social || {}
        var connected = _.keys(social).length
        if (user.bitbucket && !social.bb) social.bb = user.bitbucket
        if (user.github && !social.gh) social.gh = user.github
        if (user.linkedin && !social.in) social.in = user.linkedin
        if (user.stack && !social.so) social.so = user.stack
        if (user.twitter && !social.tw) social.tw = user.twitter
        if (_.keys(social).length != connected) migrate = true
        user.social = social
        $log('migrate.social', migrate)
        var bookmarks = user.bookmarks || []
        var tags = user.tags || []
        var siteNotifications = user.siteNotifications || []
        var roles = user.roles || []
 // || !user.bookmarks || !user.tags || !user.siteNotifications || !user.roles
        if (migrate) {
          $log(`Mirgrating user ${user._id} ${user.email}`.yellow)
          svc.updateWithSet(id, {social,bookmarks,tags,siteNotifications,roles}, done)
        }
        else
          done(null, user)
  }
  else {

    this.session.anonData = _.extend(this.session.anonData, data)
    get.getSession.call(this, cb)

  }
}