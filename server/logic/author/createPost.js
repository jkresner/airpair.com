module.exports = ({Post}, Data, DRY) => ({


  validate(user, info)
  {
    if (!info.title) return `Title required`
    if (!info.type) return `Type required`
    if (info.assetUrl) return `Unexpected assetUrl`
    if (info.md) return `Unexpected markdown`
  },


  exec(o, cb) {
    o.history = { created: new Date() }
    o.by = Data.Project.author(this.user)
    o.md = "new"
    o.meta = DRY.touchMeta(null, 'create', this.user)

    Post.create(o, cb)
    // -- legacy
    // o.editHistory = [o.lastTouch]
    // UserSvc.changeBio.call(this, o.by.bio,() => {})
  },

  project: Data.Project.info


})
