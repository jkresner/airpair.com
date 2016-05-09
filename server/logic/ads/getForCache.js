module.exports = ({Campaign}, {Project, Opts, Query}, Shared) => ({

  exec(cb) {

    Campaign.getManyByQuery(Query.activeCampaigns, Opts.cached, (e, campaigns) => {
      var ads = { tagged: {} }
      for (var c of campaigns || [])
        for (var ad of c.ads) {
          ad.campaign = c.code
          ad.brand = c.brand.toLowerCase()
          ad.shortUrl = ad.shortUrl.replace('https://www.airpair.com/visit/','')
          ad.img = ad.img.replace('https://www.airpair.com/ad/','')
          ad.positions = ad.positions.map(p=>p.replace('post:',''))
          ads[ad.img] = ad
          ads.tagged[ad.tag] = (ads.tagged[ad.tag] || []).concat([ad.img])
        }
      // $log('ads', ads)
      cb(e, ads)
    })
  }

})

