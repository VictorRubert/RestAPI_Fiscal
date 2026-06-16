const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Listar erros
app.get("/erros", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM erros
            ORDER BY data DESC
        `);

        res.json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: err.message
        });
    }
});

// Buscar erro por ID
app.get("/erros/:id", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM erros WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                erro: "Erro não encontrado"
            });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: err.message
        });
    }
});

// Cadastrar erro
app.post("/erros", async (req, res) => {
    try {

        const {
            codigo,
            categoria,
            subcategoria,
            causa,
            resolucao,
            perguntar,
            autor
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO erros
            (
                codigo,
                categoria,
                subcategoria,
                causa,
                resolucao,
                perguntar,
                autor,
                data
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                codigo,
                categoria,
                subcategoria,
                causa,
                resolucao,
                perguntar,
                autor
            ]
        );

        res.status(201).json({
            sucesso: true,
            id: result.insertId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: err.message
        });
    }
});

// Editar erro
app.put("/erros/:id", async (req, res) => {
    try {

        const {
            codigo,
            categoria,
            subcategoria,
            causa,
            resolucao,
            perguntar,
            autor
        } = req.body;

        await pool.query(
            `UPDATE erros
            SET
                codigo = ?,
                categoria = ?,
                subcategoria = ?,
                causa = ?,
                resolucao = ?,
                perguntar = ?,
                autor = ?
            WHERE id = ?`,
            [
                codigo,
                categoria,
                subcategoria,
                causa,
                resolucao,
                perguntar,
                autor,
                req.params.id
            ]
        );

        res.json({
            sucesso: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: err.message
        });
    }
});

// Excluir erro
app.delete("/erros/:id", async (req, res) => {
    try {

        await pool.query(
            "DELETE FROM erros WHERE id = ?",
            [req.params.id]
        );

        res.json({
            sucesso: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            erro: err.message
        });
    }
});

// Default
app.get("/", (req, res) => {
    res.send("API funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});