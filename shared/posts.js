module.exports = {

  validSlug(slug) {
    return /^[a-z0-9]+([a-z0-9\-]+)*$/.test(slug)
  },

  wordcount(md) {
    var s = md.replace(/(^\s*)|(\s*$)/gi,"");
    s = s.replace(/[ ]{2,}/gi," ");
    s = s.replace(/\n /,"\n");
    return s.split(' ').length;
  },

  wordsTogoForReview(wordcount) {
    var remainder = wordcount%50;
    var countWithoutRemainder = wordcount - remainder;
    return 500 - countWithoutRemainder;
  },


  extendWithReviewsSummary(post) {
    post.stars = { total: 0 }
    post.reviews= _.map(post.reviews, (r) => {
      r.rating = _.find(r.questions,(q)=>q.key == 'rating').answer
      r.feedback = _.find(r.questions,(q)=>q.key == 'feedback').answer
      post.stars.total += parseInt(r.rating)
      return r
    })
    if (post.stars.total > 0) {
      post.stars.avg = post.stars.total/post.reviews.length
    }

    return post
  }

}
