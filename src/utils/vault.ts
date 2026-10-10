const VAULT_SALT = "tauric_vault_2026";

/**
 * Decrypts an encrypted vault token/ciphertext at runtime.
 * If the input is already decrypted or empty, returns it as-is.
 */
export function decryptVaultToken(ciphertext: string): string {
  if (!ciphertext) return "";
  if (
    ciphertext.startsWith("AIza") ||
    ciphertext.includes("apps.googleusercontent.com") ||
    ciphertext.startsWith("1:")
  ) {
    return ciphertext;
  }
  try {
    const raw =
      typeof window !== "undefined"
        ? atob(ciphertext)
        : Buffer.from(ciphertext, "base64").toString("binary");
    let decrypted = "";
    for (let i = 0; i < raw.length; i++) {
      decrypted += String.fromCharCode(
        raw.charCodeAt(i) ^ VAULT_SALT.charCodeAt(i % VAULT_SALT.length)
      );
    }
    return decrypted;
  } catch {
    return ciphertext;
  }
}

/**
 * Decrypts all configuration parameters in an encrypted config object.
 */
export function decryptVaultConfig(
  encConfig: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(encConfig)) {
    result[key] = decryptVaultToken(val);
  }
  return result;
}
