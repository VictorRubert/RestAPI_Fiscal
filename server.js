const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: "localhost",
    user: "usuario",
    password: "senha",
    database: "diario_erros"
});

app.get("/erros", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM erros"
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.post("/erros", async (req, res) => {
    const { titulo, descricao } = req.body;

    try {
        await pool.query(
            "INSERT INTO erros (titulo, descricao) VALUES (?, ?)",
            [titulo, descricao]
        );

        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.listen(3000, () => {
    console.log("API rodando");
});