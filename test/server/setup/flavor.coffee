global.sinon    = require('sinon')
global.chai     = require('chai')
global.expect   = chai.expect
global.expectIdsEqual = (id1, id2) -> expect(_.idsEqual(id1,id2)).to.be.true
global.expectStartsWith = (str,start) -> expect(str.indexOf(start)).to.equal(0)
global.expectContains = (str,start) -> expect(str.indexOf(start)).not.equal(-1)
global.expectSameMoment = (date1, date2) ->
  expect(moment(date1).isSame(moment(date2))).to.be.true
global.expectTouch = (touch, byId, action) ->
  expectIdsEqual(touch.by._id, byId)
  expect(touch.action).to.equal(action)
