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

  extractCommits(events){
    var commits = []
    events.forEach(function(event){
      if (event.type === "PushEvent")
        commits.push(
          {
            author: event.payload.commits[0].author.name,
            message: event.payload.commits[0].message,
            date: event.created_at
          }
        )
    });
    commits = commits.sort(function(a,b){
      return a.date > b.date
    })
    return commits;
  }
}
