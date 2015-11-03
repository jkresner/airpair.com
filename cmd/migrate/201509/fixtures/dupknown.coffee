# authors =
  # uglow:
  #   U: G: 3990189, A: '54f9fcc05c01080c008ee02c', B: '54fa85995c01080c008eedc5'
  #   O: linked: { gp: { email:'blenzo@paychex.com' } }, username: 'uglow'
  #   R: posts:1, fn:({merged,removed}) ->
  #     expect(merged.user.email).to.equal('blenzo@paychex.com')

# alyssaravasio
#  1305.02 5181f23d66a6f999a465f284 A3  E S1      O3 B2 R3
#  1312.01 529a758c66a6f999a465fccc               O3 B1 R1
# jasonpierce
#  1308.23 521704c666a6f999a465f6c3         O7 B8 R8
#  1411.15 546636238f8c80299bcc505d A1      O1 B1 R2




# singleProfileExperts =
# 1506.10 5577bfb4fc784111004ea1f4   E R1   itzrahulsoni     itzrahulsoni@gmail.com   Rahul Soni
# 1506.10 5577bb7efc784111004ea15d          itzrahulsoni     rahul@attosol.com        Rahul Soni
  # itzrahulsoni:
  #   U: G: 6227719, A: '5577bfb4fc784111004ea1f4', B: '5577bb7efc784111004ea15d'
  #   O: linked: { gp: { email:'itzrahulsoni@gmail.com'} }, username: 'imRahulSoni'
  #   R: fn:({merged,removed}) ->
  #     expect(merged.user.email).to.equal('itzrahulsoni@gmail.com')
# kirkstrobeck
#  1312.04 529e804e66a6f999a465fd15 P1    E S10 B1 O1   O5 B3 R6
#  1407.26 53d2b7268f8c80299bcc3b73                     O3 B2 R1



# basicMix =
# 1502.07 54d57eb0ee3c760a005e5b3c         R1 gauravagarwalr    gauravagarwalr@aol.com Gaurav Agarwal,
# 1404.29 535f6b171c67d1a4859d3005   E R1         gauravagarwalr    gauravagarwal0705@gmail.com  Gaurav Agarwal
  # gauravagarwalr:
  #   U: G: 1390813, A: '535f6b171c67d1a4859d3005', B: '54d57eb0ee3c760a005e5b3c'
  #   O: linked: { gp: { email:'gauravagarwal0705@gmail.com'} }, username: 'gauravagarwalr'
  #   R: requests:1,suggests:1, fn:({merged,removed}) ->
  #     expect(merged.user.email).to.equal('gauravagarwal0705@gmail.com')



# v0ActiveCustomers =
# 1504.10 552737473cbd201100eef1ea                    jjam3774    jjames@cosprofessionals.com Jeffrey James
# 1309.27 524483b966a6f999a465f87a   E S1   O3 B1 R3  jjam3774    jjam3774@gmail.com          Jeffrey James
  # jjam3774:
  #   U: G: 4967611, A: '524483b966a6f999a465f87a', B: '552737473cbd201100eef1ea'
  #   O: linked: { gp: { email:'jjam3774@gmail.com'} }, username: 'jjam3774'
  #   R: paymethods:0,requests:3,bookings:1,orders:3, fn:({merged,removed}) ->
  #     expect(merged.user.email).to.equal('jjam3774@gmail.com')
# jawadabdulsamad
#  1306.17 51be8c1566a6f999a465f3c1         O5 B4 R1
#  1406.14 539b58fb1c67d1a4859d34c7         O1 B1 R2
# bryantchou
#  1402.27 530ea3ff1c67d1a4859d2523         O1 B1 R1
#  1405.07 53690ddb1c67d1a4859d3106         O1 B1 R1
# kevinmorrill
#  1403.25 533106c51c67d1a4859d296f         B1 R1
#  1405.09 536bc2471c67d1a4859d3159         B1 R2


module.exports = {
  # authors,
  # singleProfileExperts,
  # v0ActiveExperts,
  # v0ActiveCustomers,
  # v1ActiveExperts,
  v1ActiveCustomers
}

