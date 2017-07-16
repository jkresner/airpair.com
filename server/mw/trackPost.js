module.exports = (app, mw) => 

  mw.analytics.view('post', analytics.view, {
      onBot: () => {},
      project: d => ({_id:d._id,
        url: d.url.replace('https://www.airpair.com', '')
                  .replace('http://www.airpair.com', '')
      }),
    })
  