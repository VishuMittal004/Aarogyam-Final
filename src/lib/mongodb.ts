import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'aarogyam';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

interface MongoClientCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: MongoClientCache;
}

if (!global._mongoClientPromise) {
  global._mongoClientPromise = {
    client: null,
    db: null,
    promise: null,
  };
}

const cached = global._mongoClientPromise;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
    };
    cached.promise = MongoClient.connect(MONGODB_URI, opts);
  }

  const client = await cached.promise;
  const db = client.db(MONGODB_DB);

  cached.client = client;
  cached.db = db;

  return { client, db };
}

export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}
