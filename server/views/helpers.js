module.exports = (hbs) => {


  hbs.registerHelper('JSONID', o =>
    new hbs.handlebars.SafeString(JSON.stringify(_.pick(o,'_id')))
  )


  hbs.registerHelper('assetUrlToMedia', (assetUrl) => {
    var mediaHtml = `<img src="${assetUrl}" />`;
    if (assetUrl.indexOf('http://youtu.be/') == 0) {
      var youTubeId = assetUrl.replace('http://youtu.be/', '');
      mediaHtml = `<iframe width="640" height="360" frameborder="0" allowfullscreen="" src="//www.youtube-nocookie.com/embed/${youTubeId}"></iframe>`
    }
    return new hbs.SafeString(mediaHtml);
  });


  // hbs.registerAsyncHelper('mdToHtml', (md, cb) => {
  //   cb(new hbs.SafeString(marked(md, { sanitize: false })))
  // });


  // hbs.registerHelper('isoMoment', date => moment(date).toISOString());

  // hbs.registerHelper('dateFormat', (date, format) => {
  //   if (!date) { return ""; }
  //   return moment(date).format(format)
  // })


}
