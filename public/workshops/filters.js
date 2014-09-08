angular.module('APFilters', [])

  .filter('locaTime', function() {
    return function(utc, displayFormat) {
      offset = moment().format('ZZ')
      if (utc!='') {
        timeString = utc.split('GMT')[0]
        if (displayFormat) { format = displayFormat }
        else { format = 'ddd, MMM Do ha' }
        var result = moment(timeString, 'YYYY-MM-DDTHH:mm:ss:SSSZ').format(format)
        return result.replace(offset,'')
      }
      else
      {
        return 'Confirming time';
      }
    }
  })