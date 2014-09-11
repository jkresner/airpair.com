var cfg = {
  mongoUri: process.env.MONGOHQ_URL || "mongodb://localhost/airpair_dev",
  session: { secret: 'airyv1' },
  oAuth: { 
    callbackHost: 'http://localhost:3333'
  }
} 

// Temporary hack
cfg.local = process.env.MONGOHQ_URL == null

export default cfg