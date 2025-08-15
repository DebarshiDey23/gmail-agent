import { db } from "./firebase";
import admin from "firebase-admin";


export async function storeRefreshToken(email: string, encryptedToken: string) {
    const userRef = db.collection("users").doc(email);
    await userRef.set({
        encryptedRefreshToken: encryptedToken,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true }); // merge ensures you don’t overwrite filters later
}

export async function getRefreshToken(email: string) {
    const doc = await db.collection("users").doc(email).get()
    if (!doc.exists) return null;
    return doc.data()?.encryptedRefreshToken || null;
}