var views = {}


module.exports = new LogicDataHelper(views,

  () => ({

  }),

  //-- Queries
  {
    // campaigns: codes => {code:{$in:codes}}
  },

  //-- Query Opts
  {
    'cached': { select: '_id name code brand ads._id ads.img ads.url ads.shortUrl ads.positions ads.tag' }
  }

)
