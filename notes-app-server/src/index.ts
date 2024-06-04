import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import chalk from "chalk";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

app.listen(5000, () => {
  console.log(chalk.green("server running on localhost:5000"));
});

app.post("/notes", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.put("api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});
