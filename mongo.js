require("dotenv").config();
import mongoose from "mongoose";
import colorLog from "~utils/colorLog";

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;

const connectionString = NODE_ENV === "test" ? MONGO_DB_URI_TEST : MONGO_DB_URI;

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
