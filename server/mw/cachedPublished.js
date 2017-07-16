module.exports = (app, mw) => 

  mw.data.cached('published', honey.logic.posts.recommended.exec)

  // mw.cache('inflateMe', mw.data.recast('user','user._id',{required:false,merge:true}))
  // mw.cache('inflateMeExpert', mw.data.recast('expert','user._id',{queryKey:'userId'}))
  // var {tagLookup} = logic.tags
  // mw.cache('paramTag', (req, res, next) => {
  //   var lookup = req.params.tag
  //   var inValid = tagLookup.validation(req.user, lookup)
  //   if (inValid) return next(Error(`req.params.tag ${lookup} inValid`))
  //   logic.tags.tagLookup(req.params.tag, (e,r) => {
  //     if (e||!r) return next(e||Error(`Tag param not found by ${lookup}`))
  //     next(null, req.tag = r)
  //   })
  // })

