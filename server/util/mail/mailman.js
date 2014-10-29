var fs =          require('fs')
var handlebars =  require('handlebars')
var util =  			require('../../../shared/util')
// var async =       require('async')


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


function renderEmail(templateName, templateData) {
	var rendered = {}
  var subjectFn = templates[`${templateName}_subject`],
  		htmlFn = templates[`${templateName}_html`],
  		textFn = templates[`${templateName}_txt`]

	if (!htmlFn && !textFn || !subjectFn) throw Error(`No email template functions for ${templateName}`)

	rendered.Subject = subjectFn(templateData)
	if (htmlFn) rendered.Html = htmlFn(templateData)
	if (textFn) rendered.Text = textFn(templateData)

	return rendered
}


module.exports = function(mailProvider)
{
	initTemplates()
	var mailman = {}

	mailman.sendVerifyEmail = (toUser, hash, cb) =>
		mailProvider.send(`${toUser.name} <${toUser.email}>`, renderEmail('verifyemail', {
			firstName: util.firstName(toUser.name),
			hash
		}), cb)

	return mailman
}

