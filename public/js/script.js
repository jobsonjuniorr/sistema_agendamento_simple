document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-agendamento");
    const listaAgendamentos = document.getElementById("lista-agendamentos");

    function carregarAgendamentos() {
        fetch("/api/agendamentos")
            .then((res) => res.json())
            .then((data) => {
                listaAgendamentos.innerHTML = "";
                data.forEach((agendamento) => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        ${agendamento.nome} - ${new Date(agendamento.data).toLocaleString()} 
                        <strong>Status:</strong> ${agendamento.status}
                        <button onclick="atualizarStatus(${agendamento.id}, 'confirmado')">✅ Confirmar</button>
                        <button onclick="atualizarStatus(${agendamento.id}, 'cancelado')">❌ Cancelar</button>
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
            email: document.getElementById("email").value,
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

    window.atualizarStatus = (id, status) => {
        fetch(`/api/agendamentos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
        .then(() => carregarAgendamentos());
    };

    window.removerAgendamento = (id) => {
        fetch(`/api/agendamentos/${id}`, { method: "DELETE" })
        .then(() => carregarAgendamentos());
    };

    carregarAgendamentos();
});
document.getElementById("logout-btn").addEventListener("click", () => {
    fetch("/api/logout", { method: "POST" })
        .then((res) => res.json())
        .then(() => {
            window.location.href = "/index.html"; 
        })
        .catch((err) => console.error("Erro ao fazer logout:", err));
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
