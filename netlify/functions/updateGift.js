const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const admin = require('firebase-admin');

// Initialize Firebase admin SDK with your project credentials...
// (already present in your current function)

const db = admin.firestore();

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { id } = JSON.parse(event.body);

    // Start a Firestore transaction to perform the update atomically
    await db.runTransaction(async (transaction) => {
      const giftRef = db.collection('gifts').doc(id);

      // Update the gift's 'Given' status and 'Timestamp'
      transaction.update(giftRef, {
        Given: true,
        Timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      // Define the reference to the metadata document storing the last given gift
      const metadataRef = db.collection('metadata').doc('lastGivenGift');

      // Update the metadata document with the 'RefID' and 'Timestamp' of the last given gift
      transaction.set(metadataRef, {
        RefID: id,
        Timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Gift updated and last given gift metadata set successfully" })
    };
  } catch (error) {
    console.error('Transaction failure:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};