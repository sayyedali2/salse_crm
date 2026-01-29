import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-cbc';
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('Missing ENCRYPTION_KEY in environment variables');
  }
  return Buffer.from(key);
};

export const encryptKey = (text: string) => {
  const key = getEncryptionKey();
  const IV = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, IV);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encryptedData: encrypted,
    iv: IV.toString('hex'),
  };
};

export const decyptKey = (encryptedData: string, iv: string) => {
  const key = getEncryptionKey();
  const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  console.log(decrypted);
  return decrypted;
};
