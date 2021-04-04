require("dotenv").config();
const mongoose = require("mongoose");
const colorLog = require("./utils/colorLog");

const connectionString = process.env.MONGO_DB_URI;

const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

// Mongoose connection
mongoose
  .connect(connectionString, mongoConfig)
  .then(() => colorLog("success", `✅ MongoDB Connected ✅`))
  .catch((err) => colorLog("error", "Error connection to MongoDB", err));
