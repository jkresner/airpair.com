module.exports = {


  JSONPOST(o) {
    return JSON.stringify(_.pick(o,'_id'))
  }


}
