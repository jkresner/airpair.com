module.exports = {

  REDIRECT: {
    TYPE: [
      '301',                 // 301 forward (string/pattern) from => to
      '302',                 // 302 forward (string/pattern) from => to
      '410',                 // forward (string/pattern) from => to
      '501',                 // 501 Not implemented
      'bait',                // 418 teapot (RFC 2324) url.match(from:regex)
      // 'canonical-cached',    // Resolve custom url -> cached item (no redirect)
      // 'canonical-post',      // Resolve custom url -> post (no redirect)
      // 'canonical-tag',
      'rewrite'              // 301 forward string.replace from(regex), to(string)
    ]
  },

  EXPERT: {
    DEAL_TYPE: ['airpair', 'offline', 'code-review', 'article', 'workshop'],
    DEAL_TARGET_TYPE: ['all','user','company','newsletter','past-customers','code']
  },

  POST: {
    TEMPLATE: ['post','blank','landing','faq'],
    COMP: ['2015_q1','2018_q1'],
    TYPE: [
           'announcement',
           'comparison',
           'dive',
           'docs',
           'guide',
           'index',
           'opinion',
           'review',
           'show',
           'tips',
           'tutorial',
          ]
  },

  USER: {
    SCOPES: ['admin','spinner','pipeliner','post:editor','post:moderator','expert:trusted','expert:approved'],
  }

}
