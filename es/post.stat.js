var stats = {


  ratingBasic(post) {
    var stars = []
    var reviews = post.reviews || []
    var rated = reviews.filter(r => r.val)
    if (rated.length > 0) stars = rated.map(r => r.val)
    var stat = { reviews: stars.length }

    var sum = 0
    for (var i = 0, ii = stars.length; i < ii; ++i)
      sum += stars[i]

    if (sum > 0) stat.rating = sum/stars.length
    return stat
  },



  wordcount(post) {
    var {md} = post
    var s = md.replace(/(^\s*)|(\s*$)/gi,"");
    s = s.replace(/[ ]{2,}/gi," ");
    s = s.replace(/\n /,"\n");
    return s.split(' ').length;
  },


  ratingWeighted(post) {
    console.log('Not imp algorithm utilizing user mojo and votes')
  },


  comments(post) {
    var reviews = post.reviews || []
    var count = reviews.length + _.flatten(_.map(reviews,'replies')||[]).length
    return { comments: count }
  },


  // wordsTogoForReview(wordcount) {
  //   var remainder = wordcount%50;
  //   var countWithoutRemainder = wordcount - remainder;
  //   return 400 - countWithoutRemainder;
  // },

  // calcStats(post, wordcount) {
  //   var PRs = false// PRs || []
  //   var feedback = post.reviews ? post.reviews.map(r => r.said) : []
  //     forkers: (post.forkers||[]).length,
  //     // views: 0,            // figure it out later
  //     // shares: 0,           // figure it out later
  //     words: wordcount(post.md)   //  words: utilFns.wordcount(post.md)
  //   }
  //   return !PRs ? stats : _.extend(stats, {
  //     openPRs:     _.where(PRs, pr => pr.state=='open').length,  // not really correct at all grrr
  //     closedPRs:   _.where(PRs, pr => pr.state=='closed').length,  // not really correct at all grrr
  //     acceptedPRs: _.where(PRs, pr => pr.state=='closed').length,  // not really correct at all grrr
  //   })

    // var totalStars = 0
    // var reviews = post.reviews || []
    // return {
    //
    //   forkers: (post.forkers||[]).length,
    //   openPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='open').length,  // not really correct at all grrr
    //   closedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
    //   acceptedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
    //   shares: 0,            // figure it out later
    //   words: utilFns.wordcount(post.md)
    // }


}



module.exports = stats
