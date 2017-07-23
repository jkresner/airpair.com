angular.module('AirPair.Util.Filters', [])


.filter('first', (Shared) =>
  (name) => Shared.firstName(name)
)

.filter('replace', () =>
  (str, pattern, replace) => str.replace(pattern, replace)
)


// .filter('markdownHtml', function ($sce) {
//   return (html) => {
//     return $sce.trustAsHtml(html)
//   }
// })

// .filter('markdownAsHtml', function ($sce, Util) {
//   return (markdown) => {
//     var markdownHtml = marked(Util.htmlEscape(markdown))
//     markdownHtml = Util.codeblockUnescape(markdownHtml)
//     return $sce.trustAsHtml(markdownHtml)
//   }
// })


.filter('dateFormat', () =>
  (date, format) => moment(date).format(format||'ddd, MMM Do ha')
)

// .filter('tsTime', function() {
//   return (ts, displayFormat) => {
//     displayFormat = displayFormat || 'ddd, MMM Do ha'
//     return moment.unix(ts).format(displayFormat)
//   }
// })

.filter('html', ($sce) =>
  (html) => $sce.trustAsHtml(html)
)

// .filter('trustUrl', function ($sce) {
//   return (url) => $sce.trustAsResourceUrl(url)
// })

.filter('timeAgo', () =>
  (date) => moment(date).fromNow()
)

.filter('timeAgoShort', () =>
  (date) => moment(date).fromNow()
                        .replace('month','mth')
                        .replace('hour','hr')
                        .replace('minute','min')
)


// .filter('timeLocal', function() {
//   return (utc, displayFormat) => {
//     if (utc && utc!='') {
//       var offset = moment().format('ZZ')
//       var timeString = utc.split('GMT')[0]
//       displayFormat = displayFormat || 'ddd, MMM Do ha'
//       var result = moment(timeString, 'YYYY-MM-DDTHH:mm:ss:SSSZ').format(displayFormat)
//       return result.replace(offset,'')
//     }
//     else
//     {
//       return 'Unknown time';
//     }
//   }
// })


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
