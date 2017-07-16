module.exports = ({Post}, Data, DRY) => ({


  exec(cb) {
    var {_id} = this.user
    Post.getManyByQuery(Data.Query.drafts(_id), Data.Opts.drafts,
      (e, posts) => cb(e, e?null:{posts}) )
  },


  project: Data.Project.drafts


})



