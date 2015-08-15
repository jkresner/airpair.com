

module.exports = function(namespace, obj, on)
{
  obj.$$trace = () => {}

  if (!config.log[namespace] && !on)
    return obj

  var traceWrap = (fn, fnName) =>
    function() {
      this.$$trace = function(named, unamed) {
        var args = [`${namespace}.${fnName}`.cyan]
        if (named)
          for (var key of _.keys(named)||[]) {
            args.push(key.trace)
            args.push(named[key])
          }
        if (unamed)
          for (var d of unamed || []) {
            args.push(d)
          }
        console.log.apply(null, args)
      }
      return fn.apply(this, arguments)
    }

  return _.wrapFnList(_.omit(obj,'$$trace'), traceWrap)
}
