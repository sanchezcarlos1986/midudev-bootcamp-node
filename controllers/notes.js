import express from "express";
import Note from "~models/Note";

const router = express.Router();

router.get("/", async (_, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

router.get("/:id", (request, response, next) => {
  const { id } = request.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end("Note not found");
      }
    })
    .catch(next);
  // this is like .catch(err => next(err))
});

router.post("/", async (request, response, next) => {
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

  try {
    const savedNote = await newNote.save();
    response.status(201).json(savedNote);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", (request, response, next) => {
  const { id } = request.params;
  const note = request.body;

  Note.findByIdAndUpdate(id, note)
    .then((result) => response.status(200).end())
    .catch(next);
});

router.delete("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    await Note.findByIdAndRemove(id);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
