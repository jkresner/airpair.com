

module.exports = function(namespace, obj, on)
{
  if (!config.log[namespace] && !on)
    return _.extend({$$trace:()=>{}},obj)

  var traceWrap = (fn, fnName) =>
    function() {
      obj.$$trace = function() {
        var unnamed = [].slice.call(arguments)
        var named = unnamed.shift()
        var args = [`${namespace}.${fnName}`.cyan]
        if (named)
          for (var key of _.keys(named)||[]) {
            args.push(key.trace)
            args.push(named[key])
          }
        if (unnamed)
          for (var d of unnamed || []) {
            args.push(d)
          }
        console.log.apply(null, args)
      }
      // $log('fn', fnName, this.$$trace)
      return fn.apply(this, arguments)
    }

  return _.wrapFnList(obj, traceWrap)
}
