function exp(_id,minRate,name,email) {return {_id,email,name,minRate} }

var mg = {

  angularjs: {
    primary: 'angularjs',
    auto: [],
    manual: ['angular-ui'],
    suggested: [
      exp('5395ecdb09353b020021bf24',160,'Uri Shaked','uri@salsa4fun.co.il'),
      exp('5230d1a9746ee90200000018',160,'Ari Lerner','writeari@gmail.com'),
      exp('522f3616b4b1c60200000041',80 ,'Backnol Yogendran','backnol@gmail.com'),
      exp('53d2cb524e3fbd0200510790',110,'Jason Katzer','jkatzer@gmail.com'),
      exp('53079b87506b3e020000003d',80 ,'Terry Tutt','terryt@pure-logic.com'),
      exp('533afde08ae986020000000f',80 ,'Abraham Polishchuk','apolishc@gmail.com'),
      exp('52c5c7a7c2b917020000001d',110,'Jason Swett','jason@benfranklinlabs.com'),
      exp('52a70e9e2320fe0200000030',150,'Charles Wood','chuck@devchat.tv'),
      exp('5474a0a3c72bc30200545583',80 ,'Rahat Khanna','yehtechnologies@gmail.com'),
      exp('52fb2ea294ba990200000037',110,'Basarat Ali','basaratali@gmail.com'),
      exp('52697bfb812fcd0200000014',70 ,'Ye Liu','yeliu84@gmail.com'),
      exp('530f0d2967a7f9020000001e',160,'Benjamin Roth','benjamin@rubyist.fr'),
      exp('5563bdcd29ae0d11007e2681',80 ,'Nathan Walker','walkerrunpdx@gmail.com'),
      exp('52e142ef6efc05020000000c',80 ,'Randall Bennett','randall@vidpresso.com'),
    ]
  },

  'ruby-on-rails': {
    primary: 'ruby-on-rails',
    auto: ['ruby-on-rails-4'],
    manual: ['ruby'],
    suggested: [
      exp('522f3616b4b1c60200000041',80 ,'Backnol Yogendran','backnol@gmail.com'),
      exp('54c85ee6a4f65e03005d1640',80 ,'Thomas Beihl','tmbeihl@tmbeihl.com'),
      exp('52d6053a174f2a0200000019',80 ,'Jared Smith','jared.smith88@me.com'),
      exp('530f0d2967a7f9020000001e',160,'Benjamin Roth','benjamin@rubyist.fr'),
      exp('534c491a06ca20020000000d',160,'Ernie Miller','ernie@erniemiller.org'),
      exp('52127d5fc6a5870200000007',80 ,"Ra'Shaun Stovall",'rashaunstovall@gmail.com'),
    ]
  },

  html: {
    primary: 'html',
    auto: ['html5','css','css3'],
    manual: ['javascript'],
    suggested: [
      exp('549f9d443a0ad90200e7a72e',80 ,'Brandon J McKay','themckaystudios@gmail.com'),
      exp('550224e596bc290c00ccf0a5',80 ,'Rich McLaughlin','rsmclaug@gmail.com'),
      exp('537a8e0c77bbd10200a70b0f',80 ,'Anatoliy Zaslavskiy','adz@nycitt.com"'),
    ]
  },

  reactjs: {
    primary: 'reactjs',
    auto: [],
    manual: ['react','react-native'],
    suggested: [
      exp('55b907fe6480e81100a60279',80 ,'Gordon Dent','gordonmdent@gmail.com'),
      exp('5230d1a9746ee90200000018',160,'Ari Lerner','writeari@gmail.com'),
      exp('557216ce825eb311004fa2fc',90 ,'Frankie Bagnardi','f.bagnardi@gmail.com'),
    ]
  },

  python: {
    primary: 'python',
    auto: ['python-2.7'],
    manual: ['django'],
    suggested: [
      exp('53d2cb524e3fbd0200510790',110,'Jason Katzer','jkatzer@gmail.com'),
      exp('52cd93103237b10200000013',110,'Daniel Roseman','daniel@roseman.org.uk'),
      exp('524c772818a667020000002a',110,'Ryan Brown','ryan.sc.brown@gmail.com'),
      exp('53448a6e77a084020000002b',80 ,'J.J. Fliegelman','jdotjdot89@gmail.com'),
      exp('5490b830708910020084fe7f',80 ,'Patrick Salami','freerick@gmail.com'),
    ]
  },

  ios: {
    primary: 'ios',
    auto: ['ios8'],
    manual: ['swift','objective-c','parse.com'],
    suggested: [
      exp('5359bef3c558c2020000002f',110,'Daniel Cestari','dcestari@gmail.com'),
      exp('52f55c42a941960200000034',160,'Wain Glaiste','wain.glaister@googlemail.com'),
      exp('53d2cb524e3fbd0200510790',110,'Jason Katzer','jkatzer@gmail.com'),
      exp('530374960903650200000043',80,'Antonio Bello','jeden@elapsus.com'),
      exp('52f3e3d34b04b30200000019',110,'Lou Franco','loumfranco@gmail.com'),
      exp('524c962fa42aa0020000006d', 80,'Zachary Tschirhart','ztschir@gmail.com'),
      exp('550ac497b4533e0c006f6b04', 80,'Pulkit Goyal','pulkit110@gmail.com'),
      exp('52f22c15f9b3140200000072',110,'Ashish Awaghad','awaghad.ashish@gmail.com'),
      exp('52f28deba36cc40200000009',110,'Josh Brown','josh@roadfiresoftware.com'),
      exp('515b6eb4eb8547020000003e',110,'Jason Humphries','jack@prismatik.com.au'),
      exp('528953641c60530200000011', 80,'Giorgio Natili','g.natili@gnstudio.com'),
      exp('52f4b81f4b04b30200000084', 80,'Alexandre Rocha Lima e Marcondes','alexandre.marcondes@gmail.com'),
      exp('530bbd360f7d3b0200000031', 80,'Jeff Linwood','jlinwood@gmail.com'),
    ]
  },

  android: {
    primary: 'android',
    auto: [],
    manual: [],
    suggested: [
      exp('51a6cc55960c490200000006',120,'Adam Bliss','abliss@gmail.com'),
      exp('5314eb8d0599c70200000013',120,'Scott Alexander-Bown','123scottyb@googlemail.com'),
      exp('53a8caf02f37250200b4b88a', 80,'Yossi Elkrief','elkriefy@gmail.com'),
      exp('52dadcbdf3e5820200000012', 80,'Roger Stringer','freekrai@gmail.com'),
      exp('550ac497b4533e0c006f6b04', 80,'Pulkit Goyal','pulkit110@gmail.com'),
    ]
  }
}

module.exports = mg
