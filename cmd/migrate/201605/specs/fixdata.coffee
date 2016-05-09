data = {}
qFocus = { $or: [
    {'submitted':{'$exists':1}},
    {'published':{'$exists':1}}]}
snapped = 0


addSnap = (name, collection, done) ->

  nestHist = (post) ->
    if !post.reviews
      post.reviews = []
    # $log("nest#{name}".yellow, post.reviews.length, post.title)
    data[post._id].hist[name] = post.reviews

  doNest = (e, all) ->
    # $log('addSnap'.blue, name, all.length, "\n")
    for p in all
      if data[p._id]
        nestHist(p)

    # $log('addedSnap'.white, snapped, name, snapped+1 is History.length)
    if ++snapped is History.length
      done()

  collection.find(qFocus,{_id:1,reviews:1}).toArray doNest


collateReviews = (post) ->
  console.log("#{post.reviews.length}".gray, post.title)

  for snapId of post.hist
    for review in post.hist[snapId]
      if !review._id
        $log('bad.reviw', review)
      else if !_.find(post.reviews, (r) -> _.idsEqual(review._id, r._id))
        post.reviews.push(review)
        $log("  #{snapId} #{post.title} #{review.questions[0].answer} +1/#{post.reviews.length}".green)

  if post.reviews.length > 0
    totalStars = 0
    for rev in post.reviews
      totalStars += parseInt(_.find(rev.questions,(q)=>q.key=='rating').answer)
    post.stats.reviews = post.reviews.length
    post.stats.rating = Math.round((totalStars / post.reviews.length)*100)/100


module.exports = ->

  specInit(@)

  DESCRIBE 'FIX DATA', ->

    before (done) ->
      @timeout(10000)

      addToHash = (post) ->
        data[post._id] = post
        data[post._id].hist = []
        if post.reviews
          # $log(post.reviews.length, post.title.cyan)
        else
          post.reviews = []
          # $log("-".magenta, post.title.cyan.dim)

      Posts.find(qFocus,{_id:1,title:1,reviews:1,stats:1}).toArray (e, all) ->
        addToHash(post) for post in all
        done()
      # if !global.dupEmails
      #   throw Error("global.dupEmails undefined")

    beforeEach (done) ->
      @timeout(20000)
      for snap in History
        addSnap(snap.namespace.replace('posts-historical.posts_',''), snap, done)


    IT "Data collate", ->
      ups = []

      for pId of data
        collateReviews data[pId]

      for pId of data
        {_id,reviews,stats} = data[pId]
        if reviews.length > 0
          ups.push updateOne: { q: {_id}, u: { $set: {reviews,stats} }, upsert: false }
          # $log("#{data[pId].reviews.length}".white, data[pId].title.yellow, data[pId].stats.rating)

      Posts.bulkWrite ups, {ordered:false}, (e,r) ->
        $log('update.Posts.reviews'.yellow, r.modifiedCount)
        DONE()

