module.exports = {

  REDIRECT: {
    TYPE: [
      '301',                 // 301 forward (string/pattern) from => to
      '302',                 // 302 forward (string/pattern) from => to
      '410',                 // forward (string/pattern) from => to
      '501',                 // 501 Not implemented
      'ban',                 // 500
      'bait',                // 418 teapot (RFC 2324) url.match(from:regex)
      // 'canonical-cached',    // Resolve custom url -> cached item (no redirect)
      // 'canonical-post',      // Resolve custom url -> post (no redirect)
      // 'canonical-tag',
      'rewrite'              // 301 forward string.replace from(regex), to(string)
    ]
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

}
