# cmd/tool/run migrate


OPTS =
  setup:
    done: (cb) =>
      global.Templates = DB.Collections.templates
      global.Redirects = DB.Collections.redirects
      global.Users = DB.Collections.users
      global.Experts = DB.Collections.experts
      global.Posts = DB.Collections.posts
      cb()


SCREAM = require('screamjs')
SCREAM(OPTS).run((done) => done())
