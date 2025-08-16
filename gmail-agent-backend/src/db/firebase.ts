import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY as string);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();
export { db };
