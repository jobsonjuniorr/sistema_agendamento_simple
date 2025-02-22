document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-agendamento-login");
    const mensagemErro = document.getElementById("mensagem-erro");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const loginData = {
            email: document.getElementById("email").value,
            senha: document.getElementById("password").value, 
        };

        fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensagem === "Login bem-sucedido") {
                form.reset();
                window.location.href = "sistema.html";
            } else {
                mensagemErro.style.display = "block";
                mensagemErro.textContent = "Erro ao cadastrar, Email ou Senha incorreto!";
                setTimeout(()=>{
                    mensagemErro.style.display = "none";
                },3000)
            }
        })
        .catch(error => console.error("Erro ao fazer login:", error));
    });
});
