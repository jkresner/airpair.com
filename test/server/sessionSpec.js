module.exports = () => describe("API: ", function() {

	before(function(done) {
		stubAnalytics()
		testDb.initTags(() => testDb.ensurePost(data.posts.v1AirPair, done))
	})

	after(function(done) {
		resotreAnalytics()
		done()
	})


	it('Gets sessionId on anonymous session', function(done) {
		var opts = { unauthenticated: true }
		GET('/session', opts, function(s) {
			expect(s.authenticated).to.be.false
			expect(s.sessionID).to.exist
			done()
		})
	})


	it('Gets sessionId on anonymous full session', function(done) {
		var opts = { unauthenticated: true }
		GET('/session/full', opts, function(s) {
			expect(s.authenticated).to.be.false
			expect(s.sessionID).to.exist
			done()
		})
	})


	it('Can add tag data to anonymous session', function(done) {
		http(global.app)
			.put('/v1/api/users/me/tag/node.js')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, resp){
				if (err) throw err
				cookie = resp.headers['set-cookie']
				GET('/session', {}, function(s) {
					expect(s.authenticated).to.be.false
					expect(s.sessionID).to.exist
					expect(s.tags).to.exist
					expect(s.tags.length).to.equal(1)
					expect(s.tags[0].name).to.equal('Node.JS')
					expect(s.tags[0].slug).to.equal('node.js')
					expect(s.tags[0].priority).to.equal(0)
					done()
				})
			})
	})


	it('Can add up to 4 tags to anonymous session', function(done) {
		http(global.app)
			.put('/v1/api/users/me/tag/node.js')
			.end(function(err, resp){
				cookie = resp.headers['set-cookie']
				PUT('/users/me/tag/angularjs', {}, {}, function(s2) {
					PUT('/users/me/tag/mongodb', {}, {}, function(s3) {
						PUT('/users/me/tag/mean-stack', {}, {}, function(s4) {
							expect(s4.authenticated).to.be.false
							expect(s4.sessionID).to.exist
							expect(s4.tags).to.exist
							expect(s4.tags.length).to.equal(4)
							PUT('/users/me/tag/ruby-on-rails', {}, { status: 400 }, function(err, resp) {
								expect(resp.text.indexOf('Max allowed tags reached') != -1).to.be.true
								done()
							})
						})
					})
				})
			})
	})


	it('Can remove tag from anonymous session', function(done) {
		http(global.app)
			.put('/v1/api/users/me/tag/node.js')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, resp){
				if (err) throw err
				cookie = resp.headers['set-cookie']
				//-- Remove the tag
				PUT('/users/me/tag/node.js', {}, {}, function(s2){
					expect(s2.tags).to.exist
					expect(s2.tags.length).to.equal(0)
					GET('/session', {}, function(s) {
						expect(s.authenticated).to.be.false
						expect(s.sessionID).to.exist
						expect(s.tags).to.exist
						expect(s.tags.length).to.equal(0)
						done()
					})
				})
			})
	})


	it('Can add bookmark data to anonymous session', function(done) {
		http(global.app)
			.put(`/v1/api/users/me/bookmarks/post/${data.posts.v1AirPair._id}`)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, resp){
				if (err) throw err
				cookie = resp.headers['set-cookie']
				GET('/session', {}, function(s) {
					expect(s.authenticated).to.be.false
					expect(s.sessionID).to.exist
					expect(s.bookmarks).to.exist
					expect(s.bookmarks.length).to.equal(1)
					expect(s.bookmarks[0].title).to.equal("Starting a Mean Stack App")
					done()
				})
			})
	})


	it.skip('Can add up to 2 bookmarks to anonymous session', function(done) {
		// http(global.app)
		// 	.put(`/v1/api/users/me/bookmark/post/${p1._id}`)
		// 	.end(function(err, resp){
		// 		cookie = resp.headers['set-cookie']
		// 		PUT(`/users/me/bookmark/post/${p2._id}`, {}, {}, function(s2) {
		// 			GET('/session', {}, function(s) {
		// 				expect(s.authenticated).to.be.false
		// 				expect(s.sessionID).to.exist
		// 				expect(s.bookmarks).to.exist
		// 				expect(s.bookmarks.length).to.equal(2)
		// 				PUT(`/users/me/bookmark/post/${p3._id}`, { status: 400 }, function(err, resp) {
		// 					expect(resp.text.indexOf('Max allowed bookmarks reached') != -1).to.be.true
		// 					done()
		// 				})
		// 			})
		// 		})
		// 	})
	})


	it('Copies anonymous session data to new local signup user', (done) =>
		http(global.app)
			.put('/v1/api/users/me/tag/mongodb')
			.end( (err, resp) => {
				cookie = resp.headers['set-cookie']
				GET('/session', {}, (s) => {
					expect(s.tags[0].name).to.equal('MongoDB')
					var singup = getNewUserData('ramo')
					http(global.app).post('/v1/auth/signup').send(singup)
						.set('cookie',cookie)
						.end( (err, resp) =>
							GET('/session/full', {}, (sFull) => {
								expect(sFull._id).to.exist
								expect(sFull.name).to.equal(singup.name)
								expect(sFull.tags).to.exist
								expect(sFull.tags.length).to.equal(1)
								expect(sFull.tags[0].name).to.equal('MongoDB')
								done()
							})
						)
				})
			})
	)


	it.skip('TODO: Copies anonymous session data to new google signup user', () => {} )


	it.skip('Not gonna Impl: Merges anonymous session data to local LOGIN user', () => {} )


	it('gets slim authenticated session', function(done) {
		LOGIN('scap', data.users.scap, function() {
			GET('/session', {}, function(r) {
				expect(r._id).to.equal("5418c03f8f8c80299bcc4783")
				expect(r.email).to.equal("sc@airpair.com")
				expect(r.name).to.equal("Shane")
				expect(r.avatar).to.equal("//0.gravatar.com/avatar/54856fdf0610d64c79bf82b43d56f356")
				done()
			})
		})
	})

})

