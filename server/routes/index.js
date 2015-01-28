import rss from './rss'
import auth from './auth'
import api from './api'
import dynamic from './dynamic'
import landing from './landing'
import * as redirects from './redirects'

export default {
  rss,
  auth,
  api,
  dynamic,
  landing,
  redirects,
  whiteList: require('../../shared/routes')
}
