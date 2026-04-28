require("dotenv").config();

const config = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  DATABASE_URL: process.env.DATABASE_URL,
};

module.exports = config;