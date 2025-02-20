const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Servir arquivos HTML, CSS e JS

// Conexão com o Banco de Dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar no MySQL:", err);
    } else {
        console.log("Conectado ao MySQL!");
    }
});

// Rota para criar um agendamento
app.post("/api/agendamentos", (req, res) => {
    const { nome, email, telefone, data } = req.body;
    const sql = "INSERT INTO agendamentos (nome, email, telefone, data) VALUES (?, ?, ?, ?)";
    db.query(sql, [nome, email, telefone, data], (err, result) => {
        if (err) {
            res.status(500).json({ erro: err.message });
        } else {
            res.status(201).json({ id: result.insertId, nome, email, telefone, data });
        }
    });
});

// Rota para listar agendamentos
app.get("/api/agendamentos", (req, res) => {
    const sql = "SELECT * FROM agendamentos ORDER BY data ASC";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ erro: err.message });
        } else {
            res.json(results);
        }
    });
});

// Rota para deletar um agendamento
app.delete("/api/agendamentos/:id", (req, res) => {
    const sql = "DELETE FROM agendamentos WHERE id = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            res.status(500).json({ erro: err.message });
        } else {
            res.json({ mensagem: "Agendamento removido!" });
        }
    });
});


app.put("/api/agendamentos/:id", (req, res) => {
    const { status } = req.body; 
    const sql = "UPDATE agendamentos SET status = ? WHERE id = ?";
    
    db.query(sql, [status, req.params.id], (err) => {
        if (err) {
            res.status(500).json({ erro: err.message });
        } else {
            res.json({ mensagem: "Status atualizado com sucesso!" });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

