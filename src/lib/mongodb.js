import { MongoClient, ServerApiVersion } from "mongodb";

export default function dbConnect(dataBase, collection) {
  const uri = process.env.MongoDB_URI;
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  return client.db(dataBase).collection(collection);
}
