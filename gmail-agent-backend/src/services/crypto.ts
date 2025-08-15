import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const algorithm = "aes-256-gcm";
const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes hex

export function encrypt(text: string): string {
    const key = crypto.createHash("sha256").update(process.env.ENCRYPTION_KEY!).digest(); // 32 bytes
    const iv = crypto.randomBytes(16); // unique IV per encryption

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);

    // Return IV + encrypted text as hex/base64 so you can decrypt later
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}


export function decrypt(data: string): string {
    const key = crypto.createHash("sha256").update(process.env.ENCRYPTION_KEY!).digest(); // 32 bytes
    const [ivHex, encryptedHex] = data.split(":");
    if (!ivHex || !encryptedHex) {
        throw Error("ERRRORROROR")
    }
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString("utf8");
}

