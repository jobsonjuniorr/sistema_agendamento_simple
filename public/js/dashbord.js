document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/api/graficos")
        .then(response => response.json())
        .then(data => {
            renderizarGrafico(data);
        })
        .catch(error => console.error("Erro ao carregar os dados:", error));
});

function renderizarGrafico(dados) {
    const dadosFormatados = dados.map(item =>{
        const data = new Date(item.data)
        return data.toLocaleDateString("pt-BR",{
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    })
  
    const valores = dados.map(item => item.total); 

    const ctx = document.getElementById("graficoAgendamentos").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: dadosFormatados,
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


document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/api/total-mensal")
        .then(response => response.json())
        .then(data => {
            document.getElementById("totalMensal").textContent = `R$ ${data.total}`;
        })
        .catch(error => console.error("Erro ao carregar o total do mês:", error));
});
