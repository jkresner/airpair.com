import Workshops from '../api/workshops'
import Posts from '../api/posts'
import Session from '../api/session'
import Tags from '../api/tags'

export default function(app) {
  
  var router = require('express').Router()

  new Tags(router)
  new Workshops(router)
  new Posts(router)  
  new Session(router)    
  
  return router

}