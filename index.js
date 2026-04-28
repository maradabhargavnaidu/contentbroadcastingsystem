require("dotenv").config();

const app = require("./app");
const prisma = require("./config/prisma");
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
