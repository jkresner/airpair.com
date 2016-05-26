SKIP '/sitemap_index.xml', -> PAGE '/sitemap_index.xml', { contentType: /xml/ }, (xml) ->

SKIP '/sitemap_images.xml', -> PAGE '/sitemap_images.xml', { contentType: /xml/ }, (xml) ->


SKIP '/sitemap.xml', -> PAGE '/sitemap.xml', { contentType: /xml/ }, (xml) ->
  expect(xml).to.match(/Chef:Jonathon Kresner/)
  DONE()


IT '/humans.txt', -> PAGE '/humans.txt', { contentType: /text/ }, (txt) ->
  expect(txt).to.match(/Chef:Jonathon Kresner/)
  DONE()

IT '/robots.txt', -> PAGE '/robots.txt', { contentType: /text/ }, (txt) ->
  expect(txt).to.match(/Sitemap: https:\/\/www.airpair.com\/sitemap_index.xml/)
  expect(txt).to.match(/User-agent: \*\nDisallow: \/static\//)
  DONE()

IT '/rss', -> PAGE '/rss', { contentType: /rss/ }, (xml) ->
  expect(xml).to.match(/<rss xmlns:dc="http/)
  expect(xml).to.match(/<item><title><\!\[CDATA\[Mastering ES6 higher-order functions for Arrays\]\]><\/title><description><\!\[CDATA\[Higher-order functions are/)
  expect(xml).to.match(/Elevate your functional programming skills by learning ES6 higher-order functions for Arrays\!\]\]><\/description><link>https:\/\/www.airpair.com\/javascript\/posts\/mastering-es6-higher-order-functions-for-arrays/)
  DONE()
