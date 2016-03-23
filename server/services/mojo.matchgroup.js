// var expertIds = []
// function exp(_id) {
//   expertIds = _.union(expertIds,[_id])
//   return _id
// }


// var mg = config.env != "test" ? {

//   'android': {
//     primary: 'android',
//     auto: [],
//     manual: [],
//     suggested: [
//       exp('51a6cc55960c490200000006'),//'Adam Bliss','abliss@gmail.com'),
//       exp('5314eb8d0599c70200000013'),//'Scott Alexander-Bown','123scottyb@googlemail.com'),
//       exp('53a8caf02f37250200b4b88a'),//'Yossi Elkrief','elkriefy@gmail.com'),
//       exp('52dadcbdf3e5820200000012'),//'Roger Stringer','freekrai@gmail.com'),
//       exp('550ac497b4533e0c006f6b04'),//'Pulkit Goyal','pulkit110@gmail.com'),
//       exp('5657097ed64e391200396764'),//'Nicolas De Smyter'
//     ]
//   },

//   'angularjs': {
//     primary: 'angularjs',
//     auto: [],
//     manual: ['angular-ui'],
//     suggested: [
//       exp('5395ecdb09353b020021bf24'),//'Uri Shaked','uri@salsa4fun.co.il'),
//       exp('5230d1a9746ee90200000018'),//'Ari Lerner','writeari@gmail.com'),
//       exp('53079b87506b3e020000003d'),//'Terry Tutt','terryt@pure-logic.com'),
//       exp('533afde08ae986020000000f'),//'Abraham Polishchuk','apolishc@gmail.com'),
//       exp('52f1bda790df5e0200000041'),//'Joe Fiorini','joe@joefiorini.com'),
//       exp('52c5c7a7c2b917020000001d'),//'Jason Swett','jason@benfranklinlabs.com'),
//       exp('5474a0a3c72bc30200545583'),//'Rahat Khanna','yehtechnologies@gmail.com'),
//       exp('52fb2ea294ba990200000037'),//'Basarat Ali','basaratali@gmail.com'),
//       exp('55fdd0e6f462271100458879'),//'Mehran Hatami','mehranhatamie@gmail.com'),
//       exp('52697bfb812fcd0200000014'),//'Ye Liu','yeliu84@gmail.com'),
//       exp('530f0d2967a7f9020000001e'),//'Benjamin Roth','benjamin@rubyist.fr'),
//       exp('5563bdcd29ae0d11007e2681'),//'Nathan Walker','walkerrunpdx@gmail.com'),
//       exp('522f3616b4b1c60200000041'),//'Backnol Yogendran','backnol@gmail.com'),
//       exp('5632042ae827aa1100e51d28'),//'David Rodenas'
//       exp('5657097ed64e391200396764'),//'Nicolas De Smyter'
//       exp('521bce214336a8020000003a'),//'Phillip R. Berger'
//     ]
//   },

//   'devops': {
//     primary: 'devops',
//     auto: [],
//     manual: ['elastic-beanstalk','jenkins','continuous-integration','aws','amazon-ec2','amazon-web-services','docker'],
//     suggested: [
//       exp('52f24f1890df5e0200000083'),//'Evgeny Zislis','evgeny@devops.co.il'),
//       exp('51b0f3a1aa6f420200000008'),//'Greg Osuri','gosuri@gmail.com'),
//       exp('5333a0de5ba0eb020000001b'),//'Jeff Kingyens','jeff.kingyens@gmail.com'),
//     ]
//   },

//   'ember.js': {
//     primary: 'ember.js',
//     auto: [],
//     manual: ['ember-data'],
//     suggested: [
//       exp('52267f2a7087f90200000008'),//'Michael Grassotti ','mgrassotti@gmail.com '),
//       exp('549f9d443a0ad90200e7a72e'),//'Brandon J McKay','themckaystudios@gmail.com'),
//       exp('52f1bda790df5e0200000041'),//'Joe Fiorini','joe@joefiorini.com')
//       exp('564f0d81f79b3a1200a2c297')//'Michael (Black) Ritter'
//     ]
//   },


