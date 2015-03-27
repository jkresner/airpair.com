var logging                       = false


var wrapper = {

  init() {
    wrapper.api = global.API_GOOGLE_TIMEZONE || require('node-google-timezone')
    wrapper.api.key(config.timezone.google.apiKey)
  },

  getTimezoneFromCoordinates(k, d, timestamp, cb) {
    //-- Todo, figure out the timestamp approach to fix funny reported timezones
    if (!timestamp) timestamp = moment().unix()
    // $log('getTimezoneFromCoordinates'.yellow, k)
    wrapper.api.data(k,d,timestamp,cb)
  }

}

module.exports = wrapper
