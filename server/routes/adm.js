import {adm} from '../identity/auth/middleware'


export default function(app) {

  var router = require('express').Router()

    .use(adm)

    .get( ['/*'], app.renderHbs('adm/admin') )

  return router

}
