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
    if (stars >= 1) html + `<li></li>`
    if (stars >= 1.5 && stars < 2) html += `<li class="half"></li>`
    if (stars >= 2) html += `<li></li>`
    if (stars >= 2.5 && stars < 3) html += `<li class="half"></li>`
    if (stars >= 3) html += `<li></li>`
    if (stars >= 3.5 && stars < 4) html += `<li class="half"></li>`
    if (stars >= 4) html += `<li></li>`
    if (stars >= 4.5 && stars < 5) html += `<li class="half"></li>`
    if (stars >= 5) html += `<li></li>`
    return html + `</ul>`
  }


}
