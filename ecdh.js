const crypto = require('crypto');

const himanshu = crypto.createECDH('secp256k1');
himanshu.generateKeys();

const arun = crypto.createECDH('secp256k1');
arun.generateKeys();

// converting himanshu public key to base64 string to transfer it to arun

const himanshuPublicKeyBase64 = himanshu.getPublicKey().toString('base64');
const arunPublicKeyBase64 = arun.getPublicKey().toString('base64');

const himanshuSharedKey = himanshu.computeSecret(arunPublicKeyBase64, 'base64', 'hex');
const arunSharedKey = arun.computeSecret(himanshuPublicKeyBase64, 'base64', 'hex');

console.log(himanshuSharedKey === arunSharedKey);
console.log(himanshuSharedKey);
console.log(arunSharedKey);

