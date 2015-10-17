

unsets = ->
  attrs = 'createdById gcal.organizer gcal.creator gcal.kind gcal.sequence'
  $unset = {}
  $unset[attr] = 1 for attr in attrs.split(' ')
  $log('unset.BOOKING.attrs'.yellow, attrs.gray)
  Bookings.updateMany {}, {$unset}, ->
    DONE()




module.exports = ->

  specInit(@)

  describe 'Migrating booking fields'.white.bold, ->

    IT "Can unset undesired attrs", unsets

