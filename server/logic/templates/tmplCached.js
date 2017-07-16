module.exports = ({Template}, {Project, Opts}, DRY) => ({

  exec(cb) {
    var compiled = {}
    Template.getManyByQuery({}, (e,r) => {
      
      for (var tmpl of (r||[])) {
        compiled[tmpl.key] = {} 
        for (var attr in tmpl.parts)
          compiled[tmpl.key][attr] = handlebars.compile(tmpl.parts[attr])
      }
      cb(e, compiled)
    
    })
  }

})

