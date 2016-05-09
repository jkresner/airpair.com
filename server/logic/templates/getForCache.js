module.exports = ({Template}, {Project, Opts}, Shared) => ({

  exec(cb) {
    Template.getManyByQuery({}, {}, (e,r) => {
      var compiled = {}
      for (var tmpl of r) {
        var compiledTmpl = {
          _id: `${tmpl.type}:${tmpl.key}`,
          markdownFn: handlebars.compile(tmpl.markdown)
        }
        if (tmpl.fallback)
          compiledTmpl.fallbackFn = handlebars.compile(tmpl.fallback)
        if (tmpl.thumbnail)
          compiledTmpl.thumbnailFn = handlebars.compile(tmpl.thumbnail)
        if (tmpl.link)
          compiledTmpl.linkFn = handlebars.compile(tmpl.link)
        if (tmpl.subtype)
          compiledTmpl.subtype = tmpl.subtype
        if (tmpl.subject) {
          compiledTmpl.subjectFn = handlebars.compile(tmpl.subject)
          compiledTmpl.sender = tmpl.sender || 'team'
        }

        compiled[compiledTmpl._id] = compiledTmpl
      }
      cb(e, compiled)
    })
  }

})

