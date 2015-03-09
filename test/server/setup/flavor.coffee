global.sinon    = require('sinon')
global.chai     = require('chai')
global.expect   = chai.expect
global.expectIdsEqual = (id1, id2) -> expect(_.idsEqual(id1,id2)).to.be.true
global.expectStartsWith = (str,start) -> expect(str.indexOf(start)).to.equal(0)
global.expectContains = (str,start) -> expect(str.indexOf(start)).not.equal(-1)
