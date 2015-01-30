function isLocal(provider)
{
  return provider.indexOf('local') == 0;
}

export function getEnvConfig(provider)
{
  var cfg = { passReqToCallback: true }
  if (isLocal(provider))
  {
    _.extend(cfg, config.auth.local)
  }
  else
  {
    cfg.callbackURL = `${config.auth.oAuth.callbackHost}/auth/${provider}/callback`
    _.extend(cfg, config.auth[provider])
  }

  return cfg;
}
