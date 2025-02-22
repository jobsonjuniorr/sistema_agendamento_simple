document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-agendamento-login");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const cadastro = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            senha: document.getElementById("password").value,
        };

        fetch("http://localhost:5000/api/cadastro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cadastro),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Cadastro bem-sucedido") {
                mensagemSucesso.style.display = "block";
                mensagemSucesso.textContent = "Cadastro realizado com sucesso!";
                form.reset();

                setTimeout(() => {
                    mensagemSucesso.style.display = "none";
                }, 3000);
            } else {
                alert("Erro ao cadastrar: " + data.message);
            }
        })
        .catch(error => {
            console.error("Erro ao cadastrar:", error);
            alert("Ocorreu um erro. Tente novamente.");
        });
    });
});
