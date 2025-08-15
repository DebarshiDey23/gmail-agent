import serviceAccount from "../config/firebase-service-key.json";
import admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();
export { db };