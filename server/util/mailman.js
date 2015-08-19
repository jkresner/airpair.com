var groups        = ['pipeliners','spinners']
var lists         = {}
var {sender}      = config.mail
var emptyCB       = (e,r) => { if (e) $log('mailman.send.error'.red, e) }

var senderTansport = {
  ap: 'ses',
  jk: 'smtp',
  team: 'smtp',
  pairbot: 'ses'
}

module.exports = function()
{
  var $$log = function() {
    var args = [].slice.call(arguments)
    var named = args.shift()
    mm.$$trace(named, args)
  }

  var TemplateSvc   = require('../services/templates')

  function initTransports() {
    var {createTransport}   = require('nodemailer')
    var {markdown}          = require('nodemailer-markdown')

    var defaultTransport = config.mail.transport.default

    if (config.mail.transport.default == 'stub') {
      var stubTransport = require('nodemailer-stub-transport')
      var stub = createTransport(stubTransport())
      stub.use('compile', markdown())
      return { ses: stub, smtp: stub, stub }
    }
    else {
      var sesTransport  = require('nodemailer-ses-transport')
      var ses           = createTransport(sesTransport(config.mail.transport.ses))
      var smtp          = createTransport(config.mail.transport.smtp)
      smtp.use('compile', markdown())
      ses.use('compile', markdown())
      return { ses, smtp }
    }
  }

  var mm = $trace('mail',{


    get(tmplName, tmplData, cb) {
      TemplateSvc.mail(tmplName, tmplData, [], cb)
    },


    send(mail, transportType, cb)
    {
      if (transportType.constructor === Function) {
        cb = transportType
        transportType = null
      }

      if (!mm.transports)
        mm.transports = initTransports()

      mail.from = (mail.sender) ? config.mail.sender[mail.sender] : config.mail.sender.team
      transportType = transportType ||  senderTansport[mail.sender]

      if (!_.contains(['ses','smtp','stub'], transportType))
        return $log('transportType'.red, transportType, mail)

      mm.transports[transportType||config.mail.transport.default].sendMail(mail, (e, info) => {
        $$log(null,transportType.cyan, mail.from.split(' ')[0].gray, mail.to, mail.subject.yellow)
        if (config.log.mail) $log(mail.text)
        if (cb) cb(e, mail)
      })
    },


    sendMarkdown(subject, markdown, toUser, sender, cb) {
      var to = `${toUser.name} <${toUser.email}>`
      mm.send({subject, markdown, to, sender}, cb||emptyCB)
    },


    getGroupList(group, cb) {
      if (lists[group])
        return cb(null, lists[group])

      var {getUsersInRole}  = require('../services/users')
      var role = group.slice(0,-1)
      getUsersInRole(role, (e, users) => {
        if (e) return cb(e)
        lists[group] = _.map(users, (to) => `${to.name} <${to.email}>` )
        $$log({group}, lists[group])
        cb(null, lists[group])
      })
    },


    sendGroupMail(tmplName, tmplData, toGroup, callback) {
      var cb = callback || emptyCB
      mm.getGroupList(toGroup, (e, to) => {
        if (e) return cb(e)
        TemplateSvc.mail(tmplName, tmplData, to, (ee, mail) => {
          mm.send(mail, cb)
        })
      })
    },


    sendTemplate(tmplName, tmplData, to, cb) {
      if (_.contains(groups,to))
        return mm.sendGroupMail.apply(this, arguments)

      TemplateSvc.mail(tmplName, tmplData, to, (e, mail) =>
        mm.send(mail, cb||emptyCB))
    },


    sendTemplateMails(tmplName, tmplData, toUsers, cb) {
      if (cb) cb(Error('sendTemplateEmails does not yet support a callback'))
      // $log('sendTemplateMails'.green, tmplName, tmplData, toUsers)
      for (var to of toUsers)
        TemplateSvc.mail(tmplName, tmplData, to, (e, mail) =>
          mm.send(mail, cb||emptyCB))
    },


    sendError(text) {
      $log('sendError', text, config.log.error.email)
      if (config.log.error.email)
        mm.transports['ses'].sendMail(_.extend({text},config.log.error.email), (e, info) => {})
    }

    // sendVerifyEmailForRequest(toUser, hash, requestId, cb) {
    // singupSubscribeEmail(toUser, hash, cb) {
    // signupHomeWelcomeEmail(toUser, hash, cb) {
  })

  return mm
}

