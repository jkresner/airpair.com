

// CF-Connecting-IP === X-Forwarded-For (if no spoofing)
// First exception: CF-Connecting-IP
// To provide the client (visitor) IP address for every request to the origin, CloudFlare adds the CF-Connecting-IP header.
// "CF-Connecting-IP: A.B.C.D"
// where A.B.C.D is the client's IP address, also known as the original visitor IP address.
// Second exception: X-Forwarded-For
// X-Forwarded-For is a well-established HTTP header used by proxies, including CloudFlare, to pass along other IP addresses in the request. This is often the same as CF-Connecting-IP, but there may be multiple layers of proxies in a request path.


module.exports = (app, mw) => {

  mw.cache('trackImpression', mw.analytics.impression({
      type:'ad',
      project: d => ({type:'ad',oId:d._id,img:`${d.brand}/${d.img}`})
    }
  ))

  mw.cache('trackAuth', mw.analytics.event('auth'))

  //-- because the db is not yet connected
  var trackView = function () { global.analytics.view.apply(this, arguments) }

  mw.cache('trackClick', mw.analytics.view('ad', trackView, {
      project:  d => ({_id:d._id,img:d.img,tag:d.tag,url:d.url})
    }
  ))


  mw.cache('trackWorkshop', mw.analytics.view('workshop', trackView, {
      onBot: () => {},
      project: d => ({_id:d._id,url:d.url})
    }
  ))

  mw.cache('trackPost', mw.analytics.view('post', trackView, {
      onBot: () => {},
      project: d => ({_id:d._id,url:d.url.replace('https://www.airpair.com', '')}),
    }
  ))

  mw.cache('trackLanding', mw.analytics.view('landing', trackView, {
      onBot: ()=>{},
      project: d => ({_id:d._id,key:d.key,url:d.url}),
    }
  ))

  mw.cache('trackTag', mw.analytics.view('tag', trackView, {
      onBot:()=>{}
    }
  ))

  mw.cache('trackJob', mw.analytics.view('job', trackView, {
      onBot:()=>{},
      project:r=>({_id:r._id})
    }
  ))

}
