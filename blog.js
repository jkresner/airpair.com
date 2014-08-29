var posts = [
	'0827:90-days-of-airpairing-on-airpair',
	'0828:setting-up-an-angaularjs-app',
	'0820:using-harmony-es6-with-nodejs',	
];


module.exports = function(app)
{	
	var get = function(entry, slugUrl) { 
		app.get('/blog/mean-stack/'+slugUrl, function(req,res,next) { 
			res.status(200).render('./blog/'+entry+'.html'); }); 
	}
 
  for (var i = 0; i < posts.length; i++) {
    get(posts[i].split(':')[0], posts[i].split(':')[1]);	
  }
};
