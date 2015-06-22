var fs               = require('fs')
var handlebars       = require('handlebars')
var marked           = require('marked')
var TemplateSvc      = require('../../services/templates')
var {getUsersInRole} = require('../../services/users')

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

  function sendMassEmail(templateName, templateData, toUsers, cb) {
    TemplateSvc.mail(templateName, templateData, (e, renderedEmail) => {
      mailProvider.send(toUsers, renderedEmail, cb)
    })
  }

  function sendTemplateEmail(templateName, templateData, toUser, cb) {
    templateData.firstName = util.firstName(toUser.name)
    TemplateSvc.mail(templateName, templateData, (e, renderedEmail) =>
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderedEmail, cb)
    )
  }

  function sendTemplateEmails(templateName, templateData, toUsers, cb) {
    if (cb) cb(Error('sendTemplateEmails does not yet support a callback'))
    for (var user of toUsers)
      sendTemplateEmail(templateName, templateData, user, cb)
  }


  var mailman = {
    sendRawTextEmail(toUser, subject, body, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, {
        Subject: subject, Text: body, Html: marked(body)
      }, cb)
    },
    sendVerifyEmail(toUser, hash, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('verifyemail', {
        firstName: util.firstName(toUser.name),
        hash
      }), cb)
    },
    sendVerifyEmailForRequest(toUser, hash, requestId, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('verifyemailforrequest', {
        firstName: util.firstName(toUser.name),
        hash,
        requestId,
      }), cb)
    },
    sendChangePasswordEmail(toUser, hash, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('changepassword', {
        firstName: util.firstName(toUser.name),
        hash
      }), cb)
    },
    singupSubscribeEmail(toUser, hash, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('subscriberwelcome', {
        firstName: util.firstName(toUser.name),
        hash
      }), cb)
    },
    signupHomeWelcomeEmail(toUser, hash, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('signuphomewelcome', {
        firstName: util.firstName(toUser.name),
        hash
      }), cb)
    },
    signupPostcompEmail(toUser, hash, cb) {
      sendTemplateEmail('signup-100k-post-comp', { hash }, toUser, cb)
    },
    sendGotCreditEmail(toUser, credit, fromUser, cb) {
      mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('gotcredit', {
        firstName: util.firstName(toUser.name),
        fromName: fromUser.name,
        credit
      }), cb)
    },

    send(toUser, tmpl, data, cb) {
      if (toUser == 'pipeliners')
        sendMassEmail(tmpl,data,receivers.pipeliners,cb)
      else
        sendTemplateEmail(tmpl, data, toUser, cb)
    },

    get(templateName, templateData, cb) {
      TemplateSvc.mail(templateName, templateData, (e, renderedEmail) => cb(e,renderedEmail))
    },

    sendExpertAvailable(toCustomer, expertName, requestId, noPaymethods, cb) {
      mailProvider.send(`${toCustomer.name} <${toCustomer.email}>`, renderEmail('expertavailable', {
        firstName: util.firstName(toCustomer.name),
        expertName, requestId, noPaymethods }), cb)
    },

    sendPostReviewNotification(toUser, postId, postTitle, reviewerFullName, rating, comment, cb) {
      sendTemplateEmail('post-review-notification', { postId, postTitle, reviewerFullName, comment, rating }, toUser, cb)
    },

    sendPostReviewReplyNotification(toUsers, postId, postTitle, replierFullName, comment, cb) {
      sendTemplateEmails('post-review-reply-notification', { postId, postTitle, replierFullName, comment }, toUsers, cb)
    },

  }

  return mailman
}

