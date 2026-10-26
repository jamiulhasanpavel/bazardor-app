import { betterAuth } from "better-auth";
import { Pool } from "pg";

export function getAuth() {
  return betterAuth({
    appName: "বাজার দর",
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET ?? "bazardor-development-secret-change-before-deploy",
    database: new Pool({
      connectionString: process.env.DATABASE_URL ?? "postgresql://localhost/bazardor",
    }),
    emailAndPassword: { enabled: true },
    socialProviders: {
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
        : {}),
      ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ? { github: { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET } }
        : {}),
    },
  });
}
