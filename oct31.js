
const { MongoClient } = require('mongodb');

async function displayDataAndSave() {
  const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to the database');

    const database = client.db('transact_info');
    const collection = database.collection('events1');

    // Define the regex pattern for the date to capture transactions before 31/10/2023, 5:30:00 PM
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/2023/;
    const timeRegex = /(\d{1,2}):(\d{2}):(\d{2})/;
    
    // Construct the query to find documents with a timestamp matching the regex
    const dateFilter = {
      timestamp: {
        $lt: '31/10/2023 17:30:00' // Updated date for the filter
      }
    };

    // Fetch documents that match the date filter
    const documents = await collection.find(dateFilter).toArray();

    // Display documents in the console
    console.log(`Transactions before 31/10/2023, 5:30:00 PM:`);
    console.log(documents);

    // Save documents to a new collection named "time31"
    const newCollection = database.collection('time31');
    await newCollection.insertMany(documents);
    console.log('Documents saved to "time31" collection');
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

displayDataAndSave();


























// const { MongoClient } = require('mongodb');

// async function displayData() {
//   const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
//   const client = new MongoClient(uri, { useUnifiedTopology: true });

//   try {
//     await client.connect();
//     console.log('Connected to the database');

//     const database = client.db('transact_info');
//     const collection = database.collection('events1');

//     // Define the regex pattern for the date to capture transactions before 31/10/2023, 5:30:00 PM
//     const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/2023/;
//     const timeRegex = /(\d{1,2}):(\d{2}):(\d{2})/;
    
//     // Construct the query to find documents with a timestamp matching the regex
//     const dateFilter = {
//       timestamp: {
//         $lt: '31/10/2023 17:30:00' // Updated date for the filter
//       }
//     };

//     // Fetch documents that match the date filter
//     const documents = await collection.find(dateFilter).toArray();

//     // Display documents in the console
//     console.log(`Transactions before 31/10/2023, 5:30:00 PM:`);
//     console.log(documents);
//   } finally {
//     await client.close();
//     console.log('Connection closed');
//   }
// }

// displayData();
