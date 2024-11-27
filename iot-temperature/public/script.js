const carregarBtn = document.getElementById('carregarBtn');
const leiturasList = document.getElementById('leituras-list');

// Função para buscar as leituras do backend
function carregarLeituras() {
  fetch('/leituras')
    .then(response => response.json())
    .then(leituras => {
      leiturasList.innerHTML = '';  // Limpa a lista antes de renderizar

      // Renderiza as leituras
      leituras.forEach(leitura => {
        const div = document.createElement('div');
        div.classList.add('leitura-item');
        
        const temperaturaClass = leitura.temperaturaAlta ? 'alta' : 'normal';

        div.innerHTML = `
          <div class="temperatura ${temperaturaClass}">${leitura.temperatura}°C</div>
          <div class="umidade">${leitura.umidade}%</div>
          <div class="data-hora">${leitura.data} - ${leitura.hora}</div>
        `;
        
        leiturasList.appendChild(div);
      });

      carregarBtn.disabled = true; // Desabilitar o botão após carregar
      carregarBtn.innerText = "Leituras Carregadas";
    })
    .catch(error => console.error('Erro ao buscar leituras:', error));
}

// Adiciona evento de clique ao botão
carregarBtn.addEventListener('click', carregarLeituras);
