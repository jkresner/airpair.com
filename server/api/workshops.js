import {API} from './_api'

var talks = [{
    "__v" : 0,
    "_id" : "53dc048a6a45650200845f37",
    "attendees" : ['hackerpreneur'],
    "description" : "Learn how to apply animations to your Angular app from start to finish. With the recent changes in AngularJS 1.3, there have been rapid improvements in ngAnimate. With the new features in place let's learn how to make some crazy animations and how to really improve the look, feel and quality of our web application.",
    "difficulty" : "Intermediate",
    "duration" : "1 hour",
    "price" : 0,
    "public" : false,
    "slug" : "animations-with-angularjs",
    "speakers" : [ 
        {
            "name" : "Matias Niemela",
            "shortBio" : "Core dev on AngularJS",
            "fullBio" : "Matias is a fullstack web developer who blogs at yearofmoo.com. For the past two years he has been a full-time AngularJS core developer working on ngAnimate, Dart, Material Design and AngularJS forms. He has a passion teaching and for building complex web applications.",
            "username" : "matsko",
            "gravatar" : "3c0ca2c60c5cc418c6b3dbed47b23b69",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : "matsko"
        }
    ],
    "tags" : [ 
        "angularjs", 
        "ngAnimate"
    ],
    "time" : "2014-08-13T16:00:00.000Z",
    "title" : "Professional Animations in AngularJS 1.3",
    "updatedAt" : "2014-08-01T21:20:10.000Z",
    "youtube" : "\nA17NMUUDDog"
},
{
    "__v" : 0,
    "_id" : "53dc048a6a45650200845f38",
    "attendees" : [],
    "description" : "Learn how to release things into the wild quickly.",
    "difficulty" : "Beginner",
    "duration" : "1 hour",
    "price" : 0,
    "public" : false,
    "slug" : "release-often-release-dirty",
    "speakers" : [ 
        {
            "name" : "Jonathon Kresner",
            "shortBio" : "Mr AirPair",
            "fullBio" : "Mr Awesome",
            "username" : "hackerpreneur",
            "gravatar" : "3c0ca2c60c5cc418c6b3dbed47b23b69",
            "bb" : null,
            "so" : null,
            "tw" : null,
            "in" : null,
            "gh" : "jkresner"
        }
    ],
    "tags" : [ 
        "angularjs"
    ],
    "time" : "2014-10-13T16:00:00.000Z",
    "title" : "Release Often, Release Dirty",
    "updatedAt" : "2014-09-02T21:20:10.000Z"
}];


class ApiWorkshops extends API {

  routes(app) {
    app.get( '/workshops/', this.list(this) )
    app.get( '/workshops/:slug', this.detail(this) )
  }

  list(self) {
    return self.cbSend(null, talks)
  }

  detail(self) {
    return self.cbSend(null, talks[0])
  }
}

export var ApiWorkshops = ApiWorkshops