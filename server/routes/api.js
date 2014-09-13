import Workshops from '../api/workshops'
import Posts from '../api/posts'

export default function(app) {
  
  var router = require('express').Router()

  new Workshops(router)
  new Posts(router)  
  
  return router

}