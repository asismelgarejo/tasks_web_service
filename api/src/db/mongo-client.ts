import * as mdb from "mongodb";

import { mdbConnectionString } from '../config';

export default async function mongoClient() {
  console.log(">>mdbConnectionString", mdbConnectionString)
  console.log(">>mdb.MongoClient", mdb?.MongoClient)
  const client = new mdb.MongoClient(mdbConnectionString as string, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const mdb = client.db();

    // Test the connection
    const collections = await mdb.collections();
    console.log(
      'Connected to MongoDB | Collections count:',
      collections.length
    );

    return {
      mdb,
      mdbClose: () => client.close(),
    };
  } catch (err) {
    console.error('Error in MongoDB Client', err);
    process.exit(1);
  }
}
