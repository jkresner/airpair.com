var validation = {

  createFrom3rdParty(user, searchTerm, tag) {
    if (!searchTerm)
      return `Stackoverflow slug or Github repo name required`
    if (!tag || !(tag.so || tag.gh))
      return `Tag not found on Stackoverflow or Github`
    if (!tag.name) return `Tag name required`
    if (!tag.short) return `Tag short required`
    if (!tag.slug) return `Tag slug required`
    if (!tag.desc) return `Tag description required`
  },

  createByAdmin(user, tag) {
    if (!tag.name) return `Tag name required`
    if (!tag.short) return `Tag short required`
    if (!tag.slug) return `Tag slug required`
    if (!tag.desc) return `Tag description required`
  },

  updateByAdmin(user, original, ups) {
    if (!ups.name) return `Tag name required`
    if (!ups.short) return `Tag short required`
    if (!ups.desc) return `Tag description required`

    if (!original.slug || original.slug != ups.slug)
      return `Cannot change tag slug ${original.slug}`
    if (!original.soId || original.soId != ups.soId)
      return `Cannot change tag soId ${original.soId}`

    if (ups.meta && !_.isEmpty(ups.meta)) {
      if (!ups.meta.title) return `Tag meta title required`
      if (!ups.meta.canonical) return `Tag meta canonical required`
      if (!ups.meta.description) return `Tag meta description required`
    }
  }
}

module.exports = validation
