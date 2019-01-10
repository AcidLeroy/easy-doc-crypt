
import { generateKey, encryptDocument, decryptDocument } from './index';
import assert = require('assert')

async function test() {
  // Start by generating a password. This will return a key and a seed.
  // The seed will need to be stored to be used again later, otherwise you won't
  // be able to generate the same key.
  let password = "A Password"
  let result = await generateKey(password)
  console.log('result = ', result)
  // Create some test data
  let data = { phone: '1234567', home: '1234 street', age: 100 }
  let cipherInfo = await encryptDocument(result.secret, JSON.stringify(data))
  let decrypted = await decryptDocument(result.secret, cipherInfo.header, cipherInfo.cipherText)

  let parsed = JSON.parse(decrypted)
  assert(data.phone === parsed.phone)
  assert(data.home === parsed.home)
  assert(data.age === parsed.age)

  try {
    // Trying to use the same password and not passing the result will fail!
    let reused = await generateKey(password)
    decrypted = await decryptDocument(reused.secret, cipherInfo.header, cipherInfo.cipherText)
    assert(false) // This should fail
  } catch (error) {
    assert(true)
  }

  try {
    // This should pass since we are using the salt from the first generation
    let reused = await generateKey(password, result.salt)
    decrypted = await decryptDocument(reused.secret, cipherInfo.header, cipherInfo.cipherText)
    parsed = JSON.parse(decrypted)
    assert(data.phone === parsed.phone)
    assert(data.home === parsed.home)
    assert(data.age === parsed.age)
  } catch (e) {
    console.log('Failed to decrypt the data when we should have!')
    console.log('error ', e)
    assert(false)
  }

  console.log('Success!')
}

test().then(() => {
  console.log('finished')
}).catch(e => {
  console.log('Received an error: ', e)
})
