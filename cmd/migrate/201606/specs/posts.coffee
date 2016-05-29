imgMatch = new RegExp('^//')
mdMatch = new RegExp("\\!\\[.*\\]{1}(\\(\\/\\/).*\\)", 'g')   #

module.exports = ->

  before (done) ->
    @timeout(500000000)
    global.Posts = DB.Collections.posts
    done()

  IT "Update all ^// image urls to ^https://", ->
    @timeout(500000000)
    Posts.find({ $or: [{ 'htmlHead.ogImage' : imgMatch },
                       { 'assetUrl' : imgMatch },
                       { 'md' : mdMatch  },
               ]}, {'_id':1,'assetUrl':1,'title':1,'htmlHead.ogImage':1,'md':1}).toArray (e, all) =>
      ups = []
      for {_id,title,assetUrl,htmlHead,md} in all
        $log(':', title.white)
        $set = {}
        if imgMatch.test(assetUrl)
          $set['assetUrl'] = 'https:'+assetUrl
          $log('assetUrl'.gray, $set['assetUrl'].replace('https:','https:'.cyan))
        if imgMatch.test((htmlHead||{}).ogImage)
          $set['htmlHead.ogImage'] = 'https:'+htmlHead.ogImage
          $log('ogImage\t'.gray, $set['htmlHead.ogImage'].replace('https:','https:'.cyan))
        if mdMatch.test(md)
          mdFixed = md
          mdHightlight = md
          for m in md.match(mdMatch)
            mdFixed = mdFixed.replace(m, m.replace('(//', '(https://'))
            mdHightlight = mdHightlight.replace(m, m.replace('(//', '('+'https:'.cyan+'//'))
          mdFixed =  mdFixed.replace(/http:\/\/airpair-blog\.s3/g, 'https://airpair-blog.s3')
          mdHightlight = mdHightlight.replace(/http:\/\/airpair-blog\.s3/g, 'https://airpair-blog.s3'.cyan)
          $set['md'] = mdFixed
          $log('md\t'.gray, mdHightlight.split('\n').filter((ln) -> ln.indexOf('https:'.cyan)!=-1).join('\n\t'))

        # console.log('up', _id, title, $s
        ups.push updateOne: { q: {_id}, u: { $set }, upsert: false }

      Posts.bulkWrite ups, {ordered:false}, (e,r) ->
        $log('update.Posts["assetUrl|ogImage|md"]'.yellow, r.modifiedCount)
        DONE()
