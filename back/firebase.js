import firebaseAdmin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

export const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

export const firebaseStorage = firebaseApp
    .storage()
    .bucket('voice-assistant-7fca1.appspot.com');
