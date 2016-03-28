

// CF-Connecting-IP === X-Forwarded-For (if no spoofing)
// First exception: CF-Connecting-IP
// To provide the client (visitor) IP address for every request to the origin, CloudFlare adds the CF-Connecting-IP header.
// "CF-Connecting-IP: A.B.C.D"
// where A.B.C.D is the client's IP address, also known as the original visitor IP address.
// Second exception: X-Forwarded-For
// X-Forwarded-For is a well-established HTTP header used by proxies, including CloudFlare, to pass along other IP addresses in the request. This is often the same as CF-Connecting-IP, but there may be multiple layers of proxies in a request path.


module.exports = (app, mw) => {


  mw.cache('trackPost', mw.analytics.view('post', analytics.view, {
    project: d => ({_id:d._id,url:d.url.replace('https://www.airpair.com', '')})
  }))


  mw.cache('trackAdImpression', mw.analytics.impression('ad', analytics.impression, {

  }))
    // (req, res, next) => {
    //   //-- TODO cache ads and do it properly!
    //   req.ad = { img: req.originalUrl.replace('/ad/','') }
    // },



  mw.cache('trackAdClick', mw.analytics.view('ad', analytics.view, {

  }))
    // (req, res, next) => {
      //-- TODO cache ads and do it properly!
      // req.ad = { img: req.originalUrl.replace('/ad/','') }
    // },



}
