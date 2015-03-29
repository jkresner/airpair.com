angular.module('APFilters', [])

.filter('publishedTime', function() {
  return (utc, displayFormat) => {
    var offset = moment().format('ZZ')
    if (utc != '' && utc != null) {
      var timeString = utc.split('GMT')[0]
      var format = 'MMM Do hh:mm'
      if (displayFormat) { format = displayFormat }
      var result = moment(timeString, 'YYYY-MM-DDTHH:mm:ss:SSSZ').format(format)
      return result.replace(offset,'')
    }
    else
    {
      return '-';
    }
  }
})

.filter('locaTime', function() {
  return (utc, displayFormat) => {
    if (utc && utc!='') {
      var offset = moment().format('ZZ')
      var timeString = utc.split('GMT')[0]
      displayFormat = displayFormat || 'ddd, MMM Do ha'
      var result = moment(timeString, 'YYYY-MM-DDTHH:mm:ss:SSSZ').format(displayFormat)
      return result.replace(offset,'')
    }
    else
    {
      return 'Unknown time';
    }
  }
})

.filter('objectIdToDate', function(Util) {
  return (id, displayFormat) => {
    if (id) {
      displayFormat = displayFormat || 'MMM DD'
      return moment(Util.ObjectId2Date(id)).format(displayFormat);
    }
    return "Unknown time"
  }
})

.filter('agoTime', function() {
  return (date) => {
    console.log('agoTime', date)
    return moment(date).fromNow();
  }
})

.filter('objectIdToAgoTime', function(Util) {
  return (id) => {
    return moment(Util.ObjectId2Date(id)).fromNow();
  }
})


.filter('urlEncode', function ($sce) {
  return (string) => encodeURIComponent(string)
})

.filter('trustUrl', function ($sce) {
  return (url) => $sce.trustAsResourceUrl(url)
})

.filter('markdownHtml', function ($sce) {
  return (html) => {
    return $sce.trustAsHtml(html)
  }
})

.filter('addNameBreak', function ($sce) {
  return (text) => {
    return $sce.trustAsHtml(text.replace(' ','<br>'))
  }
})

.filter('html', function ($sce) {
  return (html) => {
    return $sce.trustAsHtml(html)
  }
})

.filter('fancyTags', function () {
  return function(tags) {
    if (!tags) { return ''; }
    return tags.join(', ');
  };
});
