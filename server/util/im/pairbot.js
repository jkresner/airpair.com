var postsChannelId = config.chat.slack.channels.posts.id

module.exports = function(imProvider)
{
  var TemplateSvc      = require('../../services/templates')

  var emtpyCb = (e,r) => {}

  if (!imProvider)
    imProvider = Wrappers.Slack


  var pairbot = {

    sendSlackMsg(channelId, tmpl, data, cb) {
      TemplateSvc.slackMSG(tmpl, data, (e, msg) =>
        imProvider.postMessage('pairbot', channelId, msg, cb || emtpyCb)
      )
    },

    sendSlackAttachment(channelId, tmpl, data, attachment, cb) {
      TemplateSvc.slackMSG(tmpl, data, (e, msg) => {
        attachment.fallback = msg
        imProvider.postAttachments('pairbot', channelId, [attachment], cb || emtpyCb)
      })
    },

    get(tmpl, data, cb) {
      TemplateSvc.slackMSG(tmpl, data, (e, msg) => cb(e,msg))
    },

    sendPostSubmitted(post, cb) {
      var attachment = {
        fallback: `Post SUBMITTED: ${post.title}`,
        color:  `warning`,
        pretext: `SUBMITTED for review`,
        thumb_url: `https://www.airpair.com/posts/thumb/${post._id}`,
        title: post.title,
        title_link: `https://www.airpair.com/posts/review/${post._id}`,
        text: `Don't be shy.\nTell ${post.by.name} what you think => https://www.airpair.com/posts/review/${post._id}`,
      }
      imProvider.postAttachments('pairbot', postsChannelId, [attachment], cb || emtpyCb)
    },

    sendPostPublished(post, cb) {
      var attachment = {
        fallback: `Post PUBLISHED: ${post.title}`,
        color:  `good`,
        pretext: `PUBLISHED by ${post.by.name}`,
        image_url: `https://www.airpair.com/posts/thumb/${post._id}`,
        title: post.title,
        title_link: post.meta.canonical,
        text: `Lend a hand.\nReview & share => ${post.meta.canonical}`,
      }
      imProvider.postAttachments('pairbot', postsChannelId, [attachment], cb || emtpyCb)
    },

    sendPostSynced(post, cb) {
      var attachment = {
        fallback: `Post SYNCED: ${post.title}`,
        pretext: `Updates SYNCED`,
        thumb_url: `https://www.airpair.com/posts/thumb/${post._id}`,
        title: post.title,
        title_link: post.meta.canonical,
        text: `Update your review (if you left one)`,
      }
      imProvider.postAttachments('pairbot', postsChannelId, [attachment], cb || emtpyCb)
    },

  }

  return pairbot
}
