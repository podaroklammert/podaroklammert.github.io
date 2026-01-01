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
    const { id } = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Gift ID is required' })
      };
    }

    // Get the gift data
    const giftDoc = await db.collection('gifts').doc(id).get();
    if (!giftDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Gift not found' })
      };
    }

    const giftData = giftDoc.data();

    // Move to skipped_gifts collection (collection = status, no flag needed)
    await db.collection('skipped_gifts').doc(id).set({
      ...giftData,
      skippedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Delete from gifts collection
    await db.collection('gifts').doc(id).delete();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Gift skipped and moved to archive' })
    };
  } catch (error) {
    console.error('Error skipping gift:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
