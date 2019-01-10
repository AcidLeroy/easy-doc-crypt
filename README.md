# easy-doc-crypt

This module makes encrypting and decrypting string data with a password easy
by leveraging [libsodium-wrappers](https://github.com/jedisct1/libsodium.js) under the hood 👌.
It was specifically built to help with encrypting and decrypting data for [NeDB](https://github.com/louischatriot/nedb) 🔆.

## API

### `generateKey(password: string, salt?: string): Promise<{ secret: string, salt: string }>`
Generate a key and salt using a password. If salt is not provided, a new key will
be generated each time, so make sure you save the salt! Returns a promise with the secret
key and the salt. You should never store the secret

### `encryptDocument(key: string, serializedData: string): Promise<{ cipherText: string, header: string }> `
Encrypt a string with the key. This returns the cipher text and the header. Be sure to
store the cipherText with the header or you will not be able to decrypt the data! Returns
a promise with the cipher text and header.

### `decryptDocument(key: string, header: string, cipherText: string): Promise<string>`
Decrypt data given a secret key, the header, and the cipher text. It returns a Promise
with a string containing the decrypted data.

## Example
Please take a look at the [TEST](src/index.test.ts) to see how to use it.
