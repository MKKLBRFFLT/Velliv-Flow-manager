// lib/db.ts
import { MongoClient } from "mongodb";

// Make sure you have MONGODB_URI in your .env.local
const uri = process.env.MONGODB_URI as string; 
if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

/**
 * In dev mode, the global variable prevents multiple connections
 * in the dev server's hot reloading.
 */
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allows global scoped vars
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
