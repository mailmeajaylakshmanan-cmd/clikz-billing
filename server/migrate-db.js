const mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_URI = 'mongodb://localhost:27017/clikz-billing';
const REMOTE_URI = process.env.MONGODB_URI;

if (!REMOTE_URI || REMOTE_URI.includes('localhost') || REMOTE_URI.includes('127.0.0.1')) {
  console.error('Error: Please update your MONGODB_URI in server/.env with your MongoDB Atlas connection string before running migration.');
  process.exit(1);
}

async function runMigration() {
  console.log('--- Database Migration Tool ---');
  
  // 1. Connect to Local Database
  console.log(`Connecting to local database: ${LOCAL_URI}...`);
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('Connected to local database.');

  // 2. Connect to Remote Database
  console.log(`Connecting to remote database: ${REMOTE_URI.replace(/:([^@]+)@/, ':****@')}...`);
  const remoteConn = await mongoose.createConnection(REMOTE_URI).asPromise();
  console.log('Connected to remote database.');

  // 3. Get collections from local database
  const collections = await localConn.db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name).filter(name => !name.startsWith('system.'));

  if (collectionNames.length === 0) {
    console.log('No collections found in local database to migrate.');
    await localConn.close();
    await remoteConn.close();
    return;
  }

  console.log(`Found collections in local database: ${collectionNames.join(', ')}`);

  // 4. Migrate each collection
  for (const name of collectionNames) {
    console.log(`Migrating collection: ${name}...`);
    const localCollection = localConn.db.collection(name);
    const remoteCollection = remoteConn.db.collection(name);

    // Get all documents
    const docs = await localCollection.find({}).toArray();
    console.log(`- Found ${docs.length} documents in local ${name}`);

    if (docs.length > 0) {
      // Clear remote collection first (optional, but prevents duplicates)
      console.log(`- Clearing remote collection ${name} before import...`);
      await remoteCollection.deleteMany({});

      // Insert documents
      const result = await remoteCollection.insertMany(docs);
      console.log(`- Successfully imported ${result.insertedCount} documents into remote ${name}`);
    } else {
      console.log(`- Collection ${name} is empty, skipping import.`);
    }
  }

  console.log('\nMigration completed successfully!');
  await localConn.close();
  await remoteConn.close();
}

runMigration().catch(err => {
  console.error('Migration failed with error:', err);
  process.exit(1);
});
