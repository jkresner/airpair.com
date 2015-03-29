var del = require('del')

module.exports = function(gulp, config, options, callback) {
  return function() {
    return del(['dist'], callback)
  }
}
