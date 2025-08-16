"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRefreshToken = storeRefreshToken;
exports.getRefreshToken = getRefreshToken;
exports.deleteUserData = deleteUserData;
const firebase_1 = require("./firebase");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
async function storeRefreshToken(email, encryptedToken) {
    const userRef = firebase_1.db.collection("users").doc(email);
    await userRef.set({
        encryptedRefreshToken: encryptedToken,
        createdAt: firebase_admin_1.default.firestore.FieldValue.serverTimestamp()
    }, { merge: true }); // merge ensures you don’t overwrite filters later
}
async function getRefreshToken(email) {
    console.log("Fetching refresh token for", email);
    const doc = await firebase_1.db.collection("users").doc(email).get();
    if (!doc.exists) {
        console.log("No user document found");
        return null;
    }
    const token = doc.data()?.encryptedRefreshToken;
    if (!token) {
        console.log("No refresh token stored for this user");
        return null;
    }
    return token;
}
async function deleteUserData(email) {
    console.log(`Deleting all data for ${email}`);
    await firebase_1.db.collection("users").doc(email).delete();
    console.log(`Data deleted for ${email}`);
}
//# sourceMappingURL=users.js.map