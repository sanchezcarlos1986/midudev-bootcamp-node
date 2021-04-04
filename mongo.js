const mongoose = require("mongoose");
const password = require("./password");
const colorLog = require("./utils/colorLog");

const { Schema, model } = mongoose;

// const connectionString = `mongodb+srv://carlos1986:${password}@cluster0.hnqf6.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const connectionString = `mongodb://carlos1986:${password}@cluster0-shard-00-00.hnqf6.mongodb.net:27017,cluster0-shard-00-01.hnqf6.mongodb.net:27017,cluster0-shard-00-02.hnqf6.mongodb.net:27017/midudb?ssl=true&replicaSet=atlas-psfzpq-shard-0&authSource=admin&retryWrites=true&w=majority`;

const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

// Mongoose connection
mongoose
  .connect(process.env.MONGO_URI || connectionString, mongoConfig)
  .then(() => colorLog("success", `✅ MongoDB Connected ✅`))
  .catch((err) => colorLog("error", "Error connection to MongoDB", err));

const notesSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = new model("Note", notesSchema);

const note = new Note({
  content: "MongoBD is awesome!",
  date: new Date(),
  important: true,
});

note.save();
