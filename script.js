document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const addTierBtn = document.getElementById('add-tier-btn');
    const tiersContainer = document.getElementById('tariff-tiers-container');
    const fileInput = document.getElementById('file-input');
    const reportBody = document.getElementById('report-body');
    const totalCostEl = document.getElementById('total-cost');
    const minTariffInput = document.getElementById('min-tariff');

    // --- MANIPULADORES DE EVENTOS ---

    // Adiciona uma nova faixa de tarifa
    addTierBtn.addEventListener('click', () => {
        const allTiers = tiersContainer.querySelectorAll('.tariff-tier');
        const lastTier = allTiers[allTiers.length - 1];
        const lastTierToInput = lastTier.querySelector('.tier-to');
        
        const newFromValue = parseFloat(lastTierToInput.value || 0) + 1;

        const newTierEl = document.createElement('div');
        newTierEl.classList.add('tariff-tier');
        newTierEl.innerHTML = `
            <span>De <strong>${newFromValue} m³</strong></span>
            <span>Até <input type="number" class="tier-to" placeholder="20"> m³</span>
            <span>- R$ <input type="number" class="tier-value" placeholder="75.00" step="0.01"></span>
        `;
        tiersContainer.appendChild(newTierEl);
    });

    // Processa o arquivo quando selecionado
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("Nenhum arquivo selecionado.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            processAndDisplayReport(content);
        };
        reader.onerror = () => {
            alert("Erro ao ler o arquivo.");
        };
        reader.readAsText(file);
    });

    // --- LÓGICA DE NEGÓCIO ---

    /**
     * ATUALIZADO: Processa o conteúdo do arquivo .txt no novo formato e exibe o relatório
     * @param {string} fileContent - O conteúdo do arquivo importado
     */
    function processAndDisplayReport(fileContent) {
        // 1. Obter configurações atuais de tarifas
        const tariffs = getTariffsFromDOM();
        const minTariff = parseFloat(minTariffInput.value) || 0;
        
        if (tariffs.some(t => isNaN(t.to) || isNaN(t.value))) {
            alert("Por favor, preencha todos os campos de tarifa com valores válidos.");
            return;
        }
        
        // 2. Limpar relatório anterior
        reportBody.innerHTML = '';
        let grandTotal = 0;

        // 3. Processar cada linha do arquivo
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');
        
        // Inicia o loop a partir da segunda linha (i=1) para pular o cabeçalho
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            
            // Altera o separador para tabulação (\t)
            const parts = line.split('\t');
            
            // Verifica se a linha tem o número mínimo de colunas esperado
            if (parts.length < 7) continue; 

            const apto = parts[0].trim();
            const consumption = parseFloat(parts[3].trim()); // Pega o consumo da 4ª coluna
            const block = parts[6].trim();

            // Constrói um nome de unidade único
            let unitName = apto;
            if (block && block.toLowerCase() !== 'ac') {
                unitName = `Bloco ${block} - ${apto}`;
            }

            if (isNaN(consumption)) continue; // Ignora linhas com consumo inválido

            // 4. Calcular custos para a unidade
            const { calculatedValue, finalValue } = calculateCost(consumption, tariffs, minTariff);
            grandTotal += finalValue;

            // 5. Adicionar linha ao relatório na tela
            renderReportRow(unitName, consumption, calculatedValue, finalValue);
        }

        // 6. Atualizar o custo total
        totalCostEl.innerHTML = `<strong>R$ ${grandTotal.toFixed(2)}</strong>`;
    }

    /**
     * Lê as faixas de tarifa da interface e retorna um array de objetos
     * @returns {Array<{from: number, to: number, value: number}>}
     */
    function getTariffsFromDOM() {
        const tariffEls = tiersContainer.querySelectorAll('.tariff-tier');
        const tariffs = [];
        let lastTo = 0;

        tariffEls.forEach(tierEl => {
            const fromValue = lastTo === 0 ? 0 : lastTo + 1;
            const toInput = tierEl.querySelector('.tier-to');
            const valueInput = tierEl.querySelector('.tier-value');

            const toValue = parseFloat(toInput.value);
            const rateValue = parseFloat(valueInput.value);
            
            tariffs.push({ from: fromValue, to: toValue, value: rateValue });
            lastTo = toValue;
        });
        return tariffs;
    }

    /**
     * Calcula o custo com base no consumo e nas regras de tarifa
     * @param {number} consumption - O consumo em m³
     * @param {Array} tariffs - O array de objetos de tarifa
     * @param {number} minTariff - A tarifa mínima
     * @returns {{calculatedValue: number, finalValue: number}}
     */
    function calculateCost(consumption, tariffs, minTariff) {
        // Exceção: Consumo zero tem custo zero
        if (consumption === 0) {
            return { calculatedValue: 0, finalValue: 0 };
        }

        let calculatedValue = 0;
        // Encontra a faixa de tarifa correta
        for (const tier of tariffs) {
            if (consumption >= tier.from && consumption <= tier.to) {
                calculatedValue = tier.value;
                break;
            }
        }
        // Se não encontrou (consumo maior que a última faixa), usa o valor da última faixa
        if (calculatedValue === 0 && tariffs.length > 0) {
             calculatedValue = tariffs[tariffs.length - 1].value;
        }


        // Aplica a tarifa mínima
        const finalValue = Math.max(calculatedValue, minTariff);

        return { calculatedValue, finalValue };
    }

    /**
     * Adiciona uma linha na tabela de relatório
     */
    function renderReportRow(unit, consumption, calculated, final) {
        const row = reportBody.insertRow();
        row.innerHTML = `
            <td>${unit}</td>
            <td>${consumption.toFixed(2)}</td>
            <td>R$ ${calculated.toFixed(2)}</td>
            <td>R$ ${final.toFixed(2)}</td>
        `;
    }
});