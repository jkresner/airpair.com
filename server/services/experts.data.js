// import * as md5           from '../util/md5'
var util =    require('../../shared/util')


var select = {
  matches: {
    '_id': 1,
    'name': 1,
    'email': 1,
    'tags._id': 1,
    'tags.short': 1,
    'rate': 1,
    'minRate': 1,
    'gh.username': 1,
    'so.link': 1,
    'bb.id': 1,
    'in.id': 1,
    'tw.username': 1
  },
  search: {
    '_id': 1,
    'name': 1,
    'email': 1,
    'username': 1,
    'tags.short': 1,
    'bookMe.urlSlug': 1
  }
}

module.exports = {

  select: {
    matches: select.matches,
    search: select.search,
  },

  query: {
  },

  options: {
  },

  data: {
    getForExpertsPage: {
      experts: [
        {
          _id: '5230d1a9746ee90200000018',
          name: 'Ari Lerner',
          username: 'auser',
          avatar: 'https://avatars1.githubusercontent.com/u/529',
          tags: ['angularjs','ruby-on-rails','erlang'],
          bio: 'ng-book author',
          rate: 280
        },
        {
          _id: '524304901c9b0f0200000012',
          name: 'Matias Niemelä',
          username: 'matsko',
          avatar: '//secure.gravatar.com/avatar/3c0ca2c60c5cc418c6b3dbed47b23b69',
          tags: ['angularjs', 'html5', 'testing'],
          bio: 'AngularJS Core Team Member',
          rate: 280
        },
        {
          _id: '52fb2ea294ba990200000037',
          name: 'Basarat Ali',
          username: 'basarat',
          avatar: '//secure.gravatar.com/avatar/1400be56ff17549b926dd3260da4a494',
          tags: ['typescript','javascript','angularjs'],
          bio: '',
          rate: 130
        },
        {
          _id: '52728efff7f1d4020000001a',
          name: 'Todd Motto',
          username: 'toddmotto',
          avatar: '//secure.gravatar.com/avatar/b56bb22b3a4b83c6b534b4c114671380',
          tags: ['angularjs','chrome','html5'],
          bio: 'Google Developer Expert',
          rate: 250
        },
        {
          _id: '532950ab264a24020000001f',
          name: 'Abe Haskins',
          username: 'abeisgreat',
          avatar: '//secure.gravatar.com/avatar/fbb79df0f24e736c8e37f9f195a738cc',
          tags: ['angularjs','firebase','angularfire'],
          bio: 'AngularFire Contributor',
          rate: 220
        },
        {
          _id: '5395ecdb09353b020021bf24',
          name: 'Uri Shaked',
          username: 'urish',
          avatar: '//secure.gravatar.com/avatar/fbf41c66afb1e3807b7b330c2d8fcc28',
          tags: ['angularjs', 'node.js', 'gulp'],
          bio: 'Google Developer Expert',
          rate: 160
        },
        {
          _id: '52f16191b437df020000003d',
          name: 'Mark Meyer',
          username: 'nuclearghost',
          avatar: '//secure.gravatar.com/avatar/6c2f0695e0ca4445a223ce325c7fb970',
          tags: ['angularjs','angular-ui','ios'],
          bio: '',
          rate: 90
        },
        {
          _id: '5387a1e7e558890200722fd5',
          name: 'Fernando Villalobos',
          username: 'fervisa',
          avatar: '//secure.gravatar.com/avatar/0e74aa62f0a56b438237adf678eae3a0',
          tags: ['angularjs','coffeescript','ruby'],
          bio: '',
          rate: 40
        }
      ]
    }
  }

}
