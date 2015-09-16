var logging                       = false


var wrapper = {

  init() {
    wrapper.api = global.API_GOOGLE_TIMEZONE || require('node-google-timezone')
    wrapper.api.key(config.timezone.google.apiKey)
  },

  getTimezoneFromCoordinates(locationData, timestamp, cb)
  {
    var location = locationData.geometry.location

    //-- Damn google places reponses keep changing...
    var lat = location.A || location.k || location.j || location.G || location.H
    var lon = location.F || location.D || location.C || location.K || location.L

    //-- Todo, figure out the timestamp approach to fix funny reported timezones
    if (!timestamp) timestamp = moment().unix()
    if (logging) $log('getTimezoneFromCoordinates'.yellow, lat, lon, timestamp)
    wrapper.api.data(lat,lon,timestamp,cb)
  }

}

module.exports = wrapper
