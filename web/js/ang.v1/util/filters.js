angular.module('AirPair.Util.Filters', [])


.filter('first', (Shared) =>
  (name) => Shared.firstName(name)
)

.filter('replace', () =>
  (str, pattern, replace) => str.replace(pattern, replace)
)

.filter('dateFormat', () =>
  (date, format) => moment(date).format(format||'ddd, MMM Do ha')
)

.filter('html', ($sce) =>
  (html) => $sce.trustAsHtml(html)
)

.filter('timeAgo', () =>
  (date) => moment(date).fromNow()
)

.filter('timeAgoShort', () =>
  (date) => moment(date).fromNow()
                        .replace('month','mth')
                        .replace('hour','hr')
                        .replace('minute','min')
)


.filter('idToDate', () =>
  (id) => new Date(parseInt(id.toString().slice(0, 8), 16) * 1000)
)

.filter('tzIdToName', (Shared) =>
  (id) => Shared.timezone.idToName(id)
)

.filter('tzIdToShortName', (Shared) =>
  (id) => Shared.timezone.idToShortName(id)
)

.filter('urlEncode', ($sce) =>
  (url) => encodeURIComponent(url)
)
