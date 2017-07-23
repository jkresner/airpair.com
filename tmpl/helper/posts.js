module.exports = {


  JSONSESSION(o) {
    return JSON.stringify(_.pick(o,'authenticated','id','_id','name','email','avatar'))
      //,'roles'))
  },

  JSONPOST(o) {
    return JSON.stringify(_.pick(o,'_id'))
  },

  post_stars(stars) {
    var html = `<ul class="stars">`
    if (!stars || stars == 0)  return `${html}</ul>`
    if (stars < 0.75) return `${html}<li class="half"></li></ul>`
    html = `${html}<li></li>`
    if (stars < 1.75) return `${html}${stars >= 1.25 ? '<li class="half"></li>' : ''}</ul>`
    html = `${html}<li></li>`
    if (stars < 2.75) return `${html}${stars >= 2.25 ? '<li class="half"></li>' : ''}</ul>`
    html = `${html}<li></li>`
    if (stars < 3.75) return `${html}${stars >= 3.25 ? '<li class="half"></li>' : ''}</ul>`
    html = `${html}<li></li>`
    if (stars < 4.75) return `${html}${stars >= 4.25 ? '<li class="half"></li>' : ''}</ul>`
    return `${html}<li></li></ul>`
  }


}
