bots = ->

  describe 'Can view', ->

    describe 'Protocols', ->
      it 'rss', itDone ->

  describe 'Can not view', ->

    describe 'Legal content', ->
      it '/contact contact', itDone ->
      it '/tos tos', itDone ->
      it '/privacy privacy', itDone ->
      it '/refund-policy refund', itDone ->

aonn = ->

  describe 'Can view', ->

    describe 'Protocols', ->
      it 'rss', itDone ->

    describe 'Legal content', ->
      it.skip 'noindex /contact contact', itDone ->
      it 'noindex /tos tos', itDone ->
      it 'noindex /privacy privacy', itDone ->
      it 'noindex /refund-policy refund', itDone ->

    describe 'Browse', ->
      it 'index / homepage', itDone ->
      it 'index /software-experts software experts', itDone ->

      it 'index /consult through airpair (partial)', itDone ->
      it 'index /hire-developers through airpair (partial)', itDone ->

      it 'index /angularjs tag angularjs', itDone ->
      it 'index /ios tag ios', itDone ->
      it 'index post (with obsfacated code blocks)', itDone ->
      # it ???? 'index /posts/tag/angularjs tag angularjs', itDone ->
      # it '??? index workshop', itDone ->

    describe 'Landing', ->
      it 'index /100-writing-competition', itDone ->
      it.skip 'index an expert (partial)', itDone ->
      it 'noindex /review request (partial)', itDone ->

    describe 'Account', ->
      it 'noindex /v1/auth/reset reset password', itDone ->
      it 'noindex /me/password password reset', itDone ->
      it 'noindex /login', itDone ->
      it 'noindex /team-signup', itDone ->


  describe 'Can not view', ->

    it 'experts search /experts', itDone ->
    it 'expert guide /expert-guide', itDone ->
    it 'me', itDone ->

    it 'settings', itDone ->
    it 'dashboard', itDone ->
    it 'office', itDone ->
    it 'matching', itDone ->
    it 'authoring', itDone ->
    it 'requests', itDone ->


customer = ->

  describe 'Without emailv + cc', ->

    describe 'Can view', ->

      it 'settings', itDone ->
      it '/consultants ? dashboard', itDone ->


  describe 'With emailv + cc', ->

    describe 'Can view', ->


    describe 'Can not view', ->

author = ->

  describe 'Without emailv', ->

    describe 'Can view', ->

      it 'new', itDone ->

    describe 'Can not view', ->

      it 'edit', itDone ->
      it 'fork', itDone ->
      it 'contributors', itDone ->

expert = ->

  # describe 'Without emailv', ->


module.exports = ->

  before -> STUB.analytics.on()

  describe("Signup: ".subspec, signup)
  describe("Dashboard: ".subspec, dashboard)
