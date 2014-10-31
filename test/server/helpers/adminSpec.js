module.exports = () => describe('CRUD: ', function() {

	before(function(done) {
		testDb.addUserWithRole('edap', 'admin', stubAnalytics);
		testDb.initTags(done);
	});

	after(function(done) {
		// restoreAnalytics();
		testDb.deleteTags(done);
		// done();
	});

	it('should not be able to get tags if not admin', function(done) {
		addLocalUser('joem', {}, function(uk) {
			LOGIN(uk, data.users[uk], function() {
				var opts = { status: 403 };
				GET('/adm/tags', opts, function(){ done(); });
			});
		});
	});

	it('should be able to get all tags if admin', function(done) {
		LOGIN('admin', data.users.admin, function() {
			var opts = { status: 200 };
			GET('/adm/tags', opts, function(){ done(); });
		});
	});

	it('should be able to create tags', function(done) {
		LOGIN('admin', data.users.admin, function() {
			var tag = {name: 'test1', slug: 'test1', soId: 'test1', short: 'test1', desc: 'test1'};
			POST(`/adm/tags`, tag, {}, function(){ done(); })
		});
	});

	it('should be able to delete tags', function(done) {
		LOGIN('admin', data.users.admin, function() {
			var tagID = data.tags.angular._id;
			DELETE(`/adm/tags/${tagID}`, {}, function() { done(); });
		});
	})
})