//   'ios': {
//     primary: 'ios',
//     auto: ['ios8'],
//     manual: ['swift','objective-c','parse.com','apple-watch'],
//     suggested: [
//       exp('5359bef3c558c2020000002f'),//'Daniel Cestari','dcestari@gmail.com'),
//       exp('52f55c42a941960200000034'),//'Wain Glaiste','wain.glaister@googlemail.com'),
//       exp('530374960903650200000043'),//'Antonio Bello','jeden@elapsus.com'),
//       exp('52f3e3d34b04b30200000019'),//'Lou Franco','loumfranco@gmail.com'),
//       exp('550ac497b4533e0c006f6b04'),//'Pulkit Goyal','pulkit110@gmail.com'),
//       exp('52f22c15f9b3140200000072'),//'Ashish Awaghad','awaghad.ashish@gmail.com'),
//       exp('52f28deba36cc40200000009'),//'Josh Brown','josh@roadfiresoftware.com'),
//       exp('515b6eb4eb8547020000003e'),//'Jason Humphries','jack@prismatik.com.au'),
//       exp('528953641c60530200000011'),//'Giorgio Natili','g.natili@gnstudio.com'),
//       exp('52f4b81f4b04b30200000084'),//'Alexandre Rocha Lima e Marcondes','alexandre.marcondes@gmail.com'),
//       exp('530bbd360f7d3b0200000031'),//'Jeff Linwood','jlinwood@gmail.com'),
//       exp('550c62e5bbbbef0c004b559c'),//'Adam Cooper','adambco@me.com'),
//       exp('550c62e5bbbbef0c004b559c'),//'Josh Brown','josh@roadfiresoftware.com'),
//       exp('52192128ccf13e020000000d'),//Jonathan Dalrymple
//       exp('524c8b42a42aa00200000050'),//Aaron Crespo
//       exp('54482438c3a742020081e1eb'),//Nicholas Iannone
//     ]
//   },

//   'node.js': {
//     primary: 'node.js',
//     auto: ['npm'],
//     manual: ['gulp'],
//     suggested: [
//       exp('5395ecdb09353b020021bf24'),//Uri Shaked','uri@salsa4fun.co.il'),
//       exp('5181d4ccf3dc070200000004'),//Jonathon Kresner','jkresner@gmail.com'),
//       exp('533afde08ae986020000000f'),//Abraham Polishchuk','apolishc@gmail.com'),
//       exp('5182182138b8c00200000006'),//Alexandru Vladutu','alessio.ijoomla@gmail.com'),
//       exp('527bd0f6890b070200000006'),//Eric Mann','eric@eam.me'),
//       exp('5385c98596b0e10200bf038c'),//Jonathan Glock','glockjt@gmail.com'),
//       exp('55fdd0e6f462271100458879'),//Mehran Hatami','mehranhatamie@gmail.com'),
//     ]
//   },

//   'ruby-on-rails': {
//     primary: 'ruby-on-rails',
//     auto: ['ruby-on-rails-4','ruby-on-rails-3.2','ruby-on-rails-3.1','ruby-on-rails-3'],
//     manual: ['rake','rspec','ruby'],
//     suggested: [
//       exp('51d5683b0c857e020000000e'),//'Pedro Nascimento'
//       exp('522f3616b4b1c60200000041'),//'Backnol Yogendran','backnol@gmail.com'),
//       exp('54c85ee6a4f65e03005d1640'),//'Thomas Beihl','tmbeihl@tmbeihl.com'),
//       exp('52d6053a174f2a0200000019'),//'Jared Smith','jared.smith88@me.com'),
//       // exp('55d4e3036f46da1100318af9'),//'Charles Wood','chuck@devchat.tv'),
//       exp('530f0d2967a7f9020000001e'),//'Benjamin Roth','benjamin@rubyist.fr'),
//       exp('52127d5fc6a5870200000007'),//'Ra\'Shaun Stovall','rashaunstovall@gmail.com'),
//       exp('549f9d443a0ad90200e7a72e'),//'Brandon J McKay','themckaystudios@gmail.com'),
//       exp('5468a10302bae60200444e47'),//'Ivan Turkovic','ivan.turkovic@gmail.com'),
//       exp('52286f4fcf430c0200000011'),//'Marek Publicewicz','kingeri@gmail.com'),
//       exp('55b00cb5841879110096f2b4'),//'Adam Lieskovsky','adamliesko@gmail.com'),
//       exp('56623ab5b1a9981100f60652'),//Len Smith
//       exp('53fcc9ae1b6f310200a53ea2'),//Joanne Cheng
//     ]
//   },

