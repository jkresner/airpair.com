module.exports = {

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
  }

}
