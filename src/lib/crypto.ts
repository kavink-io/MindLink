import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

export interface KeyPair {
  publicKey: string;
  secretKey: string;
}

export function generateKeyPair(): KeyPair {
  const pair = nacl.box.keyPair();
  return {
    publicKey: encodeBase64(pair.publicKey),
    secretKey: encodeBase64(pair.secretKey),
  };
}

export function encryptMessage(
  message: string,
  recipientPublicKey: string,
  senderSecretKey: string
): { encrypted: string; nonce: string } {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = decodeUTF8(message);
  const encrypted = nacl.box(
    messageUint8,
    nonce,
    decodeBase64(recipientPublicKey),
    decodeBase64(senderSecretKey)
  );
  return {
    encrypted: encodeBase64(encrypted),
    nonce: encodeBase64(nonce),
  };
}

export function decryptMessage(
  encryptedBase64: string,
  nonceBase64: string,
  senderPublicKey: string,
  recipientSecretKey: string
): string | null {
  try {
    const decrypted = nacl.box.open(
      decodeBase64(encryptedBase64),
      decodeBase64(nonceBase64),
      decodeBase64(senderPublicKey),
      decodeBase64(recipientSecretKey)
    );
    if (!decrypted) return null;
    return encodeUTF8(decrypted);
  } catch {
    return null;
  }
}

// Symmetric encryption for room-wide messages (shared key)
export function generateSharedKey(): string {
  return encodeBase64(nacl.randomBytes(nacl.secretbox.keyLength));
}

export function encryptSymmetric(message: string, keyBase64: string): { encrypted: string; nonce: string } {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = decodeUTF8(message);
  const encrypted = nacl.secretbox(messageUint8, nonce, decodeBase64(keyBase64));
  return {
    encrypted: encodeBase64(encrypted),
    nonce: encodeBase64(nonce),
  };
}

export function decryptSymmetric(encryptedBase64: string, nonceBase64: string, keyBase64: string): string | null {
  try {
    const decrypted = nacl.secretbox.open(
      decodeBase64(encryptedBase64),
      decodeBase64(nonceBase64),
      decodeBase64(keyBase64)
    );
    if (!decrypted) return null;
    return encodeUTF8(decrypted);
  } catch {
    return null;
  }
}
