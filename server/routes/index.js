module.exports = function(routes)
{
  if (routes == 'blackList')
    return [
      '/rev-manifest.json'
    ]
  else if (routes == 'whiteList')
    return [
      '/v1',
      '/bookings',
      '/booking/*',
      '/bookings/*',
      '/dashboard',
      '/posts*',
      '/settings',
      '/find-an-expert',
      '/hire-software-developers',
      '/experts',
      '*/posts*',
      // '*/workshops*',
      '/billing*',
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
