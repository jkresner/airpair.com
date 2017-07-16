module.exports = ({Tag}, Data, DRY) => ({

  exec(cb) {
    var hash = {}
    Tag.getManyByQuery({}, Data.Opts.cached, (e,r)=>{
      for (var tag of r) hash[tag._id] = tag
      cb(null, hash)
    })
  }

})

