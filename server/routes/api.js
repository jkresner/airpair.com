import Workshops from '../api/workshops'
import Posts from '../api/posts'
import iniUsersApi from '../api/users'
import Tags from '../api/tags'

export default function(app) {
  
  var router = require('express').Router()

  new Tags(router)
  new Workshops(router)
  new Posts(router)  
  iniUsersApi(router)    
  
  return router

}