//   'html': {
//     primary: 'html',
//     auto: ['html5','css','css3'],
//     manual: ['javascript'],
//     suggested: [
//       exp('52127d5fc6a5870200000007'),//'Ra\'Shaun Stovall','rashaunstovall@gmail.com'),
//       exp('549f9d443a0ad90200e7a72e'),//'Brandon J McKay','themckaystudios@gmail.com'),
//       exp('550224e596bc290c00ccf0a5'),//'Rich McLaughlin','rsmclaug@gmail.com'),
//       // exp('537a8e0c77bbd10200a70b0f'),//'Anatoliy Zaslavskiy','adz@nycitt.com"'),
//       exp('521bce214336a8020000003a'),//'Phillip R. Berger'
//     ]
//   },

//   'reactjs': {
//     primary: 'reactjs',
//     auto: [],
//     manual: ['react','react-native'],
//     suggested: [
//       exp('563135ece770281100006233'),//'Alexandre Kirszenberg'
//       exp('533afde08ae986020000000f'),//'Abraham Polishchuk','apolishc@gmail.com'),
//       exp('55b907fe6480e81100a60279'),//'Gordon Dent','gordonmdent@gmail.com'),
//       exp('5230d1a9746ee90200000018'),//'Ari Lerner','writeari@gmail.com'),
//       exp('557216ce825eb311004fa2fc'),//'Frankie Bagnardi','f.bagnardi@gmail.com'),
//       exp('56623ab5b1a9981100f60652'),//Len Smith
//     ]
//   },

//   'php': {
//     primary: 'php',
//     auto: ['lamp'],
//     manual: ['laravel','codeigniter'],
//     suggested: [
//       exp('522551df1f86bf0200000008'),//'Jorge Colon','2upmedia@gmail.com'),
//       exp('527bd0f6890b070200000006'),//'Eric Mann','eric@eam.me')
//     ]
//   },

//   'python': {
//     primary: 'python',
//     auto: ['python-2.7'],
//     manual: ['django'],
//     suggested: [
//       exp('52cd93103237b10200000013'),//'Daniel Roseman','daniel@roseman.org.uk'),
//       exp('524c772818a667020000002a'),//'Ryan Brown','ryan.sc.brown@gmail.com'),
//       exp('53448a6e77a084020000002b'),//'J.J. Fliegelman','jdotjdot89@gmail.com'),
//       exp('5490b830708910020084fe7f'),//'Patrick Salami','freerick@gmail.com'),
//     ]
//   },

// } : {}


// DAL.Expert.getManyById(expertIds, {select:'_id availability rate userId',join:{userId:'name email'}}, (e, experts) => {
//   for (var tech in mg) {
//     mg[tech].suggested = mg[tech].suggested.map(exp => {
//       var expert = _.find(experts, ex => _.idsEqual(exp, ex._id))
//       if (!expert) $log('none', exp)
//       if (expert.user) {
//         Object.assign(expert, expert.user, {_id: expert._id })
//         delete expert.user
//       }
//       return expert
//     }).filter( o =>
//       o.availability &&
//       o.availability.updated &&
//       o.availability.status == 'ready' )

//     $log('automatch'.gray, `${tech} (${mg[tech].auto.join(',')})`.white, _.pluck(mg[tech].suggested,'name').join(', '))
//   }
// })

// module.exports = mg
