/* Agente Tech — configuração do Simulador de Relatórios (gerado em 29/10/2026 10:57) */
/* URL /exec da "Agente Tech - API" (a mesma em todos os sistemas). Vazia = IA desligada. */
window.AGENTE_API_URL = window.AGENTE_API_URL || '';
/* Agente Tech \u2014 Simulador de Relat\u00f3rios (\u00e1gua: faixas de consumo ou custo m\u00e9dio) */
(function () {
  if (!window.AgenteTech) return;
  var AT = window.AgenteTech, U = AT.util, esc = AT.esc;

  // ---------------------------------------------------------------- leitura do estado da tela (o app guarda os dados em escopo fechado)
  function $(id) { return document.getElementById(id); }
  function val(id) { var e = $(id); return e ? String(e.value || '').trim() : ''; }
  function marcado(id) { var e = $(id); return !!(e && e.checked); }
  function arquivoNome() { var f = $('fileInput'); return f && f.files && f.files[0] ? f.files[0].name : ''; }
  function registros() { var s = $('commonAreaMetersSelect'); return s ? s.options.length : 0; }
  function acSelecionados() { var s = $('commonAreaMetersSelect'); return s ? Array.prototype.filter.call(s.options, function (o) { return o.selected; }).map(function (o) { return o.textContent; }) : []; }
  function metodo() { return val('billingType') === 'average' ? 'custo m\u00e9dio' : 'faixas de consumo'; }
  function resultadosVisiveis() { var r = $('results-section'); return !!r && r.style.display !== 'none' && !!r.querySelector('table'); }
  function faixas() {
    return Array.prototype.map.call(document.querySelectorAll('#tiers-container .tier-row'), function (row, i) {
      var q = function (c) { var e = row.querySelector(c); return e ? String(e.value || '').trim() : ''; };
      return { n: i + 1, de: q('.tier-start'), ate: q('.tier-end'), tipo: q('.tier-type') === 'fixed' ? 'tarifa m\u00ednima (valor fixo)' : 'valor por m\u00b3', valor: q('.tier-price'), _row: row };
    });
  }
  function linhasResultado() {
    var t = document.querySelector('#results-table table'); if (!t) return { linhas: [], totais: null };
    var rows = Array.prototype.slice.call(t.tBodies[0] ? t.tBodies[0].rows : []);
    var tot = rows.length ? rows[rows.length - 1] : null;
    var dados = rows.slice(0, -1).map(function (r, i) {
      var c = r.cells, inp = function (k) { var e = c[k] && c[k].querySelector('input'); return e ? U.num(e.value) : NaN; };
      return { i: i, bloco: U.texto(c[0]), apto: U.texto(c[1]), anterior: inp(2), atual: inp(3), consumo: U.num(U.texto(c[4])),
        valorConsumo: U.num(U.texto(c[5])), rateioAC: U.texto(c[6]), taxa: U.texto(c[7]), total: U.num(U.texto(c[8])) };
    });
    var totais = tot ? { consumo: U.texto(tot.cells[1]), valorConsumo: U.texto(tot.cells[2]), rateio: U.texto(tot.cells[3]), taxa: U.texto(tot.cells[4]), totalAPagar: U.texto(tot.cells[5]) } : null;
    return { linhas: dados, totais: totais };
  }
  var estado = { execucao: 0, alteracao: 0 };
  function desatualizado() { return resultadosVisiveis() && estado.alteracao > estado.execucao; }

  // ---------------------------------------------------------------- diagn\u00f3stico
  function diagnostico() {
    var L = [], add = function (n, t, a) { L.push({ nivel: n, texto: t, alvo: a }); };
    var nome = arquivoNome(), n = registros();
    if (!nome) add('erro', 'Carregue o arquivo de leitura (TXT no formato Carsoft).', 'dropZoneFile');
    else if (!n) add('erro', 'O arquivo "' + nome + '" foi lido mas n\u00e3o trouxe registros: ele precisa de 7 colunas separadas por TAB (apto, leitura anterior, leitura atual, \u2026, data, bloco).', 'dropZoneFile');
    if (!val('condoName')) add('aviso', 'Informe o nome do condom\u00ednio \u2014 ele sai no PDF e no Excel (sem ele aparece "N\u00e3o informado").', 'condoName');

    if (val('billingType') === 'average') {
      if (!(U.num(val('totalBill')) > 0)) add('erro', 'No custo m\u00e9dio, informe o valor total da conta de \u00e1gua.', 'totalBill');
    } else {
      var F = faixas();
      if (!F.length) add('erro', 'Adicione pelo menos uma faixa de consumo.', 'addTierBtn');
      F.forEach(function (f, k) {
        var de = U.num(f.de), ate = f.ate === '' ? Infinity : U.num(f.ate), preco = U.num(f.valor);
        if (!(preco > 0)) add('erro', 'Faixa ' + f.n + ' sem valor (R$).', 'faixa_' + k);
        if (isFinite(ate) && isFinite(de) && ate < de) add('erro', 'Faixa ' + f.n + ': "at\u00e9" (' + f.ate + ') menor que "de" (' + f.de + ').', 'faixa_' + k);
        if (f.ate === '' && k < F.length - 1) add('aviso', 'Faixa ' + f.n + ' sem "at\u00e9": s\u00f3 a \u00faltima faixa pode ficar aberta.', 'faixa_' + k);
        if (k > 0) {
          var antAte = U.num(F[k - 1].ate);
          if (isFinite(antAte) && isFinite(de) && de > antAte + 1) add('aviso', 'Faixa ' + f.n + ' come\u00e7a em ' + f.de + ' m\u00b3, mas a anterior termina em ' + F[k - 1].ate + ' m\u00b3 (h\u00e1 um intervalo sem faixa).', 'faixa_' + k);
          if (isFinite(antAte) && isFinite(de) && de < antAte) add('aviso', 'Faixa ' + f.n + ' come\u00e7a em ' + f.de + ' m\u00b3, antes do fim da anterior (' + F[k - 1].ate + ' m\u00b3).', 'faixa_' + k);
        }
      });
      var ult = F[F.length - 1];
      if (ult && ult.ate !== '') {
        var lim = U.num(ult.ate), acima = linhasResultado().linhas.filter(function (l) { return l.consumo > lim; });
        add(acima.length ? 'erro' : 'info', 'A \u00faltima faixa termina em ' + ult.ate + ' m\u00b3: consumo acima disso n\u00e3o \u00e9 cobrado' +
          (acima.length ? ' (' + acima.length + ' unidade(s), ex.: apto ' + acima[0].apto + ' com ' + U.br(acima[0].consumo, 0) + ' m\u00b3)' : '') + '. Deixe o "at\u00e9" da \u00faltima faixa vazio.', 'faixa_' + (F.length - 1));
      }
      if (val('sewageFee') === '') add('info', 'Taxa de esgoto vazia = 0%.', 'sewageFee');
    }
    if (marcado('includeRateioAC')) {
      var sel = acSelecionados();
      if (!sel.length) add('aviso', 'Rateio da \u00e1rea comum ligado, mas nenhum medidor de AC selecionado.', 'commonAreaMetersSelect');
      else if (!marcado('applyRateioValue')) add('info', sel.length + ' ponto(s) de AC separados no relat\u00f3rio, mas o valor n\u00e3o est\u00e1 sendo rateado (marque "Ratear o valor entre as unidades?").', 'applyRateioValue');
    }
    if (marcado('includeManagementFee') && !(U.num(val('managementFeeValue')) > 0)) add('aviso', 'Taxa de gest\u00e3o ligada, mas sem valor.', 'managementFeeValue');

    if (n && !resultadosVisiveis()) add('info', 'Par\u00e2metros prontos? Clique em "Executar Simula\u00e7\u00e3o".', 'runSimulationBtn');
    if (desatualizado()) add('aviso', 'Voc\u00ea mudou par\u00e2metros depois da \u00faltima simula\u00e7\u00e3o \u2014 clique em "Executar Simula\u00e7\u00e3o" de novo antes de gerar o PDF/Excel.', 'runSimulationBtn');
    if (resultadosVisiveis()) {
      var R = linhasResultado().linhas;
      var neg = R.filter(function (l) { return l.consumo < 0; });
      if (neg.length) add('erro', neg.length + ' unidade(s) com consumo negativo (leitura atual menor que a anterior): ' + neg.slice(0, 4).map(function (l) { return 'apto ' + l.apto; }).join(', ') + '. Corrija na tabela.', 'linha_' + neg[0].i);
      var med = U.mediana(R.map(function (l) { return l.consumo; }).filter(function (c) { return c > 0; }));
      var alto = R.filter(function (l) { return med > 0 && l.consumo > med * 3 && l.consumo > 5; });
      if (alto.length) add('aviso', 'Consumo muito acima da mediana (' + U.br(med, 0) + ' m\u00b3): ' + alto.slice(0, 4).map(function (l) { return 'apto ' + l.apto + ' ' + U.br(l.consumo, 0) + ' m\u00b3'; }).join(', ') + '.', 'linha_' + alto[0].i);
      var zero = R.filter(function (l) { return l.consumo === 0; });
      if (zero.length) add('info', zero.length + ' unidade(s) sem consumo.', 'linha_' + zero[0].i);
    }
    if (!$('logoPreview') || $('logoPreview').style.display === 'none') add('info', 'Sem logo: o PDF sai com o texto TECHMETRIA no cabe\u00e7alho.', 'dropZoneLogo');
    if (resultadosVisiveis()) add('info', 'O "M\u00eas Ref." do PDF usa o m\u00eas de hoje (do computador), n\u00e3o a data da leitura.', 'generatePdfBtn');
    if (resultadosVisiveis() && !L.some(function (x) { return x.nivel === 'erro'; }) && !desatualizado()) {
      var tt = linhasResultado().totais;
      add('ok', 'Simula\u00e7\u00e3o pronta' + (tt ? ': total a pagar ' + tt.totalAPagar : '') + '. Gere o PDF ou o Excel.', 'generatePdfBtn');
    }
    return L;
  }

  // ---------------------------------------------------------------- respostas locais
  function respFaixas() {
    return '<b>Faixas de consumo (tarifa progressiva)</b><br>' +
      '\u2022 Cada faixa tem "de", "at\u00e9", tipo e valor. Faixas <b>"valor por m\u00b3"</b> cobram cada m\u00b3 consumido dentro do intervalo.<br>' +
      '\u2022 Faixa <b>"tarifa m\u00ednima"</b> cobra um valor fixo: se o consumo cair dentro dela, a unidade paga s\u00f3 esse valor.<br>' +
      '\u2022 O consumo \u00e9 cobrado em cascata: os primeiros m\u00b3 na 1\u00aa faixa, os seguintes na 2\u00aa, e assim por diante.<br>' +
      '\u2022 Deixe o <b>"at\u00e9" da \u00faltima faixa vazio</b> para cobrir qualquer consumo acima.<br>' +
      '\u2022 A <b>taxa de esgoto</b> (%) \u00e9 aplicada sobre o valor da \u00e1gua.<br>' +
      '<button type="button" class="apontar" data-alvo="tiers-container">\ud83d\udccd faixas</button> <button type="button" class="apontar" data-alvo="addTierBtn">\ud83d\udccd Adicionar Faixa</button>';
  }
  function respCustoMedio() {
    return '<b>Custo m\u00e9dio</b><br>Valor por m\u00b3 = <b>valor total da conta \u00f7 consumo total</b> do arquivo. Cada unidade paga consumo \u00d7 valor por m\u00b3, mais rateio da \u00e1rea comum e taxa de gest\u00e3o, se ligados.' +
      '<br><button type="button" class="apontar" data-alvo="billingType">\ud83d\udccd m\u00e9todo de cobran\u00e7a</button>';
  }
  function respRateio() {
    return '<b>Rateio da \u00e1rea comum (AC)</b><br>1. Marque "Habilitar rateio da \u00c1rea Comum?".<br>2. Selecione os medidores de AC na lista (Ctrl para v\u00e1rios).<br>' +
      '3. Marque "Ratear o valor entre as unidades?" para dividir o valor da AC <b>igualmente</b> entre as demais unidades.<br>' +
      'Os medidores de AC saem numa tabela pr\u00f3pria no PDF e n\u00e3o pagam taxa de gest\u00e3o.<br><button type="button" class="apontar" data-alvo="includeRateioAC">\ud83d\udccd rateio da AC</button>';
  }

  // ---------------------------------------------------------------- contexto para a IA
  function contexto() {
    var R = linhasResultado();
    return {
      arquivo: { nome: arquivoNome() || null, registros: registros() },
      parametros: {
        condominio: val('condoName'), metodo: metodo(),
        contaTotal: val('billingType') === 'average' ? val('totalBill') : null,
        taxaEsgotoPercent: val('billingType') === 'average' ? null : val('sewageFee'),
        faixas: val('billingType') === 'average' ? null : faixas().map(function (f) { return { faixa: f.n, de: f.de, ate: f.ate || 'sem limite', tipo: f.tipo, valor: f.valor, alvo: 'faixa_' + (f.n - 1) }; }),
        rateioAC: { ligado: marcado('includeRateioAC'), medidoresAC: acSelecionados(), ratearValor: marcado('applyRateioValue') },
        taxaGestao: { ligada: marcado('includeManagementFee'), valor: val('managementFeeValue') },
        logoCarregado: !!($('logoPreview') && $('logoPreview').style.display !== 'none')
      },
      resultados: resultadosVisiveis() ? {
        desatualizado: desatualizado(), totais: R.totais,
        unidades: R.linhas.map(function (l) { return { alvo: 'linha_' + l.i, bloco: l.bloco, apto: l.apto, anterior: l.anterior, atual: l.atual, consumo: l.consumo, valorConsumo: l.valorConsumo, rateioAC: l.rateioAC, taxa: l.taxa, total: l.total }; })
      } : null
    };
  }

  var CONHECIMENTO = [
    'O Simulador de Relat\u00f3rios (site da Techmetria no GitHub Pages, vers\u00e3o 1.4, autor Miguel Carvalho) simula o relat\u00f3rio de consumo de \u00c1GUA de um condom\u00ednio antes da emiss\u00e3o oficial, comparando m\u00e9todos de cobran\u00e7a, e gera PDF e Excel padronizados.',
    'PASSO 1 \u2014 Carregar dados: arquivo de leitura no formato CARSOFT (TXT separado por TAB; 1\u00aa linha \u00e9 cabe\u00e7alho; colunas usadas: apto, leitura anterior, leitura atual, \u2026, data do levantamento na 6\u00aa e bloco na 7\u00aa; consumo = atual \u2212 anterior) e, opcionalmente, a logo do relat\u00f3rio (PNG/JPG).',
    'PASSO 2 \u2014 Par\u00e2metros: nome do condom\u00ednio; m\u00e9todo de cobran\u00e7a "Faixas de Consumo (Tarifa Progressiva)" (taxa de esgoto em % sobre a \u00e1gua; faixas com de/at\u00e9 em m\u00b3, tipo "Valor por ' +
    'm\u00b3" ou "Tarifa M\u00ednima" (valor fixo) e valor em R$; a cobran\u00e7a \u00e9 em cascata e a \u00faltima faixa deve ficar sem "at\u00e9" para cobrir consumos maiores \u2014 consumo acima do \u00faltimo "at\u00e9" ' +
    'n\u00e3o \u00e9 cobrado) ou "Custo M\u00e9dio" (valor total da conta \u00f7 consumo total = valor por m\u00b3). Rateio da \u00c1rea Comum: marcar, selecionar os medidores de AC e "Ratear o valor entre as unidades" ' +
    '(divide igualmente o valor da AC pelas demais unidades; AC n\u00e3o paga taxa). Taxa de gest\u00e3o por unidade (somada ao total, exceto AC).',
    'PASSO 3 \u2014 "Executar Simula\u00e7\u00e3o": monta a tabela (Bloco, Apto, leituras edit\u00e1veis, Consumo, Vlr. Consumo, Rateio AC, Taxa Gest\u00e3o, Total a Pagar e linha de TOTAIS). Editar uma leitura recalcula na hora. Mudar o m\u00e9todo, as faixas, a conta ou a taxa exige executar de novo.',
    'EXPORTA\u00c7\u00c3O: "Gerar Relat\u00f3rio PDF" (cabe\u00e7alho com a logo ou o texto TECHMETRIA, "M\u00eas Ref." = m\u00eas atual do computador, informa\u00e7\u00f5es do cliente e da conta, tabela de AC, consumo ' +
    'individualizado das unidades, valores de refer\u00eancia das faixas, legendas e central de atendimento) e "Gerar Excel (XLSX)" com os par\u00e2metros e a tabela. Os arquivos se chamam "Simula\u00e7\u00e3o de ' +
    'Relat\u00f3rio - <condom\u00ednio> - <M\u00eas> <ano>".',
    'Para apontar uma unidade use o "alvo" dela (linha_N); uma faixa: faixa_N.'
  ].join('\n');

  // ---------------------------------------------------------------- tour
  function caixaParametros() {
    var a = $('average-cost-params'), t = $('tiered-cost-params');
    return (a && a.style.display !== 'none') ? a : t;
  }
  var TOUR = [
    { alvo: null, titulo: 'Bem-vindo ao Simulador de Relat\u00f3rios',
      texto: 'Aqui voc\u00ea simula o relat\u00f3rio de consumo de \u00e1gua de um condom\u00ednio \u2014 por <b>faixas de consumo</b> ou por <b>custo m\u00e9dio</b> \u2014 e gera o PDF e o Excel padronizados. Vamos ao passo a passo.' },
    { alvo: 'dropZoneFile', titulo: '1. Arquivo de leitura',
      texto: 'Clique ou arraste o <b>TXT no formato Carsoft</b>. O sistema conta os registros e j\u00e1 monta a lista de medidores para a \u00e1rea comum.' },
    { alvo: 'dropZoneLogo', titulo: 'Logo (opcional)', texto: 'Imagem que vai no topo do PDF. Sem ela, o cabe\u00e7alho sai com o texto <b>TECHMETRIA</b>.' },
    { alvo: 'condoName', titulo: '2. Nome do condom\u00ednio', texto: 'Aparece no PDF, no Excel e no nome dos arquivos.' },
    { alvo: 'billingType', titulo: 'M\u00e9todo de cobran\u00e7a',
      texto: '<b>Faixas de consumo</b>: tarifa progressiva com faixas e taxa de esgoto. <b>Custo m\u00e9dio</b>: valor da conta \u00f7 consumo total.' },
    { alvo: caixaParametros, titulo: 'Par\u00e2metros do m\u00e9todo',
      texto: function () {
        return val('billingType') === 'average'
          ? 'Informe o <b>valor total da conta de \u00e1gua</b>: o valor por m\u00b3 \u00e9 calculado sozinho.'
          : 'Defina a <b>taxa de esgoto</b> e as <b>faixas</b> (de/at\u00e9 em m\u00b3, tipo e valor). Deixe o <b>"at\u00e9" da \u00faltima faixa vazio</b> para cobrir qualquer consumo acima.';
      } },
    { alvo: function () { return $('includeRateioAC') && $('includeRateioAC').parentNode; }, titulo: 'Rateio da \u00e1rea comum',
      texto: 'Marque, escolha os medidores de <b>\u00e1rea comum</b> e decida se o valor deles \u00e9 <b>rateado</b> igualmente entre as unidades.' },
    { alvo: function () { return $('includeManagementFee') && $('includeManagementFee').parentNode; }, titulo: 'Taxa de gest\u00e3o', texto: 'Valor por unidade somado ao total a pagar (a \u00e1rea comum n\u00e3o paga).' },
    { alvo: 'runSimulationBtn', titulo: '3. Executar simula\u00e7\u00e3o', texto: 'Calcula todas as unidades. Se mudar par\u00e2metros depois, execute de novo.' },
    { alvo: 'results-section', titulo: 'Resultados e exporta\u00e7\u00e3o',
      texto: function () {
        return resultadosVisiveis()
          ? 'As <b>leituras s\u00e3o edit\u00e1veis</b> e recalculam na hora. Confira os totais e gere o <b>PDF</b> ou o <b>Excel</b> logo abaixo da tabela.'
          : 'Depois de executar, aparece aqui a tabela por unidade (leituras edit\u00e1veis, consumo, valores, rateio, taxa e total) com os bot\u00f5es <b>Gerar Relat\u00f3rio PDF</b> e <b>Gerar Excel</b>.';
      } },
    { alvo: 'infoBtn', titulo: 'Informa\u00e7\u00f5es', texto: 'Vers\u00e3o do simulador e o resumo de como usar.' }
  ];

  // ---------------------------------------------------------------- ganchos (o app n\u00e3o exp\u00f5e fun\u00e7\u00f5es: escutamos os bot\u00f5es)
  function ganchos(A) {
    var fi = $('fileInput');
    if (fi) fi.addEventListener('change', function () {
      if (!fi.files || !fi.files[0]) return;
      A.dizer('Lendo o arquivo ' + esc(fi.files[0].name), { digitando: true, ms: 0 });
      A.aguardar(function () { return registros() > 0; }, 3000).then(function () {
        A.dizer('\ud83d\udcc2 <b>' + registros() + ' registros</b> carregados. Agora confira os par\u00e2metros e clique em Executar.', { tipo: 'ok', ms: 4500 });
        A.atualizar();
      }).catch(function () {
        A.dizer('N\u00e3o encontrei registros v\u00e1lidos nesse arquivo \u2014 ele precisa ser o TXT do Carsoft, separado por TAB.', { tipo: 'erro', ms: 5500 });
      });
    });
    var rb = $('runSimulationBtn');
    if (rb) rb.addEventListener('click', function () {
      if (!registros()) return;
      estado.execucao = Date.now() + 1;
      A.dizer('Calculando as unidades', { digitando: true, ms: 0 });
      setTimeout(function () {
        var tt = linhasResultado().totais, erros = diagnostico().filter(function (x) { return x.nivel === 'erro'; }).length;
        if (!tt) { A.calar(); return; }
        A.dizer('Simula\u00e7\u00e3o pronta: <b>' + esc(tt.totalAPagar) + '</b> no total' + (erros ? ' \u00b7 \u26a0\ufe0f ' + erros + ' pend\u00eancia(s)' : ''), { tipo: erros ? 'aviso' : 'ok', ms: 5000 });
        A.atualizar();
      }, 450);
    }, true);
    var pdf = $('generatePdfBtn'), xls = $('generateXlsxBtn');
    if (pdf) pdf.addEventListener('click', function () { setTimeout(function () { A.dizer('\ud83d\udcc4 PDF gerado \u2014 confira os downloads.', { tipo: 'ok' }); }, 900); });
    if (xls) xls.addEventListener('click', function () { setTimeout(function () { A.dizer('\ud83d\udcca Excel gerado.', { tipo: 'ok' }); }, 700); });
    var marcar = function (e) {
      var t = e.target; if (!t || !t.closest) return;
      if (t.closest('#results-table') || t.id === 'condoName' || t.id === 'fileInput' || t.id === 'logoInput') return;
      if (t.closest('#rateio-selector-box')) return;      // o app recalcula sozinho nesse bloco
      estado.alteracao = Date.now() + 2;
      setTimeout(A.atualizar, 50);
    };
    document.addEventListener('input', marcar, true);
    document.addEventListener('change', marcar, true);
  }
  function resolverAlvo(k) {
    var m = /^(linha|faixa)_(\d+)$/.exec(k); if (!m) return null;
    if (m[1] === 'faixa') return document.querySelectorAll('#tiers-container .tier-row')[+m[2]] || null;
    var t = document.querySelector('#results-table table'); if (!t || !t.tBodies[0]) return null;
    var r = t.tBodies[0].rows[+m[2]]; return r ? (r.cells[3] && r.cells[3].querySelector('input')) || r.cells[1] : null;
  }
  function rotuloAlvo(k) {
    var m = /^(linha|faixa)_(\d+)$/.exec(k); if (!m) return '';
    if (m[1] === 'faixa') return 'faixa ' + (+m[2] + 1);
    var l = linhasResultado().linhas[+m[2]]; return l ? 'apto ' + l.apto + (l.bloco ? ' (bloco ' + l.bloco + ')' : '') : 'unidade';
  }

  AT.iniciar({
    projeto: 'simulador',
    nome: 'Simulador de Relat\u00f3rios',
    subtitulo: 'Simulador de Relat\u00f3rios \u00b7 \u00e1gua',
    ia: { url: String(window.AGENTE_API_URL || '') },
    conhecimento: CONHECIMENTO,
    saudacao: 'Ol\u00e1! Sou o <b>Assistente Tech</b> do Simulador de Relat\u00f3rios. Confiro o arquivo e os par\u00e2metros, explico as <b>faixas</b>, o <b>custo m\u00e9dio</b> e o <b>rateio da \u00e1rea comum</b>, e aponto o campo certo.',
    convite: 'Quer ajuda com a simula\u00e7\u00e3o? Clique aqui \ud83d\udc4b',
    placeholder: 'Pergunte sobre faixas, rateio, valores\u2026',
    ajuda: { dentro: '.main-header', variante: 'claro' },
    cssPagina: '.main-header .agtech-ajuda{position:absolute;right:calc(2rem + 50px);top:50%;transform:translateY(-50%)}' +
      '@media(max-width:900px){.main-header .agtech-ajuda{right:calc(1rem + 46px)}}' +
      '@media(max-width:600px){.main-header .agtech-ajuda{display:none}}',
    alvos: {
      dropZoneFile: 'arquivo de leitura', dropZoneLogo: 'logo do relat\u00f3rio', condoName: 'nome do condom\u00ednio',
      billingType: 'm\u00e9todo de cobran\u00e7a', totalBill: 'valor total da conta', sewageFee: 'taxa de esgoto',
      'tiers-container': 'faixas de consumo', addTierBtn: 'Adicionar Faixa',
      includeRateioAC: { el: function () { return $('includeRateioAC') && $('includeRateioAC').parentNode; }, rotulo: 'rateio da \u00e1rea comum' },
      commonAreaMetersSelect: { el: function () { return $('rateio-selector-box'); }, rotulo: 'medidores da \u00e1rea comum',
        antes: function () { var c = $('includeRateioAC'); if (c && !c.checked) { c.checked = true; c.dispatchEvent(new Event('change')); return true; } return null; } },
      applyRateioValue: { el: function () { return $('applyRateioValue') && $('applyRateioValue').parentNode; }, rotulo: 'ratear o valor da AC' },
      managementFeeValue: { el: function () { return $('management-fee-box'); }, rotulo: 'valor da taxa de gest\u00e3o' },
      runSimulationBtn: 'Executar Simula\u00e7\u00e3o',
      'results-section': { rotulo: 'resultados', oculto: 'Os resultados aparecem depois de clicar em "Executar Simula\u00e7\u00e3o".' },
      generatePdfBtn: { rotulo: 'Gerar Relat\u00f3rio PDF', oculto: 'Aparece depois de executar a simula\u00e7\u00e3o.' },
      generateXlsxBtn: { rotulo: 'Gerar Excel', oculto: 'Aparece depois de executar a simula\u00e7\u00e3o.' },
      infoBtn: 'Informa\u00e7\u00f5es'
    },
    resolverAlvo: resolverAlvo, rotuloAlvo: rotuloAlvo,
    diagnostico: diagnostico,
    contexto: contexto,
    tela: function () { return resultadosVisiveis() ? 'resultados da simula\u00e7\u00e3o' : 'par\u00e2metros'; },
    chips: [
      { id: 'faltando', rotulo: '\ud83d\udd0d O que est\u00e1 faltando?' },
      { id: 'faixas', rotulo: '\ud83d\udcf6 Como funcionam as faixas', acao: respFaixas },
      { id: 'medio', rotulo: '\u2797 Custo m\u00e9dio', acao: respCustoMedio },
      { id: 'rateio', rotulo: '\ud83c\udfe2 Rateio da \u00e1rea comum', acao: respRateio },
      { id: 'conferir', rotulo: '\u2705 Conferir a simula\u00e7\u00e3o', prompt: 'Confira esta simula\u00e7\u00e3o: par\u00e2metros, faixas (intervalos, valores e a \u00faltima faixa aberta), rateio da \u00e1rea comum, taxa de gest\u00e3o, consumos suspeitos e se os resultados est\u00e3o atualizados.' },
      { id: 'tour', rotulo: '\ud83e\udded Fazer o tour' }
    ],
    respostas: [
      { padrao: /faixa|progressiv|esgoto|tarifa m[\u00edi]nima/, acao: respFaixas },
      { padrao: /m[\u00e9e]dio/, acao: respCustoMedio },
      { padrao: /rateio|[\u00e1a]rea comum|\bac\b/, acao: respRateio }
    ],
    tour: TOUR,
    ganchos: ganchos
  });
})();

