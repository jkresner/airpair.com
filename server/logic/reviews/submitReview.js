module.exports = (DAL, Data, {role,updateReviews}) => ({


  validate(user, post, review) {
    // var existing = _.find(post.reviews, (r)=>_.idsEqual(user._id, r.by._id))
    // if (existing)
    //   return `You have already reviewed ${post.title}`

    // if (_.idsEqual(user._id,post.by.userId))
    //   return `Cannot review your own post.`

    // if (!post.published && !post.submitted)
    //   return `Cannot review. Post [${post._id}] has not been submitted or published`

    // var rating = _.find(review.questions, (q)=> q.key == 'rating')
    // if (!rating || !(rating.answer > 0 && rating.answer < 6) )
    //   return `5 star rating required`

    // var feedback = _.find(review.questions, (q)=> q.key == 'feedback')
    // if (!feedback || !feedback.answer)
    //   return `5 star feedback required`

    if (role.author(user, post))
      return `Cannot review your own post`

    if (!(post.history||{}).submitted)
      return `Post[${post._id}] ${post.title} not submitted`

    if (!(post.history||{}).published) {
      if (!review.val) return `5 star rating required`
      if (!review.said) return `Review comment required`
    }
    else {
      if (!review.val && !review.said) return `Review empty...`
    }

    if (review.val && !(review.val == 1 ||
                        review.val == 2 ||
                        review.val == 3 ||
                        review.val == 4 ||
                        review.val == 5))
      return `5 star rating required`
  },


  exec(original, review, cb) {
    var {user} = this

    var existing = _.find(original.reviews, r => _.idsEqual(user._id, r.by))
    if (existing) review = assign(existing, review, {updated: new Date})
    else assign(review,{ by: user._id })

    var reviews = original.reviews || []
    if (!existing) reviews.push(review)

    var notifications =  () => {

  //   reviewNotify(post, review) {
  //     var rating = _.find(review.questions,(q)=>q.key=='rating').answer
  //     var {_id,title} = post
  //     var comment = _.find(review.questions,(q)=>q.key=='feedback').answer
  //     return { _id, title , comment, rating, reviewerFullName: review.by.name }
  //   },
  //   reviewReplyNotify(post, reply) {
  //     var {_id,title} = post
  //     var {comment,by} = reply
  //     return { _id, title , comment, replierFullName: by.name }
  //   },\

    }

    var action = existing?'postreview:update':'postreview'

    updateReviews(original, reviews, action, user, notifications, cb)

  },


  project: Data.Project.review


})



  // "post-review-reply-notify": {
  //   "_id" : "54ddc48fa779e09fc45b3b29",
  //   // "type" : "mail",
  //   "key" : "post-review-reply-notification",
  //   "description" : "Used for letting notifying post reviewers on new comments",
  //   "sender" : "pairbot",
  //   mail: {
  //     "subject" : "New reply on {{postTitle}}",
  //     "markdown" : "Hi {{ firstName }},  \n  \n{{replierFullName}} has commented on a thread you're participating on. See the full discussion and parrallel running threads by others on the contributors page:  \n\nhttp://author.airpa.ir/contributors/{{ postId }}  \n  \nThanks,\n\nThe AirPair Team  \nhttp://twitter.com/airpair\n"
  //   }
  // },

  // "post-review-notify": {
  //   "_id" : "54ddc48fa779e09fc45b3b19",
  //   // "type" : "mail",
  //   "key" : "post-review-notification",
  //   "description" : "Used for letting authors know when someone reviews their post",
  //   "sender" : "pairbot",
  //   mail: {
  //     "subject" : "{{rating}} Star Review for {{title}}",
  //     "markdown" : "{{ firstName }},\n\n{{title}} was given a {{rating}} star rating by {{reviewer}}.\n\n- - -\n\n{{feedback}}\n\n- - -\n\nReply on your post's activity page:  \n\nhttp://post.airpa.ir/activity/{{ _id }} \n\nThanks,\n\nThe AirPair Team  \nhttp://twitter.com/airpair"
  //   }
  // },

    // postReview(post, reviewer, existing) {
    //   //-- consider sending a different template ?
    //   if (existing) return

    //   model.DAL.User.getById(post.by._id, {select:'name email'}, (e, author) => {
    //     var review = _.find(post.reviews, r => _.idsEqual(r.by._id, reviewer._id))
    //     var rating = _.find(review.questions, q => q.key == 'rating').answer
    //     var feedback = _.find(review.questions, q => q.key == 'feedback').answer
    //     var {_id, title} = post

    //     var tmplData = { _id, title, rating, feedback,
    //       firstName: post.by.name.split(' ')[0],
    //       reviewer: reviewer.name
    //     }

    //     COMM('ses').from('sys').tmpl('post-review-notify', tmplData).send(author)
    //   })
    // },
//
