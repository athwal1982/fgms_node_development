import {constant} from "../constants/constant.js";
import * as crypto from "crypto";
const KEY = "my_secret_key_12345";
const IV = crypto.randomBytes(16);

const {CIPHER_ALGO, CIPHER_SECRET_KEY} = constant;
const salt = "865ab5ce-0d67-11e8-ba89-0ed5f89f718b";
const iterations = 10000;
const keylen = 64;
const digest = "sha512";


const createCryptoHashPassword = async (password) => {
  const key = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  console.log('password, salt, iterations, keylen, digest',password, salt, iterations, keylen, digest);
  console.log('key',key.toString("hex"));
  return key.toString("hex");
};
const encrypt = async (password) => {
    try {
        const cipher = crypto.createCipheriv(CIPHER_ALGO, KEY, IV)
        let encrypted = cipher.update(password, 'utf8', 'hex')
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (err) {
        return null;
    }
}

const decrypt = async (password) => {
    try {
        const decipher = crypto.createDecipheriv(CIPHER_ALGO, KEY, IV);
        let decrypted = decipher.update(password, 'hex', 'utf8')
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        return null;
    }
}
const encryptedKey = "cfcfcgjh-hghgh-3hgh4ge-6refcg-hgfhf75rtdcgfcbv";

export const encryptData = (ciphertext) => {
    try {
      const encodedStringBtoA = btoa(ciphertext);
      return encodedStringBtoA;
    } catch (err) {
      return null;
    }
  };

export const decryptData = (ciphertext) => {
    try {
        const decodedStringAtoB = atob(ciphertext);

        return decodedStringAtoB;
      } catch (err) {
        return null;
      }
    };
     
    const encryptThird=async(data , encryptionKey) => {
      try {
        const initializationVector = crypto.randomBytes(16);
        const hashedEncryptionKey = crypto.createHash('sha256').update(encryptionKey).digest('hex').substring(0, 32);
        const cipher = crypto.createCipheriv('aes256', hashedEncryptionKey, initializationVector);
      
        let encryptedData = cipher.update(Buffer.from(data, 'utf-8'));
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
      
        return `${initializationVector.toString('hex')}:${encryptedData.toString('hex')}`;
      } catch (err) {
          return null;
      }
    }
    const decryptThird = async (encryptedData, encryptionKey) => {
      try {
        const [initializationVectorAsHex, encryptedDataAsHex] = encryptedData?.split(':');
        const initializationVector = Buffer.from(initializationVectorAsHex, 'hex');
        const hashedEncryptionKey = crypto.createHash('sha256').update(encryptionKey).digest('hex').substring(0, 32);
        const decipher = crypto.createDecipheriv('aes256', hashedEncryptionKey, initializationVector);
        
        let decryptedText = decipher.update(Buffer.from(encryptedDataAsHex, 'hex'));
        decryptedText = Buffer.concat([decryptedText, decipher.final()]);
      
        return decryptedText.toString();
      } catch (err) {
          return null;
      }
    }
    

export const AuthHelpers = {
    encrypt,
    decrypt,
    encryptData,
    decryptData,
    createCryptoHashPassword,
    encryptThird,
    decryptThird
}
