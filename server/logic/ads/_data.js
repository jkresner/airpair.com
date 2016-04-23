var views = {}


module.exports = new LogicDataHelper(views,

  () => ({

  }),

  //-- Queries
  {
    'activeCampaigns': {code:{$in:config.routes.ads.campaigns.split(',')}}
  },

  //-- Query Opts
  {
    'cached': { select: '_id name code brand ads._id ads.img ads.url ads.shortUrl ads.positions ads.tag' }
  }

)
