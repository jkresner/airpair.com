var del = require('del')

module.exports = (callback) =>
  del(['dist'], callback)
