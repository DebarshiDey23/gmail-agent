import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string, fallback?: string): string {
    const value = process.env[name];
    if (!value) {
        if (fallback) {
            console.warn(`Missing ${name}, using fallback: ${fallback}`);
            return fallback;
        }
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    GOOGLE_CLIENT_ID: requireEnv('GOOGLE_CLIENT_ID', 'placeholder'),
    GOOGLE_CLIENT_SECRET: requireEnv('GOOGLE_CLIENT_SECRET', 'placeholder'),
    GOOGLE_REDIRECT_URI: requireEnv('GOOGLE_REDIRECT_URI', 'https://gmail-agent-t5kd.onrender.com/auth/google/callback')

};