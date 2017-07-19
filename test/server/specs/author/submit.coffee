beforeEach ->
  STUB.allGitPublisherAPIcalls()

IT "Simple post and valid gh.token", ->
  STORY.newPost 'higherOrder', { author: 'tmot', data: {title:"Higher #{@testSeed}"} }, (p0, session) ->
    GET "/author/submitting/#{p0._id}", (pSubmission) ->
      EXPECT.equalIdAttrs(pSubmission, p0)
      expect(pSubmission.slug).to.exist
      expect(pSubmission.submission.valid).to.be.true
      PUT "/author/submit/#{p0._id}", pSubmission, (p1) ->
        expect(p1.history.submitted).to.exist
        expect(p1.slug).to.equal(pSubmission.slug)
        DONE()


IT "When already submitted", ->
  opts = { author: 'admb', data: {title: "Highest #{@testSeed}"}, submit: new Date }
  STORY.newPost 'higherOrder', opts, (p0, session) ->
    GET "/author/submitting/#{p0._id}", { status: 403 }, (submissionErr) ->
      expect(submissionErr.message).to.inc ['previously submitted']
      p0.slug = p0.title.toLowerCase().replace(' ', '-')
      PUT "/author/submit/#{p0._id}", p0, { status: 403 }, (submitErr) ->
        expect(submitErr.message).to.inc ['Already submitted']
        DONE()


IT "When wordcount too low", ->
  opts = { author: 'stpv', data: {title: "Extra words#{@testSeed}", md: 'not enough'} }
  STORY.newPost 'exps_deep', opts, (p0, session) ->
    GET "/author/submitting/#{p0._id}", { status: 403 }, (submissionErr) ->
      expect(submissionErr.message).to.inc ['words to submit']
      p0.slug = p0.title.toLowerCase().replace(/ /g, '-').split('sessions-')[1]
      PUT "/author/submit/#{p0._id}", p0, { status: 403 }, (submitErr) ->
        expect(submitErr.message).to.inc ['words required for peer review']
        DONE()


SKIP "When 'user' | 'public_repo' scope missing", ->
SKIP "With expired gh token", ->

