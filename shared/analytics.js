var Analytics = require('analytics-node')
var segment = new Analytics(config.analytics.segmentio.writekey, { flushAt: 1 })

export var track = (userId, event, properties, done) =>
  segment.track({userId,event,properties}, (e, batch) => { if (done) done() })
