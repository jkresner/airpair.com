module.exports = function(routes)
{
  if (routes == 'blackList')
    return [
      '/rev-manifest.json'
    ]
  else if (routes == 'whiteList')
    return [
      '/v1',
      '/v1/auth*',
      '/bookings',
      '/booking/*',
      '/bookings/*',
      '/dashboard',
      '/office',
      '/posts*',
      '*/so-welcome',
      '/settings',
      '/find-an-expert',
      '/be-an-expert',
      '/experts',
      '/expert-applications',
      // '/learn',
      '*/posts*',
      // '*/workshops*',
      '/billing*',
      '/payouts*',
      '*pair-programming*',
      '/login',
      '/me*',
      '/help*',
      '/adm*',
      '/matchmaking*',
      '/review*',
      '/requests*',
      '/100k-writing-competition'
    ]
  else
    return require(`./${routes}`)
}
