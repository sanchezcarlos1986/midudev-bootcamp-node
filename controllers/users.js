import express from "express";
import User from "~models/User";

const router = express.Router();

router.get("/", async (_, response) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (err) {
    console.log({ err });
  }
});

router.post("/", async (request, response, next) => {
  const user = request.body;

  if (!user || !user.username) {
    return response.status(400).json({
      error: "user or user.content are missing",
    });
  }

  const newUser = new User({
    username: user.username,
    name: user.name,
    passwordHash: user.password,
  });

  try {
    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

export default router;
