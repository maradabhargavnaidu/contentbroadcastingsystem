const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Content Broadcasting API",
      version: "1.0.0",
      description: "Backend API for Content Broadcasting System",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.js")], // ✅ FIXED PATH
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
