module.exports = {

  stars(val) {
    var html = `<ul class="rating">`
    if (val < 0.75) return `${html}<li class="star"></li></ul>`
    html = `${html}<li></li>`
    if (val < 1.75) return `${html}${val >= 1.25 ? '<li class="star"></li>' : ''}</ul>`
    html = `${html}<li></li>`
    if (val < 2.75) return `${html}${val >= 2.25 ? '<li class="star"></li>' : ''}</ul>`
    html = `${html}<li></li>`
    if (val < 3.75) return `${html}${val >= 3.25 ? '<li class="star"></li>' : ''}</ul>`
    html = `${html}<li></li>`
    if (val < 4.75) return `${html}${val >= 4.25 ? '<li class="star"></li>' : ''}</ul>`
    return `${html}<li></li></ul>`
  }

}
