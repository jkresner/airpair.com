module.exports = (DAL, DATA, Shared) => ({

  exec(cb) {
    var $in = config.routes.ads.campaigns.split(',').map(c => c.split(':')[0])
    var query = {code:{$in}}
    var opts = { select: '_id name code brand ads._id ads.img ads.url ads.shortUrl ads.positions ads.tag' }
    // $log('query', query, 'opts', opts, config.analytics.model)
    DAL.Campaign.getManyByQuery(query, opts, (e, campaigns) => {
      // $log('back', e, campaigns)
      var ads = { tagged: {} }
      for (var c of campaigns || [])
        for (var ad of c.ads) {
          ad.campaign = c.code
          ad.brand = c.brand.toLowerCase()
          ad.shortUrl = ad.shortUrl.replace('https://www.airpair.com/visit/','')
          ad.img = ad.img.replace('https://www.airpair.com/ads/','')
                         .replace('https://www.airpair.com/ad/','')
          ad.positions = ad.positions.map(p=>p.replace('post:',''))
          ads[ad.img.replace('2016-q3-','')] = ad
          ads.tagged[ad.tag] = (ads.tagged[ad.tag] || []).concat([ad.img.replace('2016-q3-','')])
        }
      // $log('ads', ads) ///, DAL.Campaign, Query.activeCampaigns, Opts.cached)
      cb(e, ads)
    })
  }

})

