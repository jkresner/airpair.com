md5                   = require('../../../../server/util/md5')

data = {}
qFocus =
  '1' : {}
  '2' : $or: [{ 'reviews.1': { $exists: 1 } }, 'forkers.1': { $exists: 1 }]
  '3' : {}
  '4' : { assetUrl: /http:/ }

oldhist = created:1,submitted:1,updated:1,published:1,publishedBy:1,publishedCommit:1,publishedUpdated:1,publishHistory:1,lastTouch:1,editHistory:1
qSelect =
  '1' : {_id:1,title:1,by:1}
  '2' : {_id:1,title:1,by:1,reviews:1,forkers:1}
  '3' : Object.assign({_id:1,title:1,meta:1},oldhist)
  '4' : {_id:1,title:1,assetUrl:1}

tstIdx = 0

module.exports = ->

  specInit(@)

  DESCRIBE 'Migrate Posts + Reviews', ->

    beforeEach (done) ->
      @timeout(10000)
      data = {}
      query = qFocus[++tstIdx]
      Posts.find(query,qSelect[tstIdx]).toArray (e, all) ->
        for post in all
          data[post._id] = post
        $log(JSON.stringify(query).yellow, "matched #{all.length} Posts")
        done()


    # SKIP "Unset prize manually", ->
      # db.posts.update({ 'prize': { $exists: 1 } }, { $unset: { prize: 1 } }, {multi: true })


    IT "Flatten author", ->
      ups = []

      authors = {}
      for pid of data
        {userId} = data[pid].by
        authors[userId] = { _id: userId }

      $in = []
      $in.push(authors[id]._id) for id of authors
      # console.log('ids', $in.length)
      Users.find('_id':{$in}).toArray (e, users) ->
        # console.log('e', e, users)
        # expect(users.length).to.equal($in.length)
        for _id of data
          {userId,bio} = data[_id].by
          user = users.filter((u)->u._id.toString()==userId.toString())[0]
          if !user
            $log('missing user'.red, _id, data[_id].title, data[_id].by)
          else
            {name,avatar,email,photos} = user
            By = { _id: userId, name, email }
            By.avatar = if photos? and photos.length > 0 then photos[0].value else md5.gravatarUrl(email)
            By.bio = bio if bio
            By.links = {}
            By.links.ap = user.username if user.username
            By.links.gh = user.auth.gh.login if user.auth.gh
            By.links.so = user.auth.so.link if user.auth.so
            By.links.bb = user.auth.bb.username if user.auth.bb
            By.links.in = user.auth.in.id if user.auth.in
            By.links.tw = user.auth.tw.screen_name if user.auth.tw
            By.links.al = user.auth.al.username if user.auth.al
            By.links.gp = user.auth.gp.url||user.auth.gp.id if user.auth.gp
            # $log('author'.red, By)
            ups.push updateOne: { q: {_id:data[_id]._id}, u: { $set: {by:By} }, upsert: false }

        Posts.bulkWrite ups, {ordered:false}, (e,r) ->
          $log('update.Posts["by"]'.yellow, r.modifiedCount)
          DONE()


    IT "Migrate to normalized reviews and forkers", ->
      ups = []

      for postId of data
        post = data[postId]
        reviews = []
        forkers = []
        subscribed = []
        addSub = (user, _id) ->
          uId = (user._id || user.userId).toString()
          existing = null
          for sub in subscribed
            existing = sub if sub.userId.toString() == uId
          subscribed.push(_id:_id||ObjectId(),userId:ObjectId(uId),mail:user.email||'primary') if !existing

        addSub post.by, post._id

        # console.log('rev[0]', data[_id].reviews[0])
        # expect(post.reviews, JSON.stringify(post)).to.exist
        # expect(post.reviews.length > 0).to.be.true

        for r in (post.reviews||[])
          addSub r.by, r._id
          expect(r.questions[0].key).to.equal('rating')
          clean =
            _id:  r._id
            by:   ObjectId(r.by._id)
            val:  parseInt(r.questions[0].answer)
            said: r.questions[1].answer

          if r.replies && r.replies.length > 0
            clean.replies = r.replies.map((rep)->_id:rep._id,by:rep.by._id,said:rep.comment)
            addSub(rep.by, rep._id) for rep in r.replies

          if r.votes && r.votes.length > 0
            clean.votes = r.votes.map((v)->_id:v._id,by:v.by._id,val:v.val)
            addSub(v.by, v._id) for v in r.votes

          reviews.push(clean)

        for f in (post.forkers||[])
          addSub { userId: f.userId, email: f.email }, f._id
          forkers.push _id: f._id, userId: f.userId

        # console.log('cleaned'.white, reviews, subscribed)
        $set = {subscribed}
        $set.reviews = reviews if reviews.length > 0
        $set.forkers = forkers if forkers.length > 0
        ups.push updateOne: { q: {_id:post._id}, u: { $set }, upsert: false }

      Posts.bulkWrite ups, {ordered:false}, (e,r) ->
        $log('update.Posts["reviews|forkers|subscribed"]'.yellow, r.modifiedCount)
        DONE()



    IT "Group / merge history bits and bobs", ->
      ups = []

      for postId of data
        post = data[postId]
        history = { created: post.created }
        history.updated = post.updated if post.updated
        history.submitted = post.submitted if post.submitted
        history.published = post.published if post.published
        if post.published
          history.live = published: post.publishedUpdated || post.published
          history.live.by = if post.publishedBy then ObjectId(post.publishedBy._id||post.publishedBy) else post.by._id
          expect(history.live.by.constructor == ObjectId).to.be.true
          if post.publishedCommit then history.live.commit = post.publishedCommit

        {meta,editHistory,publishHistory} = post
        hasHistory = editHistory and editHistory.length > 0 or publishHistory and publishHistory.length > 0
        if !meta && post.lastTouch?
          meta = lastTouch: post.lastTouch, activity: []

        if !meta && hasHistory
          meta = activity: []

        if editHistory && editHistory.length > 0
          meta.activity.push(act) for act in editHistory

        if publishHistory && publishHistory.length > 0
          meta.activity.push(act) for act in publishHistory

        set = {history}
        set.meta = meta if meta?
        # console.log('cleaned'.white, post.title, set)
        ups.push updateOne: { q: {_id:post._id}, u: { $set: set, $unset:oldhist }, upsert: false }

      Posts.bulkWrite ups, {ordered:false}, (e,r) ->
        $log('update.Posts["history|meta"]'.yellow, r.modifiedCount)
        DONE()


    IT "Update all asset urls to be https instead of http", ->
      ups = []
      for postId of data
        post = data[postId]
        assetUrl = post.assetUrl.replace(/http:/i,'https:')
        if (!assetUrl.match('youtu.be'))
          ups.push updateOne: { q: {_id:post._id}, u: { $set: {assetUrl} }, upsert: false }
      Posts.bulkWrite ups, {ordered:false}, (e,r) ->
        $log('update.Posts["assetUrl"]'.yellow, r.modifiedCount)
        DONE()
