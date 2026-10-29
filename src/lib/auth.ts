import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export function getAuth() {
  const databaseUrl = process.env.DATABASE_URL;
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!databaseUrl || !secret) {
    throw new Error("DATABASE_URL and BETTER_AUTH_SECRET are required to configure authentication.");
  }

  const client = globalForMongo.mongoClient ?? new MongoClient(databaseUrl);
  globalForMongo.mongoClient = client;

  return betterAuth({
    appName: "বাজার দর",
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret,
    database: mongodbAdapter(client.db(), { client }),
    emailAndPassword: { enabled: true },
    socialProviders: {
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
      ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ? {
            github: {
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
            },
          }
        : {}),
    },
  });
}
