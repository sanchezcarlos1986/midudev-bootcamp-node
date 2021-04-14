import express from "express";
import cors from "cors";
import colorLog from "~utils/colorLog";
import notFound from "~middlewares/notFound";
import handleErrors from "~middlewares/handleErrors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

const { NODE_ENV } = process.env;

const app = express();

Sentry.init({
  dsn:
    "https://4e3fa8b247824e98acadf73d2cd5322f@o568893.ingest.sentry.io/5714260",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

import "./mongo";
import Note from "~models/Note";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

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
    .catch(next);
  // this is like .catch(err => next(err))
});

app.post("/api/notes", async (request, response, next) => {
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

app.put("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  const note = request.body;

  Note.findByIdAndUpdate(id, note)
    .then((result) => response.status(200).end())
    .catch(next);
});

app.delete("/api/notes/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    await Note.findByIdAndRemove(id);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.use(Sentry.Handlers.errorHandler());
app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  NODE_ENV === "development" &&
    colorLog("info", `🔥 Node Server running on PORT ${PORT} 🔥`);
});

export { app, server };
export default app;
