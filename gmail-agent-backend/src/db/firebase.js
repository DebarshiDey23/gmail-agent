"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_service_key_json_1 = __importDefault(require("../config/firebase-service-key.json"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebase_service_key_json_1.default)
});
const db = firebase_admin_1.default.firestore();
exports.db = db;
//# sourceMappingURL=firebase.js.map