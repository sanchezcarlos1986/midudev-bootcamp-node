import express from "express";
import Note from "~models/Note";
import User from "~models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", async (_, response) => {
  const notes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
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
  const { content, important = false } = request.body;
  let token = "";

  try {
    const authorization = request.get("authorization");

    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      token = authorization.substring(7);
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken?.id) {
      response
        .status(401)
        .json({ error: "Missing Token or Unauthorized user" });
    }

    const { id: userId } = decodedToken;
    const user = await User.findById(userId);

    if (!content) {
      return response.status(400).json({
        error: "note.content is missing",
      });
    }

    const newNote = new Note({
      date: new Date(),
      important: important || false,
      content,
      user: user._id,
    });
    const savedNote = await newNote.save();

    // Relacionamos la nota guardada con el userId enviado en el body
    user.notes = user.notes.concat(savedNote._id);
    user.save();

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
