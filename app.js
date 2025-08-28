document.addEventListener('DOMContentLoaded', () => {
    // 1. REFERÊNCIAS AOS ELEMENTOS DO HTML
    const fileInput = document.getElementById('fileInput');
    const logoInput = document.getElementById('logoInput');
    const billingTypeSelect = document.getElementById('billingType');
    const averageCostParams = document.getElementById('average-cost-params');
    const tieredCostParams = document.getElementById('tiered-cost-params');
    const runSimulationBtn = document.getElementById('runSimulationBtn');
    const resultsTableDiv = document.getElementById('results-table');
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const tiersContainer = document.getElementById('tiers-container');
    const addTierBtn = document.getElementById('addTierBtn');
    const includeRateioAC = document.getElementById('includeRateioAC');
    const rateioSelectorBox = document.getElementById('rateio-selector-box');
    const commonAreaMetersSelect = document.getElementById('commonAreaMetersSelect');
    const condoNameInput = document.getElementById('condoName');

    let parsedData = [];
    let logoDataUrl = null; // Variável para armazenar o logo

    // 2. EVENT LISTENERS
    billingTypeSelect.addEventListener('change', () => {
        if (billingTypeSelect.value === 'average') {
            averageCostParams.style.display = 'block';
            tieredCostParams.style.display = 'none';
        } else {
            averageCostParams.style.display = 'none';
            tieredCostParams.style.display = 'block';
        }
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            parsedData = parseTxtContent(e.target.result);
            if (parsedData.length > 0) {
                alert(`${parsedData.length} registros carregados com sucesso!`);
                populateCommonAreaSelector();
            } else {
                alert('O arquivo foi lido, mas nenhum registro válido foi encontrado.');
            }
        };
        reader.readAsText(file);
    });

    logoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            logoDataUrl = null;
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            logoDataUrl = e.target.result;
            alert('Logo carregado com sucesso!');
        };
        reader.readAsDataURL(file);
    });

    includeRateioAC.addEventListener('change', () => {
        rateioSelectorBox.style.display = includeRateioAC.checked ? 'block' : 'none';
    });

    runSimulationBtn.addEventListener('click', () => {
        if (parsedData.length === 0) {
            alert('Por favor, carregue um arquivo de dados primeiro.');
            return;
        }
        calculateAll();
    });

    generatePdfBtn.addEventListener('click', generatePdf);
    addTierBtn.addEventListener('click', addTier);
    tiersContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-tier-btn') && tiersContainer.children.length > 1) {
            event.target.closest('.tier-row').remove();
        }
    });

    // 3. FUNÇÕES DE LÓGICA E CÁLCULO
    function calculateAll() {
        parsedData.forEach(item => { item.totalAPagar = 0; item.rateioAC = 0; });
        const billingType = billingTypeSelect.value;
        if (billingType === 'average') { calculateByAverageCost(); } else { calculateByTieredCost(); }
        applyCommonAreaRateio();
        displayResults();
    }

    function populateCommonAreaSelector() {
        commonAreaMetersSelect.innerHTML = '';
        parsedData.forEach((item, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Bloco: ${item.bloco} / Apto: ${item.apto}`;
            commonAreaMetersSelect.appendChild(option);
        });
    }

    function parseTxtContent(txtContent) {
        const lines = txtContent.trim().split('\n');
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const columns = lines[i].split('\t');
            if (columns.length >= 7) {
                data.push({
                    apto: columns[0].trim(),
                    leituraAnterior: parseFloat(columns[1].trim().replace(',', '.')),
                    leituraAtual: parseFloat(columns[2].trim().replace(',', '.')),
                    consumo: parseFloat(columns[2].trim().replace(',', '.')) - parseFloat(columns[1].trim().replace(',', '.')),
                    totalAPagar: 0,
                    dataLevantamento: columns[5].trim(),
                    bloco: columns[6].trim(),
                    rateioAC: 0
                });
            }
        }
        return data;
    }

    function applyCommonAreaRateio() {
        if (!includeRateioAC.checked) return;
        const selectedIndexes = Array.from(commonAreaMetersSelect.selectedOptions).map(opt => parseInt(opt.value));
        if (selectedIndexes.length === 0) {
            alert('Opção de rateio marcada, mas nenhum medidor foi selecionado. O rateio não será aplicado.');
            return;
        }
        const commonAreaEntries = parsedData.filter((item, index) => selectedIndexes.includes(index));
        const totalCommonAreaCost = commonAreaEntries.reduce((sum, item) => sum + item.totalAPagar, 0);
        const numberOfUnits = parsedData.length - commonAreaEntries.length;
        if (numberOfUnits <= 0) return;
        const rateioPerUnit = totalCommonAreaCost / numberOfUnits;
        parsedData.forEach((item, index) => {
            if (!selectedIndexes.includes(index)) {
                item.rateioAC = rateioPerUnit;
                item.totalAPagar += item.rateioAC;
            }
        });
    }

    function calculateByTieredCost() {
        const sewageFee = parseFloat(document.getElementById('sewageFee').value) || 0;
        const tierRows = document.querySelectorAll('.tier-row');
        const tiers = [];
        tierRows.forEach(row => { tiers.push({ start: parseFloat(row.querySelector('.tier-start').value), end: parseFloat(row.querySelector('.tier-end').value) || Infinity, price: parseFloat(row.querySelector('.tier-price').value), type: row.querySelector('.tier-type').value }); });
        tiers.sort((a, b) => a.start - b.start);
        parsedData.forEach(apto => {
            let waterCost = 0;
            let billedConsumption = 0;
            for (const tier of tiers) {
                if (apto.consumo <= billedConsumption) break;
                const consumptionInTier = Math.min(apto.consumo, tier.end) - billedConsumption;
                if (consumptionInTier <= 0) continue;
                if (tier.type === 'fixed') { waterCost = tier.price; } else { waterCost += consumptionInTier * tier.price; }
                billedConsumption += consumptionInTier;
            }
            const sewageCost = waterCost * (sewageFee / 100);
            apto.totalAPagar = waterCost + sewageCost;
        });
    }

    function displayResults() {
        const selectedIndexes = Array.from(commonAreaMetersSelect.selectedOptions).map(opt => parseInt(opt.value));
        let tableHTML = `<table><thead><tr><th>Bloco</th><th>Apto</th><th>Leitura Anterior</th><th>Leitura Atual</th><th>Consumo (m³)</th><th>Rateio AC (R$)</th><th>Total a Pagar (R$)</th></tr></thead><tbody>`;
        parsedData.forEach((item, index) => {
            const isCommonArea = includeRateioAC.checked && selectedIndexes.includes(index);
            const rateioDisplay = isCommonArea ? 'RATEADO' : item.rateioAC.toFixed(2).replace('.', ',');
            tableHTML += `<tr><td>${item.bloco}</td><td>${item.apto}</td><td>${item.leituraAnterior.toFixed(0)}</td><td>${item.leituraAtual.toFixed(0)}</td><td>${item.consumo.toFixed(0)}</td><td>${rateioDisplay}</td><td>${item.totalAPagar.toFixed(2).replace('.', ',')}</td></tr>`;
        });
        const totalConsumption = parsedData.reduce((sum, item) => sum + item.consumo, 0);
        const totalBilled = parsedData.reduce((sum, item) => sum + item.totalAPagar, 0);
        const totalRateio = parsedData.reduce((sum, item) => sum + item.rateioAC, 0);
        tableHTML += `<tr style="font-weight: bold; background-color: #e9ecef;"><td colspan="4">TOTAIS</td><td>${totalConsumption.toFixed(0)}</td><td>${totalRateio.toFixed(2).replace('.', ',')}</td><td>R$ ${totalBilled.toFixed(2).replace('.', ',')}</td></tr></tbody></table>`;
        resultsTableDiv.innerHTML = tableHTML;
        generatePdfBtn.style.display = 'block';
    }

    function generatePdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const condoName = condoNameInput.value || 'Não informado';
        let startY = 15;

        if (logoDataUrl) {
            try {
                const imgProps = doc.getImageProperties(logoDataUrl);
                const aspectRatio = imgProps.height / imgProps.width;
                // *** AJUSTE AQUI: Aumenta a largura do logo ***
                const logoWidth = 45; 
                const logoHeight = logoWidth * aspectRatio;
                const xPosition = doc.internal.pageSize.getWidth() - logoWidth - 14;
                doc.addImage(logoDataUrl, 'PNG', xPosition, 10, logoWidth, logoHeight);
            } catch (e) {
                console.error("Erro ao adicionar o logo:", e);
                alert("Ocorreu um erro ao processar o arquivo de logo. Tente usar uma imagem .png ou .jpg menor.");
            }
        }

        doc.setFontSize(17);
        doc.setFont(undefined, 'bold');
        doc.text("Relatório de Simulação de Consumo", 14, startY);
        startY += 8;
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Condomínio: ${condoName}`, 14, startY);
        startY += 12;

        const summaryBoxStartY = startY;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text("Resumo Geral", 14, summaryBoxStartY);
        doc.setLineWidth(0.2);
        doc.line(14, summaryBoxStartY + 2, 98, summaryBoxStartY + 2);
        
        const selectedIndexes = Array.from(commonAreaMetersSelect.selectedOptions).map(opt => parseInt(opt.value));
        const residentialUnits = parsedData.filter((item, index) => !selectedIndexes.includes(index));
        const commonAreaEntries = parsedData.filter((item, index) => selectedIndexes.includes(index));
        const totalConsumptionAllUnits = parsedData.reduce((sum, item) => sum + item.consumo, 0);
        const totalBilledAllUnits = parsedData.reduce((sum, item) => sum + item.totalAPagar, 0);
        const totalValorAC = commonAreaEntries.reduce((sum, item) => sum + item.totalAPagar - item.rateioAC, 0);
        const maiorValor = residentialUnits.length > 0 ? Math.max(...residentialUnits.map(u => u.totalAPagar)) : 0;
        const menorValor = residentialUnits.length > 0 ? Math.min(...residentialUnits.map(u => u.totalAPagar)) : 0;

        let summaryText = [
            { label: "Consumo Total:", value: `${totalConsumptionAllUnits.toFixed(0)} m³` },
            { label: "Valor Total Faturado:", value: `R$ ${totalBilledAllUnits.toFixed(2).replace('.', ',')}` },
            { label: "Custo Área Comum:", value: `R$ ${totalValorAC.toFixed(2).replace('.', ',')}` },
            { label: "Maior Valor (Unidade):", value: `R$ ${maiorValor.toFixed(2).replace('.', ',')}` },
            { label: "Menor Valor (Unidade):", value: `R$ ${menorValor.toFixed(2).replace('.', ',')}` }
        ];

        let summaryItemY = summaryBoxStartY + 8;
        doc.setFontSize(9);
        summaryText.forEach(item => {
            doc.setFont(undefined, 'bold');
            doc.text(item.label, 16, summaryItemY);
            doc.setFont(undefined, 'normal');
            doc.text(item.value, 60, summaryItemY);
            summaryItemY += 6;
        });

        const paramsBoxStartY = startY;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text("Parâmetros Aplicados", 110, paramsBoxStartY);
        doc.line(110, paramsBoxStartY + 2, 196, paramsBoxStartY + 2);

        let paramsText = [`- Método: ${billingTypeSelect.options[billingTypeSelect.selectedIndex].text}`];
        if (billingTypeSelect.value === 'tiered') {
            paramsText.push(`- Taxa de Esgoto: ${document.getElementById('sewageFee').value || "0"}%`);
            paramsText.push(`- Rateio AC: ${includeRateioAC.checked ? 'Sim' : 'Não'}`);
            document.querySelectorAll('.tier-row').forEach((row, index) => {
                const start = row.querySelector('.tier-start').value;
                const end = row.querySelector('.tier-end').value || '...';
                const type = row.querySelector('.tier-type').options[row.querySelector('.tier-type').selectedIndex].text;
                const price = row.querySelector('.tier-price').value;
                paramsText.push(`- F${index + 1}: ${start} a ${end} m³ | ${type}: R$ ${price}`);
            });
        } else {
            const totalBill = document.getElementById('totalBill').value || "N/A";
            paramsText.push(`- Vlr. Total Conta: R$ ${totalBill}`);
            const totalConsumption = parsedData.reduce((sum, item) => sum + item.consumo, 0);
            if (totalConsumption > 0 && !isNaN(parseFloat(totalBill))) {
                const averagePricePerM3 = parseFloat(totalBill) / totalConsumption;
                paramsText.push(`- Custo Médio Aplicado: R$ ${averagePricePerM3.toFixed(4).replace('.', ',')} / m³`);
            }
        }

        let paramsItemY = paramsBoxStartY + 8;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(paramsText, 112, paramsItemY, { lineHeightFactor: 1.5 });

        startY = Math.max(summaryItemY, paramsItemY + (paramsText.length * 4)) + 10;

        const tableColumn = ["Bloco", "Apto", "L. Anterior", "L. Atual", "Consumo (m³)", "Rateio AC (R$)", "Total a Pagar (R$)"];
        const tableRows = [];
        parsedData.forEach((item, index) => {
            const isCommonArea = includeRateioAC.checked && selectedIndexes.includes(index);
            const rateioDisplay = isCommonArea ? 'RATEADO' : `R$ ${item.rateioAC.toFixed(2).replace('.', ',')}`;
            tableRows.push([item.bloco, item.apto, item.leituraAnterior.toFixed(0), item.leituraAtual.toFixed(0), item.consumo.toFixed(0), rateioDisplay, `R$ ${item.totalAPagar.toFixed(2).replace('.', ',')}`]);
        });
        
        doc.autoTable({ head: [tableColumn], body: tableRows, startY: startY, headStyles: { fillColor: [0, 90, 156] } });
        doc.save(`Relatorio_${condoName.replace(/ /g, "_")}.pdf`);
    }

    function addTier() {
        const newTierRow = document.createElement('div');
        newTierRow.classList.add('tier-row');
        newTierRow.innerHTML = `<span>De <input type="number" class="tier-start" placeholder="Ex: 11"> até <input type="number" class="tier-end" placeholder="Ex: 20"> m³ | </span><select class="tier-type"><option value="per_m3">Valor por m³</option><option value="fixed">Valor Fixo na Faixa</option></select><span>: R$ <input type="number" class="tier-price" placeholder="Preço"></span><button class="remove-tier-btn" title="Remover Faixa">Remover</button>`;
        tiersContainer.appendChild(newTierRow);
    }
    
    function calculateByAverageCost() {
        const totalBill = parseFloat(document.getElementById('totalBill').value);
        if (isNaN(totalBill) || totalBill <= 0) return alert('Insira um valor total da conta válido.');
        const totalConsumption = parsedData.reduce((sum, item) => sum + item.consumo, 0);
        if (totalConsumption === 0) return alert('O consumo total é zero.');
        const averagePricePerM3 = totalBill / totalConsumption;
        parsedData.forEach(item => { item.totalAPagar = item.consumo * averagePricePerM3; });
    }
});
