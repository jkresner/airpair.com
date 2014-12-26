import rss from './rss'
import auth from './auth'
import api from './api'
import dynamic from './dynamic'
import * as redirects from './redirects'

export default {
  rss,
  auth,
  api,
  dynamic,
  redirects,
  whiteList: require('../../shared/routes')
}
