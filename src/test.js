// import * as _sodium from 'libsodium-wrappers';
const _sodium = require('libsodium-wrappers');

(async () => {
  await _sodium.ready;

  try {
    const sodium = _sodium;
    // This is a password the user would enter to get their master key
    let PASSWORD = 'This is super secret'
    // This salt would ideally be stored somewhere on disk after it is generated
    // let salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES)
    // For testing, we can seed the salt so we can get the same key each time.
    let seed = new Uint8Array(sodium.randombytes_SEEDBYTES)
    console.log('sodium.seedbytes= ', sodium.randombytes_SEEDBYTES)
    // let salt = sodium.randombytes_buf_deterministic(sodium.crypto_pwhash_SALTBYTES, seed)
    let salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES)

    // Generate a key using the password.
    let secretKey = sodium.crypto_pwhash(sodium.crypto_box_SEEDBYTES, PASSWORD, salt, sodium.crypto_pwhash_OPSLIMIT_MIN, sodium.crypto_pwhash_MEMLIMIT_MIN,
      sodium.crypto_pwhash_ALG_DEFAULT)

    // Use the secret to de/encrypt stuff.
    console.log('The encryption key is: ', sodium.to_hex(secretKey))
  } catch (e) {
    console.log('received an error: ', e)
  }
})();


// async function generateKey(password) {
//   await _sodium.ready;
//   const sodium = _sodium;
//   try {
//     // This salt would ideally be stored somewhere on disk after it is generated
//     // let salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES)
//     // For testing, we can seed the salt so we can get the same key each time.
//     let seed = new Uint8Array(sodium.randombytes_SEEDBYTES)
//     let salt = sodium.randombytes_buf_deterministic(sodium.crypto_pwhash_SALTBYTES, seed)
//     // Generate a key using the password.
//     let secretKey = sodium.crypto_pwhash(sodium.crypto_box_SEEDBYTES, PASSWORD, salt, sodium.crypto_pwhash_OPSLIMIT_MIN, sodium.crypto_pwhash_MEMLIMIT_MIN,
//      sodium.crypto_pwhash_ALG_DEFAULT)
//
//     // Use the secret to de/encrypt stuff.
//     console.log('The encryption key is: ', sodium.to_hex(secretKey))
//     return secretKey
//   } catch (e) {
//     console.log('received an error: ', e)
//   }
//
// }
// function encryptDocument(key, object) {
//
// }
// function decryptDocument(key){}
