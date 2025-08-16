"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function requireEnv(name, fallback) {
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
exports.env = {
    GOOGLE_CLIENT_ID: requireEnv('GOOGLE_CLIENT_ID', 'placeholder'),
    GOOGLE_CLIENT_SECRET: requireEnv('GOOGLE_CLIENT_SECRET', 'placeholder'),
    GOOGLE_REDIRECT_URI: requireEnv('GOOGLE_REDIRECT_URI', 'https://gmail-agent-t5kd.onrender.com/auth/google/callback')
};
//# sourceMappingURL=env.js.map