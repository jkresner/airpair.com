import Svc from '../services/_service2'
import Post from '../models/post'
import generateToc from './postsToc'

var logging = false

var svc = new Svc(Post, logging)

var posts = [	
  { id: '09.04', tag: 'javscript', title: 'Migrating CoffeeScript to ES6 JavaScript', by: 'hackerpreneur' },
  { id: '09.03', tag: 'angularjs', title: 'AngularJS CDN Architecture', by: 'hackerpreneur' },
  { id: '09.02', tag: 'angularjs', title: 'Getting started with AngularJS 1.3', by: 'hackerpreneur' },
  { id: '09.01', tag: 'javascript', title: 'Using ES6 Harmony with NodeJS', by: 'hackerpreneur' },
  { id: '08.28', tag: 'angularjs', title: 'Setting up my First AngularJS App', by: 'hackerpreneur' },
  { id: '08.27', tag: 'mean-stack', title: 'Starting a Mean Stack App', by: 'hackerpreneur' }
];

for (var p of posts) 
{
  p.date = moment(p.id+'2014','MM.DDYYYY');
  p.published = p.date.format('DD MMMM, YYYY');	
  p.slug = `/${p.tag}/${p.title.toLowerCase().replace(/ /g, '-')}`;
  p.url = `/posts${p.slug}`;
}

export function getAll(cb) {
  return cb(null, posts)
}


export function getById(id, cb) {
  svc.getById( id, cb ) 
}

export function getUsersPosts(id, cb) {
  svc.searchMany({by:id},{ fields: { title:1, slug: 1, created: 1 } },cb) 
}

export function getTableOfContents(markdown, cb) {
  var toc = generateToc(markdown);
  return cb(null, {toc:toc})
}


export function create(o, cb) {
  o.created = new Date()
  o.by = this.user._id
  svc.create(o, cb) 
}


export function update(id, o, cb) {
  o.updated = new Date()
  
  //-- todo, authorization for owner or editor (maybe using params?)

  svc.update(id, o, cb) 
}