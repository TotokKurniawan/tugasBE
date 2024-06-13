import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { testConnection, query } from "./database/db.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/datanotes", async (req, res) => {
  try {
    const result = await query("SELECT * FROM notes");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/datakedua/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query("SELECT * FROM notes WHERE id = ?", [id]);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    }
  } catch (error) {
    res.status(500).json({ erorr });
  }
});

app.post("/tambahdata", async (req, res) => {
  const { judul, tanggal, catatan } = req.body;
  try {
    await query("INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)", [
      judul,
      tanggal,
      catatan,
    ]);
    res.status(200).json({ message: "Sukses" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/updatedata/:id", async (req, res) => {
  const id = req.params.id;
  const { judul, tanggal, catatan } = req.body;
  try {
    const result = await query(
      "UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?",
      [judul, tanggal, catatan, id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Sukses" });
    }
  } catch (error) {
    res.status(500).json({ erorrr });
  }
});

app.delete("/hapusdata/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query("DELETE FROM notes WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Data Terhapus" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(process.env.APP_PORT, () => {
  testConnection();
  console.log(`Server is running at http://localhost:${process.env.APP_PORT}`);
});