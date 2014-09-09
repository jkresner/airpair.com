var cfg = {
  mongoUri: process.env.MONGOHQ_URL || "mongodb://localhost/airpair_dev"
} 

// Temporary hack
cfg.local = process.env.MONGOHQ_URL == null

export default cfg