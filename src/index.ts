import _sodium = require('libsodium-wrappers');
/**
 * Geneate a key for encryption using a password
 * @param  password A string that represents the password
 * @param  seed     A seed to salt the password. This argument can be undefined. In order to
 *                  get the same key out each time after the seed is generated, it must be passed in.
 * @return          returns the secret keey and the seed. DO NOT STORE THE SECRET KEY, onlyt the seed
 */
async function generateKey(password: string, salt?: string): Promise<{ secret: string, salt: string }> {
  await _sodium.ready;
  const sodium = _sodium;

  // This salt would ideally be stored somewhere on disk after it is generated
  // let salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES)
  // For testing, we can seed the salt so we can get the same key each time.
  if (!salt)
    salt = sodium.to_hex(sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES))
  // Generate a key using the password.
  let secretKey = sodium.crypto_pwhash(sodium.crypto_box_SEEDBYTES, password, sodium.from_hex(salt), sodium.crypto_pwhash_OPSLIMIT_MIN, sodium.crypto_pwhash_MEMLIMIT_MIN,
    sodium.crypto_pwhash_ALG_DEFAULT)

  return { secret: sodium.to_hex(secretKey), salt: salt }
}

/**
 * Encrypt a document using a key and serialized data
 * @param  key            Uint8Array that represents a secret key
 * @param  serializedData String that represents the serialized data
 * @return                Returns a ciphertext and header. They must be kept together in order decrypt the document later
 */
async function encryptDocument(key: string, serializedData: string): Promise<{ cipherText: string, header: string }> {
  await _sodium.ready;
  const sodium = _sodium;
  let s = sodium.crypto_secretstream_xchacha20poly1305_init_push(sodium.from_hex(key))
  let result = sodium.crypto_secretstream_xchacha20poly1305_push(s.state, sodium.from_string(serializedData),
    null, sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL)
  return { cipherText: sodium.to_base64(result, sodium.base64_variants.ORIGINAL), header: sodium.to_hex(s.header) }
}

/**
 * Decrypt the cipher text
 * @param  key        Secret key to decrypt the data with
 * @param  header     header used to decrypt cipher text
 * @param  cipherText The cipher text of the document
 * @return            The string of the original data
 */
async function decryptDocument(key: string, header: string, cipherText: string): Promise<string> {
  await _sodium.ready;
  const sodium = _sodium;
  let s = sodium.crypto_secretstream_xchacha20poly1305_init_pull(sodium.from_hex(header), sodium.from_hex(key))
  let res = sodium.crypto_secretstream_xchacha20poly1305_pull(s, sodium.from_base64(cipherText, sodium.base64_variants.ORIGINAL));
  if (!res) {
    throw new Error('Error decrypting the data!')
  }

  if (res.tag as any !== sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL){
    console.log(' sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL ',  sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL)
    console.log('tag = ', typeof(res.tag))
    throw new Error('Did not receive the final tag!')
  }

  return sodium.to_string(res.message)
}

export { generateKey, encryptDocument, decryptDocument }
