let ok = 0

function expectOne(canonical, all) {
  let url = canonical.replace(/^(https|http)\:\/\/www\.airpair\.com/,'')
  PAGE(url, {session:null}, (html) => {
    expect(html).inc(`<link rel="canonical" href="${canonical}" />`)
    if (all === ++ok) DONE()
  })
}

function expectSet(links) { links
  .forEach(link => expectOne(link, links.length)) }


beforeEach(function() {
  ok = 0
  config.middleware.throttle = { limit: 1000 }
})


IT("Tags", function() {
  this.timeout(5000)
  let canonicals = Object.values(cache['canonical'].tag)
                         .map(p=>`https://www.airpair.com${p.url}`)
  expectSet(canonicals)
})


IT("Posts", function() {
  this.timeout(5000)
  let canonicals = Object.values(cache['posts']).map(p=>p.url)
  expectSet(canonicals)
})


