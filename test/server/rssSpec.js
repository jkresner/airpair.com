module.exports = () => describe("Rss: ", function() {

  before( (done) => {
    stubAnalytics()
    // testDb.clearPosts( () => {
    testDb.initPosts( () => {
      // testDb.clearWorkshops( () => {
      testDb.initWorkshops(done)
      // })
    })
    // })
  })

  after( (done) => {
    resotreAnalytics()
    done()
  })

  var expectFeedWideFields = (text) => {
    expect(text).to.not.be.empty
    expect(text).to.match(/<title>.+<\/title>(?=.*<item>)/)
    expect(text).to.match(/<description>.+<\/description>(?=.*<item>)/)
    expect(text).to.match(/<atom:link href="https:\/\/www.airpair.com\/rss\/{0,1}(posts|workshops){0,1}(?=.*<item>)/)
    expect(text).to.match(/<link>https:\/\/www.airpair.com<\/link>(?=.*<item>)/)
    expect(text).to.match(/<image><url>https:\/\/www.airpair.com\/v1\/img\/css\/airpair-circle.png<\/url>(?=.*<item>)/)
    expect(text).to.match(/<copyright>.+<\/copyright>(?=.*<item>)/)
    expect(text).to.match(/<language>.+<\/language>(?=.*<item>)/)
    expect(text).to.match(/<category>.+<\/category>(?=.*<item>)/)
    expect(text).to.match(/<pubDate>.+<\/pubDate>(?=.*<item>)/)
    expect(text).to.match(/<ttl>.+<\/ttl>(?=.*<item>)/)
  }

  var expectItemFields = (text) => {
    expect(text).to.not.be.empty
    expect(text).to.match(/<item>.*(<title>.+<\/title>)(?=.*<\/item>)/)
    expect(text).to.match(/<item>.*(<description>.+<\/description>)(?=.*<\/item>)/)
    expect(text).to.match(/<item>.*(<pubDate>.+<\/pubDate>)(?=.*<\/item>)/)
    expect(text).to.match(/<item>.*(<link>.+<\/link>)(?=.*<\/item>)/)
    expect(text).to.match(/<item>.*(<dc:creator>.+<\/dc:creator>)(?=.*<\/item>)/)
    expect(text).to.match(/<item>.*(<category>.+<\/category>)(?=.*<\/item>)/)
  }

  var expectAtLeast2OrderedItems = (text) => {
    var items = text.match(/<item>(?=.*<\/item>)/g)
    expect(items.length).to.be.at.least(2)
    var publishedDates = text.match(/<pubDate>[^<]+<\/pubDate>/g)
    expect(publishedDates.length).to.be.at.least(3) // date on feed + 2 items
    for (var i = 0; i < publishedDates.length; i++) {
      var dateString = publishedDates[i].match(/<pubDate>(.*)<\/pubDate>/)
      publishedDates[i] = new Date(dateString[1])
    }
    expect(publishedDates[1]).to.be.gt(publishedDates[2])  // first date [0], is the feed's date
  }

  describe("Posts Feed", function() {
    it('contains expected fields and at least 2 posts, most recent first', (done) => {
      GETXML('/rss/posts')
        .end( (e,r) => {
          if (e) return done(e)
          expectFeedWideFields(r.text)
          expectItemFields(r.text)
          expectAtLeast2OrderedItems(r.text)
          done()
        })
    })
  })

  describe("Workshops Feed", function() {
    it('contains expected fields and at least 2 workhops, furthest in the future first', (done) => {
      GETXML('/rss/workshops')
        .end( (e, r) => {
          if (e) return done(e)
          expectFeedWideFields(r.text)
          expectItemFields(r.text)
          expectAtLeast2OrderedItems(r.text)
          done()
        })
    })
  })

  describe("Mixed Feed", function() {
    it('it contains the expected fields', (done) => {
      GETXML('/rss')
        .end( (e,r) => {
          if (e) return done(e)
          expectFeedWideFields(r.text)
          expectItemFields(r.text)
          done()
        })
    })

    it.skip('it contains at least 1 workshop and at least 1 post', (done) => {
      GETXML('/rss')
        .get( (e,r) => {
          if (e) return done(e)
          // assert something
        })
    })
  })
})
