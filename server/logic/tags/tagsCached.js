module.exports = ({Tag}, DATA, Shared) => ({

  exec(cb) {
    var hash = {}
    Tag.getManyByQuery({}, { select:'_id slug name short', sort:{slug:1} }, (e,r)=>{
      for (var tag of r) hash[tag._id] = tag
      cb(null, hash)
    })
  }

})

