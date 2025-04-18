const rawKey = 'p4E!x9z@1Lk#Vm$2'; // 16-byte AES key
const key = CryptoJS.enc.Utf8.parse(rawKey);

const urlParams = new URLSearchParams(window.location.search);
const encryptedKey = urlParams.get('key');
const movieId = urlParams.get('id');

let decryptedLink = '';

if (encryptedKey) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedKey, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    decryptedLink = decrypted.toString(CryptoJS.enc.Utf8);

    if (decryptedLink) {
      console.log("🔓 Decrypted Link:", decryptedLink);
      // Redirect with decrypted link
      const redirectUrl = `/download-movie/?link=${encodeURIComponent(decryptedLink)}&id=${movieId}`;
      window.location.href = redirectUrl;
    } else {
      console.error("❌ Decryption failed or key mismatch.");
    }

  } catch (err) {
    console.error('❌ Decryption error:', err);
  }
} else {
  console.warn('⚠️ Missing encrypted key.');
}
