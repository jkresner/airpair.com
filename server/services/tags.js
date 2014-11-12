import Svc from '../services/_service'
import Tag from '../models/tag'
import * as WorkshopsSvc from './workshops'


var logging = false
var svc = new Svc(Tag, logging)


var fields = {
	listCache: { '_id':1, name: 1, slug: 1 },
	search: { '_id': 1, 'name': 1, 'slug': 1, 'desc': 1, 'tokens': 1, 'short': 1 }
}


function encode(term) {
  if (!term) return term;
  return term.replace(/[-\/\\^$*+?.()|[\]{}+]/g, '\\$&');
}


function tokenize(term, wildcardStart, wildcardEnd) {
  if (!term) return '.*';

  var regex = '';
  if (wildcardStart) regex += '.*';

  var tokens = term.split(' ');
  if (tokens) regex += tokens.join('.*');
  else regex += term;

  if (wildcardEnd) regex += '.*';

  return regex;
}


function isMatchOnWeightedFields(tag, regex) {
  if (tag.name && tag.name.match(regex)) return true;
  if (tag.short && tag.short.match(regex)) return true;
  if (tag.slug && tag.slug.match(regex)) return true;
  return false;
}


export function search(searchTerm, cb) {
  if (searchTerm) searchTerm = searchTerm.replace(/-/g, ' ');
  var encodedTerm = encode(searchTerm)

  var regex = new RegExp(tokenize(encodedTerm, true, true), 'i');
  var exactMatch = new RegExp('^' + encodedTerm + '$', 'i');
  var startsWith = new RegExp('^' + encodedTerm + '[^-]', 'i');

  var query = { $or: [{name: regex},{short: regex},{tokens: regex}] };
	var opts = { fields: fields.search, limit: 10 }

	svc.searchMany(query, opts, function(err, result) {
    if (err) {
      cb(err, result);
      return;
    }

    for (var i = 0; i < result.length; i++) {
      var tag = result[i];
      tag.weight = 0;

      // if it's an exact match: -
      if (isMatchOnWeightedFields(tag, exactMatch)) {
        tag.weight -= 1;
      }
      // if starts with: -
      if (isMatchOnWeightedFields(tag, startsWith)) {
        tag.weight -= 1;
      }
    }

    var retVal = _.sortBy(result, (x) => x.weight).splice(0, 3);
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
  WorkshopsSvc.getByTag(tag.slug, (e,workshops)=>{
    cb(null,
      {
        tag,
        featured: {
          pairing: {
            name: 'Ari Lerner',
            username: 'auser',
            avatar: 'https://avatars1.githubusercontent.com/u/529'
          }
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
            tags: []
          },
          {
            name: 'Matias Niemelä',
            username: 'matsko',
            avatar: '//secure.gravatar.com/avatar/3c0ca2c60c5cc418c6b3dbed47b23b69',
            tags: []
          },
          {
            name: 'Basarat Ali',
            username: 'basarat',
            avatar: '//secure.gravatar.com/avatar/1400be56ff17549b926dd3260da4a494',
            tags: []
          },
          {
            name: 'Todd Motto',
            username: 'toddmotto',
            avatar: '//secure.gravatar.com/avatar/b56bb22b3a4b83c6b534b4c114671380',
            tags: []
          },
          {
            name: 'Abe Haskins',
            username: 'abeisgreat',
            avatar: '//secure.gravatar.com/avatar/fbb79df0f24e736c8e37f9f195a738cc',
            tags: []
          },
          {
            name: 'Uri Shaked',
            username: 'urish',
            avatar: '//secure.gravatar.com/avatar/fbf41c66afb1e3807b7b330c2d8fcc28',
            tags: []
          }
        ],
        workshops
      }
    )
  })

  // svc.searchOne({slug:slug},null, (e,r) => {
  //   $log(r)
  //   cb(e,r)
  // })
}
