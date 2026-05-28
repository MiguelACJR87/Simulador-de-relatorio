document.addEventListener('DOMContentLoaded', () => {
    // 1. REFERÊNCIAS AOS ELEMENTOS
    const fileInput = document.getElementById('fileInput');
    const logoInput = document.getElementById('logoInput');
    const logoPreview = document.getElementById('logoPreview');
    const billingTypeSelect = document.getElementById('billingType');
    const averageCostParams = document.getElementById('average-cost-params');
    const tieredCostParams = document.getElementById('tiered-cost-params');
    const runSimulationBtn = document.getElementById('runSimulationBtn');
    const resultsSection = document.getElementById('results-section');
    const resultsTableDiv = document.getElementById('results-table');
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const generateXlsxBtn = document.getElementById('generateXlsxBtn'); 
    const tiersContainer = document.getElementById('tiers-container');
    const addTierBtn = document.getElementById('addTierBtn');
    const condoNameInput = document.getElementById('condoName');
    const totalBillInput = document.getElementById('totalBill');
    const includeRateioAC = document.getElementById('includeRateioAC');
    const rateioSelectorBox = document.getElementById('rateio-selector-box');
    const commonAreaMetersSelect = document.getElementById('commonAreaMetersSelect');
    const includeManagementFee = document.getElementById('includeManagementFee');
    const managementFeeBox = document.getElementById('management-fee-box');
    const managementFeeValueInput = document.getElementById('managementFeeValue');
    const toastContainer = document.getElementById('toast-container');
    const infoBtn = document.getElementById('infoBtn');
    const infoModal = document.getElementById('infoModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    let parsedData = [];
    let logoDataUrl = null;

    // --- FUNÇÕES DE UTILS ---
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { info: 'info-circle', success: 'check-circle', error: 'exclamation-triangle' };
        toast.innerHTML = `<i class="fas fa-${icons[type]}"></i> ${message}`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    function applyCurrencyMask(event) { 
        let value = event.target.value.replace(/\D/g, ''); 
        if (value.length === 0) { event.target.value = ''; return; } 
        value = (parseInt(value, 10) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); 
        event.target.value = value; 
    }

    function getNumericValue(formattedString) { 
        if (!formattedString || typeof formattedString !== 'string') return 0; 
        const numericString = formattedString.replace('R$', '').replace(/\./g, '').replace(',', '.').trim(); 
        const value = parseFloat(numericString); 
        return isNaN(value) ? 0 : value; 
    }

    function formatNumberBR(number, decimalPlaces = 2) { 
        const options = { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }; 
        return new Intl.NumberFormat('pt-BR', options).format(number); 
    }

    function isRateioHabilitado() {
        let chk = document.getElementById('doRateioCalc');
        if (!chk) {
            const checkboxes = rateioSelectorBox.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length > 0) {
                chk = checkboxes[0];
            }
        }
        return chk ? chk.checked : false;
    }

    // 2. EVENT LISTENERS
    billingTypeSelect.addEventListener('change', () => { 
        if (billingTypeSelect.value === 'average') { 
            averageCostParams.style.display = 'block'; tieredCostParams.style.display = 'none'; 
        } else { 
            averageCostParams.style.display = 'none'; tieredCostParams.style.display = 'block'; 
        } 
    });

    fileInput.addEventListener('change', (event) => { 
        const file = event.target.files[0]; 
        if (!file) return; 
        const reader = new FileReader(); 
        reader.onload = (e) => { 
            parsedData = parseTxtContent(e.target.result); 
            if (parsedData.length > 0) { 
                showToast(`${parsedData.length} registros carregados!`, 'success'); 
                populateCommonAreaSelector(); addInitialTier(); 
            } else { showToast('Ficheiro lido, mas sem registros válidos.', 'error'); } 
        }; 
        reader.readAsText(file, 'ISO-8859-1'); 
    });

    logoInput.addEventListener('change', (event) => { 
        const file = event.target.files[0]; 
        if (!file) { logoDataUrl = null; logoPreview.src = '#'; logoPreview.style.display = 'none'; return; } 
        const reader = new FileReader(); 
        reader.onload = (e) => { logoDataUrl = e.target.result; logoPreview.src = logoDataUrl; logoPreview.style.display = 'block'; }; 
        reader.readAsDataURL(file); 
    });

    includeRateioAC.addEventListener('change', () => { rateioSelectorBox.style.display = includeRateioAC.checked ? 'block' : 'none'; });
    includeManagementFee.addEventListener('change', () => { managementFeeBox.style.display = includeManagementFee.checked ? 'block' : 'none'; });
    
    rateioSelectorBox.addEventListener('change', () => {
        if (parsedData.length > 0) calculateAll();
    });

    runSimulationBtn.addEventListener('click', () => { 
        if (parsedData.length === 0) { showToast('Carregue um ficheiro de dados primeiro.', 'error'); return; } 
        runSimulationBtn.classList.add('loading'); 
        setTimeout(() => { calculateAll(); runSimulationBtn.classList.remove('loading'); resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); 
    });

    generatePdfBtn.addEventListener('click', generatePdf);
    generateXlsxBtn.addEventListener('click', generateXlsx);
    addTierBtn.addEventListener('click', () => addTier(false));

    const dropZoneFile = document.getElementById('dropZoneFile');
    const dropZoneLogo = document.getElementById('dropZoneLogo');
    function setDropZoneFeedback(zone, fileName) { zone.classList.add('has-file'); const hint = zone.querySelector('.drop-zone-hint'); if (hint) hint.textContent = fileName; }
    fileInput.addEventListener('change', () => { if (fileInput.files[0]) setDropZoneFeedback(dropZoneFile, fileInput.files[0].name); });
    logoInput.addEventListener('change', () => { if (logoInput.files[0]) setDropZoneFeedback(dropZoneLogo, logoInput.files[0].name); });
    [dropZoneFile, dropZoneLogo].forEach(zone => {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', () => zone.classList.remove('dragover'));
    });

    tiersContainer.addEventListener('click', (event) => { if (event.target.closest('.remove-tier-btn') && tiersContainer.children.length > 1) { event.target.closest('.tier-row').remove(); } });
    totalBillInput.addEventListener('input', applyCurrencyMask);
    managementFeeValueInput.addEventListener('input', applyCurrencyMask);
    tiersContainer.addEventListener('input', (event) => { if (event.target.classList.contains('currency-input')) { applyCurrencyMask(event); } });
    infoBtn.addEventListener('click', () => { infoModal.classList.remove('hidden'); });
    closeModalBtn.addEventListener('click', () => { infoModal.classList.add('hidden'); });
    infoModal.addEventListener('click', (event) => { if (event.target === infoModal) { infoModal.classList.add('hidden'); } });

    resultsTableDiv.addEventListener('input', (event) => {
        if (event.target.classList.contains('edit-leitura')) {
            const index = parseInt(event.target.dataset.index);
            const field = event.target.dataset.field;
            let rawValue = event.target.value.replace(',', '.');
            let newVal = parseFloat(rawValue);

            parsedData[index][field] = isNaN(newVal) ? 0 : newVal;
            parsedData[index].consumo = Math.max(0, parsedData[index].leituraAtual - parsedData[index].leituraAnterior);

            const activeId = event.target.id;
            let start = 0, end = 0;
            try { start = event.target.selectionStart; end = event.target.selectionEnd; } catch (e) {}

            calculateAll();

            const inputToFocus = document.getElementById(activeId);
            if (inputToFocus) {
                inputToFocus.focus();
                inputToFocus.value = event.target.value; 
                try { inputToFocus.setSelectionRange(start, end); } catch (e) {}
            }
        }
    });

    // 3. FUNÇÕES DE LÓGICA (CORE)
    function calculateAll() { 
        parsedData.forEach(item => { item.valorConsumo = 0; item.rateioAC = 0; item.taxaGestao = 0; item.totalAPagar = 0; }); 
        
        const billingType = billingTypeSelect.value; 
        if (billingType === 'average') { calculateByAverageCost(); } 
        else { calculateByTieredCost(); } 
        
        applyCommonAreaRateio(); 
        applyManagementFee(); 

        const selectedIndexes = Array.from(commonAreaMetersSelect.selectedOptions).map(opt => parseInt(opt.value));
        
        parsedData.forEach((item, index) => { 
            const isCommonArea = includeRateioAC.checked && selectedIndexes.includes(index);
            if (isCommonArea) {
                item.totalAPagar = item.valorConsumo + item.taxaGestao; 
            } else {
                item.totalAPagar = item.valorConsumo + item.rateioAC + item.taxaGestao; 
            }
        }); 
        
        displayResults(); 
    }

    function parseTxtContent(txtContent) { const lines = txtContent.trim().split('\n'); const data = []; for (let i = 1; i < lines.length; i++) { const columns = lines[i].split('\t'); if (columns.length >= 7) { data.push({ apto: columns[0].trim(), leituraAnterior: parseFloat(columns[1].trim().replace(',', '.')), leituraAtual: parseFloat(columns[2].trim().replace(',', '.')), consumo: parseFloat(columns[2].trim().replace(',', '.')) - parseFloat(columns[1].trim().replace(',', '.')), valorConsumo: 0, taxaGestao: 0, rateioAC: 0, totalAPagar: 0, dataLevantamento: columns[5].trim(), bloco: columns[6].trim() }); } } return data; }
    function populateCommonAreaSelector() { commonAreaMetersSelect.innerHTML = ''; parsedData.forEach((item, index) => { const option = document.createElement('option'); option.value = index; option.textContent = `Bloco: ${item.bloco} / Apto: ${item.apto}`; commonAreaMetersSelect.appendChild(option); }); }
    
    function calculateByTieredCost() { const sewageFee = parseFloat(document.getElementById('sewageFee').value) || 0; const tierRows = document.querySelectorAll('.tier-row'); const tiers = []; tierRows.forEach(row => { tiers.push({ start: parseFloat(row.querySelector('.tier-start').value), end: parseFloat(row.querySelector('.tier-end').value) || Infinity, price: getNumericValue(row.querySelector('.tier-price').value), type: row.querySelector('.tier-type').value }); }); tiers.sort((a, b) => a.start - b.start); parsedData.forEach(apto => { let waterCost = 0; const applicableFixedTier = tiers.find(t => t.type === 'fixed' && apto.consumo >= t.start && apto.consumo <= t.end); if (applicableFixedTier) { waterCost = applicableFixedTier.price; } else { let billedConsumption = 0; for (const tier of tiers) { if (apto.consumo <= billedConsumption) break; const consumptionInTier = Math.min(apto.consumo, tier.end) - billedConsumption; if (consumptionInTier > 0) { if (tier.type === 'fixed') { waterCost += tier.price; } else { waterCost += consumptionInTier * tier.price; } } billedConsumption += consumptionInTier; } } const sewageCost = waterCost * (sewageFee / 100); apto.valorConsumo = waterCost + sewageCost; }); }
    
    function calculateByAverageCost() { const totalBill = getNumericValue(totalBillInput.value); if (totalBill <= 0) { showToast('Insira um valor total da conta válido.', 'error'); return; } const totalConsumption = parsedData.reduce((sum, item) => sum + item.consumo, 0); if (totalConsumption === 0) { showToast('O consumo total é zero.', 'warning'); return; } const averagePricePerM3 = totalBill / totalConsumption; parsedData.forEach(item => { item.valorConsumo = item.consumo * averagePricePerM3; }); }
    
    function applyCommonAreaRateio() { 
        if (!includeRateioAC.checked) return; 
        if (!isRateioHabilitado()) return; 
        
        const selectedIndexes = Array.from(commonAreaMetersSelect.selectedOptions).map(opt => parseInt(opt.value)); 
        if (selectedIndexes.length === 0) return; 
        
        const commonAreaEntries = parsedData.filter((item, index) => selectedIndexes.includes(index)); 
        const totalCommonAreaCost = commonAreaEntries.reduce((sum, item) => sum + item.valorConsumo, 0); 
        const numberOfUnits = parsedData.length - commonAreaEntries.length; 
        if (numberOfUnits <= 0) return; 
        
        const rateioPerUnit = totalCommonAreaCost / numberOfUnits; 
        parsedData.forEach((item, index) => { 
            if (!selectedIndexes.includes(index)) { item.rateioAC = rateioPerUnit; } 
        }); 
    }
    
    function applyManagementFee() { if (!includeManagementFee.checked) return; const feeValue = getNumericValue(managementFeeValueInput.value); if (feeValue <= 0) return; const selectedIndexes = Array.from(commonAreaMetersSelect.selectedOptions).map(opt => parseInt(opt.value)); parsedData.forEach((item, index) => { const isCommonArea = includeRateioAC.checked && selectedIndexes.includes(index); if (!isCommonArea) { item.taxaGestao = feeValue; } }); }
    
    function addTier(isInitial = false) { const newTierRow = document.createElement('div'); newTierRow.classList.add('tier-row'); const content = isInitial ? `<span>De <input type="number" class="tier-start" value="0"> até <input type="number" class="tier-end" value="5"> m³ | </span><select class="tier-type"><option value="fixed">Tarifa Mínima</option><option value="per_m3">Valor por m³</option></select><span>: <input type="text" class="tier-price currency-input" placeholder="R$ 0,00"></span>` : `<span>De <input type="number" class="tier-start" placeholder="Ex: 6"> até <input type="number" class="tier-end" placeholder="Ex: 10"> m³ | </span><select class="tier-type"><option value="per_m3">Valor por m³</option><option value="fixed">Tarifa Mínima</option></select><span>: <input type="text" class="tier-price currency-input" placeholder="R$ 0,00"></span>`; newTierRow.innerHTML = `${content}<button class="remove-tier-btn" title="Remover Faixa"><i class="fas fa-trash-alt"></i></button>`; tiersContainer.appendChild(newTierRow); }
    
    function addInitialTier() { tiersContainer.innerHTML = ''; addTier(true); }

    function displayResults() {
        resultsSection.style.display = 'block';
        const selectedIndexes = Array.from(commonAreaMetersSelect.selectedOptions).map(opt => parseInt(opt.value));
        const rateioAtivo = isRateioHabilitado();

        let tableHTML = `<table><thead><tr>
            <th>Bloco</th>
            <th>Apto</th>
            <th>L. Anterior</th>
            <th>L. Atual</th>
            <th>Consumo<br>(m³)</th>
            <th>Vlr. Consumo<br>(R$)</th>
            <th>Rateio AC<br>(R$)</th>
            <th>Taxa Gestão<br>(R$)</th>
            <th>Total a Pagar<br>(R$)</th>
        </tr></thead><tbody>`;

        parsedData.forEach((item, index) => {
            const isCommonArea = includeRateioAC.checked && selectedIndexes.includes(index);
            const rateioDisplay = isCommonArea ? (rateioAtivo ? 'RATEADO' : '-') : (item.rateioAC > 0 ? formatNumberBR(item.rateioAC) : '-');
            const gestaoDisplay = isCommonArea ? '-' : formatNumberBR(item.taxaGestao);
            
            tableHTML += `<tr>
                <td>${item.bloco}</td>
                <td>${item.apto}</td>
                <td><input type="text" inputmode="numeric" id="leit-ant-${index}" class="edit-leitura table-input" data-index="${index}" data-field="leituraAnterior" value="${item.leituraAnterior}"></td>
                <td><input type="text" inputmode="numeric" id="leit-atual-${index}" class="edit-leitura table-input" data-index="${index}" data-field="leituraAtual" value="${item.leituraAtual}"></td>
                <td>${formatNumberBR(item.consumo, 0)}</td>
                <td>${formatNumberBR(item.valorConsumo)}</td>
                <td>${rateioDisplay}</td>
                <td>${gestaoDisplay}</td>
                <td>R$ ${formatNumberBR(item.totalAPagar)}</td>
            </tr>`;
        });

        const totalConsumption = parsedData.reduce((sum, item) => sum + item.consumo, 0);
        
        const totalValorConsumo = parsedData.reduce((sum, item, index) => {
            const isCommonArea = includeRateioAC.checked && selectedIndexes.includes(index);
            if (isCommonArea && rateioAtivo) return sum; 
            return sum + item.valorConsumo;
        }, 0);
        
        const totalTaxaGestao = parsedData.reduce((sum, item, index) => {
            const isCommonArea = includeRateioAC.checked && selectedIndexes.includes(index);
            if (isCommonArea && rateioAtivo) return sum; 
            return sum + item.taxaGestao;
        }, 0);
        
        const totalRateio = parsedData.reduce((sum, item) => sum + item.rateioAC, 0);
        
        const totalBilled = parsedData.reduce((sum, item, index) => {
            const isCommonArea = includeRateioAC.checked && selectedIndexes.includes(index);
            if (isCommonArea && rateioAtivo) return sum; 
            return sum + item.totalAPagar;
        }, 0);
        
        tableHTML += `<tr style="font-weight: bold; background-color: #e9ecef;">
            <td colspan="4">TOTAIS</td>
            <td>${formatNumberBR(totalConsumption, 0)}</td>
            <td>${formatNumberBR(totalValorConsumo)}</td>
            <td>${formatNumberBR(totalRateio)}</td>
            <td>${formatNumberBR(totalTaxaGestao)}</td>
            <td>R$ ${formatNumberBR(totalBilled)}</td>
        </tr></tbody></table>`;
        resultsTableDiv.innerHTML = tableHTML;
    }

    // --- GERAÇÃO DE PDF ---
    function generatePdf() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            const condoName = condoNameInput.value || 'Não informado';
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            const C = {
                txt: [102, 102, 102],       
                strong: [0, 0, 0],          
                bg: [239, 239, 239],        
                line: [196, 196, 196],      
                lineThick: [185, 185, 185], 
                white: [255, 255, 255],     
                zebra: [246, 246, 246]      
            };

            const mL = 6.3, mR = 6.3; 
            const usableW = pageWidth - mL - mR;
            let startY = 8; 

            // Estilos
            const styleBase = { 
                fontSize: 7.5, 
                textColor: C.txt, 
                lineColor: C.line, 
                lineWidth: 0.18, 
                font: 'helvetica',
                cellPadding: { top: 1.5, bottom: 1.5, left: 2, right: 2 }
            };

            const thickW = 0.35; 

            const styleColHeader = { 
                fillColor: C.white, 
                textColor: C.txt, 
                fontStyle: 'bold', 
                halign: 'center',
                valign: 'middle' 
            };

            const styleTitle = { 
                fillColor: C.bg, 
                fontStyle: 'bold', 
                halign: 'center',
                valign: 'middle',
                textColor: C.txt,
                fontSize: 7.5,
                font: 'helvetica',
                cellPadding: { top: 1.5, bottom: 1.5, left: 2, right: 2 }
            };

            // 1. HEADER
            let currentX = mL;
            if (typeof logoDataUrl !== 'undefined' && logoDataUrl) {
                try {
                    const ip = doc.getImageProperties(logoDataUrl);
                    const lw = 40, lh = Math.min(lw * (ip.height / ip.width), 16); 
                    doc.addImage(logoDataUrl, 'PNG', mL, startY, lw, lh);
                    currentX = mL + lw + 4;
                } catch(e) { console.warn('Logo error:', e); }
            } else {
                doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...C.txt);
                doc.text('TECHMETRIA', currentX, startY + 5);
                doc.setFontSize(7.5); doc.text('SOLUÇÕES INTELIGENTES', currentX, startY + 9);
            }

            const mesStr = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
            const mesRef = mesStr.charAt(0).toUpperCase() + mesStr.slice(1);
            const rightX = pageWidth - mR;

            doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...C.txt);
            doc.text(`Mês Ref.: ${mesRef}`, rightX, startY + 3, { align: 'right' });

            doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
            doc.text('NR Serviços de Medição Individualizada e Com. Ltda', rightX, startY + 7, { align: 'right' });
            doc.text('Rua Prof. Álvaro Lima, N° 24, Casa Forte', rightX, startY + 10.5, { align: 'right' });
            doc.text('Recife/PE - CEP: 52070-005 - Brasil', rightX, startY + 14, { align: 'right' });
            doc.text('Atendimento ao Cliente: (81) 4007-2008', rightX, startY + 17.5, { align: 'right' });

            startY += 22; 
            doc.setDrawColor(0, 0, 0); 
            doc.setLineWidth(0.2); 
            doc.line(mL, startY, pageWidth - mR, startY); 
            startY += 4; 

            function checkPageBreak(neededHeight) { if (startY + neededHeight > pageHeight - 10) { doc.addPage(); startY = 10; } }

            const selectedIndexes = Array.from(commonAreaMetersSelect.selectedOptions).map(o => parseInt(o.value));
            const residentialUnits = parsedData.filter((_, i) => !selectedIndexes.includes(i));
            const commonAreaEntries = parsedData.filter((_, i) => selectedIndexes.includes(i));
            const rateioAtivo = isRateioHabilitado();
            
            const totalConsumo = parsedData.reduce((s, i) => s + i.consumo, 0);
            const totalFaturado = parsedData.reduce((s, item, index) => {
                const isCommonArea = includeRateioAC.checked && selectedIndexes.includes(index);
                if (isCommonArea && rateioAtivo) return s; 
                return s + item.totalAPagar;
            }, 0); 
            
            const maiorValor = residentialUnits.length ? Math.max(...residentialUnits.map(u => u.totalAPagar)) : 0;
            const menorValor = residentialUnits.length ? Math.min(...residentialUnits.map(u => u.totalAPagar)) : 0;
            const dataLeitura = parsedData.length ? parsedData[0].dataLevantamento : '';

            // ----------------------------------------------------
            // 2. INFORMAÇÕES CLIENTE
            // ----------------------------------------------------
            checkPageBreak(25);
            
            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'plain', 
                body: [[ { content: 'INFORMAÇÕES CLIENTE', styles: { ...styleTitle, lineWidth: { top: 0, right: thickW, bottom: thickW, left: thickW }, lineColor: C.lineThick } } ]]
            });
            startY = doc.lastAutoTable.finalY - thickW; 
            
            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'grid', 
                styles: { ...styleBase, lineWidth: thickW, lineColor: C.lineThick },
                body: [
                    [ { content: `Cód: 0000 - ${condoName}`, styles: { fontStyle: 'bold' } }, { content: 'Mat. concessionária: ------', styles: { fontStyle: 'bold', halign: 'center' } } ],
                    [ { content: 'Administração Interna', rowSpan: 2, styles: { fontStyle: 'bold', valign: 'middle' } }, { content: `Qtd de Aptos: ${residentialUnits.length}`, styles: { fontStyle: 'bold', halign: 'center' } } ],
                    [ { content: `Qtd Pontos AC: ${commonAreaEntries.length}`, styles: { fontStyle: 'bold', halign: 'center' } } ]
                ]
            });
            startY = doc.lastAutoTable.finalY + 3;

            // ----------------------------------------------------
            // 3. INFORMAÇÕES CONTA
            // ----------------------------------------------------
            checkPageBreak(25);
            
            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'plain', 
                body: [[ { content: 'INFORMAÇÕES CONTA', styles: { ...styleTitle, lineWidth: { top: 0, right: thickW, bottom: thickW, left: thickW }, lineColor: C.lineThick } } ]]
            });
            startY = doc.lastAutoTable.finalY - thickW;

            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'grid', 
                styles: { ...styleBase, lineWidth: thickW, lineColor: C.lineThick },
                body: [
                    [
                        { content: 'Consumo total', styles: styleColHeader },
                        { content: 'Informações Adicionais', colSpan: 2, styles: styleColHeader },
                        { content: 'Período de\nConsumo', styles: styleColHeader },
                        { content: 'Próxima Leit\nPrevisão', styles: styleColHeader },
                        { content: 'Valor Total', styles: styleColHeader }
                    ],
                    [
                        { content: `${formatNumberBR(totalConsumo, 0)} m³`, rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } },
                        { content: 'Menor Conta', styles: { halign: 'center' } },
                        { content: `R$ ${formatNumberBR(menorValor)}`, styles: { halign: 'center' } },
                        { content: dataLeitura || '---', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                        { content: '---', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                        { content: `R$ ${formatNumberBR(totalFaturado)}`, rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } }
                    ],
                    [
                        { content: 'Maior Conta', styles: { halign: 'center' } },
                        { content: `R$ ${formatNumberBR(maiorValor)}`, styles: { halign: 'center' } }
                    ]
                ]
            });
            startY = doc.lastAutoTable.finalY + 3;

            // ----------------------------------------------------
            // 3.5 ÁREA COMUM
            // ----------------------------------------------------
            if (commonAreaEntries.length > 0) {
                checkPageBreak(35); 
                const numberOfUnits = residentialUnits.length;

                const acBody = commonAreaEntries.map((item, idx) => {
                    const valorRateado = (rateioAtivo && numberOfUnits > 0) ? (item.valorConsumo / numberOfUnits) : 0;
                    return [
                        { content: `${idx + 1}`, styles: { halign: 'center' } },
                        { content: item.apto, styles: { halign: 'center' } },
                        { content: `${formatNumberBR(item.leituraAnterior, 0)} m³`, styles: { halign: 'center' } },
                        { content: `${formatNumberBR(item.leituraAtual, 0)} m³`, styles: { halign: 'center' } },
                        { content: `${formatNumberBR(item.consumo, 0)} m³`, styles: { halign: 'center' } },
                        { content: `R$ ${formatNumberBR(item.valorConsumo)}`, styles: { halign: 'right' } }, 
                        { content: `R$ ${formatNumberBR(item.totalAPagar)}`, styles: { halign: 'right' } }, 
                        { content: rateioAtivo ? `R$ ${formatNumberBR(valorRateado)}` : '-', styles: { halign: 'right' } }      
                    ];
                });

                doc.autoTable({
                    startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'plain', 
                    body: [[ { content: 'CONSUMO INDIVIDUALIZADO ÁREA COMUM', styles: { ...styleTitle, lineWidth: { top: 0, right: thickW, bottom: thickW, left: thickW }, lineColor: C.lineThick } } ]]
                });
                startY = doc.lastAutoTable.finalY - thickW;

                doc.autoTable({
                    startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'grid', 
                    styles: { ...styleBase, lineWidth: thickW, lineColor: C.lineThick }, rowPageBreak: 'avoid', alternateRowStyles: { fillColor: C.zebra },
                    head: [[
                        { content: 'AC', styles: styleColHeader }, { content: 'Local', styles: styleColHeader },
                        { content: 'Leit.\nAnterior\nm³', styles: styleColHeader }, { content: 'Leit.\nAtual m³', styles: styleColHeader },
                        { content: 'Consumo\nm³', styles: styleColHeader }, { content: 'Total', styles: styleColHeader },
                        { content: 'Total a\npagar', styles: styleColHeader }, { content: 'Valor\nrateado', styles: styleColHeader }
                    ]],
                    body: acBody
                });
                startY = doc.lastAutoTable.finalY + 3;
            }

            // ----------------------------------------------------
            // 4. UNIDADES
            // ----------------------------------------------------
            checkPageBreak(40);
            
            const lineUnidades = 0.25;

            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'plain', 
                body: [[ { content: 'CONSUMO INDIVIDUALIZADO DAS UNIDADES', styles: { ...styleTitle, lineWidth: { top: 0, right: lineUnidades, bottom: lineUnidades, left: lineUnidades }, lineColor: C.line } } ]]
            });
            startY = doc.lastAutoTable.finalY - lineUnidades;

            let sumConsumo = 0, sumValorInd = 0, sumRateio = 0, sumTotal = 0, sumTotalPagar = 0;
            const mainBody = residentialUnits.map((item) => {
                const totalLin = item.valorConsumo + item.rateioAC;
                sumValorInd += item.valorConsumo; sumRateio += item.rateioAC; sumTotal += totalLin; sumTotalPagar += item.totalAPagar; sumConsumo += item.consumo;
                return [
                    { content: item.apto, styles: { halign: 'center' } },
                    { content: item.bloco || '1', styles: { halign: 'left' } },
                    { content: `${formatNumberBR(item.leituraAnterior, 0)} m³`, styles: { halign: 'center' } },
                    { content: `${formatNumberBR(item.leituraAtual, 0)} m³`, styles: { halign: 'center' } },
                    { content: `${formatNumberBR(item.consumo, 0)} m³`, styles: { halign: 'center' } },
                    { content: `R$ ${formatNumberBR(item.valorConsumo)}`, styles: { halign: 'right' } },
                    { content: item.rateioAC > 0 ? `R$ ${formatNumberBR(item.rateioAC)}` : '-', styles: { halign: 'center' } },
                    { content: `R$ ${formatNumberBR(totalLin)}`, styles: { halign: 'right' } },
                    { content: `R$ ${formatNumberBR(item.totalAPagar)}`, styles: { halign: 'right' } },
                    { content: item.apto, styles: { halign: 'center' } }
                ];
            });

            mainBody.push([
                { content: 'TOTAL', colSpan: 2, styles: { fontStyle: 'bold', fillColor: C.bg, halign: 'center' } },
                { content: '', styles: { fillColor: C.bg } }, { content: '', styles: { fillColor: C.bg } },
                { content: `${formatNumberBR(sumConsumo, 0)} m³`, styles: { fontStyle: 'bold', fillColor: C.bg, halign: 'center' } },
                { content: `R$ ${formatNumberBR(sumValorInd)}`, styles: { fontStyle: 'bold', fillColor: C.bg, halign: 'right' } },
                { content: `R$ ${formatNumberBR(sumRateio)}`, styles: { fontStyle: 'bold', fillColor: C.bg, halign: 'center' } },
                { content: `R$ ${formatNumberBR(sumTotal)}`, styles: { fontStyle: 'bold', fillColor: C.bg, halign: 'right' } },
                { content: `R$ ${formatNumberBR(sumTotalPagar)}`, styles: { fontStyle: 'bold', fillColor: C.bg, halign: 'right' } },
                { content: '', styles: { fillColor: C.bg } }
            ]);

            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'grid', 
                styles: { ...styleBase, lineWidth: lineUnidades }, alternateRowStyles: { fillColor: C.zebra },
                head: [[
                    { content: 'Apart', styles: styleColHeader }, { content: 'Nome', styles: { ...styleColHeader, halign: 'left' } },
                    { content: 'Leit.\nAnterior\nm³', styles: styleColHeader }, { content: 'Leit.\nAtual m³', styles: styleColHeader },
                    { content: 'Consumo\nm³', styles: styleColHeader }, { content: 'Valor Ind.', styles: styleColHeader },
                    { content: 'Rateio\nAC', styles: styleColHeader }, { content: 'Total', styles: styleColHeader },
                    { content: 'Total a\nPagar', styles: styleColHeader }, { content: 'Apart', styles: styleColHeader }
                ]],
                body: mainBody
            });
            startY = doc.lastAutoTable.finalY + 3;

            // ----------------------------------------------------
            // 5. VALORES DE REFERÊNCIA
            // ----------------------------------------------------
            checkPageBreak(30);
            const tierRowEls = document.querySelectorAll('.tier-row');
            const tiersBody = [];
            if (billingTypeSelect.value === 'tiered' && tierRowEls.length > 0) {
                tierRowEls.forEach(row => {
                    const priceV = row.querySelector('.tier-price') ? row.querySelector('.tier-price').value : '';
                    const startV = row.querySelector('.tier-start') ? row.querySelector('.tier-start').value : '0';
                    const endV = row.querySelector('.tier-end') ? row.querySelector('.tier-end').value : '...';
                    const typeV = row.querySelector('.tier-type') ? row.querySelector('.tier-type').value : '';
                    const desc = typeV === 'fixed' 
                        ? `Até ${formatNumberBR(parseFloat(endV) * 1000, 0)} litros` 
                        : `${formatNumberBR(parseFloat(startV) * 1000 + 1, 0)} a ${formatNumberBR(parseFloat(endV) * 1000, 0)} por 1.000 litros`;
                    tiersBody.push([{ content: priceV, styles: { fontStyle: 'bold', halign: 'center' } }, { content: desc, styles: { halign: 'center' } }]);
                });
            } else if (billingTypeSelect.value === 'average') {
                const totalBillNum = getNumericValue(totalBillInput.value);
                const avgM3 = totalConsumo > 0 ? totalBillNum / totalConsumo : 0;
                tiersBody.push([{ content: `R$ ${formatNumberBR(totalBillNum)}`, styles: { fontStyle: 'bold', halign: 'center' } }, { content: 'Valor total da conta (Custo Médio)', styles: { halign: 'center' } }]);
                tiersBody.push([{ content: `R$ ${formatNumberBR(avgM3, 4)}`, styles: { fontStyle: 'bold', halign: 'center' } }, { content: 'Custo médio por m³', styles: { halign: 'center' } }]);
            }

            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'plain', 
                body: [[ { content: 'Valores de referência', colSpan: 2, styles: { ...styleTitle, lineWidth: { top: 0, right: 0.18, bottom: 0.18, left: 0.18 }, lineColor: C.line } } ]]
            });
            startY = doc.lastAutoTable.finalY - 0.18;

            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'grid', styles: styleBase, alternateRowStyles: { fillColor: C.zebra },
                columnStyles: { 0: { cellWidth: 40 } },
                body: tiersBody.length ? tiersBody : [['N/A', 'N/A']]
            });
            startY = doc.lastAutoTable.finalY + 3;

            // ----------------------------------------------------
            // 6. LEGENDAS E TAXAS
            // ----------------------------------------------------
            checkPageBreak(40);
            let stringTaxaDesc = 'Valor Ind. + Taxa de Gestão/Serviço';
            if (includeManagementFee.checked) {
                stringTaxaDesc = `Valor Ind. + Taxa Serviço (R$ ${formatNumberBR(getNumericValue(managementFeeValueInput.value))})`;
            }

            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'plain', 
                body: [[ { content: 'Legendas', colSpan: 2, styles: { ...styleTitle, lineWidth: { top: 0, right: 0.18, bottom: 0.18, left: 0.18 }, lineColor: C.line } } ]]
            });
            startY = doc.lastAutoTable.finalY - 0.18;

            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'grid', styles: styleBase, alternateRowStyles: { fillColor: C.zebra },
                columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold', halign: 'center' }, 1: { halign: 'center' } },
                body: [
                    ['MI:', 'Medição individualizada'],
                    ['CE:', 'Caixa externa'],
                    ['AC:', 'Área comum'],
                    ['VALOR IND.:', 'Valor individualizado do consumo de Água'],
                    ['TOTAL A PAGAR:', stringTaxaDesc],
                    ['CONSUMO TOTAL CONDÔMINOS:', `${formatNumberBR(totalConsumo, 0)} m³`],
                    ['VALOR TOTAL CONDÔMINOS:', `R$ ${formatNumberBR(totalFaturado)}`]
                ]
            });
            startY = doc.lastAutoTable.finalY + 3;

            // ----------------------------------------------------
            // 7. RODAPÉ
            // ----------------------------------------------------
            checkPageBreak(25);
            
            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'plain', 
                body: [[ { content: 'Central de Atendimento', styles: { ...styleTitle, lineWidth: { top: 0, right: 0.18, bottom: 0.18, left: 0.18 }, lineColor: C.line } } ]]
            });
            startY = doc.lastAutoTable.finalY - 0.18;

            doc.autoTable({
                startY: startY, margin: { left: mL, right: mR }, tableWidth: usableW, theme: 'grid', styles: { ...styleBase, halign: 'center' }, alternateRowStyles: { fillColor: C.zebra },
                body: [
                    [{ content: 'NR Serviços de Medição Individualizada e Com. Ltda', styles: { fontStyle: 'bold' } }],
                    [{ content: 'Fone: (81) 4007-2008', styles: { fontStyle: 'bold' } }],
                    [{ content: 'E-mail: falecom@techmetria.com.br', styles: { fontStyle: 'bold' } }],
                    [{ content: 'Rua Prof. Álvaro Lima, N° 24 - Casa Forte - Recife/PE    www.techmetria.com.br', styles: { fontStyle: 'bold' } }]
                ]
            });

            // Formatação do Nome do Arquivo: Simulação de Relatório - Nome do Condomínio - Maio 2026.pdf
            const now = new Date();
            const nomeMes = now.toLocaleString('pt-BR', { month: 'long' });
            const mesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
            const aaaa = now.getFullYear();
            const fileNameSuffix = `${mesCapitalizado} ${aaaa}`;

            doc.save(`Simulação de Relatório - ${condoName} - ${fileNameSuffix}.pdf`);
            
        } catch (error) {
            console.error("Erro na geração do PDF:", error);
            alert("Erro ao gerar PDF. O script original foi preservado.");
        }
    }

    // --- GERADOR DE EXCEL ---
    function generateXlsx() {
        if (parsedData.length === 0) { showToast('Não há dados para exportar.', 'error'); return; }
        const condoName = condoNameInput.value || 'Condominio (Não informado)';
        const timestamp = new Date().toLocaleString('pt-BR');
        const ws_data = [ ["RELATÓRIO DE SIMULAÇÃO DE CONSUMO"], [`Condomínio: ${condoName}`], [`Data de Geração: ${timestamp}`], [], ["PARÂMETROS UTILIZADOS NO CÁLCULO:"] ];
        const billingType = billingTypeSelect.value;
        const methodText = billingTypeSelect.options[billingTypeSelect.selectedIndex].text;
        ws_data.push(["Método de Cobrança:", methodText]);

        if (billingType === 'average') {
            const totalBillText = totalBillInput.value || "R$ 0,00";
            const totalBillNum = getNumericValue(totalBillInput.value);
            const totalConsumption = parsedData.reduce((sum, item) => sum + item.consumo, 0);
            ws_data.push(["Valor Total da Conta:", totalBillText]);
            if (totalConsumption > 0) {
                const averagePricePerM3 = totalBillNum / totalConsumption;
                ws_data.push(["Consumo Total (m³):", totalConsumption]);
                ws_data.push(["Custo Médio Calculado:", `R$ ${formatNumberBR(averagePricePerM3, 4)} / m³`]);
            }
        } else {
            const sewageFee = document.getElementById('sewageFee').value || "0";
            ws_data.push(["Taxa de Esgoto:", `${sewageFee}%`]);
            ws_data.push([]); ws_data.push(["DETALHE DAS FAIXAS (TARIFA PROGRESSIVA):"]);
            ws_data.push(["Descrição", "Intervalo (m³)", "Tipo", "Valor (R$)"]);
            document.querySelectorAll('.tier-row').forEach((row, index) => {
                const start = row.querySelector('.tier-start').value;
                const end = row.querySelector('.tier-end').value || '...';
                const typeText = row.querySelector('.tier-type').options[row.querySelector('.tier-type').selectedIndex].text;
                const price = row.querySelector('.tier-price').value;
                ws_data.push([`Faixa ${index + 1}`, `${start} a ${end}`, typeText, price]);
            });
            ws_data.push([]); 
        }

        const rateioAtivo = isRateioHabilitado();
        const rateioText = (includeRateioAC.checked && rateioAtivo) ? "SIM (Rateio Igualitário)" : "NÃO";
        ws_data.push(["Rateio Área Comum:", rateioText]);
        if (includeManagementFee.checked) { ws_data.push(["Taxa de Gestão (Unidade):", managementFeeValueInput.value || "R$ 0,00"]); }
        ws_data.push([]); 
        ws_data.push(["Bloco", "Apto", "Leitura Anterior", "Leitura Atual", "Consumo (m³)", "Valor Consumo (R$)", "Rateio AC (R$)", "Taxa Gestão (R$)", "Total a Pagar (R$)"]);

        const selectedIndexes = Array.from(commonAreaMetersSelect.selectedOptions).map(opt => parseInt(opt.value));
        parsedData.forEach(item => { ws_data.push([ item.bloco, item.apto, item.leituraAnterior, item.leituraAtual, item.consumo, item.valorConsumo, item.rateioAC, item.taxaGestao, item.totalAPagar ]); });

        const totalConsumption = parsedData.reduce((sum, item) => sum + item.consumo, 0);
        const totalValorConsumo = parsedData.reduce((sum, item, index) => {
            if (includeRateioAC.checked && selectedIndexes.includes(index) && rateioAtivo) return sum;
            return sum + item.valorConsumo;
        }, 0);
        const totalRateio = parsedData.reduce((sum, item) => sum + item.rateioAC, 0);
        const totalTaxaGestao = parsedData.reduce((sum, item, index) => {
            if (includeRateioAC.checked && selectedIndexes.includes(index) && rateioAtivo) return sum;
            return sum + item.taxaGestao;
        }, 0);
        const totalBilled = parsedData.reduce((sum, item, index) => {
            if (includeRateioAC.checked && selectedIndexes.includes(index) && rateioAtivo) return sum;
            return sum + item.totalAPagar;
        }, 0);

        ws_data.push([]); ws_data.push(["TOTAIS", "", "", "", totalConsumption, totalValorConsumo, totalRateio, totalTaxaGestao, totalBilled]);

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({c: C, r: R});
                if (!ws[cellRef]) continue;
                if (ws[cellRef].t === 'n') {
                    if (C >= 5 && C <= 8) { ws[cellRef].z = '"R$ "#,##0.00'; }
                    if (C === 4) { ws[cellRef].z = '#,##0.00'; }
                }
            }
        }

        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push({ s: {r:0, c:0}, e: {r:0, c:8} }); ws['!merges'].push({ s: {r:1, c:0}, e: {r:1, c:8} }); ws['!merges'].push({ s: {r:2, c:0}, e: {r:2, c:8} });
        ws['!cols'] = [ {wch: 15}, {wch: 25}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 20} ];
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Relatório");
        
        // Formatação do Nome do Arquivo Excel
        const now = new Date();
        const nomeMes = now.toLocaleString('pt-BR', { month: 'long' });
        const mesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
        const aaaa = now.getFullYear();
        const fileNameSuffix = `${mesCapitalizado} ${aaaa}`;
        
        XLSX.writeFile(wb, `Simulação de Relatório - ${condoName} - ${fileNameSuffix}.xlsx`);
        showToast('Arquivo Excel (Formatado) gerado com sucesso!', 'success');
    }

    addInitialTier();
});
