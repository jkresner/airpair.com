import Svc                from '../services/_service'
var logging               = false
var Template              = require('../models/template')
var svc                   = new Svc(Template, logging)
var handlebars            = require('handlebars')
var marked                = require('marked')

var get = {

  getAll(cb)
  {
    svc.searchMany({},{}, cb)
  },

  getAllForCache(cb)
  {
    get.getAll((e,r) => {
      var compiled = []
      for (var tmpl of r) {
        var compiledTmpl = {
          _id: `${tmpl.type}:${tmpl.key}`,
          markdownFn: handlebars.compile(tmpl.markdown)
        }
        if (tmpl.subject)
          compiledTmpl.subjectFn = handlebars.compile(tmpl.subject)

        compiled.push(compiledTmpl)
      }
      cb(e,compiled)
    })
  }

}


var interpolate = {

  mdFile(key, data, cb) {
    cache.tmpl('md-file', key, (tmpl) =>
      cb(tmpl.markdownFn(data))
    )
  },

  mail(key, data, cb) {
    cache.tmpl('mail', key, (tmpl) => {
      var Text = tmpl.markdownFn(data)
      cb(null, {
        Subject: tmpl.subjectFn(data),
        Text,
        Html: marked(Text)
      })
    })
  }

}


module.exports = _.extend(get, interpolate)
