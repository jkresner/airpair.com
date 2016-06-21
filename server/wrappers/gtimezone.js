var wrapper = {

  name: 'Timezone',

  init(opts) {
    opts = opts || {}
    this.api = global.API_GOOGLE_TIMEZONE || require('node-google-timezone')
    this.api.key(config.wrappers.timezone.google.apiKey)
  },

  getTimezoneFromCoordinates({lat,lng}, timestamp, cb)
  {
    //-- Todo, figure out the timestamp approach to fix funny reported timezones
    if (!timestamp) timestamp = moment().unix()
    $logIt(`wrpr.call`, `timezone.fromCoordinates`)
    this.api.data(lat,lng,timestamp,cb)
  }

}

module.exports = wrapper
