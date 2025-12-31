const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();

exports.handler = async function(event) {
  try {
    // Default to current year, allow override via query parameter for testing
    const currentYear = new Date().getFullYear();
    const queryYear = event.queryStringParameters?.year;
    const filterYear = queryYear ? parseInt(queryYear) : currentYear;

    const giftsSnapshot = await db.collection('gifts').get();
    const allGifts = giftsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter gifts by year
    const gifts = allGifts.filter(gift => gift.Year === filterYear);

    return {
      statusCode: 200,
      body: JSON.stringify(gifts)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
