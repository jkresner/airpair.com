

// CF-Connecting-IP === X-Forwarded-For (if no spoofing)
// First exception: CF-Connecting-IP
// To provide the client (visitor) IP address for every request to the origin, CloudFlare adds the CF-Connecting-IP header.
// "CF-Connecting-IP: A.B.C.D"
// where A.B.C.D is the client's IP address, also known as the original visitor IP address.
// Second exception: X-Forwarded-For
// X-Forwarded-For is a well-established HTTP header used by proxies, including CloudFlare, to pass along other IP addresses in the request. This is often the same as CF-Connecting-IP, but there may be multiple layers of proxies in a request path.


module.exports = (app, mw) => {

  mw.cache('trackImpression', mw.analytics.impression({type:'ad',onBot:(()=>{})}))


  mw.cache('trackAuth', mw.analytics.event('auth'))
  mw.cache('trackClick', mw.analytics.view('ad'))

  mw.cache('trackTag', mw.analytics.view('tag', {onBot:()=>{}}))
  mw.cache('trackJob', mw.analytics.view('job', {onBot:()=>{}}))
  mw.cache('trackWorkshop', mw.analytics.view('workshop', {onBot:()=>{}}))
  mw.cache('trackLanding', mw.analytics.view('landing', {onBot:()=>{}}))
  mw.cache('trackPost', mw.analytics.view('post', {
      project: d => ({_id:d._id,url:d.url.replace('https://www.airpair.com', '')}),
      onBot:(()=>{})
    })
  )

}
