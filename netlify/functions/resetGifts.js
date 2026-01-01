const admin = require('firebase-admin');

// Initialize the app if it's not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const batch = db.batch();

    // 1. Reset all gifts' 'Given' status to false and clear Timestamp
    const gifts = await db.collection('gifts').get();
    gifts.docs.forEach(doc => {
      batch.update(doc.ref, {
        Given: false,
        Timestamp: admin.firestore.FieldValue.delete()
      });
    });

    // 2. Restore skipped gifts back to gifts collection
    const skippedGifts = await db.collection('skipped_gifts').get();
    skippedGifts.docs.forEach(doc => {
      const data = doc.data();
      // Remove skipped-specific fields and reset to available
      const { skippedAt, Timestamp, ...cleanData } = data;

      // Add back to gifts collection
      batch.set(db.collection('gifts').doc(doc.id), {
        ...cleanData,
        Given: false
      });

      // Delete from skipped_gifts
      batch.delete(doc.ref);
    });

    // Commit all changes
    await batch.commit();

    const restoredCount = skippedGifts.docs.length;
    const message = restoredCount > 0
      ? `Gifts reset successfully. Restored ${restoredCount} skipped gift(s).`
      : 'Gifts reset successfully.';

    return {
      statusCode: 200,
      body: JSON.stringify({ message })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
