module.exports = (DAL, {Project,Query,Opts}, DRY) => ({


  validate() {},


  exec(cb) {
    var {user} = this
    DAL.Post.getManyByQuery(Query.home(user._id), Opts.home,
      (e, posts) => {
        if (e) return cb(e)
        var $in = posts.filter(p=>(p.history||{}).published && _.idsEqual(user._id,p.by._id)).map(p=>p._id)
        if ($in.length == 0) return cb(null,{user,posts,views:[]})

        var startId = DAL.Post.newId().constructor.createFromTime(moment().add(-1,'week').format('X'))
        var q2 = {_id:{$gt:startId},oId:{$in}}
        DAL.View.getManyByQuery(q2, { select: '_id oId ref' }, (ee, views) => {
          cb(ee, ee?null:{user,posts,views})
        })
      })
  },


  project: Project.home


})



