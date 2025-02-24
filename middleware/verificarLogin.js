const verificarLogin = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        // Se for uma rota de API, retorna erro JSON
        if (req.path.startsWith("/api/")) {
            return res.status(401).json({ erro: "Não autorizado. Faça login." });
        }
        // Se for uma página, redireciona para o login
        res.redirect("/index.html");
    }
};

export default verificarLogin;
