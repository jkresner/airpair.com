var consolidate = require('consolidate');

export default function(app) {
	app.engine('jade', consolidate.jade);
	app.get('/chat/admin', (req, res, next) => res.status(200).render('./chat/admin.jade'));
};
