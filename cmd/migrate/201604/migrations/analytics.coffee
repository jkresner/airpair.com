"""

View (old):

{
    "_id" : ObjectId("5621d4b374dd531100a5191d"),
    "url" : "/angularjs/posts/angularjs-performance-large-applications",
    "type" : "post",
    "objectId" : ObjectId("545b902a68cacc0b0067e318"),
    "ip" : "73.231.139.13, 199.27.133.226",
    "anonymousId" : "tx6Xm0T0acwKPRKeN4hmkvc6wenbKFUi",
    "referer" : "https://www.google.com/",
    "ua" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36"
}


(new) == >

asCollection(map.view, {
  app:       { type: String, required: true },
  ip:        { type: String, required: true },
  sId:       { type: String, index: true, sparse: true },
  uId:       { type: Id, index: true, sparse: true },

  oId:       { type: Id, required: true },
  ref:       { type: String },
  type:      { type: String, required: true, lowercase: true },
  ua:        { type: String },
  url:       { type: String, required: true },
  utm:       { type: {} }
})


"""

db.views.update({objectId:{$exists:1}},{$rename:{'objectId':'oId'}},{multi: true})
db.views.update({anonymousId:{$exists:1}},{$rename:{'anonymousId':'sId'}},{multi: true})
db.views.update({referer:{$exists:1}},{$rename:{'referer':'ref'}},{multi: true})

"""
march 11 - ObjectId('56f293500000000000000000')

"""

db.views.update({url:/java\?c=70130000000NYVGAA4/i,_id:{$gt:ObjectId('56f293500000000000000000')}}, {$set: { oId:ObjectId("56f97837b60d99e0d793cafa")}}, {multi:true})
db.views.update({url:/php\?c=70130000000NYVFAA4/i,_id:{$gt:ObjectId('56f293500000000000000000')}}, {$set: { oId:ObjectId("56f97837b60d99e0d793cafb")}}, {multi:true})
db.views.update({url:/nodese\?c=70130000000NYVEAA4/i,_id:{$gt:ObjectId('56f293500000000000000000')}}, {$set: { oId:ObjectId("56f97837b60d99e0d793cafc")}}, {multi:true})
db.impressions.update({img:'heroku/900x90.q4.1.signup.node.js.png',_id:{$gt:ObjectId('56f293500000000000000000')}}, {$set: { img:'heroku/900x90.q2-1.node.js.png'}}, {multi:true})
db.impressions.update({img:'heroku/900x90.q4.1.signup.php.png',_id:{$gt:ObjectId('56f293500000000000000000')}}, {$set: { img:'heroku/900x90.q2-1.php.png'}}, {multi:true})
db.impressions.update({img:'heroku/900x90.q4.1.signup.java.png',_id:{$gt:ObjectId('56f293500000000000000000')}}, {$set: { img:'heroku/900x90.q2-1.java.png'}}, {multi:true})



