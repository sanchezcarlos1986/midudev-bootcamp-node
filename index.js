const express = require("express");
const app = express();
const cors = require("cors");
const colorLog = require("./utils/colorLog");

require("./mongo");

const Note = require("./models/Note");

app.use(cors());
app.use(express.json());

let notes = [];

function getIdFromRequest(request) {
  return Number(request.params.id);
}

app.get("/api", (_, response) => response.send("<h1>HOLA MUNDO</h1>"));

app.get("/api/notes", async (_, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = getIdFromRequest(request);
  const note = notes.find((item) => item.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end("Note not found");
  }
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    return response.status(400).json({
      error: "note or note.content are missing",
    });
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);
  const newNote = {
    id: maxId + 1,
    date: new Date(),
    important: false,
    content: note.content,
  };
  response.status(201).json(newNote);

  notes = [...notes, newNote];
});

app.delete("/api/notes/:id", (request, response) => {
  const id = getIdFromRequest(request);
  notes = notes.filter((item) => item.id !== id);
  response.status(204).end();
});

app.use((_, response) => {
  response.status(404).json({
    error: "Not found...",
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () =>
  colorLog("success", `🔥 Server running on PORT ${PORT} 🔥`)
);
