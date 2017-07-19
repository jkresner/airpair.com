module.exports = (app, mw) =>

  mw.analytics.view('post', analytics.view, {
    onBot: () => {},
    project: ({post}) => ({_id:post._id,
      url: post.url.replace('https://www.airpair.com', '')
                .replace('http://www.airpair.com', '')
    }),
  })

