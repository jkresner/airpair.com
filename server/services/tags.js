import Svc from '../services/_service'
import Tag from '../models/tag'
import * as WorkshopsSvc from './workshops'
import * as PostsSvc from './posts'


var logging = false
var svc = new Svc(Tag, logging)


var fields = {
	listCache: { '_id':1, name: 1, slug: 1 },
	search: { '_id': 1, 'name': 1, 'slug': 1, 'desc': 1, 'tokens': 1 }
}


function tokenize(term, wildcardStart, wildcardEnd) {
  if (!term) return '.*';
  term = term.replace(/[-\/\\^$*+?.()|[\]{}+]/g, '\\$&');

  var regex = '';
  if (wildcardStart) regex += '.*';

  var tokens = term.split(' ');
  if (tokens) regex += tokens.join('.*');
  else regex += term;

  if (wildcardEnd) regex += '.*';

  return regex;
}


export function search(searchTerm, cb) {
  var regex = new RegExp(tokenize(searchTerm, true, true), 'i');

  var query = { $or: [{name: regex},{tokens: regex}] };
	var opts = { fields: fields.search, limit: 10 }

	svc.searchMany(query, opts, function(err, result) {
    if (err) {
      cb(err, result);
      return;
    }

    var startsWith = new RegExp('^' + tokenize(searchTerm, false, true), 'i');
    var endsWith = new RegExp(tokenize(searchTerm, true, false) + '$', 'i');

    for (var i = 0; i < result.length; i++) {
      var o = result[i];
      o.weight = 0;

      // if it's an exact match: -
      if (o.name.toLowerCase() === searchTerm.toLowerCase()) {
        o.weight -= 1;
      }
      // if starts with: -
      if (o.name.match(startsWith)) {
        o.weight -= 1;
      }
      // if it ends with: +
      if (o.name.match(endsWith)) {
        o.weight += 1;
      }
    }

    var retVal = _.sortBy(result, (x) => x.weight + '_' + x.name).splice(0, 3);
    cb(err, retVal);
  });
}


export function create(o, cb) {
	svc.create(o,null, cb)
}


export function getAllForCache(cb) {
	svc.searchMany({}, { fields: fields.listCache }, cb)
}


export function getBySlug(slug, cb) {
	svc.searchOne({slug:slug},null, cb)
}


export function getTagPage(tag, cb) {
  PostsSvc.getByTag(tag, (ee,posts)=> {
    WorkshopsSvc.getByTag(tag.slug, (e,workshops)=> {
      var d = {
          tag,
          featured: {
            workshop: {
              url: '/angularjs/workshops/top-10-mistakes-angularjs-developers-make',
              title: 'The Top 10 Mistakes AngularJS Developers Make',
              speaker: { name: 'Mark Meyer', gravatar: '6c2f0695e0ca4445a223ce325c7fb970' }, //todo change to avatar
              time: new Date(2014,10,11),
            },
            post: {
              _id: "542c4b4f8e66ce0b00c885a4",
              by: { name: 'Todd Motto', avatar: '//0.gravatar.com/avatar/b56bb22b3a4b83c6b534b4c114671380', username: 'toddmotto' },
              url: '/angularjs/posts/angularjs-tutorial',
              title: 'AngularJS Tutorial: A Comprehensive 10,000 Word Guide',
              meta: {
                ogImage: '//i.imgur.com/GA8g15e.jpg',
                description: 'Written by Google Developer Expert (GDE) Todd Motto, this Angular tutorial serves as an ultimate resource for learning AngularJS.'
              },
              published: new Date(),
              tags: []
            },
          },
          about: {
            tagline: "AngularJS is an amazing framework for creating rich client-side applications.",
            quote: "Angular can be used to create sleek and crisp web applications with minimal amounts of code. Seeing as Angular.JS is a comparatively new framework, it is important to learn the basics, understand testing and get acquainted with best practices.",
            by: "Matias Niemelä, AirPair Experts and AngularJS Core Team Member",
            byPic: "//secure.gravatar.com/avatar/3c0ca2c60c5cc418c6b3dbed47b23b69"
          },
          experts: [
            {
              name: 'Ari Lerner',
              username: 'auser',
              avatar: 'https://avatars1.githubusercontent.com/u/529',
              tags: ['angularjs','ruby-on-rails','erlang'],
              bio: 'ng-book author',
              rate: '280'
            },
            {
              name: 'Matias Niemelä',
              username: 'matsko',
              avatar: '//secure.gravatar.com/avatar/3c0ca2c60c5cc418c6b3dbed47b23b69',
              tags: ['angularjs', 'html5', 'testing'],
              bio: 'AngularJS Core Team Member',
              rate: '280'
            },
            {
              name: 'Basarat Ali',
              username: 'basarat',
              avatar: '//secure.gravatar.com/avatar/1400be56ff17549b926dd3260da4a494',
              tags: ['typescript','javascript','angularjs'],
              bio: '',
              rate: '130'
            },
            {
              name: 'Todd Motto',
              username: 'toddmotto',
              avatar: '//secure.gravatar.com/avatar/b56bb22b3a4b83c6b534b4c114671380',
              tags: ['angularjs','chrome','html5'],
              bio: 'Google Developer Expert',
              rate: '250'
            },
            {
              name: 'Abe Haskins',
              username: 'abeisgreat',
              avatar: '//secure.gravatar.com/avatar/fbb79df0f24e736c8e37f9f195a738cc',
              tags: ['angularjs','firebase','angularfire'],
              bio: 'AngularFire Contributor',
              rate: '220'
            },
            {
              name: 'Uri Shaked',
              username: 'urish',
              avatar: '//secure.gravatar.com/avatar/fbf41c66afb1e3807b7b330c2d8fcc28',
              tags: ['angularjs', 'node.js', 'gulp'],
              bio: 'Google Developer Expert',
              rate: '160'
            },
            {
              name: 'Mark Meyer',
              username: 'nuclearghost',
              avatar: '//secure.gravatar.com/avatar/6c2f0695e0ca4445a223ce325c7fb970',
              tags: ['angularjs','angular-ui','ios'],
              bio: '',
              rate: '90'
            },
            {
              name: 'Fernando Villalobos',
              username: 'fervisa',
              avatar: '//secure.gravatar.com/avatar/0e74aa62f0a56b438237adf678eae3a0',
              tags: ['angularjs','coffeescript','ruby'],
              bio: '',
              rate: '40'
            }
          ],
          workshops,
          posts: posts.posts
        }

      d.workshops = _.sortBy(_.first(_.filter(d.workshops, (w) => w.time > new Date() ), 5), (w) => w.time)
      d.posts = _.first(d.posts, 5)
      d.featured.pairing = d.experts[0];

      cb(null, d)
    })
  })

  // svc.searchOne({slug:slug},null, (e,r) => {
  //   $log(r)
  //   cb(e,r)
  // })
}
