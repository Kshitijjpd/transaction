const { MongoClient, ObjectId } = require('mongodb');

async function addBalanceHistoryAndStoreForAll() {
  const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to the database');

    const database = client.db('finaldb');
    const collection = database.collection('final_database');

    // Fetch all documents from the collection
    const documents = await collection.find().toArray();

    for (const document of documents) {
      // Initialize an object to store balance history for each unique combination of chainRPC and vaultAddress
      const balanceHistory = {};

      if (document.transactions && document.transactions.length > 0) {
        for (const transaction of document.transactions) {
          const key = `${transaction.chainRPC}_${transaction.vaultAddress}`;

          // Ensure the key exists in the balanceHistory object
          balanceHistory[key] = balanceHistory[key] || 0;

          // Sum the shares for each unique combination of chainRPC and vaultAddress
          if (transaction.eventName === 'Deposit') {
            balanceHistory[key] += transaction.shares || 0;
          } else if (transaction.eventName === 'Withdraw') {
            balanceHistory[key] -= transaction.shares || 0;
          }
        }
      }

      // Convert the balanceHistory object to an array of objects
      const balanceHistoryArray = Object.entries(balanceHistory).map(([key, totalBalance]) => {
        const [chainRPC, vaultAddress] = key.split('_');
        return { chainRPC, vaultAddress, totalBalance };
      });

      // Add a new field 'balancehistory' with the total balance for each combination of chainRPC and vaultAddress
      document.balancehistory = balanceHistoryArray;

      // Remove the existing _id or create a new one
      delete document._id;
      document._id = new ObjectId();

      // Create a new collection for storing modified documents
      const newCollection = database.collection('new_table1');

      // Insert the modified document into the new collection
      await newCollection.insertOne(document);
    }

    console.log('Balance history added and stored for all documents in new_table collection.');
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

addBalanceHistoryAndStoreForAll();
