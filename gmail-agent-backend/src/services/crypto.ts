import crypto from "crypto";
import dotenv from "dotenv";
import { auth } from "firebase-admin";

dotenv.config();

const algorithm = "aes-256-gcm";

// Use consistent key derivation
function getKey(): Buffer {
    return crypto.createHash("sha256").update(process.env.ENCRYPTION_KEY!).digest();
}

export function encrypt(text: string): string {
    const key = getKey();
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const authTag = cipher.getAuthTag(); // Important for GCM mode!

    // Return IV + authTag + encrypted text
    return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(data: string): string {
    const key = getKey();
    const parts = data.split(":");

    if (parts.length !== 3) {
        throw new Error("Invalid encrypted data format");
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    if (!ivHex || !authTagHex || !encryptedHex) {
        throw Error
    }
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag); // Important for GCM mode!

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
}