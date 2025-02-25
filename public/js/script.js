document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-agendamento");
    const listaAgendamentos = document.getElementById("lista-agendamentos");

    function carregarAgendamentos() {
        fetch("/api/agendamentoshoje")
            .then((res) => res.json())
            .then((data) => {
                listaAgendamentos.innerHTML = "";
                data.forEach((agendamento) => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <p>
                        ${agendamento.nome} 
                        ${agendamento.servico}
                        R$:${agendamento.valor}
                        </p>
                        
                        <button onclick="removerAgendamento(${agendamento.id})">🗑 Remover</button>
                    `;
                    listaAgendamentos.appendChild(li);
                });
            });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const agendamento = {
            nome: document.getElementById("nome").value,
            valor: document.getElementById("valor").value,
            telefone: document.getElementById("telefone").value,
            data: document.getElementById("data").value,
            servico: document.getElementById("servico").value,
        };

        fetch("/api/agendamentos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(agendamento),
        })
        .then(() => {
            form.reset();
            carregarAgendamentos();
        });
    });

    window.removerAgendamento = (id) => {
        fetch(`/api/agendamentos/${id}`, { method: "DELETE" })
        .then(() => carregarAgendamentos());
    };

    carregarAgendamentos();
});
document.querySelectorAll(".logout-btn").forEach(button => {
    button.addEventListener("click", () => {
        fetch("/api/logout", { method: "POST" })
            .then((res) => res.json())
            .then(() => {
                window.location.href = "/index.html"; 
            })
            .catch((err) => console.error("Erro ao fazer logout:", err));
    });
});

fetch("/api/status")
    .then(res => {
        if (!res.ok) {
            throw new Error('Erro ao verificar sessão');
        }
        return res.json(); 
    })
    .then(data => {
        if (!data.logado) {
            window.location.href = "/index.html"; 
        }
    })
    .catch(err => {
        console.error("Erro ao verificar sessão:", err);
        window.location.href = "/index.html";
    });

    document.addEventListener("DOMContentLoaded", function () {
        const menuLateral = document.getElementById("menu-lateral");
        const overlay = document.getElementById("overlay");
        const abrirMenu = document.getElementById("button-menu");
        const fecharMenu = document.getElementById("fechar-menu");
    
        abrirMenu.addEventListener("click", function () {
            menuLateral.classList.add("ativo");
            overlay.classList.add("ativo");
        });
    
        fecharMenu.addEventListener("click", function () {
            menuLateral.classList.remove("ativo");
            overlay.classList.remove("ativo");
        });
    
        overlay.addEventListener("click", function () {
            menuLateral.classList.remove("ativo");
            overlay.classList.remove("ativo");
        });
    });
    