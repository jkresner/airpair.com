module.exports = function(routes)
{

  if (routes == 'blackList')
    return [
      '/rev-manifest.json'
    ]
  else
    return require(`./${routes}`)
}
