module.exports = function(DAL, Data, Shared, Lib) {

  return {

    // validate,

    exec(cb) {
      var authenticated = this.user != null
      if (authenticated)
        DAL.User.getById(this.user._id, Data.Opts.full, cb)
      else
        cb(null, assign({ authenticated }, { sessionID: this.sessionID }, this.session.anonData))

        // var avatar = Data.data.anonAvatars[_.random(1)]
        // if (this.session.anonData && this.session.anonData.email)
        // {
        //   Data.select.setAvatar(this.session.anonData)
        //   avatar = this.session.anonData.avatar
        // }
    },


    project: Data.Project.full

  }
}
