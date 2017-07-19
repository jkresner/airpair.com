module.exports = ({Template}, {Project, Opts}, DRY) => ({

  exec(cb) {
    var compiled = {}
    Template.getManyByQuery({}, (e,r) => {
      if (e) return cb(e)
      for (var tmpl of r) {
        compiled[tmpl.key] = {}
        for (var attr in tmpl.part)
          compiled[tmpl.key][attr] = handlebars.compile(tmpl.part[attr])
      }
      cb(null, compiled)
    })
  }

})

