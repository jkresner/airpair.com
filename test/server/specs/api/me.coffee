IT '/me contains no sensitive data', ->
  STUB.wrapper('GitPublisher').api('user.get').success('gh_user_scopes')
  LOGIN {key:'tiag'}, (jk) =>
    GET "/me", (lib) =>
      for p in lib.mine
        expect(p._id).to.exist
        expect(p.title).to.exist
        expect(p.history).to.be.undefined
        expect(p.stats).to.exist
        expect(p.log).to.be.undefined
        # expect(p.log.last).to.exist
        # expect(p.log.last).to.be.undefined
        # {feedback,forkers,github} = p
        # if github
        #   expect(p.github.stats).to.be.undefined
        #   expect(p.github.events).to.be.undefined
        # if forkers
        #   for f in p.forkers
        #     expect(f.email).to.be.undefined
        #     expect(f._id).to.exist
        #     expect(f.userId).to.exist
        #     expect(f.name).to.exist
        #     expect(f.avatar).to.exist
        #     expect(f.gh).to.exist
        # if feedback
        #   for r in feedback
        #     expect(r.by.email).to.be.undefined
        #     if r.votes
        #       for v in r.votes
        #         expect(v._id).to.exist
        #         expect(v.val).to.exist
        #         expect(v.by).to.exist
        #         expect(v.by.email).to.be.undefined
        #         expect(v.by.mail).to.be.undefined
        #     if r.replies
        #       for rp in r.replies
        #         expect(rp._id).to.exist
        #         expect(rp.said).to.exist
        #         expect(rp.by).to.exist
        #         expect(rp.by.email).to.be.undefined
        #         expect(rp.by.mail).to.be.undefined
      DONE()
