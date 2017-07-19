UTIL = require("../../../../es/post")


IT "TOC from h2 + h3", ->
  toc1 = UTIL.toc(FIXTURE.markdown.toc1)
  items = toc1.split('\n') 
  expect(items.length).to.equal(7)
  expect(items[0]).to.equal("- [Welcome to toc1 h2](#welcome-to-toc1-h2)")
  expect(items[1]).to.equal("  - [Here's first sub h3](#here-s-first-sub-h3)")
  expect(items[2]).to.equal("  - [Second h3](#second-h3)")
  expect(items[3]).to.equal("- [Second H2](#second-h2)")
  expect(items[4]).to.equal("- [Third h2](#third-h2)")
  expect(items[5]).to.equal("- [h2 underline should pickup](#h2-underline-should-pickup)")
  expect(items[6]).to.equal("  - [Third h3](#third-h3)")
  DONE()


IT "Index sup references", ->
  {md,references} = UTIL.indexReferences(FIXTURE.markdown.toc1)
  items = references.split('\n') 
  expect(items.length).to.equal(3)
  expect(items[0]).to.equal('1. <cite id="ref-1"><a href="http://www.nodejs.org/">nodejs.org</a></cite>')
  expect(items[1]).to.equal('2. <cite id="ref-2">sup 2 inside codeblock counts</cite>')
  expect(items[2]).to.equal('3. <cite id="ref-3">3rd ref</cite>')  
  expect(md).inc "<sup>[[1](#ref-1)]</sup>"
  expect(md).inc "<sup>[[2](#ref-2)]</sup>"
  expect(md).inc "<sup>[[3](#ref-3)]</sup>"
  DONE()


IT "Default slug", ->
  title = "Here's a great c# + JavaScript post for everyone in the world"
  slug = UTIL.defaultSlug({title})
  expect(slug).to.equal('heres-a-great-c-javascript-post-for-ever')
  DONE()
  