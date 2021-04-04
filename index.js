const express = require("express");
const app = express();
const cors = require("cors");
const colorLog = require("./utils/colorLog");
const notFound = require("./middlewares/notFound");
const handleErrors = require("./middlewares/handleErrors");

require("./mongo");

const Note = require("./models/Note");

app.use(cors());
app.use(express.json());

app.get("/api", (_, response) => response.send("<h1>HOLA MUNDO</h1>"));

app.get("/api/notes", async (_, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

app.get("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end("Note not found");
      }
    })
    .catch((err) => next(err));
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    return response.status(400).json({
      error: "note or note.content are missing",
    });
  }

  const newNote = new Note({
    date: new Date(),
    important: note.important || false,
    content: note.content,
  });

  newNote.save().then((savedNote) => response.status(201).json(savedNote));
});

app.put("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  const note = request.body;

  Note.findByIdAndUpdate(id, note)
    .then((result) => response.status(200).end())
    .catch((err) => next(err));
});

app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findByIdAndRemove(id)
    .then((result) => response.status(204).end())
    .catch((err) => next(err));
});

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;

app.listen(PORT, () =>
  colorLog("info", `🔥 Node Server running on PORT ${PORT} 🔥`)
);
