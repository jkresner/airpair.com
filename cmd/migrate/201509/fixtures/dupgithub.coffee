nonCategorizedUsers =
# 1503.11 54fef6be91529e0c00f388f9          dhavaln    dhaval.b.nagar@gmail.com Dhaval Nagar,
# 1503.11 54fef62b64d9df0c005df0c7          dhavaln    dhaval@jumpbyte.com      Dhaval Nagar
  dhavaln:
    U: G: 207155, A: '54fef6be91529e0c00f388f9', B: '54fef62b64d9df0c005df0c7'
    O: linked: { gp: { email:'dhaval.b.nagar@gmail.com'} }, username: 'dhavaln'
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('dhaval.b.nagar@gmail.com')
# 1505.05 55479d1ce8420211002bcb54          citylims    austin.formica@pinchfavor.com  Austin Formica,
# 1504.01 551b42f710cb481100e321dd          citylims    austin.formica@gmail.com Austin Formica
  citylims:
    U: G: 4462029, A: '551b42f710cb481100e321dd', B: '55479d1ce8420211002bcb54'
    O: linked: { gp: { email:'austin.formica@gmail.com'} }, initials: "amf"
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('austin.formica@gmail.com')
# 1507.01 5592cdff0ae3231100ce5434          azukileo     gokuriny@gmail.com gogo gokkun,
# 1504.15 552e0917b888611100d76af3          azukileo     azukileo@gmail.com Leo Azuki
  azukileo:
    U: G: 4111068, A: '552e0917b888611100d76af3', B: '5592cdff0ae3231100ce5434'
    O: linked: { gp: { email:'azukileo@gmail.com'} }, name: "Leo Azuki", username: 'azukileo'
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('azukileo@gmail.com')
# 1505.24 5560e37915503911000425d8          curvenut     ltyqcca@gmail.com      Curvenut Cur,
# 1505.24 5560e2c3034d3311000fc5bf          curvenut     yleungtack@gmail.com   Yves Leung-Tack
  curvenut:
    U: G: 1280289, A: '5560e2c3034d3311000fc5bf', B: '5560e37915503911000425d8'
    O: linked: { gp: { email:'yleungtack@gmail.com'} }, name: "Yves Leung-Tack"
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('yleungtack@gmail.com')
# 1505.16 5556546a0dd191110059c452          elliotf    efoster@firetaco.com      Elliot Foster
# 1505.16 555648990dd191110059c2cd          elliotf    efoster@shutterstock.com  Elliot Foster
  elliotf:
    U: G: 22679, A: '555648990dd191110059c2cd', B: '5556546a0dd191110059c452'
    O: linked: { gp: { email:'efoster@shutterstock.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('efoster@shutterstock.com')


authors =
  uglow:
    U: G: 3990189, A: '54f9fcc05c01080c008ee02c', B: '54fa85995c01080c008eedc5'
    O: linked: { gp: { email:'blenzo@paychex.com' } }, username: 'uglow'
    R: posts:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('blenzo@paychex.com')
  thestubborndev:
    U: G: 1705132, A: '53b5cb068f8c80299bcc378a', B: '55c39acb82dca1110089908f'
    O: linked: { gp: { email:'carlotta.tatti@gmail.com' } }, username: 'thestubborndev'
    R: posts:1,paymethods:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('carlotta.tatti@gmail.com')


singleProfileExperts =
# 1506.10 5577bfb4fc784111004ea1f4   E R1   itzrahulsoni     itzrahulsoni@gmail.com   Rahul Soni
# 1506.10 5577bb7efc784111004ea15d          itzrahulsoni     rahul@attosol.com        Rahul Soni
  itzrahulsoni:
    U: G: 6227719, A: '5577bfb4fc784111004ea1f4', B: '5577bb7efc784111004ea15d'
    O: linked: { gp: { email:'itzrahulsoni@gmail.com'} }, username: 'imRahulSoni'
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('itzrahulsoni@gmail.com')
# 1507.06 5599dee617989811002b22b5     E       shelbyd     shelbydoolittle@shelbyd.com  Shelby Doolittle,
# 1502.11 54dad2ed02217f0a0017d1a4             shelbyd     shelby@shelbyd.com           Shelby Doolittle
  shelbyd:
    U: G: 5272847, A: '5599dee617989811002b22b5', B: '54dad2ed02217f0a0017d1a4'
    O: linked: { gp: { email:'frasermince@gmail.com'} }, username: 'shelbyd'
    R: suggests:2, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('shelbydoolittle@shelbyd.com')
      expectExactFields(merged.user.linked,['password','in','tw','gh','gp'])
# 1502.01 54cce4cd3121ce0900ed2f36     E R1    daviskoh    koh.davis.0@gmail.com      Davis Koh,
# 1411.11 546193708f8c80299bcc4fa0             daviskoh    davis.koh@crowdsurge.com   Davis Koh
  daviskoh:
    U: G: 5395403, A: '54cce4cd3121ce0900ed2f36', B: '546193708f8c80299bcc4fa0'
    O: linked: { gp: { email:'koh.davis.0@gmail.com'} }
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('koh.davis.0@gmail.com')
# 1410.26 544ca2fd8f8c80299bcc4d4c     E       frasermince    frasermince@gmail.com  Fraser Mince,
# 1409.15 54164e238f8c80299bcc4741             frasermince    fraser@causelabs.co    Fraser Mince
  frasermince:
    U: G: 3620683, A: '544ca2fd8f8c80299bcc4d4c', B: '54164e238f8c80299bcc4741'
    O: linked: { gp: { email:'frasermince@gmail.com'} }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('frasermince@gmail.com')
# 1405.20 537a7bef1c67d1a4859d3264             marchant     benoit@montagestudio.com Benoit Marchant,
# 1403.02 531235161c67d1a4859d25f8     E       marchant     benoit@declarativ.com  Benoit Marchant
  marchant:
    U: G: 367788, A: '531235161c67d1a4859d25f8', B: '537a7bef1c67d1a4859d3264'
    O: linked: { gp: { email:'benoit@declarativ.com'} }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('benoit@declarativ.com')
# 1408.01 53dab5648f8c80299bcc3d16     E       nickick    hong.nick@gmail.com  NH,
# 1408.01 53dab5218f8c80299bcc3d15             nickick    nick.hong@therealreal.com  NH
  nickick:
    U: G: 1316662, A: '53dab5648f8c80299bcc3d16', B: '53dab5218f8c80299bcc3d15'
    O: linked: { gp: { email:'hong.nick@gmail.com'} }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('hong.nick@gmail.com')
# 1408.05 53e005ab8f8c80299bcc3e55     E       markoan    marco@interastar.com Marco Villaseñor,
# 1404.26 535b19e01c67d1a4859d2f9b             markoan    marco@villasenor.net Marco
  markoan:
    U: G: 833852, A: '53e005ab8f8c80299bcc3e55', B: '535b19e01c67d1a4859d2f9b'
    O: linked: { gp: { email:'marco@interastar.com'} }, name: 'Marco Villaseñor'
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('marco@interastar.com')
# 1406.17 53a03e7b1c67d1a4859d3530             oroce    robert@oroszi.net  Róbert Oroszi,
# 1406.16 539e16fe1c67d1a4859d34f1     E       oroce    oroszi.robert@gmail.com  Róbert Oroszi
  oroce:
    U: G: 462848, A: '53a03e7b1c67d1a4859d3530', B: '539e16fe1c67d1a4859d34f1'
    O: linked: { gp: { email:'robert@oroszi.net' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('robert@oroszi.net')
# 1404.23 5356c2091c67d1a4859d2e83     E       austinfromboston     austin@omadahealth.com Austin Putman,
# 1404.15 534c31e11c67d1a4859d2d32             austinfromboston     austinfromboston@gmail.com Austin Putman
  austinfromboston:
    U: G: 2930, A: '534c31e11c67d1a4859d2d32', B: '5356c2091c67d1a4859d2e83'
    O: linked: { gp: { email:'austinfromboston@gmail.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('austinfromboston@gmail.com')
# 1401.26 52e4d9af1c67d1a4859d1d96             mreinsch     michael@doorkeeper.jp  Michael Reinsch,
# 1309.04 5226a0ee66a6f999a465f755     E       mreinsch     micha.reinsch@gmail.com  Michael Reinsch
  mreinsch:
    U: G: 33982, A: '5226a0ee66a6f999a465f755', B: '52e4d9af1c67d1a4859d1d96'
    O: linked: { gp: { email:'micha.reinsch@gmail.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('micha.reinsch@gmail.com')
# 1311.22 528e1f2866a6f999a465fc05             mcmorgan     marcel.morgan@verdacom.com Marcel Morgan,
# 1311.22 528e1d9e66a6f999a465fc04     E       mcmorgan     marcel.morgan@codedry.com  Marcel Morgan
  mcmorgan:
    U: G: 371739, A: '528e1d9e66a6f999a465fc04', B: '528e1f2866a6f999a465fc05'
    O: linked: { gp: { email:'marcel.morgan@codedry.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('marcel.morgan@codedry.com')
# 1404.29 535f15fa1c67d1a4859d2ff3             jdoconnor    jaydoconnor@gmail.com  Jay OConnor,
# 1404.24 535847251c67d1a4859d2ef7     E       jdoconnor    jay@bellycard.com  Jay OConnor
  jdoconnor:
    U: G: 348383, A: '535f15fa1c67d1a4859d2ff3', B: '535847251c67d1a4859d2ef7'
    O: linked: { gp: { email:'jaydoconnor@gmail.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jaydoconnor@gmail.com')
# 1408.08 53e3b6128f8c80299bcc3f8e     E       mhayes     mark@deployfx.com  Mark Hayes,
# 1402.05 52f15c9a1c67d1a4859d1ee0             mhayes     mark@zurb.com  Mark Hayes
  mhayes:
    U: G: 125222, A: '53e3b6128f8c80299bcc3f8e', B: '52f15c9a1c67d1a4859d1ee0'
    O: linked: { gp: { email:'mark@deployfx.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('mark@deployfx.com')
# 1402.05 52f214001c67d1a4859d204d             OAGr     ozzie@bowlabs.org            Ozzie Gooen,
# 1308.04 51fd2f4666a6f999a465f4d5     E R3    OAGr     abridginginfinity@gmail.com  Ozzie Gooen
  OAGr:
    U: G: 377065, A: '51fd2f4666a6f999a465f4d5', B: '52f214001c67d1a4859d204d'
    O: linked: { gp: { email:'abridginginfinity@gmail.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('abridginginfinity@gmail.com')
# 1403.30 5337f0c61c67d1a4859d2ab6     E R9    ranman     randallhunt@gmail.com      J. Randall Hunt,
# 1403.17 53266f2d1c67d1a4859d27fb             ranman     randall.hunt@10gen.com     J. Randall Hunt
  ranman:
    U: G: 175163, A: '5337f0c61c67d1a4859d2ab6', B: '53266f2d1c67d1a4859d27fb'
    O: linked: { gp: { email:'randallhunt@gmail.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('randallhunt@gmail.com')
# 1406.18 53a1121d1c67d1a4859d3551             shama    kyle@dontkry.com           Kyle Robinson Young,
# 1402.07 52f422a31c67d1a4859d217d     E R4    shama    kyletyoungemail@gmail.com  Kyle Robinson Young
  shama:
    U: G: 99604, A: '52f422a31c67d1a4859d217d', B: '53a1121d1c67d1a4859d3551'
    O: linked: { gp: { email:'kyletyoungemail@gmail.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('kyletyoungemail@gmail.com')
# 1404.12 53491d831c67d1a4859d2cf8     E R2    jsunpe     jsunpe@gmail.com             Jsun Pe,
# 1404.12 534916a01c67d1a4859d2cf7             jsunpe     jsun.pe@systempartners.com   Jsun Pe
  jsunpe:
    U: G: 4621167, A: '53491d831c67d1a4859d2cf8', B: '534916a01c67d1a4859d2cf7'
    O: linked: { gp: { email:'jsunpe@gmail.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jsunpe@gmail.com')
# 1502.13 54dde7273d97840a0000cf67     E R2    mansona    chris@bloo.ie  Chris Manson,
# 1406.02 538b592e1c67d1a4859d337d             mansona    chris@manson.ie  Chris Manson
  mansona:
    U: G: 594890, A: '538b592e1c67d1a4859d337d', B: '54dde7273d97840a0000cf67'
    O: linked: { gp: { email:'chris@manson.ie' } }, username: 'mansona'
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('chris@manson.ie')
# 1402.06 52f286021c67d1a4859d20cd             sjlu     steve@urbancompass.com Steven Lu,
# 1308.09 52044bee66a6f999a465f53a     E R11   sjlu     tacticalazn@gmail.com  Steven Lu
  sjlu:
    U: G: 329917, A: '52044bee66a6f999a465f53a', B: '52f286021c67d1a4859d20cd'
    O: linked: { gp: { email:'tacticalazn@gmail.com' } }
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('tacticalazn@gmail.com')
# 1508.14 55cd8019dcb9e91100e80e43             evilbuck     buckleyrobinson@gmail.com  buckley robinson,
# 1404.25 535976871c67d1a4859d2f64     E R2    evilbuck     buck2769@gmail.com         Evil Buck
  evilbuck:
    U: G: 12896, A: '55cd8019dcb9e91100e80e43', B: '535976871c67d1a4859d2f64'
    O: linked: { gp: { email:'buckleyrobinson@gmail.com' } }, name: "Buckley Robinson"
    R: fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('buckleyrobinson@gmail.com')
      expect(merged.user.name).to.equal('Buckley Robinson')


easyDoubleProfileExperts =
# 1404.06 5340d87e1c67d1a4859d2bf1   E         mattallen    matta@lookahead.com.au Matt Allen,
# 1310.08 52535eba66a6f999a465f99d   E         mattallen    matt.allen@gmail.com Matt Allen
  mattallen:
    U: G: 398, A: '52535eba66a6f999a465f99d', B: '5340d87e1c67d1a4859d2bf1', E: ''
    O: linked: { gp: { email:'matt.allen@gmail.com'} }
    R: suggests: 0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('matt.allen@gmail.com')
# 1408.10 53e708578f8c80299bcc4064     E      AbstractSoft    eduard.ghergu@visma.com  Eduard Ghergu,
# 1408.10 53e7023e8f8c80299bcc4061     E      AbstractSoft    ghergu@gmail.com         Eduard Ghergu
  AbstractSoft:
    U: G: 6548696, A: '53e7023e8f8c80299bcc4061', B: '53e708578f8c80299bcc4064', E: '53e7029268419202002e0fb4'
    O: linked: { gp: { email:'ghergu@gmail.com'} }
    R: suggests: 0, fn:({merged,removed}) ->
      expectExactFields(merged.user.linked,['in','tw','gh','gp'])
      expect(merged.user.email).to.equal('ghergu@gmail.com')
#  1406.18 53a189361c67d1a4859d3558     E      itzmukeshy7    itzmukeshy7@gmail.com  Mukesh Yadav
#  1402.24 530aea1e1c67d1a4859d249b     E R1   itzmukeshy7    mukesh.y@webcontxt.com Mukesh Yadav
  itzmukeshy7:
    U: G: 5780768, A: '530aea1e1c67d1a4859d249b', B: '53a189361c67d1a4859d3558', E: '53155ed90599c7020000002b'
    O: linked: { gp: { email:'ukesh.y@webcontxt.com'} }
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('mukesh.y@webcontxt.com')
#  1501.06 54ab071d8f8c80299bcc5ac7     E R1      aztech-dev     nrb.miners@gmail.com   Thibaud F.,
#  1409.11 541157cd8f8c80299bcc46d2     E         aztech-dev     thibaud@aztech.io      Thibaud Fabre
  aztechdev:
    U: G: 5682430, A: '54ab071d8f8c80299bcc5ac7', B: '541157cd8f8c80299bcc46d2', E: '541157e5d1c70602000b280c'
    O: linked: { gp: { email:'nrb.miners@gmail.com'} }, name: 'Thibaud Fabre'
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('nrb.miners@gmail.com')
# 1406.18 53a180231c67d1a4859d3557   E            samdb     me@sam-bell.com  Sam Bell,
# 1402.08 52f4e4051c67d1a4859d21cb   E S1         samdb     sam.bell@copiadigital.co.uk  Sam Bell
  samdb:
    U: G: 5083658, A: '53a180231c67d1a4859d3557', B: '52f4e4051c67d1a4859d21cb', E: '52f4e446bb3aba020000007b'
    O: linked: { gp: { email:'me@sam-bell.com'} }
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('me@sam-bell.com')

#  1503.19 550ab0e5bde9c70c0042f40c     E R1      tonyfreed       hello@tonyfreed.com      Tony Freed
#  1311.05 5277d38566a6f999a465facf     E R4      tonyfreed       freed.anthony@gmail.com  Tony Freed
  tonyfreed:
    U: G: 1897490, A: '5277d38566a6f999a465facf', B: '550ab0e5bde9c70c0042f40c', E: '5277d4ba0be575020000000c'
    O: linked: { gp: { email:'freed.anthony@gmail.com'} }, username: 'tonyfreed'
    R: suggests:5, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('freed.anthony@gmail.com')
#  1405.08 536ad2851c67d1a4859d3145     E R2      samiur          groundhawk2006@gmail.com   Samiur Rahman
#  1402.06 52f34e8e1c67d1a4859d211f     E R1      samiur          me@samiurr.com             Samiur rahman
  samiur:
    U: G: 1919218, A: '52f34e8e1c67d1a4859d211f', B: '536ad2851c67d1a4859d3145', E: '52f34ee77bb9e2020000000b'
    O: linked: { gp: { email:'me@samiurr.com'} }, name: 'Samiur Rahman'
    R: suggests:3, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('me@samiurr.com')
#  1403.24 533014561c67d1a4859d2949     E         tornad          regis.martin@tornad.net    RegisM
#  1307.05 51d6b43866a6f999a465f427     E R3      tornad          regis.google@denaroo.com   Regis M
  tornad:
    U: G: 2128499, A: '533014561c67d1a4859d2949', B: '51d6b43866a6f999a465f427', E: '51d6b451839204020000000e'
    O: linked: { gp: { email:'regis.martin@tornad.net'} }, name: "Regis Martin"
    R: suggests:3, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('regis.martin@tornad.net')
#  1503.27 5514bd9d5955b711004d74b6     E         CodingFu        jumpincode@gmail.com     Seva Rybakov
#  1401.18 52d9b1d01c67d1a4859d1cc1     E R2      CodingFu        codingfu@gmail.com       Seva Rybakov
  CodingFu:
    U: G: 1714573, A: '5514bd9d5955b711004d74b6', B: '52d9b1d01c67d1a4859d1cc1', E: '52d9b1f22f113a020000000e'
    O: linked: { gp: { email:'jumpincode@gmail.com'} }
    R: suggests:2, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jumpincode@gmail.com')
#  1410.10 5436ab708f8c80299bcc4af4     E         CacheFactory    ejanderson4@gmail.com  Edward Anderson
#  1409.29 542848478f8c80299bcc4915     E         CacheFactory    edward@taskflow.io     Eddie Anderson
  CacheFactory:
    U: G: 1606184, A: '542848478f8c80299bcc4915', B: '5436ab708f8c80299bcc4af4', E: '542a1b51635195020040a6ad'
    O: linked: { gp: { email:'edward@taskflow.io'} }, name: 'Edward Anderson'
    R: suggests:0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('edward@taskflow.io')
#  1503.17 5507ab51228b180c003664e0     E R1      manpreetnarang  manpreet@metawarelabs.com          Manpreet Narang
#  1402.27 530e5fb41c67d1a4859d2513     E         manpreetnarang  manpreet@webdesignerintoronto.com  Manpreet Singh Narang
  manpreetnarang:
    U: G: 1205380, A: '5507ab51228b180c003664e0', B: '530e5fb41c67d1a4859d2513', E: '530e5fc9322c1a0200000039'
    O: linked: { gp: { email:'manpreet@metawarelabs.com'} }, name: "Manpreet Narang"
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('manpreet@metawarelabs.com')
#  1405.26 538232101c67d1a4859d32dd     E         randomizor      jay@thedevsquad.com  Jay Whiting
#  1403.22 532c3cac1c67d1a4859d28fa     E         randomizor      jay@jaydwhiting.com  Jay Whiting
  randomizor:
    U: G: 1047142, A: '532c3cac1c67d1a4859d28fa', B: '538232101c67d1a4859d32dd', E: '532c3d55f962c80200000017'
    O: linked: { gp: { email:'jay@jaydwhiting.com'} }
    R: suggests:0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jay@jaydwhiting.com')
#  1411.22 546f9ffb8f8c80299bcc51cc     E R22     il1ja        dalibor.ilijevski@gmail.com        Dalibor Ilijevski
#  1410.22 5446dc908f8c80299bcc4cbf     E R1      il1ja        dalibor.ilijevski@softserbia.com   Dalibor
  il1ja:
    U: G: 207230, A: '546f9ffb8f8c80299bcc51cc', B: '5446dc908f8c80299bcc4cbf', E: '5446dccf3dc34e0200bca4d8'
    O: linked: { gp: { email:'dalibor.ilijevski@gmail.com'} }, name: 'Dalibor Ilijevski'
    R: suggests:23, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('dalibor.ilijevski@gmail.com')
#  1407.28 53d6217e8f8c80299bcc3bd8     E         kosmotaur    marek.stasikowski@gmail.com  Marek Stasikowski
#  1307.05 51d6b53366a6f999a465f42c     E         kosmotaur    bowdowntonoone@gmail.com     Marek Stasikowski
  kosmotaur:
    U: G: 213450, A: '53d6217e8f8c80299bcc3bd8', B: '51d6b53366a6f999a465f42c', E: '51d6b6ec8392040200000012'
    O: linked: { gp: { email:'marek.stasikowski@gmail.com'} }
    R: suggests:0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('marek.stasikowski@gmail.com')
#  1307.08 51da96c166a6f999a465f43d     E R1      gbugyis      bugyisg@gmail.com        Greg Bugyis
#  1307.08 51da962e66a6f999a465f43c     E R4      gbugyis      greg@worryfreelabs.com   Greg Bugyis
  gbugyis:
    U: G: 224071, A: '51da96c166a6f999a465f43d', B: '51da962e66a6f999a465f43c', E: '51da980ef584250200000008'
    O: linked: { gp: { email:'bugyisg@gmail.com'} }
    R: suggests:5, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('bugyisg@gmail.com')
#  1408.01 53da86b68f8c80299bcc3ceb     E R1      jjasonclark  jason@jjcconsultingllc.com   Jason Clark
#  1309.11 522f6a1066a6f999a465f7c3     E R3      jjasonclark  jason@jjasonclark.com        Jason Clark
  jjasonclark:
    U: G: 155233, A: '522f6a1066a6f999a465f7c3', B: '53da86b68f8c80299bcc3ceb', E: '522f6abab4b1c60200000053'
    O: linked: { gp: { email:'jason@jjasonclark.com'} }
    R: suggests:4, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jason@jjasonclark.com')
#  1505.08 554b70451f4cbb11004e18b4     E         cballou      corey@coreyballou.com    Corey Ballou
#  1503.21 550c41e7bbbbef0c004b5171     E R1      cballou      ballouc@gmail.com        Corey Ballou
  cballou:
    U: G: 166784, A: '550c41e7bbbbef0c004b5171', B: '554b70451f4cbb11004e18b4', E: '550c42cdd2e9580c004a5be4'
    O: linked: { gp: { email:'ballouc@gmail.com'} }, username: 'cballou'
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('ballouc@gmail.com')
# 1306.11 51b5f62066a6f999a465f39f     E R1      malachaifrazier    malachaifrazier@gmail.com  Malachai
# 1305.03 5182e86166a6f999a465f2a8     E R2      malachaifrazier    thefounder@detroitrails.co Malachai
  malachaifrazier:
    U: G: 761210, A: '51b5f62066a6f999a465f39f', B: '5182e86166a6f999a465f2a8', E: '51549795d96db10200000044'
    O: linked: { gp: { email:'malachaifrazier@gmail.com'} }
    R: suggests:3, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('malachaifrazier@gmail.com')
# 1504.06 5521f2087117b91100b793a9     E         ejlangev     ejl6266@gmail.com  Ethan Langevin
# 1308.09 52040dae66a6f999a465f51c     E R1      ejlangev     ethan.langevin@lifebooker.com  Ethan Langevin
  ejlangev:
    U: G: 718430, A: '5521f2087117b91100b793a9', B: '52040dae66a6f999a465f51c', E: '52040dcf4af6ba0200000018'
    O: linked: { gp: { email:'ejl6266@gmail.com'} }
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('ejl6266@gmail.com')
# 1502.24 54ec368c6e9ac20c004e15fc               frowing    frowing@gmail.com  Francisco Sevillano
# 1407.16 53c62dc08f8c80299bcc39d7     E R2      frowing    fran@touristeye.com  Francisco Sevillano
  frowing:
    U: G: 744696, A: '54ec368c6e9ac20c004e15fc', B: '53c62dc08f8c80299bcc39d7', E: '53c62e36f5d0270200b75e6d'
    O: linked: { gp: { email:'frowing@gmail.com'} }, username: 'frowing'
    R: suggests:2, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('frowing@gmail.com')
# 1410.24 544a4d0d8f8c80299bcc4d16     E         shezi    j@spielmannsolutions.com Johannes Spielmann
# 1402.11 52f9dd041c67d1a4859d2296     E         shezi    shezijs@gmail.com  Johannes Spielmann
  shezi:
    U: G: 690171, A: '52f9dd041c67d1a4859d2296', B: '544a4d0d8f8c80299bcc4d16', E: '52f9dd3e3a8f0c0200000029'
    O: linked: { gp: { email:'shezijs@gmail.com'} }
    R: suggests:0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('shezijs@gmail.com')
# 1407.21 53cc9ab58f8c80299bcc3a95     E R4     ben-rosio    ben@ros.io           Ben Barnett
# 1407.21 53cc87a08f8c80299bcc3a91     E R3     ben-rosio    ben@valice.com       Ben
  benrosio:
    U: G: 639053, A: '53cc9ab58f8c80299bcc3a95', B: '53cc87a08f8c80299bcc3a91', E: '53cc87c01b572c0200090a24'
    O: linked: { gp: { email:'ben@ros.io'} }, name: 'Ben Barnett'
    R: suggests:7, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('ben@ros.io')
# 1507.10 559fbac80e1d3611009a29be     E        coderdan     dan@codehire.com     Dan Draper
# 1406.03 538d5c291c67d1a4859d33b1     E        coderdan     daniel@codehire.com  Dan Draper
  coderdan:
    U: G: 522225, A: '559fbac80e1d3611009a29be', B: '538d5c291c67d1a4859d33b1', E: ''
    O: linked: { gp: { email:'dan@codehire.com'} }
    R: suggests:0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('dan@codehire.com')
# 1508.22 55d820b090002d110041e3a4     E        mohsen1    me@azimi.me  Mohsen Azimi
# 1311.14 528436d166a6f999a465fb77     E R5     mohsen1    msnazi@gmail.com Mohsen Azimi
  mohsen1:
    U: G: 543633, A: '528436d166a6f999a465fb77', B: '55d820b090002d110041e3a4', E: ''
    O: linked: { gp: { email:'msnazi@gmail.com'} }, username: 'mohsen', initials: 'ma'
    R: suggests:5, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('msnazi@gmail.com')
# 1503.09 54fcc90eb6e17a0c009b6c83     E        hanibash     hanibash+airpair@gmail.com Hani Sharabash
# 1305.30 51a6cd1a66a6f999a465f30c     E R4     hanibash     hanibash@gmail.com Hani Sharabash
  hanibash:
    U: G: 431626, A: '51a6cd1a66a6f999a465f30c', B: '54fcc90eb6e17a0c009b6c83', E: ''
    O: linked: { gp: { email:'hanibash@gmail.com'} }
    R: suggests:4, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('hanibash@gmail.com')
# 1408.30 5400a1458f8c80299bcc4508     E R4     phpnode    charles.pick@gmail.com Charles Pick
# 1408.22 53f6079e8f8c80299bcc4377     E R3     phpnode    charles@codemix.com  Charles Pick
  phpnode:
    U: G: 363611, A: '53f6079e8f8c80299bcc4377', B: '5400a1458f8c80299bcc4508', E: ''
    O: linked: { gp: { email:'charles@codemix.com'} }
    R: suggests:7, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('charles@codemix.com')
# 1503.11 54feff2b91529e0c00f38a93              AVGP     martin@geekonaut.de  Martin Naumann
# 1503.10 54fea23564d9df0c005de2fe  P1   E R2   AVGP     mr.avgp@gmail.com  Martin Naumann
  AVGP:
    U: G: 370246, A: '54fea23564d9df0c005de2fe', B: '54feff2b91529e0c00f38a93', E: ''
    O: linked: { gp: { email:'mr.avgp@gmail.com'} }
    R: suggests:2,posts:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('mr.avgp@gmail.com')
# 1506.04 5570139ae819861100d7a0d3     E         holdenweb        steve@holdenweb.com  Steve Holden
# 1311.19 528b506666a6f999a465fbcb     E R1      holdenweb        holdenweb@gmail.com  Steve Holden
  holdenweb:
    U: G: 105312, A: '528b506666a6f999a465fbcb', B: '5570139ae819861100d7a0d3', E: ''
    O: linked: { gp: { email:'holdenweb@gmail.com'} }
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('holdenweb@gmail.com')
# 1412.24 5499d9118f8c80299bcc57e5     E         karianne         karianne.berg@gmail.com  Karianne Berg
# 1402.05 52f1412c1c67d1a4859d1e87     E R1      karianne         karianne.berg@vimond.com Karianne Berg
  karianne:
    U: G: 133878, A: '5499d9118f8c80299bcc57e5', B: '52f1412c1c67d1a4859d1e87', E: ''
    O: linked: { gp: { email:'karianne.berg@gmail.com'} }
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('karianne.berg@gmail.com')
# 1405.14 5372cb011c67d1a4859d31ef     E R5      alan-andrade     alan@lumoslabs.com       Alan Andrade
# 1308.08 5202b3ad66a6f999a465f4fa     E R2      alanandrade      alan.andradec@gmail.com  Alan Andrade
  alanandrade:
    U: G: 97609, A: '5202b3ad66a6f999a465f4fa', B: '5372cb011c67d1a4859d31ef', E: ''
    O: linked: { gp: { email:'alan.andradec@gmail.com'} }
    R: suggests:7, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('alan.andradec@gmail.com')
# 1503.12 55014c3bb2620c0c009bb735               willrax          me@willrax.com            Will Raxworthy
# 1403.13 5320fa221c67d1a4859d276c     E R11     willrax          willraxworthy@gmail.com   Will Raxworthy
  willrax:
    U: G: 94960, A: '5320fa221c67d1a4859d276c', B: '55014c3bb2620c0c009bb735', E: ''
    O: linked: { gp: { email:'willraxworthy@gmail.com'} }
    R: suggests:11, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('willraxworthy@gmail.com')
# 1410.08 54340fcb8f8c80299bcc4a93     E         siruguri         sameer@dstrategies.org    Sameer S
# 1312.03 529d13bb66a6f999a465fced     E R1      siruguri         siruguri@gmail.com        Sameer Siruguri
  siruguri:
    U: G: 40653, A: '529d13bb66a6f999a465fced', B: '54340fcb8f8c80299bcc4a93', E: ''
    O: linked: { gp: { email:'siruguri@gmail.com'} }, name: 'Sameer Siruguri'
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('siruguri@gmail.com')
# 1405.20 537adf341c67d1a4859d3272     E         lgleasain        lance.gleason@gmail.com  Lance Gleason
# 1405.15 537454cd1c67d1a4859d3208     E R1      lgleasain        lgleason@polyglotprogramminginc.com  Lance Gleason
  lgleasain:
    U: G: 26530, A: '537adf341c67d1a4859d3272', B: '537454cd1c67d1a4859d3208', E: ''
    O: linked: { gp: { email:'lance.gleason@gmail.com'} }
    R: suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('lance.gleason@gmail.com')
# 1411.23 547159988f8c80299bcc51f1     E R1      claudiob         claudiob@gmail.com Claudio B.
# 1310.03 524c824666a6f999a465f8ef     E R2      claudiob         cbaccigalupo@topspinmedia.com  Claudio B.
  claudiob:
    U: G: 10076, A: '547159988f8c80299bcc51f1', B: '524c824666a6f999a465f8ef', E: ''
    O: linked: { gp: { email:'claudiob@gmail.com'} }
    R: suggests:3, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('claudiob@gmail.com')
# 1505.17 555813a9b372b01100bdf491     E R1      caseysoftware    keith@caseysoftware.com  Keith Casey
# 1402.23 53097f961c67d1a4859d2480     E R2      caseysoftware    keith.casey@gmail.com    Keith Casey
  caseysoftware:
    U: G: 134579, A: '53097f961c67d1a4859d2480', B: '555813a9b372b01100bdf491', E: '53097fd3242cab0200000009' #ObjectId("55581526ca088711008a2f28")
    O: linked: { gp: { email:'keith.casey@gmail.com'} }
    R: suggests:2, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('keith.casey@gmail.com')
# # 1403.10 531ca4791c67d1a4859d270b     E R5      tanimislam     tanim.islam@gmail.com  Tanim Islam
# # 1403.09 531b913c1c67d1a4859d2700     E R4      tanimislam     tsi6a@virginia.edu Tanim Islam
  tanimislam:
    U: G: 747905, A: '531ca4791c67d1a4859d270b', B: '531b913c1c67d1a4859d2700', E: '531b91ee60ef61020000001f'
    O: linked: { gp: { email:'tanim.islam@gmail.com'} }, username: 'tanimislam'
    R: suggests:8, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('tanim.islam@gmail.com')
#  1503.06 54f856be939a320c00ec1ecf     E R2      mietek       mietek@bak.io      Miëtek Bak
#  1403.12 531f52771c67d1a4859d2735     E R2      mietek       mietek@gmail.com   Miëtek Bak
  mietek:
    U: G: 166207, A: '54f856be939a320c00ec1ecf', B: '531f52771c67d1a4859d2735', E: '531f52ce1994ea020000000b'
    O: linked: { gp: { email:'mietek@bak.io'} }
    R: suggests:3, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('mietek@bak.io')
#  1502.20 54e68c7ff737280c00a28b47     E R1      STRML           samuel.trace.reed@gmail.com  Samuel Reed
#  1405.22 537d4e431c67d1a4859d329f     E R7      STRML           sam@tixelated.com            Sam Reed
  STRML:
    U: G: 1197375, A: '54e68c7ff737280c00a28b47', B: '537d4e431c67d1a4859d329f', E: '537d4e8d77980d02002d8e7c'
    O: linked: { gp: { email:'samuel.trace.reed@gmail.com'} }, name: 'Samuel Reed'
    R: suggests:7, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('samuel.trace.reed@gmail.com')
#  1405.27 538355911c67d1a4859d32f1   E R1         pashaisthebest    pashaisthebest@gmail.com Павел Гуров
#  1402.18 53028ec71c67d1a4859d2374   E R4         pashaisthebest    pg@goodworkapps.com  Pavel Gurov
  pashaisthebest:
    U: G: 2697487, A: '538355911c67d1a4859d32f1', B: '53028ec71c67d1a4859d2374', E: ''
    O: linked: { gp: { email:'pashaisthebest@gmail.com'} }, name: 'Pavel Gurov'
    R: suggests:5, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('pashaisthebest@gmail.com')
#  1406.10 539649221c67d1a4859d3451   E R5   njd5475     njd5475@gmail.com  Zealous Coder,
#  1406.10 539648e21c67d1a4859d3450          njd5475     nicholas_dziedzic@pepboys.com  Zealous Coder
  njd5475:
    U: G: 225261, A: '539649221c67d1a4859d3451', B: '539648e21c67d1a4859d3450', E: ''
    O: linked: { gp: { email:'njd5475@gmail.com'} }
    R: suggests:5, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('njd5475@gmail.com')
#  1503.05 54f754373696cb0c00dfcf6d   E R2         jcmurrayii    jc@decisionarytech.com Jc Murray
#  1406.27 53acac7c1c67d1a4859d36f1   E R4         jcmurrayii    jmurray@tallosoft.com  Jc Murray
  jcmurrayii:
    U: G: 1308223, A: '54f754373696cb0c00dfcf6d', B: '53acac7c1c67d1a4859d36f1', E: ''
    O: linked: { gp: { email:'jc@decisionarytech.com'} }
    R: suggests:4, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jc@decisionarytech.com')
#  1408.05 53dfbaa48f8c80299bcc3e1e   E R3           micahhausler    micah.hausler@ambition.com Micah Hausler,
#  1403.22 532c57981c67d1a4859d28ff P1  E R2         micahhausler    hausler.m@gmail.com  Micah Hausler
  micahhausler:
    U: G: 791000, A: '532c57981c67d1a4859d28ff', B: '53dfbaa48f8c80299bcc3e1e', E: ''
    O: linked: { gp: { email:'hausler.m@gmail.com'} }
    R: suggests:5,paymethods:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('hausler.m@gmail.com')
 # 1502.04 54d186b7ea3ebb09009289f8 P1  E S1         juanpastas    pastasjuan@gmail.com Juan D Pastas,
 # 1310.27 526c167d66a6f999a465fa5b   E S12        juanpastas    juandavid1707@gmail.com  Juan David Pastás Rivera
  juanpastas:
    U: G: 671721, A: '526c167d66a6f999a465fa5b', B: '54d186b7ea3ebb09009289f8', E: ''
    O: linked: { gp: { email:'juandavid1707@gmail.com'} }, initials: 'jd', name: 'Juan D Pastas'
    R: suggests:13,paymethods:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('juandavid1707@gmail.com')
#  1412.12 5489c8c48f8c80299bcc54ad P1  E R3         tamouse     tamouse.lists@gmail.com  tamouse pontiki
#  1408.13 53eb40dc8f8c80299bcc4184   E              tamouse     tamouse@gmail.com        Tamara Temple
  tamouse:
    U: G: 363583, A: '53eb40dc8f8c80299bcc4184', B: '5489c8c48f8c80299bcc54ad', E: ''
    O: linked: { gp: { email:'tamouse@gmail.com'} }, name: 'Tamouse Pontiki'
    R: suggests:3,paymethods:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('tamouse@gmail.com')









easyCustomers =
# 1503.16 550631584ffec50c00ce1263    E   R2  huskynation     wadson.espindola@gmail.com  Wadson F. Espindola,
# 1503.16 550630514ffec50c00ce1243        R2  huskynation     wadson@inkqwi;re.com         Wadson Espindola
  huskynation:
    U: G: 6406002, A: '550631584ffec50c00ce1263', B: '550630514ffec50c00ce1243'
    O: linked: { gp: { email:'wadson.espindola@gmail.com'} }, username: 'huskynation', name: 'Wadson Espindola'
    R: requests:4, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('wadson.espindola@gmail.com')
      expect(merged.user.username).to.equal('huskynation')
      expect(merged.user.name).to.equal('Wadson Espindola')
# 1403.21 532b30921c67d1a4859d28d2             oliverbarnes     oliverbwork@gmail.com  Oliver Azevedo Barnes,
# 1309.07 522a6cd866a6f999a465f798         R1  oliverbarnes     oli.azevedo.barnes@gmail.com Oliver Azevedo Barnes
  oliverbarnes:
    U: G: 21290, A: '522a6cd866a6f999a465f798', B: '532b30921c67d1a4859d28d2'
    O: linked: { gp: { email:'oli.azevedo.barnes@gmail.com'} }
    R: requests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('oli.azevedo.barnes@gmail.com')
# 1509.07 55ec6c343a143a110094dcd3         R1  tania531     tania.dev77@gmail.com  cecelia anteri,
# 1305.24 519edc9d66a6f999a465f2e7             tania531     valentina531@gmail.com tania
  tania531:
    U: G: 709654, A: '55ec6c343a143a110094dcd3', B: '519edc9d66a6f999a465f2e7'
    O: linked: { gp: { email:'tania.dev77@gmail.com'} }, name: 'Cecelia Anteri'
    R: requests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('tania.dev77@gmail.com')
      expect(merged.user.name).to.equal('Cecelia Anteri')
# 1312.06 52a108ce66a6f999a465fd38         R1  gngotho    getngothonow@gmail.com Geoffrey Ngotho,
# 1309.11 522f8e5d66a6f999a465f7ca             gngotho    geoffrey.ngotho@gmail.com  Geoffrey Ngotho
  gngotho:
    U: G: 1695623, A: '522f8e5d66a6f999a465f7ca', B: '52a108ce66a6f999a465fd38'
    O: linked: { gp: { email:'geoffrey.ngotho@gmail.com'} }
    R: requests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('geoffrey.ngotho@gmail.com')
# 1507.05 5598854967693111001e2e08         R1  jhmcclellandii     jhmcclellandii@gmail.com John McClelland,
# 1505.11 554f70701adc8411006bcdf7         R1  jhmcclellandii     jm@machinen.co John McClelland
  jhmcclellandii:
    U: G: 4265905, A: '5598854967693111001e2e08', B: '554f70701adc8411006bcdf7'
    O: linked: { gp: { email:'jhmcclellandii@gmail.com'} }, username: 'jhmcclellandii', initials: 'jm'
    R: requests:2, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jhmcclellandii@gmail.com')
      expect(merged.user.initials).to.equal('jm')




basicMix =
# 1502.07 54d57eb0ee3c760a005e5b3c         R1 gauravagarwalr    gauravagarwalr@aol.com Gaurav Agarwal,
# 1404.29 535f6b171c67d1a4859d3005   E R1         gauravagarwalr    gauravagarwal0705@gmail.com  Gaurav Agarwal
  gauravagarwalr:
    U: G: 1390813, A: '535f6b171c67d1a4859d3005', B: '54d57eb0ee3c760a005e5b3c'
    O: linked: { gp: { email:'gauravagarwal0705@gmail.com'} }, username: 'gauravagarwalr'
    R: requests:1,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('gauravagarwal0705@gmail.com')
# 1311.14 5283b75566a6f999a465fb64   E R1        R4 jtremback     jehan.tremback@gmail.com Jehan Tremback,
# 1308.03 51fc078466a6f999a465f4d3          jtremback     jehan@sfdevlabs.com  Jehan
  jtremback:
    U: G: 1335122, A: '5283b75566a6f999a465fb64', B: '51fc078466a6f999a465f4d3'
    O: linked: { gp: { email:'jehan.tremback@gmail.com'} }, name: 'Jehan Tremback'
    R: requests:4,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jehan.tremback@gmail.com')
# 1408.05 53e000cb8f8c80299bcc3e50          zben    legendben2@gmail.com Ben Zhang,
# 1308.14 520adc9a66a6f999a465f5d5   E R1        R1 zben    legendben@gmail.com  Ben Zhang
  zben:
    U: G: 1301575, A: '520adc9a66a6f999a465f5d5', B: '53e000cb8f8c80299bcc3e50'
    O: linked: { gp: { email:'legendben@gmail.com'} }
    R: requests:1,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('legendben@gmail.com')
# 1504.06 55225123a3b117110039b204         R1 dferber90     nick@eventport.net Dominik Ferber,
# 1408.12 53e8e7188f8c80299bcc40c6   E        dferber90     dominik.ferber@gmail.com Dominik Ferber
  dferber90:
    U: G: 1765075, A: '53e8e7188f8c80299bcc40c6', B: '55225123a3b117110039b204'
    O: linked: { gp: { email:'dominik.ferber@gmail.com'} }, username: 'dferber'
    R: requests:1,suggests:0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('dominik.ferber@gmail.com')
# 1505.23 555f47825931b11100dd5111         R1 rpeterson     ryan@inovat.com  Ryan J. Peterson,
# 1312.19 52b2e62c66a6f999a465fe2b   E R2         rpeterson     rpeterson@serenitysoft.com Ryan J. Peterson
  rpeterson:
    U: G: 82721, A: '52b2e62c66a6f999a465fe2b', B: '555f47825931b11100dd5111'
    O: linked: { gp: { email:'rpeterson@serenitysoft.com'} }
    R: requests:1,suggests:2, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('rpeterson@serenitysoft.com')
# 1404.23 5357be4e1c67d1a4859d2ea8         R1 johnpaulashenfelter     john@ashenfelter.com John Paul Ashenfelter
# 1306.16 51bcc97266a6f999a465f3bb   E        johnpaulashenfelter     johnpaul@transitionpoint.com John Paul Ashenfelter
  johnpaulashenfelter:
    U: G: 19890, A: '5357be4e1c67d1a4859d2ea8', B: '51bcc97266a6f999a465f3bb'
    O: linked: { gp: { email:'john@ashenfelter.com'} }
    R: requests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('john@ashenfelter.com')
# 1505.09 554d15121001151100760112         R1 drakmail    am@generate.club Alexander Maslov
# 1402.09 52f6420a1c67d1a4859d220b   E R1         drakmail    drakmail@gmail.com Alexander
  drakmail:
    U: G: 869453, A: '52f6420a1c67d1a4859d220b', B: '554d15121001151100760112'
    O: linked: { gp: { email:'drakmail@gmail.com'} }, name: "Alexander Maslov"
    R: requests:1,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('drakmail@gmail.com')
# 1502.24 54ebc63f3275fe0c00f17fe2         R1 waaaaargh     johannes@weltraumpflege.org  Johannes Fürmann
# 1403.29 5335804f1c67d1a4859d2a67   E R7         waaaaargh     johannes@fuermann.cc Johannes Fürmann
  waaaaargh:
    U: G: 243367, A: '54ebc63f3275fe0c00f17fe2', B: '5335804f1c67d1a4859d2a67'
    O: linked: { gp: { email:'johannes@weltraumpflege.org'} }
    R: requests:1,suggests:7, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('johannes@weltraumpflege.org')
# 1310.15 525caa0766a6f999a465f9e5   E R23       R1 TrevorBurnham     trevorburnham@gmail.com  Trevor Burnham
# 1310.15 525ca7f666a6f999a465f9e4          TrevorBurnham     tburnham@hubspot.com Trevor Burnham
  TrevorBurnham:
    U: G: 224895, A: '525caa0766a6f999a465f9e5', B: '525ca7f666a6f999a465f9e4'
    O: linked: { gp: { email:'trevorburnham@gmail.com'} }
    R: requests:1,suggests:23, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('trevorburnham@gmail.com')
# 1507.15 55a59376db5c001100e18a9b P1  E       R1 vmharrel    vijay@wolfpackdigital.com  Vijay Harrell
# 1502.23 54ea52c9830d530c00003c27         R1 vmharrel    vijay.m.harrell@gmail.com  Vijay Harrell
  vmharrel:
    U: G: 204996, A: '54ea52c9830d530c00003c27', B: '55a59376db5c001100e18a9b'
    O: linked: { gp: { email:'vijay.m.harrell@gmail.com'} }, username: 'vmharrel'
    R: requests:2,suggests:1,paymethods:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('vijay.m.harrell@gmail.com')
# 1506.12 557a81be5b3a4a11007027d9   E R1         bgreg     bgregmc@icloud.com      Greg Mcguirk,
# 1412.30 54a1fd1b8f8c80299bcc5922   E       R1 bgreg     bert.mcguirk@gmail.com    Greg Mc
  bgreg:
    U: G: 3711139, A: '54a1fd1b8f8c80299bcc5922', B: '557a81be5b3a4a11007027d9', E: ''
    O: linked: { gp: { email:'bert.mcguirk@gmail.com'} }, name: 'Greg Mcguirk', initials: 'gm'
    R: requests:1,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('bert.mcguirk@gmail.com')
# 1503.13 55028bf3c878110c00115fa6   E        mistrikushal    kushal.mistry@bacancytechnology.com  Kushal M,
# 1502.07 54d4d6e0c7bd7b0a00a9ed04   E R1        R1 mistrikushal    kushal_mistry@live.in          Kushal Mistri
  mistrikushal:
    U: G: 2395038, A: '54d4d6e0c7bd7b0a00a9ed04', B: '55028bf3c878110c00115fa6', E: ''
    O: linked: { gp: { email:'kushal_mistry@live.in'} }, name: 'Kushal Mistri', username: 'kushalmistri'
    R: requests:1,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('kushal_mistry@live.in')
# 1501.15 54b68d677b1047516695d5c2 P1  E R1        R1 roychri     christian.s.roy@gmail.com  Christian Roy,
# 1403.21 532bb3261c67d1a4859d28ec   E        roychri     croy@highschoolcube.com  Christian Roy
  roychri:
    U: G: 1678867, A: '54b68d677b1047516695d5c2', B: '532bb3261c67d1a4859d28ec', E: ''
    O: linked: { gp: { email:'christian.s.roy@gmail.com'} }
    R: requests:1,suggests:1,paymethods:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('christian.s.roy@gmail.com')
# 1509.19 55fcd8d47b78ba11002e6f99 P1  E        abishekrsrikaanth     abishekrsrikaanth@gmail.com  Abishek Raghavan Srikaanth,
# 1503.13 550279a996bc290c00ccfc60   E       R1 abishekrsrikaanth     abishek@technicaliti.me      Abishek R Srikaanth
  abishekrsrikaanth:
    U: G: 1639302, A: '55fcd8d47b78ba11002e6f99', B: '550279a996bc290c00ccfc60', E: ''
    O: linked: { gp: { email:'abishekrsrikaanth@gmail.com'} }, name: 'Abishek R Srikaanth', username: 'abishekrsrikaanth', initials: 'abi'
    R: requests:1,paymethods:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('abishekrsrikaanth@gmail.com')
# 1411.19 546b7c6f8f8c80299bcc50e9   E R11       R1 gabrielpoca     gabrielpoca@gmail.com  Gabriel Poça,
# 1402.19 5303706c1c67d1a4859d23a0   E R2         gabrielpoca     cette118@gmail.com Gabriel Poça
  gabrielpoca:
    U: G: 934580, A: '546b7c6f8f8c80299bcc50e9', B: '5303706c1c67d1a4859d23a0', E: ''
    O: linked: { gp: { email:'gabrielpoca@gmail.com'} }
    R: requests:1,suggests:13, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('gabrielpoca@gmail.com')
# 1312.18 52b0a5cf66a6f999a465fdf0   E R1         hyeomans    hyeomans@nearsoft.com  Hector Yeomans,
# 1308.14 520a845f66a6f999a465f5bb   E       R1 hyeomans    yeomans.leonel@gmail.com Hector Yeomans
  hyeomans:
    U: G: 312799, A: '520a845f66a6f999a465f5bb', B: '52b0a5cf66a6f999a465fdf0', E: ''
    O: linked: { gp: { email:'yeomans.leonel@gmail.com'} }
    R: requests:1,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('yeomans.leonel@gmail.com')
# 1505.22 555df69231f9b41100b11e7b   E R2        R1 fijiaaron     fijiaaron@fast-mail.org  Aaron Evans,
# 1406.13 539a6ef91c67d1a4859d34ab   E R4         fijiaaron     aarone@one-shore.com Aaron Evans
  fijiaaron:
    U: G: 116369, A: '555df69231f9b41100b11e7b', B: '539a6ef91c67d1a4859d34ab', E: ''
    O: linked: { gp: { email:'fijiaaron@fast-mail.org'} }, username: 'fijiaaron'
    R: requests:1,suggests:5, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('fijiaaron@fast-mail.org')





v0ActiveExperts =
# 1310.09 525490f766a6f999a465f9ab P1  E R12 B14        deontologician    habitue@gmail.com  Josh Kuhn,
# 1306.01 51a9091366a6f999a465f329          deontologician    deontologician@gmail.com Josh Kuhn
  deontologician:
    U: G: 1366, A: '525490f766a6f999a465f9ab', B: '51a9091366a6f999a465f329', E: ''
    O: linked: { gp: { email:'habitue@gmail.com'} }
    R: suggests:12,posts:1,booked:14,ordered:6, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('habitue@gmail.com')
#  1402.05 52f1494e1c67d1a4859d1e97   E R4 B1      AntouanK    ablackjim@gmail.com  Antony Blackjim,
#  1402.05 52f147311c67d1a4859d1e92   E R11        AntouanK    antonis.karamitros@gmail.com Antonios Karamitros
  AntouanK:
    U: G: 4569111, A: '52f147311c67d1a4859d1e92', B: '52f1494e1c67d1a4859d1e97', E: ''
    O: linked: { gp: { email:'antonis.karamitros@gmail.com'} }, name: 'Antonios Karamitros'
    R: suggests:14,booked:1,ordered:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('antonis.karamitros@gmail.com')
#  1409.27 542616b98f8c80299bcc48f3                lhorie    lhorie@klick.com Leo Horie,
#  1409.24 5422303b8f8c80299bcc486e   E R1 B1      lhorie    leohorie@gmail.com Leo Horie
  lhorie:
    U: G: 1637573, A: '5422303b8f8c80299bcc486e', B: '542616b98f8c80299bcc48f3', E: ''
    O: linked: { gp: { email:'leohorie@gmail.com'} }
    R: suggests:1,booked:1,ordered:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('leohorie@gmail.com')
#  1307.03 51d355bc66a6f999a465f413          justinobney     justin@envoc.com Justin Obney,
#  1306.26 51ca5c2d66a6f999a465f3fc   E R32 B11        justinobney     justinobney@gmail.com  Justin Obney
  justinobney:
    U: G: 1054188, A: '51ca5c2d66a6f999a465f3fc', B: '51d355bc66a6f999a465f413', E: ''
    O: linked: { gp: { email:'justinobney@gmail.com'} }
    R: suggests:31,booked:11,ordered:11, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('justinobney@gmail.com')

#  1401.25 52e3173e1c67d1a4859d1d80   E R6 B1   seanculver    sean.culver@cuppyyarrish.com Sean Culver,
#  1307.31 51f7e09766a6f999a465f4b5             seanculver    seanculver@gmail.com Sean Culver
  seanculver:
    U: G: 503033, A: '51f7e09766a6f999a465f4b5', B: '52e3173e1c67d1a4859d1d80', E: ''
    O: linked: { gp: { email:'seanculver@gmail.com'} }
    R: suggests:6,booked:1,ordered:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('seanculver@gmail.com')
#  1411.14 54653f388f8c80299bcc5036 P1  E        thiagogabriel     thiagogbsilva@gmail.com  Thiago Borges,
#  1309.22 523df69666a6f999a465f843   E R1       thiagogabriel     thiago.kiler6@gmail.com  Thiago Borges
  thiagogabriel:
    U: G: 97197, A: '54653f388f8c80299bcc5036', B: '523df69666a6f999a465f843', E: ''
    O: linked: { gp: { email:'thiagogbsilva@gmail.com'} }
    R: suggests:1,paymethods:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('thiagogbsilva@gmail.com')
#  1405.07 536a0eb81c67d1a4859d312c   E R2 B1    cupuyc    stan.reshetnyk@trembit.com Stan Reshetnyk,
#  1405.07 5369d4151c67d1a4859d3123              cupuyc    siriushire@gmail.com Stan Reshetnyk
  cupuyc:
    U: G: 54808, A: '536a0eb81c67d1a4859d312c', B: '5369d4151c67d1a4859d3123', E: ''
    O: linked: { gp: { email:'stan.reshetnyk@trembit.com'} }
    R: suggests:2,booked:1,ordered:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('stan.reshetnyk@trembit.com')
# 1403.05 53161a651c67d1a4859d267c     E S12           metashock     th@simplesurance.de  hek2mgl,
# 1305.30 51a74cb866a6f999a465f312 P1  E S10 B3 O1 P1  metashock     heymann.thorsten@gmail.com Thorsten Heymann
  metashock:
    U: G: 412228, A: '51a74cb866a6f999a465f312', B: '53161a651c67d1a4859d267c', E: ''
    O: linked: { gp: { email:'heymann.thorsten@gmail.com'} }, name: 'Thorsten Heymann'
    R: paymethods:1,suggests:21,booked:3,ordered:3,paidout:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('heymann.thorsten@gmail.com')




v1ActiveExperts =
 # 1501.10 54b02eb87b1047516695d41b     E S6               jmif    jmif96@gmail.com Joe Mifsud,
 # 1408.13 53eacd118f8c80299bcc416c P1  E S50 B8 O8 P3     jmif    joe@mifsud.me  Joe Mifsud
  jmif:
    U: G: 1000442, A: '53eacd118f8c80299bcc416c', B: '54b02eb87b1047516695d41b', E: ''
    O: linked: { gp: { email:'joe@mifsud.me'} }, username: 'jmif'
    R: paymethods:1,suggests:54,booked:8,ordered:8,paidout:3, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('joe@mifsud.me')
 # 1503.18 5508865f6912810c007d6697                 muriithi    muriithi@arrow-tech.net  Domain Admin,
 # 1308.19 5211bcfa66a6f999a465f631   E S29 B1 O1   muriithi    muriithik@gmail.com      Muriithi Kamweti
  muriithi:
    U: G: 409483, A: '5211bcfa66a6f999a465f631', B: '5508865f6912810c007d6697'
    O: linked: { gp: { email:'muriithik@gmail.com'} }, name: 'Muriithi Kamweti'
    R: paymethods:0,suggests:29,booked:1,ordered:1,paidout:0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('muriithik@gmail.com')
# 1403.07 531904bd1c67d1a4859d26d4 P1  E S10          Chandu    chandra.vedantham@gmail.com  Chandra Vedantham,
# 1311.30 5299526266a6f999a465fcbe     E S5 B1 O1     Chandu    chadrants@gmail.com  Chandra V
  Chandu:
    U: G: 261027, A: '531904bd1c67d1a4859d26d4', B: '5299526266a6f999a465fcbe', E: ''
    O: linked: { gp: { email:'chandra.vedantham@gmail.com'} }, name: 'Chandra Vedantham'
    R: paymethods:1,suggests:14,booked:1,ordered:1,paidout:0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('chandra.vedantham@gmail.com')
 # 1409.30 5429b57f8f8c80299bcc4944 P1  E S13 B4 O3 P2     adamjleonard    adamjamesleonard@gmail.com Adam Leonard,
 # 1408.20 53f408c28f8c80299bcc4338   E                    adamjleonard    adam@tanookilabs.com Adam Leonard
  adamjleonard:
    U: G: 80531, A: '5429b57f8f8c80299bcc4944', B: '53f408c28f8c80299bcc4338', E: ''
    O: linked: { gp: { email:'adamjamesleonard@gmail.com'} }
    R: paymethods:1,suggests:13,booked:4,ordered:3,paidout:2, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('adamjamesleonard@gmail.com')
 # 1407.18 53c8b6838f8c80299bcc3a1d P1  E S36 B7 O8 P3    airy    akkudu@gmail.com Andaç Karay Kudu,
 # 1312.12 52a8fa1b66a6f999a465fda4     E S19  O1         airy    airydragon@gmail.com airy
  airy:
    U: G: 32067, A: '53c8b6838f8c80299bcc3a1d', B: '52a8fa1b66a6f999a465fda4', E: ''
    O: linked: { gp: { email:'akkudu@gmail.com'} }, name: 'Andaç Karay Kudu'
    R: paymethods:1,suggests:48,booked:7,ordered:8,paidout:3, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('akkudu@gmail.com')


v0ActiveCustomers =
# 1504.10 552737473cbd201100eef1ea                    jjam3774    jjames@cosprofessionals.com Jeffrey James
# 1309.27 524483b966a6f999a465f87a   E S1   O3 B1 R3  jjam3774    jjam3774@gmail.com          Jeffrey James
  jjam3774:
    U: G: 4967611, A: '524483b966a6f999a465f87a', B: '552737473cbd201100eef1ea'
    O: linked: { gp: { email:'jjam3774@gmail.com'} }, username: 'jjam3774'
    R: paymethods:0,requests:3,bookings:1,orders:3, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jjam3774@gmail.com')
# 1501.09 54aeb3e57b1047516695d3c0         R2       Dascrilla     anetsch@zenefits.com        Alex Netsch
# 1310.03 524c7e6a66a6f999a465f8dd       O2 B2 R3   Dascrilla     alexlnetsch@gmail.com       Alex Netsch
  Dascrilla:
    U: G: 2790471, A: '524c7e6a66a6f999a465f8dd', B: '54aeb3e57b1047516695d3c0'
    O: linked: { gp: { email:'alexlnetsch@gmail.com'} }
    R: paymethods:0,requests:5,bookings:2,orders:2, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('alexlnetsch@gmail.com')
# 1310.19 526172a466a6f999a465fa05       O1 B2 R1 dsilver829    dsilver@candidatemetrics.com  David Silver
# 1310.05 524f342f66a6f999a465f986                dsilver829    dsilver829@gmail.com          David Silver
  dsilver829:
    U: G: 587295, A: '526172a466a6f999a465fa05', B: '524f342f66a6f999a465f986'
    O: linked: { gp: { email:'dsilver@candidatemetrics.com'} }
    R: requests:1,bookings:2,orders:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('dsilver@candidatemetrics.com')


v1ActiveCustomers =
#  1401.10 52cf441766a6f999a465fef5 P1      O2 B1 R2 ianyamey    ian@policygenius.com Ian Yamey,
#  1308.10 5205235c66a6f999a465f553   E     O2 B1 R1 ianyamey    ianyamey@gmail.com Ian Yamey
  ianyamey:
    U: G: 142204, A: '5205235c66a6f999a465f553', B: '52cf441766a6f999a465fef5'
    O: linked: { gp: { email:'ianyamey@gmail.com'} }
    R: paymethods:1,requests:3,bookings:2,ordered:4,released:0, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('ianyamey@gmail.com')
 # 1503.27 5514b8825955b711004d741d P1      O1 B1 R1 martianinteractive    bayona.sergio@gmail.com  Sergio Bayona,
 # 1401.21 52dde8941c67d1a4859d1d05          martianinteractive    sbayona@martianinteractive.com Sergio Bayona
  martianinteractive:
    U: G: 13754, A: '5514b8825955b711004d741d', B: '52dde8941c67d1a4859d1d05'
    O: linked: { gp: { email:'bayona.sergio@gmail.com'} }, username: 'martianinteractive'
    R: paymethods:1,requests:1,bookings:1,orders:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('bayona.sergio@gmail.com')



fullMix =
# 1404.04 533dd6721c67d1a4859d2ba7   E                deadlyicon     deadlyicon@gmail.com       Jared Grippe,
# 1401.20 52dc97e21c67d1a4859d1cdf   E S1   O2 B1 R1  deadlyicon     jared.other.io@gmail.com   Jared Grippe
  deadlyicon:
    U: G: 8385, A: '52dc97e21c67d1a4859d1cdf', B: '533dd6721c67d1a4859d2ba7'
    O: linked: { gp: { email:'jared.other.io@gmail.com'} }
    R: paymethods:0,requests:1,bookings:1,orders:2,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('jared.other.io@gmail.com')
# 1403.21 532af5eb1c67d1a4859d28c1 P1      O1 B1 R3  KensoDev     avi@kensodev.com     Avi Tzurel
# 1402.21 53064f6f1c67d1a4859d241c     E S1          KensoDev     avi.kenso@gmail.com  Avi Tzurel
  KensoDev:
    U: G: 79502, A: '532af5eb1c67d1a4859d28c1', B: '53064f6f1c67d1a4859d241c'
    O: linked: { gp: { email:'avi@kensodev.com'} }
    R: paymethods:1,requests:3,bookings:1,orders:1,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('avi@kensodev.com')
# 1410.18 5441ae9c8f8c80299bcc4c4a P1      O13 B11 R4  pkellner     peter@peterkellner.net Peter Kellner,
# 1405.29 538638191c67d1a4859d3320   E         pkellner     pkellner99@gmail.com Peter Kellner
  pkellner:
    U: G: 241170, A: '5441ae9c8f8c80299bcc4c4a', B: '538638191c67d1a4859d3320'
    O: linked: { gp: { email:'peter@peterkellner.net'} }
    R: paymethods:1,requests:4,bookings:11,orders:13, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('peter@peterkellner.net')
# 1306.14 51ba69f466a6f999a465f3b5 P1  E S57 B4 O4 P1  O1 B1 R1  gregorynicholas    faction.gregory@gmail.com  gregory nicholas,
# 1305.02 5181f24d66a6f999a465f285     E S4 B1 O1                gregorynicholas    nicholas.g.gregory@gmail.com gregory nicholas
  gregorynicholas:
    U: G: 407650, A: '5181f24d66a6f999a465f285', B: '51ba69f466a6f999a465f3b5'
    O: linked: { gp: { email:'nicholas.g.gregory@gmail.com'} }
    R: paymethods:1,suggests:51,requests:1,bookings:1,orders:1,paidout:1,ordered:5,booked:5, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('nicholas.g.gregory@gmail.com')
# 1403.13 5321909a1c67d1a4859d2782   E S1        R2  irfanyasin     irfanyasin@gmail.com Irfan Yasin,
# 1403.13 532180fc1c67d1a4859d277d   E     O1 B1 R1  irfanyasin     irfan.yasin@buto.tv  Irfan Yasin
  irfanyasin:
    U: G: 1329048, A: '5321909a1c67d1a4859d2782', B: '532180fc1c67d1a4859d277d'
    O: linked: { gp: { email:'irfanyasin@gmail.com' } }
    R: paymethods:0,requests:3,bookings:1,orders:1,suggests:1, fn:({merged,removed}) ->
      expect(merged.user.email).to.equal('irfanyasin@gmail.com')




module.exports = {
  nonCategorizedUsers,
  authors,
  singleProfileExperts,
  easyDoubleProfileExperts,
  easyCustomers,
  basicMix,
  v0ActiveExperts,
  v0ActiveCustomers,
  v1ActiveExperts,
  v1ActiveCustomers
  fullMix,
}

