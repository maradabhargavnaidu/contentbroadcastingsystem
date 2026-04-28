const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/error.middleware");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/content", require("./routes/content.routes"));

app.use(errorHandler);

module.exports = app;
