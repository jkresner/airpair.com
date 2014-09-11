it('login google: new user')
  expect('google').toExist()
  expect('googleId').toExist()  
  expect('name').toExist()  
  expect('email').toExist()  
  expect('emailVerified').toBe(false)  
  expect('local.password').toBe(null)  


it('login google: has google, no local')
  expect('google').toExist()
  expect('googleId').toExist()  
  expect('name').toExist()  
  expect('email').toExist()  


it('login google: no google, has local, google login matching local email')
  expect('login success')
  expect('profile upsert success')  
  expect('google').toExist()
  expect('googleId').toExist()  


it('login local: user has google, no local, with google email address')
  expect('login fail')
  expect('tell no matching password')  
  expect('ask user to google login')  


it('signup local: new user')
  expect('google').toBe(null)
  expect('googleId').toBe(null)  
  expect('name').toExist()  
  expect('email').toExist()  
  expect('emailVerified').toBe(false)  
  expect('local.password').toBe(null)


it('signup local: has google, no local, singup with matching google email address')
  expect('signup fail')
  expect('ask user to google login')


it('signup local: no google, has local, singup with matching local email')
  expect('signup fail')
  expect('ask user to login')  

