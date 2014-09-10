import Workshops from '../api/workshops'

export default function(app) {
  
  var router = require('express').Router()

  new Workshops(router)
  
  return router

}