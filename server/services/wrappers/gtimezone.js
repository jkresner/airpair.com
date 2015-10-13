var logging                       = true


var wrapper = {

  init() {
    wrapper.api = global.API_GOOGLE_TIMEZONE || require('node-google-timezone')
    wrapper.api.key(config.timezone.google.apiKey)
  },

  getTimezoneFromCoordinates({lat,lng}, timestamp, cb)
  {
    //-- Todo, figure out the timestamp approach to fix funny reported timezones
    if (!timestamp) timestamp = moment().unix()
    if (logging) $log('getTimezoneFromCoordinates'.yellow, lat, lng, timestamp)
    wrapper.api.data(lat,lng,timestamp,cb)
  }

}

module.exports = wrapper
