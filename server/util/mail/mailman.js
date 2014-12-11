var fs =          require('fs')
var handlebars =  require('handlebars')
var util =        require('../../../shared/util')
// var async =       require('async')
import {getUsersInRole} from '../../services/users'

var templates = {}

function initTemplates() {
  var filenames = fs.readdirSync(`${config.appdir}/shared/mail`)
  for (var filename of filenames)
  {
    var matches = /^([^.]+).hbs$/.exec(filename)
    if (matches)
    {
      var name = matches[1]
      var template = fs.readFileSync(`${config.appdir}/shared/mail/${filename}`, 'utf8')
      templates[name] = handlebars.compile(template)
    }
  }
}

var receivers = {}
function initReceivers() {
  getUsersInRole('pipeliner', (e,r) => {
    receivers.pipeliners = []
    for (var {name,email} of r) { receivers.pipeliners.push(`${name} <${email}>`) }
  })
}


function renderEmail(templateName, templateData) {
  var rendered = {}
  var subjectFn = templates[`${templateName}_subject`],
      htmlFn = templates[`${templateName}_html`],
      textFn = templates[`${templateName}_text`]

  if (!htmlFn && !textFn || !subjectFn) throw Error(`No email template functions for ${templateName}`)

  rendered.Subject = subjectFn(templateData)
  if (htmlFn) rendered.Html = htmlFn(templateData)
  if (textFn) rendered.Text = textFn(templateData)

  return rendered
}


module.exports = function(mailProvider)
{
  initTemplates()
  initReceivers()

  var mailman = {
    sendVerifyEmail(toUser, hash, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('verifyemail', {
        firstName: util.firstName(toUser.name),
        hash
      }), cb)
    },
    sendChangePasswordEmail(toUser, hash, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('changepassword', {
        firstName: util.firstName(toUser.name),
        hash
      }), cb)
    },
    subscriberWelcomeEmail(toUser, hash, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('subscriberwelcome', {
        firstName: util.firstName(toUser.name),
        hash
      }), cb)
    },
    sendPipelinerNotifyPurchaseEmail(byName, total, cb) {
      mailProvider.send(receivers.pipeliners, renderEmail('pipelinernotifypurchase', {
        fullName: byName,
        total,
      }), cb)
    },
    sendPipelinerNotifyBookingEmail(byName, expertName, bookingId, cb) {
      mailProvider.send(receivers.pipeliners, renderEmail('pipelinernotifybooking',
        { byName, expertName, bookingId }), cb)
    },
    sendPipelinerNotifyRequestEmail(byName, requestId, cb) {
      mailProvider.send(receivers.pipeliners, renderEmail('pipelinernotifyrequest',
        { byName, requestId }), cb)
    }
  }

  return mailman
}

