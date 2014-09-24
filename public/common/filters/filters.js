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
      var offset = moment().format('ZZ')
      if (utc!='') {
        var timeString = utc.split('GMT')[0]
        var format = 'ddd, MMM Do ha'
        if (displayFormat) { format = displayFormat }
        var result = moment(timeString, 'YYYY-MM-DDTHH:mm:ss:SSSZ').format(format)
        return result.replace(offset,'')
      }
      else
      {
        return 'Confirming time';
      }
    }
  })

  .filter('trustUrl', function ($sce) {
    return (url) => $sce.trustAsResourceUrl(url)
  })

  .filter('markdownHtml', function ($sce) {
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
