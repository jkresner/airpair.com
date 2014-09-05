var posts = [	
  { id: '09.04', tag: 'javscript', title: 'Migrating CoffeeScript to ES6 JavaScript', by: 'hackerpreneur' },
  { id: '09.03', tag: 'angularjs', title: 'AngularJS Basics', by: 'hackerpreneur' },
  { id: '09.02', tag: 'angularjs', title: 'Getting started with AngularJS 1.3', by: 'hackerpreneur' },
  { id: '09.01', tag: 'javascript', title: 'Using ES6 Harmony with NodeJS', by: 'hackerpreneur' },
  { id: '08.28', tag: 'angularjs', title: 'Setting up my First AngularJS App', by: 'hackerpreneur' },
  { id: '08.27', tag: 'mean-stack', title: 'Starting a Mean Stack App', by: 'hackerpreneur' }
];

for (var p of posts) 
{
  p.date = moment(p.id+'2014','MM.DDYYYY');
  p.published = p.date.format('DD MMMM, YYYY');	
  p.url = `/posts/${p.tag}/${p.title.toLowerCase().replace(/ /g, '-')}`;
}

export var posts;
