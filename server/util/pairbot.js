var postsChannelId = config.wrappers.chat.slack.channels.posts.id

module.exports = function(imProvider)
{
  function slackMSGSync(key, data) {
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
  }


  var emtpyCb = (e,r) => {}


  if (!imProvider)
    imProvider = Wrappers.Slack

  var pairbot = {

    sendSlackMsg(channelId, tmpl, data, cb) {
      var cb = cb || emtpyCb
      var msg = slackMSGSync(tmpl, data)
      var text = data.text || msg.text
      if (msg.type == 'message')
        imProvider.postMessage('pairbot', channelId, text, cb)
      if (msg.type == 'attachment')
        imProvider.postAttachments('pairbot', channelId, [_.extend(msg,{text})], cb)
    },

    get(tmpl, data, cb) {
      cb(null, slackMSGSync(tmpl, data))
    },

    //-- TODO: move into db
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
        title_link: post.htmlHead.canonical,
        text: `Lend a hand.\nReview & share => ${post.htmlHead.canonical}`,
      }
      imProvider.postAttachments('pairbot', postsChannelId, [attachment], cb || emtpyCb)
    },

    sendPostSynced(post, cb) {
      var attachment = {
        fallback: `Post SYNCED: ${post.title}`,
        pretext: `Updates SYNCED`,
        thumb_url: `https://www.airpair.com/posts/thumb/${post._id}`,
        title: post.title,
        title_link: post.htmlHead.canonical,
        text: `Update your review (if you left one)`,
      }
      imProvider.postAttachments('pairbot', postsChannelId, [attachment], cb || emtpyCb)
    },

  }

  return pairbot
}
