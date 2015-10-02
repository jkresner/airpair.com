var Svc                   = require('./_service')
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

  mail(key, data, to, cb) {
    var tData = data
    if (to && to.name)
      tData = _.extend({firstName:util.firstName(to.name)},data)

    cache.tmpl('mail', key, (tmpl) => {
      cb(null, {
        to: (to.constructor === Array) ? to : [`${to.name} <${to.email}>`],
        subject: tmpl.subjectFn(tData).replace(/&#x27;/g,"'"),
        markdown: tmpl.markdownFn(tData).replace(/&#x27;/g,"'"),
        sender: tmpl.sender
      })
    })
  },

  slackMSGSync(key, data) {
    var tmpl = cache.templates[`slack-message:${key}`]

    if (!tmpl)
      $log(`template slack-message:${key} not found in cache`.warning)

    else if (tmpl.subtype == 'message')
      return {
        type: 'message',
        text: tmpl.markdownFn(data)
      }

    else if (tmpl.subtype == 'attachment')
      return {
        type: 'attachment',
        fallback: tmpl.fallbackFn(data),
        color:  tmpl.color,
        pretext: tmpl.subjectFn(data),
        thumb_url: tmpl.thumbnailFn(data),
        title: data.title,
        title_link: tmpl.linkFn(data),
        text: tmpl.markdownFn(data),
      }
  },

  slackMSG(key, data, cb) {
    cache.tmpl('slack-message', key, (tmpl) =>
      cb(null, interpolate.slackMSGSync(key, data))
    )
  },

  slackMSGsforBookingStatus(data) {
    var {status} = data
    var msgs = {}
    for (var tmlpKey of _.keys(cache.templates)) {
      if (tmlpKey.indexOf(`slack-message:booking-${status}-`)==0)
      {
        var type = cache.templates[tmlpKey].subtype
        var msgKey = tmlpKey.replace(`slack-message:booking-${status}-`,'')
        msgs[msgKey] = interpolate.slackMSGSync(`booking-${status}-${msgKey}`,data)  //message|attachment
      }
    }
    return msgs
  }

}


module.exports = _.extend(get, interpolate)
