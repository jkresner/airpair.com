# cmd/tool/run guard


OPTS =
  setup:
    done: (cb) =>
      cb()


SCREAM = require('screamjs')
SCREAM(OPTS).run((done) => done())
