var Data                  = require('./tags.data')
var {Tag} = DAL

var exactMatchBonus = (term, tag) =>
  term.toLowerCase() == tag.name.toLowerCase() ? 1000 : 0



var get = {

  getById(id,cb) {
    Tag.getById(id, cb)
  },

  search(term, cb) {
    var encodedTerm = '\"'+term+'\"'

    var query = { $text: { $search: encodedTerm } }
    var opts = { select: Data.select.search }
    Tag.getManyByQuery(query, opts, function(e, result) {
      if (e) return cb(e)

      cb(null,
        _.first(
          _.sortBy(result, (r) =>
            -1 * (
              r.score + exactMatchBonus(term,r)
              )
            )
        ,4)
        )
    })
  },

  getAllForCache(cb) {
    Tag.getManyByQuery({}, { fields: Data.select.listCache }, cb)
  },

  getBySlug(slug, cb) {
    if (slug.indexOf('#') != -1) slug = encodeURIComponent(slug)
    Tag.getByQuery({slug},null, cb)
  },

  getBy3rdParty(term, cb) {
    term = term.toLowerCase()
    Wrappers.StackExchange.getTagByStackoverflowSlug(term, (e,r) => {
      if (!r) return cb()
      Tag.getByQuery({$or:[{soId:term},{ghId:term}]}, {}, (e,existing) => {
        // $log('getBy3rdParty.existing', existing)
        cb(null, _.extend(r, existing||{}))
      })
    })

  },

  getTagPage(slug, cb) {
    get.getBySlug(slug,(e, tag)=>{
      require('./posts').getByTag(tag, (ee,posts)=> {
        require('./workshops').getByTag(slug, (eee,workshops)=> {
          //-- TODO move tagPage stuff into the database
          var d = Data.data.angularPage(tag,posts,workshops)
          cb(null, d)
        })
      })
    })
  }

}

var save = {

  createFrom3rdParty(term, tagFrom3rdParty, cb) {
    if (tagFrom3rdParty._id) {
      // $log('Updating tag from 3rd Party', tagFrom3rdParty.name)
      Tag.updateSet(tagFrom3rdParty._id, tagFrom3rdParty, Data.select.cb.search(cb))
    }
    else {
      // $log('Creating new tag', tagFrom3rdParty)
      Tag.create(tagFrom3rdParty, Data.select.cb.search(cb))
    }
    if (cache) cache.flush('tags')
  },

  createByAdmin(o, cb) {
    Tag.create(o, null, cb)
    if (cache) cache.flush('tags')
  },

  updateByAdmin(orignal, ups, cb) {
    cb(V2DeprecatedError('Tags.updateByAdmin'))
    // if (ups.meta) {
    //   if (_.isEmpty(ups.meta)) delete ups.meta
    //   else {
    //     ups.meta.ogType = "website"
    //     ups.meta.ogUrl = ups.meta.canonical
    //     ups.meta.ogImage = `https://www.airpair.com/static/img/css/tags/${orignal.slug}-og.png`
    //     if (!ups.meta.ogTitle) ups.meta.ogTitle = ups.meta.title
    //     if (!ups.meta.ogDescription) ups.meta.ogDescription = ups.meta.description
    //   }
    // }
    // Tag.updateSet(orignal._id, ups, cb)
  }

}


module.exports = _.extend(get,save)
