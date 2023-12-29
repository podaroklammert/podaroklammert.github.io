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
    // Reset the gifts' 'Given' status
    const gifts = await db.collection('gifts').get();
    const batch = db.batch();

    gifts.docs.forEach(doc => {
      batch.update(doc.ref, { Given: false });
    });

    // Reset the metadata for the last given gift
    // This assumes you want to erase the data
    // You might choose to use `null` or a specific 'empty' indicator
    const metadataRef = db.collection('metadata').doc('lastGivenGift');
    batch.set(metadataRef, {
      RefID: '', // Or 'null' if you prefer to clear the reference.
      Timestamp: null // Removes the timestamp
    });

    // Commit the batch of updates
    await batch.commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Gifts and last given gift reset successfully" })
    };
  } catch (error) {
    console.error(error); // Log the error to the server console
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};