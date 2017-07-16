module.exports = ({Tag}, DATA, DRY) => ({


  validation(user, data) {
    // createFrom3rdParty(user, searchTerm, tag) {
    //   if (!searchTerm)
    //     return `Stackoverflow slug or Github repo name required`
    //   if (!tag || !(tag.so || tag.gh))
    //     return `Tag not found on Stackoverflow or Github`
    //   if (!tag.name) return `Tag name required`
    //   if (!tag.short) return `Tag short required`
    //   if (!tag.slug) return `Tag slug required`
    //   if (!tag.desc) return `Tag description required`
    // },

    // createByAdmin(user, tag) {
    //   if (!tag.name) return `Tag name required`
    //   if (!tag.short) return `Tag short required`
    //   if (!tag.slug) return `Tag slug required`
    //   if (!tag.desc) return `Tag description required`
    // },

    // updateByAdmin(user, original, ups) {
    //   if (!ups.name) return `Tag name required`
    //   if (!ups.short) return `Tag short required`
    //   if (!ups.desc) return `Tag description required`

    //   if (!original.slug || original.slug != ups.slug)
    //     return `Cannot change tag slug ${original.slug}`
    //   if (!original.soId || original.soId != ups.soId)
    //     return `Cannot change tag soId ${original.soId}`

    //   if (ups.meta && !_.isEmpty(ups.meta)) {
    //     if (!ups.meta.title) return `Tag meta title required`
    //     if (!ups.meta.canonical) return `Tag meta canonical required`
    //     if (!ups.meta.description) return `Tag meta description required`
    //   }
    // }
  },


  exec: function () {

    // createFrom3rdParty(term, tagFrom3rdParty, cb) {
    //   if (tagFrom3rdParty._id) {
    //     // $log('Updating tag from 3rd Party', tagFrom3rdParty.name)
    //     Tag.updateSet(tagFrom3rdParty._id, tagFrom3rdParty, Data.select.cb.search(cb))
    //   }
    //   else {
    //     // $log('Creating new tag', tagFrom3rdParty)
    //     Tag.create(tagFrom3rdParty, Data.select.cb.search(cb))
    //   }
    //   if (cache) cache.flush('tags')
    // },

    // // createByAdmin(o, cb) {
    // //   Tag.create(o, null, cb)
    // //   if (cache) cache.flush('tags')
    // // },

    // updateByAdmin(orignal, ups, cb) {
    //   cb(V2DeprecatedError('Tags.updateByAdmin'))
    //   // if (ups.meta) {
    //   //   if (_.isEmpty(ups.meta)) delete ups.meta
    //   //   else {
    //   //     ups.meta.ogType = "website"
    //   //     ups.meta.ogUrl = ups.meta.canonical
    //   //     ups.meta.ogImage = `https://www.airpair.com/static/img/css/tags/${orignal.slug}-og.png`
    //   //     if (!ups.meta.ogTitle) ups.meta.ogTitle = ups.meta.title
    //   //     if (!ups.meta.ogDescription) ups.meta.ogDescription = ups.meta.description
    //   //   }
    //   // }
    //   // Tag.updateSet(orignal._id, ups, cb)
    // }


  }


  // project: Data.Project['?']


})

