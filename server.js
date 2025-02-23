import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import verificarLogin from "./middleware/verificarLogin.js"; 


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public")); 
app.use(session({
    secret:"12912991929219",
    resave:"false",
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }
}))

app.get("/sistema.html", verificarLogin, (req, res) => {
    res.sendFile(__dirname + "/sistema.html");
});

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


app.post("/api/agendamentos", verificarLogin,(req,res) => {
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


app.get("/api/agendamentos", verificarLogin, (req, res) => {
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
app.delete("/api/agendamentos/:id",verificarLogin, (req, res) => {
    const sql = "DELETE FROM agendamentos WHERE id = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            res.status(500).json({ erro: err.message });
        } else {
            res.json({ mensagem: "Agendamento removido!" });
        }
    });
});


app.put("/api/agendamentos/:id", verificarLogin, (req, res) => {
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

app.post("/api/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const sql = "INSERT INTO cadastro (nome, email, senha) VALUES (?, ?, ?)";
        db.query(sql, [nome, email, senhaCriptografada], (err, result) => {
            if (err) {
                console.error("Erro ao cadastrar:", err);
                return res.status(500).json({ message: "Erro ao cadastrar usuário" });
            }

            res.status(201).json({ message: "Cadastro bem-sucedido" });
        });
    } catch (error) {
        console.error("Erro no servidor:", error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
});


app.post("/api/login", (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM cadastro WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            res.status(500).json({ erro: err.message });
        } else if (results.length === 0) {
            res.status(401).json({ erro: "E-mail não encontrado!" });
        } else {
            const usuario = results[0];
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

            if (senhaCorreta) {
                req.session.user = { id: usuario.id, nome: usuario.nome, email: usuario.email }; // Armazena os dados do usuário
                res.status(200).json({ mensagem: "Login bem-sucedido", usuario: req.session.user });
            } else {
                res.status(401).json({ erro: "Senha incorreta!" });
            }
        }
    });
});
app.get("/api/status", (req, res) => {
    if (req.session.user) {
        res.json({ logado: true, usuario: req.session.user });
    } else {
        res.json({ logado: false });
    }
});

app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao encerrar a sessão." });
        }
        res.clearCookie("connect.sid");
        res.json({ mensagem: "Logout realizado com sucesso!" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

