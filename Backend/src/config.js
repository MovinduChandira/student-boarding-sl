import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name} (see .env.example)`);
    process.exit(1);
  }
  return value;
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,

  // Comma-separated list of frontend origins allowed to call the API
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  db: {
    connectionString: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "boarding_lk",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  },

  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },

  cookieName: "boarding_token",
  bcryptRounds: 10,
};

config.isProduction = config.env === "production";

if (!config.db.connectionString && !config.db.password) {
  console.error(
    "DB_PASSWORD is empty in .env. If your password contains # or spaces, wrap it in double quotes, e.g. DB_PASSWORD=\"my#pass\""
  );
  process.exit(1);
}

export default config;
