const { MongoClient } = require('mongodb');

async function displayData() {
  const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to the database');

    const database = client.db('finaldb');
    const collection = database.collection('final_database');

    // Fetch the first 10 documents from the collection
    const documents = await collection.find().limit(10).toArray();

    // Display the documents in the console
    console.log('First 10 documents from final_database collection:');
    console.log(documents);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

displayData();
