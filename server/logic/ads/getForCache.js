module.exports = (DAL, {Project, Opts, Query}, Shared) => ({

  exec(cb) {
    var codes = config.routes.ads.campaigns.split(',').map(c => c.split(':')[0])
    DAL.Campaign.getManyByQuery({code:{$in:codes}}, Opts.cached, (e, campaigns) => {
      var ads = { tagged: {} }
      for (var c of campaigns || [])
        for (var ad of c.ads) {
          ad.campaign = c.code
          ad.brand = c.brand.toLowerCase()
          ad.shortUrl = ad.shortUrl.replace('https://www.airpair.com/visit/','')
          ad.img = ad.img.replace('https://www.airpair.com/ads/','')
                         .replace('https://www.airpair.com/ad/','')
                         .replace('2016-q3-','')
          ad.positions = ad.positions.map(p=>p.replace('post:',''))
          ads[ad.img] = ad
          ads.tagged[ad.tag] = (ads.tagged[ad.tag] || []).concat([ad.img])
        }
      // $log('ads', ads) ///, DAL.Campaign, Query.activeCampaigns, Opts.cached)
      cb(e, ads)
    })
  }

})

