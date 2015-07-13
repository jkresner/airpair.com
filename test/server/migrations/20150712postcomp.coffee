{ObjectId2Date} = util
ObjectId = require('mongodb').ObjectID
updated = 0
toUpdate = 0

prizeObj = (sponsor,tag,prizeName) ->
  return {sponsor,name:prizeName,tag,comp:"2015_q1"}

prizes =
  "5509d23f9da6560c003aed7d": prizeObj "keen-io", "keen-io", "Best Getting Started with Keen.io Tutorial"
  "5509e5c19ea8470c00457db6": prizeObj "keen-io", "keen-io", "Most popular Keen.io post"
  "54fd4050c1534a0c00e6d055": prizeObj "drifty", "drifty", "Most popular Ionic Framework post"
  "55822d67fb10a41100b8f228": prizeObj "drifty", "drifty", "Best Getting Started with Ionic Tutorial"
  "550c9e37bbbbef0c004b5c8f": prizeObj "sendgrid", "sendgrid", "Best Show and Tell with SendGrid in Production"
  "5500811ae59f920c0023ad4b": prizeObj "firebase", "firebase", "Most popular Firebase post"
  "54f5d05c5e76ff0c00e577e5": prizeObj "neo4j", "neo4j", "Most popular Neo4j post"
  "5524106917321011003dd6fe": prizeObj "neo4j", "neo4j", "Best Show & Tell with Neo4j Production"
  "54f3d0b292e9370c00ae049f": prizeObj "hashicorp", "terraform", "Most popular Terraform post"
  "550106c2f1377c0c0051cbef": prizeObj "hashicorp", "consul", "Most popular Consul post"
  "5583362972978911003b881b": prizeObj "mongodb", "mongodb", "Best coverage of New Features in MongoDB 3"
  "54f70cdb8438550c00e989d1": prizeObj "mongodb", "mongodb", "Most popular MongoDB post"
  "557ed2f15eea9a11009ef2f9": prizeObj "rethinkdb", "rethinkdb", "Best Getting Started with RethinkDB"
  "5506ef1132c9f60c008cca48": prizeObj "rethinkdb", "rethinkdb", "Most popular RethinkDB post"
  "55064e8a4ffec50c00ce15b6": prizeObj "twilio", "twilio", "Most popular Twilio post"
  "552fd3d439157b1100a5cdbe": prizeObj "pivotal", "pivotaltracker", "Most popular Tracker"
  "5525ad669786811100412675": prizeObj "ironio", "ironio", "Most popullar IronIO post"
  "551226f672254b1100c7bbcf": prizeObj "braintree", "braintree","Best Braintree post"
  "5561e940643f6f1100bba668": prizeObj "thoughtworks", "thoughtworks", "Best Mingle post"
  "55105816ea66aa110014b626": prizeObj "coreos", "coreos", "Most popular CoreOS post"
  "55826132574b4a11000bd274": prizeObj "coreos", "etcd", "Best post on etcd"
  "54dd479af9cf4b0a0016d071": prizeObj "pubnub", "pubnub", "Best Pubnub post"
  "54f62a080189d00c0092a8b4": prizeObj "airpair", "swift", "Best iOS/swift post"
  "5562b36efd056311002f27dd": prizeObj "airpair", "databases", "Best Database post"
  "555a37ff2411f01100e7a7d3": prizeObj "airpair", "python", "Best Python post"
  "5514e83ae9ad6211008ce928": prizeObj "airpair", "node.js", "Best Node.js post"
  "54f71b583696cb0c00dfc3c9": prizeObj "airpair", "frontend", "Best Front-end post"
  "55595d26d5a56511007746a1": prizeObj "airpair", "reactjs", "Best ReactJS post"
  "557d9ba099ee3c11003a4bd4": prizeObj "airpair", "angularjs", "Best AngularJS post"
  "554727c7e8420211002bbc93": prizeObj "airpair", "ember.js", "Best EmberJS post"
  "55013256b2620c0c009bb3c0": prizeObj "airpair", "devops", "Best DevOps post"
  "551c060d10cb481100e34409": prizeObj "airpair", "ruby", "Best Ruby/Rails post"
  "5518b656a8699611005a0b65": prizeObj "airpair", "android", "Best Android post"



done = null

logUpdate = (o) ->
  (e, r) ->
    updated++
    result = if r.result.n == 1 then "success".green else r.result.n.toString().red
    err = if !e then "-" else e.toString().red
    $log("Updated[#{updated}/#{toUpdate}][#{o._id}:","#{o.name}]:".white, err, result)
    done() if updated == toUpdate - 1


updateWithPrize = (_id, prize) ->
  Posts.update {_id},{$set:{prize}}, logUpdate({_id,name:prize.name})


module.exports = (cb) ->
  done = cb
  toUpdate = _.keys(prizes).length
  for postId in _.keys prizes
    updateWithPrize ObjectId(postId), prizes[postId]
