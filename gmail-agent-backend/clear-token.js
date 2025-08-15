// clear-token.js
const admin = require('firebase-admin');

// Initialize Firebase (adjust path to your service account key)
const serviceAccount = require('../../credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearToken() {
    try {
        await db.collection('users').doc('debarshirdey@gmail.com').delete();
        console.log('User data deleted successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

clearToken();