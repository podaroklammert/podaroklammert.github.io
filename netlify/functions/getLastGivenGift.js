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

exports.handler = async function(event, context) {
  // This Netlify function will only respond to HTTP GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Default to current year, allow override via query parameter for testing
    const currentYear = new Date().getFullYear();
    const queryYear = event.queryStringParameters?.year;
    const targetYear = queryYear ? parseInt(queryYear) : currentYear;

    // Get the document reference for 'lastGivenGift' from the 'metadata' collection
    const metadataRef = db.collection('metadata').doc('lastGivenGift');
    const metadataDoc = await metadataRef.get();

    if (!metadataDoc.exists) {
      // If the 'lastGivenGift' document does not exist, return a meaningful message
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Last given gift record not found." })
      };
    }

    const lastGivenGiftMetadata = metadataDoc.data();

    // Using the 'RefID' from metadata to get the last given gift details
    const giftRef = db.collection('gifts').doc(lastGivenGiftMetadata.RefID);
    const giftDoc = await giftRef.get();

    if (!giftDoc.exists) {
      // If the gift with 'RefID' does not exist, return a meaningful message
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Gift not found." })
      };
    }

    const giftData = giftDoc.data();

    // Check if the gift belongs to the target year
    if (giftData.Year !== targetYear) {
      // Gift is from a different year, don't show it
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No gift found for current year." })
      };
    }

    // Return the last given gift data
    return {
      statusCode: 200,
      body: JSON.stringify(giftData)
    };

  } catch (error) {
    console.error('Error retrieving last given gift:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while retrieving the last given gift.' })
    };
  }
};