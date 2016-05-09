module.exports = ({Tag}, {Project, Opts}, Shared) => ({

  exec(cb) {
    var hash = {}
    Tag.getManyByQuery({}, Opts.cached, (e,r)=>{
      for (var tag of r) hash[tag._id] = tag
      cb(null, hash)
    })
  }

})

