var {selectFromObject} = require('./util')

var postsUtil = {

  validSlug(slug) {
    return /^[a-z0-9]+([a-z0-9\-\.]+)*$/.test(slug)
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
    return 400 - countWithoutRemainder;
  },

  calcStats(post) {
    var totalStars = 0
    var reviews = post.reviews || []
    var stars = _.map(reviews, (r) => {
      var s = parseInt(_.find(r.questions,(q)=>q.key=='rating').answer)
      totalStars = totalStars + s
      return s
    })

    return {
      rating: (stars.length > 0) ? totalStars / stars.length : null,
      reviews: reviews.length,
      comments: reviews.length + _.flatten(_.pluck(reviews,'replies')||[]).length,
      forkers: (post.forkers||[]).length,
      openPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='open').length,  // not really correct at all grrr
      closedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
      acceptedPRs: _.where(post.pullRequests||[],(pr)=>pr.state=='closed').length,  // not really correct at all grrr
      shares: 0,            // figure it out later
      words: postsUtil.wordcount(post.md)
    }
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
  },


  authorFromUser(user) {
    var by = _.extend({ userId:user._id }, _.pick(user,'name','bio','social','username','avatar', 'userId'))
    if (by.social)
      by.social = selectFromObject(by.social,{ 'gh.username': 1,'so.link':1,'bb.username':1,'in.id':1,'tw.username':1,'al.username':1,'gp.link':1 })
    return by
  },


  splitLines(lines, colLength, doc) {
    var i=0
    var changed = false
    // console.log('lines', colLength, lines.length, lines)
    while (lines[i] != null)
    {
      // console.log('i', lines[i].length, lines[i].indexOf(' '), lines[i])
      if (lines[i].length > colLength && lines[i].indexOf(' ') != -1)
      {
        changed = true
        var line = lines[i].substring(0,colLength)
        var lineColLength = line.lastIndexOf(' ')
        if (lineColLength == -1) {
          lineColLength = lines[i].indexOf(' ')
        }
        var extra = lines[i].substring(lineColLength+1, lines[i].length)
        lines[i] = lines[i].substring(0,lineColLength)

        // console.log(':::line[i+1]', lines[i+1].length)
        if (!lines[i+1])
          lines[i+1] = extra
        else if (lines[i+1].length == 0)
          lines.splice(i+1,0,extra)
        else {
          // console.log('extra', extra)
          lines[i+1] = extra + ' ' + lines[i+1]
        }

        // console.log('line[i+1]', lines[i+1])
      }

      i = i + 1;
    }
    if (changed && doc) doc.setValue(lines.join('\n'))
    // console.log('done', lines.length)
    return lines
  }

}

module.exports = postsUtil
