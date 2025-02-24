document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/api/graficos")
        .then(response => response.json())
        .then(data => {
            console.log("Dados recebidos:", data); // Verifique no console
            renderizarGrafico(data);
        })
        .catch(error => console.error("Erro ao carregar os dados:", error));
});

function renderizarGrafico(dados) {
    const labels = dados.map(item => item.data);  // Datas formatadas
    const valores = dados.map(item => item.total); // Quantidade de agendamentos

    const ctx = document.getElementById("graficoAgendamentos").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Agendamentos por Data",
                data: valores,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
