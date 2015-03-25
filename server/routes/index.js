module.exports = function(routes)
{
  if (routes == 'whiteList')
    return require('../../shared/routes')
  else
    return require(`./${routes}`)
}
