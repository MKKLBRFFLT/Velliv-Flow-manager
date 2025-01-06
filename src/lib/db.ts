import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client: MongoClient;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

const clientPromise: Promise<MongoClient> = global._mongoClientPromise;

export default clientPromise;
