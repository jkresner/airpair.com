var express = require('express')
var app = express()

import {ApiWorkshops} from './api/workshops'

new ApiWorkshops(app)

export var appApi = app