module.exports = {


  JSONID(o) {
    return JSON.stringify(_.pick(o,'_id'))
  },


  isoMoment(date) {
    return moment(date).toISOString()
  },


  dateFormat(date, format) {
    return date ? moment(date).format(format) : ''
  },


  v1postAssetUrlToMedia(url) {
    return url.indexOf('http://youtu.be/') != 0
      ? `<img src="${url}" />`
      : `<iframe width="640" height="360" frameborder="0" allowfullscreen="" src="//www.youtube-nocookie.com/embed/${url.replace('http://youtu.be/','')}"></iframe>`
  }


}
