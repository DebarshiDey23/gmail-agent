import { db } from "./firebase";
import admin from "firebase-admin";


export async function storeRefreshToken(email: string, encryptedToken: string) {
    const userRef = db.collection("users").doc(email);
    await userRef.set({
        encryptedRefreshToken: encryptedToken,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true }); // merge ensures you don’t overwrite filters later
}

export async function getRefreshToken(email: string): Promise<string | null> {
    console.log("Fetching refresh token for", email);
    const doc = await db.collection("users").doc(email).get();
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
export async function deleteUserData(email: string) {
    console.log(`Deleting all data for ${email}`);
    await db.collection("users").doc(email).delete();
    console.log(`Data deleted for ${email}`);
}