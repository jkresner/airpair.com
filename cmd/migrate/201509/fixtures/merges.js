var merges = {}

require('fs').readdirSync(__dirname+'/merges').forEach(file => {
  var path = __dirname+'/merges/'+file

  if (file.indexOf('_a.js')!=-1)
    merges[file.replace('_a.js','')] =
      Object.assign(merges[file.replace('_a.js','')]||{},{a: require(path)})
  if (file.indexOf('_b.js')!=-1)
    merges[file.replace('_b.js','')] =
      Object.assign(merges[file.replace('_b.js','')]||{},{b: require(path)})

})

module.exports = merges
