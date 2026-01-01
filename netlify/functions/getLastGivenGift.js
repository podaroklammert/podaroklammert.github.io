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

// Get current year in Amsterdam timezone
function getAmsterdamYear() {
  return parseInt(new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam', year: 'numeric' }));
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Default to current year (Amsterdam time), allow override via query parameter
    const currentYear = getAmsterdamYear();
    const queryYear = event.queryStringParameters?.year;
    const targetYear = queryYear ? parseInt(queryYear) : currentYear;

    // Query gifts: Given=true, Year=targetYear, ordered by Timestamp desc, limit 1
    const snapshot = await db.collection('gifts')
      .where('Year', '==', targetYear)
      .where('Given', '==', true)
      .orderBy('Timestamp', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No gift found for this year." })
      };
    }

    const giftDoc = snapshot.docs[0];
    const giftData = giftDoc.data();

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: giftDoc.id,
        ...giftData
      })
    };

  } catch (error) {
    console.error('Error retrieving last given gift:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while retrieving the last given gift.' })
    };
  }
};
