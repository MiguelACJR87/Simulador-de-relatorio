/* Agente Tech v1.0 — gerado em 29/10/2026 10:57 (não editar à mão) */
/* =====================================================================
   AGENTE TECH \u2014 assistente virtual dos sistemas da Techmetria
   Mascote 3D animado, tour guiado, painel com diagn\u00f3stico autom\u00e1tico e
   perguntas \u00e0 IA Gemini (pela API central "Agente Tech \u2014 API").
   Tudo roda dentro de um Shadow DOM: n\u00e3o herda nem altera o CSS do
   sistema onde for instalado. Cada sistema chama AgenteTech.iniciar({...})
   com o seu pr\u00f3prio contexto (tour, diagn\u00f3stico, dados para a IA).
   ===================================================================== */
(function () {
  'use strict';
  if (window.AgenteTech && window.AgenteTech.versao) return;

  var VERSAO = '1.0';
  var CSS = [
":host{all:initial}.ag{--navy:#002D5E;--navy2:#003F7A;--blue:#0056B3;--blue2:#3B82F6;--blue-ink:#1D4ED8;--soft:#F8FAFF;--border:#E2EEF9;--border2:#E8EEF8;--text:#1E293B;--text2:#334155;--muted:#64748B;--muted2:#94A3B8;--shadow-lg:0 12px 40px rgba(0,45,94,.16);--f:\"Plus Jakarta Sans\",\"Segoe UI\",system",
"-ui,-apple-system,Roboto,sans-serif;--ag-r:22px;--ag-b:22px;font-family:var(--f);font-size:15px;line-height:1.45;color:var(--text);-webkit-font-smoothing:antialiased;text-align:left;letter-spacing:normal;text-transform:none}.ag *,.ag *::before,.ag *::after{box-sizing:border-box;margin:0;padding:0}.a",
"g button,.ag textarea{font-family:inherit;letter-spacing:normal;text-transform:none}.ag [hidden]{display:none!important}.ag:focus-visible{outline:2px solid var(--blue);outline-offset:2px}.fab{position:fixed;right:max(var(--ag-r),env(safe-area-inset-right,0px));bottom:calc(var(--ag-b) + env(safe-area",
"-inset-bottom,0px));z-index:3;width:64px;height:64px;border-radius:50%;border:3px solid #fff;background:#fff;box-shadow:0 10px 28px rgba(0,45,94,.4);cursor:pointer;padding:0;overflow:visible;transition:transform .2s}.fab:hover{transform:translateY(-2px) scale(1.04)}.fab .masc-slot{width:100%;height:",
"100%;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 40% 30%,#FFFFFF,#DCE8F8)}.badge{position:absolute;top:-4px;right:-4px;min-width:22px;height:22px;border-radius:11px;background:#DC2626;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content",
":center;padding:0 6px;border:2px solid #fff}.badge.aviso{background:#F59E0B}.fab.trabalhando{animation:fab-vivo .7s ease-in-out infinite}.fab.trabalhando::after{content:\"\";position:absolute;inset:-6px;border-radius:50%;border:3px solid rgba(59,130,246,.55);animation:fab-onda 1.1s ease-out infinite}@",
"keyframes fab-vivo{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-5px) rotate(-4deg)}60%{transform:translateY(-2px) rotate(3deg)}}@keyframes fab-onda{0%{transform:scale(.92);opacity:1}100%{transform:scale(1.35);opacity:0}}.fab.trabalhando .masc .m-cabeca{animation-duration:1.4s}",
".bubble{position:fixed;right:calc(var(--ag-r) + 74px + env(safe-area-inset-right,0px));bottom:calc(var(--ag-b) + 14px + env(safe-area-inset-bottom,0px));z-index:3;background:#fff;color:var(--navy);font-size:12px;font-weight:600;line-height:1.45;padding:9px 13px;border-radius:14px 14px 4px 14px;box-s",
"hadow:var(--shadow-lg);border:1px solid var(--border);max-width:280px;cursor:pointer;transition:opacity .2s}.bubble b{font-weight:800}.bubble u{text-underline-offset:2px}.bubble.ok{border-color:#A7F3D0;background:#ECFDF5;color:#065F46}.bubble.aviso{border-color:#FCD9AA;background:#FFF7ED;color:#9A34",
"12}.bubble.erro{border-color:#FCA5A5;background:#FFF5F5;color:#991B1B}.dots{display:inline-flex;gap:3px;vertical-align:middle;margin-left:2px}.dots i{width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.35;animation:dots 1s infinite}.dots i:nth-child(2){animation-delay:.15s}.dots ",
"i:nth-child(3){animation-delay:.3s}@keyframes dots{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}.panel{position:fixed;right:max(var(--ag-r),env(safe-area-inset-right,0px));bottom:calc(var(--ag-b) + 76px + env(safe-area-inset-bottom,0px));z-index:4;width:min(4",
"00px,calc(100vw - 32px));height:min(620px,calc(100vh - 140px));background:#fff;border-radius:20px;box-shadow:0 25px 60px -12px rgba(0,0,0,.35);border:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden}.head{background:linear-gradient(135deg,#002D5E 0%,#003F7A 60%,#0056B3 100%",
");color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px}.head .masc-slot{width:46px;height:46px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 40% 30%,#FFFFFF,#DCE8F8);border:2px solid rgba(255,255,255,.55);flex-shrink:0}.head .ht{min-width:0;flex:1}.head h4{f",
"ont-size:14px;font-weight:800;letter-spacing:.3px;color:#fff}.head p{font-size:10.5px;color:rgba(255,255,255,.78);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.head .x{margin-left:auto;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3);color:#fff;bord",
"er-radius:9px;width:32px;height:32px;cursor:pointer;font-size:15px;flex-shrink:0}.head .x:hover{background:rgba(255,255,255,.24)}.ia{font-size:9.5px;font-weight:800;padding:2px 8px;border-radius:10px;margin-top:3px;display:inline-block;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:",
"ellipsis}.ia.on{background:#D1FAE5;color:#065F46}.ia.off{background:rgba(255,255,255,.18);color:#fff}.msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:var(--soft)}.msg{max-width:92%;font-size:12.5px;line-height:1.55;font-weight:500;padding:9px 12px;bord",
"er-radius:14px;overflow-wrap:anywhere}.msg.bot{background:#fff;border:1px solid var(--border);color:var(--text);border-bottom-left-radius:4px;align-self:flex-start;box-shadow:0 2px 6px rgba(0,45,94,.05)}.msg.user{background:linear-gradient(135deg,#0056B3,#002D5E);color:#fff;border-bottom-right-radiu",
"s:4px;align-self:flex-end}.msg b{font-weight:800}.msg ul{margin:4px 0 2px 16px}.msg .muted{color:var(--muted);font-size:11.5px}.msg.typing{color:var(--muted);font-style:italic}.msg table{border-collapse:collapse;margin:6px 0;font-size:11.5px;width:100%}.msg th,.msg td{border:1px solid var(--border2)",
";padding:3px 6px;text-align:left}.msg th{background:var(--soft);font-weight:800;color:var(--navy)}.diag{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:5px}.diag li{display:flex;gap:7px;align-items:flex-start;padding:6px 8px;border-radius:9px;border:1.5px solid var(--",
"border2);background:var(--soft)}.diag li.erro{border-color:#FCA5A5;background:#FFF5F5}.diag li.aviso{border-color:#FCD9AA;background:#FFF7ED}.diag li.ok{border-color:#A7F3D0;background:#ECFDF5}.diag li span{flex:1}.apontar{border:1.5px solid #BFDBFE;background:#EFF6FF;color:var(--blue-ink);border-ra",
"dius:8px;padding:2px 8px;font-size:10.5px;font-weight:800;cursor:pointer;white-space:nowrap;margin:2px 2px 0 0;line-height:1.5}.apontar:hover{background:#DBEAFE}.msg-masc{display:flex;gap:10px;align-items:flex-end}.msg-masc .masc-slot{width:74px;height:74px;flex-shrink:0}.chips{display:flex;gap:6px;",
"flex-wrap:wrap;padding:8px 12px;border-top:1px solid var(--border);background:#fff;max-height:96px;overflow-y:auto}.chip{border:1.5px solid var(--border);background:var(--soft);color:var(--text2);border-radius:16px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;lin",
"e-height:1.3}.chip:hover{border-color:var(--blue);color:var(--blue);background:#EFF6FF}.form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--border);background:#fff}.form textarea{flex:1;resize:none;height:42px;max-height:110px;border:1.5px solid var(--border);border-radius:12px;pa",
"dding:10px 12px;font:600 12.5px/1.4 var(--f);color:var(--text);background:var(--soft)}.form textarea:focus{outline:none;border-color:var(--blue);background:#fff;box-shadow:0 0 0 3px rgba(0,86,179,.1)}.form button{border:none;border-radius:12px;padding:0 14px;background:linear-gradient(135deg,#0056B3",
",#002D5E);color:#fff;font-weight:800;font-size:12px;cursor:pointer}.form button:disabled{opacity:.5;cursor:wait}@media(max-width:520px){.panel{right:8px;left:8px;width:auto;bottom:calc(var(--ag-b) + 70px + env(safe-area-inset-bottom,0px));height:min(560px,calc(100vh - 120px))}.fab{width:56px;height:",
"56px}.bubble{right:calc(var(--ag-r) + 64px);max-width:min(240px,calc(100vw - 110px))}}.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--ag-b) + 8px + env(safe-area-inset-bottom,0px));z-index:5;background:linear-gradient(135deg,#0056B3,#3B82F6);color:#fff;padding:10px 16px;b",
"order-radius:12px;font-size:12px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.2);max-width:min(340px,calc(100vw - 48px))}.toast.ok{background:linear-gradient(135deg,#059669,#10B981)}.toast.aviso{background:linear-gradient(135deg,#D97706,#FF9100)}.toast.erro{background:linear-gradient(135deg,#B9",
"1C1C,#EF4444)}.tour{position:fixed;inset:0;z-index:10}.tblock{position:fixed;inset:0;background:transparent}.tspot{position:fixed;border-radius:14px;box-shadow:0 0 0 4px rgba(255,255,255,.9),0 0 0 9999px rgba(0,25,55,.62);pointer-events:none;transition:width .2s ease,height .2s ease}.tspot.center{wi",
"dth:0!important;height:0!important;box-shadow:0 0 0 9999px rgba(0,25,55,.62)}.tcard{position:fixed;width:min(360px,calc(100vw - 32px));background:#fff;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.35);padding:16px 18px 14px;display:flex;flex-direction:column;gap:8px;max-height:calc(100vh - 3",
"2px);overflow-y:auto}.ttop{display:flex;align-items:center;gap:10px}.ttop .masc-slot{width:44px;height:44px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 40% 30%,#FFFFFF,#E8F0FD);flex-shrink:0}.tstep{font-size:9px;font-weight:800;color:var(--muted2);text-transform:uppercase;",
"letter-spacing:1.2px}.ttitle{font-size:15px;font-weight:800;color:var(--navy);line-height:1.25}.ttext{font-size:12.5px;font-weight:500;color:var(--text2);line-height:1.55}.ttext b{color:var(--navy);font-weight:800}.tex{font-size:11.5px;font-weight:700;color:var(--blue-ink);background:#EFF6FF;border:",
"1.5px solid #BFDBFE;border-radius:8px;padding:6px 9px}.tbar{height:4px;border-radius:4px;background:#E2EEF9;overflow:hidden}.tbar i{display:block;height:100%;background:linear-gradient(90deg,#0056B3,#3B82F6);transition:width .3s}.tnav{display:flex;align-items:center;gap:6px;margin-top:2px}.tnav .sp{",
"flex:1}.tbtn{border:none;border-radius:9px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer;line-height:1.2}.tbtn.pri{background:linear-gradient(135deg,#0056B3,#002D5E);color:#fff}.tbtn.sec{background:#F1F5F9;color:#475569;border:1.5px solid #E2E8F0}.tbtn.link{background:none;color:var",
"(--muted);padding:8px 6px}.thero{display:flex;justify-content:center;margin:-4px 0 -2px}.thero .masc-slot{width:150px;height:150px}@media(max-height:620px){.thero .masc-slot{width:96px;height:96px}}.masc-slot{display:block}.masc{width:100%;height:100%;display:block;overflow:visible}.masc *{transform",
"-box:fill-box;transform-origin:center}.masc .m-cabeca{transform-origin:50% 90%;animation:m-cabeca 6s ease-in-out infinite}.masc .m-corpo{animation:m-resp 4s ease-in-out infinite;transform-origin:50% 100%}.masc .m-cabelo{animation:m-cabelo 3.2s ease-in-out infinite;transform-origin:50% 100%}.masc .m-",
"palp{transform:scaleY(0);transform-origin:50% 0;animation:m-piscar 5s infinite}.masc .m-palp-d{animation-delay:.02s}.masc .m-pupila{animation:m-olhar 9s ease-in-out infinite}.masc .m-boca{transform-origin:50% 0;animation:m-sorriso 6s ease-in-out infinite}.masc .m-bigode{transform-origin:50% 30%;anim",
"ation:m-bigode 6s ease-in-out infinite}.masc .m-boch{animation:m-boch 6s ease-in-out infinite}.masc .m-sobr{animation:m-sobr 6s ease-in-out infinite}@keyframes m-cabeca{0%,100%{transform:rotate(-2.5deg) translateY(0)}50%{transform:rotate(2.5deg) translateY(-1.5px)}}@keyframes m-resp{0%,100%{transfor",
"m:scaleY(1)}50%{transform:scaleY(1.025)}}@keyframes m-cabelo{0%,100%{transform:rotate(0)}50%{transform:rotate(1.4deg) translateY(-.6px)}}@keyframes m-piscar{0%,44%,50%,90%,96%,100%{transform:scaleY(0)}46%,48%{transform:scaleY(1)}92%,94%{transform:scaleY(1)}}@keyframes m-olhar{0%,20%,100%{transform:t",
"ranslate(0,0)}28%,40%{transform:translate(-2.6px,.4px)}55%,68%{transform:translate(2.6px,-.4px)}78%{transform:translate(0,1px)}}@keyframes m-sorriso{0%,100%{transform:scale(1,1)}40%,62%{transform:scale(1.14,1.42)}}@keyframes m-bigode{0%,100%{transform:translateY(0) rotate(0)}40%,62%{transform:transl",
"ateY(-1.6px) scaleX(1.05)}}@keyframes m-boch{0%,100%{transform:translateY(0) scale(1)}40%,62%{transform:translateY(-2px) scale(1.12)}}@keyframes m-sobr{0%,100%{transform:translateY(0)}40%,55%{transform:translateY(-2.4px)}}.falando .masc .m-boca{animation:m-falar .32s ease-in-out infinite}.falando .m",
"asc .m-bigode{animation:m-bigode-falar .32s ease-in-out infinite}@keyframes m-falar{0%,100%{transform:scale(1,.7)}50%{transform:scale(1.08,1.5)}}@keyframes m-bigode-falar{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.4px)}}.fab:hover .masc .m-palp-e{animation:none;transform:scaleY(1)}.",
"fab:hover .masc .m-boca{animation:none;transform:scale(1.16,1.5)}.fab:hover .masc .m-boch{animation:none;transform:translateY(-2px) scale(1.15)}.segue .masc .m-pupila{animation:none;transform:translate(var(--mx,0px),var(--my,0px));transition:transform .12s ease-out}@media (prefers-reduced-motion:red",
"uce){.ag *{animation:none!important;transition:none!important}}"
].join('');
  var SIMBOLO = [
"data:image/png;base64,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"
].join('');
  var FONTE = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap';

  // ------------------------------------------------------------------ utilidades
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function seguro(fn, padrao) {
    try { return fn(); } catch (e) { try { console.warn('[Agente Tech]', e); } catch (_) {} return padrao; }
  }
  function num(v) {
    if (typeof v === 'number') return v;
    var s = String(v == null ? '' : v).trim().replace(/r\$/gi, '').replace(/\s/g, '');
    if (!s) return NaN;
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    return parseFloat(s);
  }
  function br(n, d) {
    if (n == null || !isFinite(n)) return '\u2014';
    d = d == null ? 2 : d;
    return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function money(n) { return 'R$ ' + br(n, 2); }
  function mediana(arr) {
    var s = (arr || []).filter(function (x) { return isFinite(x); }).sort(function (a, b) { return a - b; });
    return s.length ? s[Math.floor(s.length / 2)] : 0;
  }
  function dataBR(s) {
    var m = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/.exec(String(s || ''));
    if (!m) return null;
    var a = +m[3]; if (a < 100) a += 2000;
    var d = new Date(a, +m[2] - 1, +m[1]);
    return isNaN(d) ? null : d;
  }
  function dias(a, b) { return a && b ? Math.round((b - a) / 86400000) : null; }
  function hoje() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function hojeBR() { return new Date().toLocaleDateString('pt-BR'); }
  function texto(el) { return el ? String(el.innerText || el.textContent || '').trim() : ''; }
  function visivel(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var r = el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return false;
    var cs = window.getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  }
  function aguardar(cond, ms, passo) {
    return new Promise(function (ok, nao) {
      var t0 = Date.now();
      (function tick() {
        var v = false;
        try { v = cond(); } catch (e) { v = false; }
        if (v) return ok(v);
        if (Date.now() - t0 > (ms || 20000)) return nao(new Error('tempo esgotado'));
        setTimeout(tick, passo || 250);
      })();
    });
  }
  // reduz arrays grandes at\u00e9 o JSON caber no limite (para mandar contexto \u00e0 IA)
  function encolher(obj, limite) {
    var j = JSON.stringify(obj);
    if (j.length <= limite) return obj;
    var copia = JSON.parse(j), voltas = 0;
    while (JSON.stringify(copia).length > limite && voltas < 12) {
      voltas++;
      (function corta(o) {
        if (!o || typeof o !== 'object') return;
        Object.keys(o).forEach(function (k) {
          var v = o[k];
          if (Array.isArray(v) && v.length > 8) {
            var n = Math.ceil(v.length / 2);
            o[k] = v.slice(0, n);
            o[k + '_omitidos'] = (o[k + '_omitidos'] || 0) + (v.length - n);
          } else if (v && typeof v === 'object') corta(v);
        });
      })(copia);
    }
    var s = JSON.stringify(copia);
    return s.length <= limite ? copia : { aviso: 'contexto grande demais, resumido', resumo: s.slice(0, limite - 80) };
  }

  // ------------------------------------------------------------------ estado
  var C = null;            // configura\u00e7\u00e3o do sistema
  var host = null, sr = null, montado = false;
  var ajudaEl = null;
  var A = { aberto: false, historico: [], ia: false, modelo: '', ocupado: false, iniciado: false, erroIA: '' };
  var T = { ativo: false, i: 0, passos: [], ctx: null, seq: 0 };
  var V = { t: null, seq: 0, dicas: 0, calar: null };
  var LS = {
    k: function (n) { return 'agtech_' + (C ? C.projeto : 'x') + '_' + n; },
    get: function (n, d) { try { var v = localStorage.getItem(LS.k(n)); return v == null ? d : v; } catch (e) { return d; } },
    set: function (n, v) { try { localStorage.setItem(LS.k(n), v); } catch (e) {} }
  };
  function $(id) { return sr ? sr.getElementById(id) : null; }

  // ------------------------------------------------------------------ mascote
  function mascoteSVG(p, modo) {
    p = p || ('m' + Math.random().toString(36).slice(2, 7));
    var vb = modo === 'rosto' ? '24 22 162 150' : '0 0 210 210';
    var g = function (id) { return p + '-' + id; };
    return '<svg class="masc" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
'<defs>' +
'<radialGradient id="' + g('pele') + '" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#FFE3CF"/><stop offset=".55" stop-color="#F6BE9A"/><stop offset="1" stop-color="#D98C66"/></radialGradient>' +
'<radialGradient id="' + g('orelha') + '" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FAD1B5"/><stop offset="1" stop-color="#D88763"/></radialGradient>' +
'<radialGradient id="' + g('nariz') + '" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#FFD2C0"/><stop offset=".55" stop-color="#F3A58C"/><stop offset="1" stop-color="#D1735E"/></radialGradient>' +
'<radialGradient id="' + g('branco') + '" cx="35%" cy="25%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F1F5FA"/><stop offset="1" stop-color="#C5D0DE"/></radialGradient>' +
'<radialGradient id="' + g('cabelo') + '" cx="45%" cy="30%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#EEF2F7"/><stop offset="1" stop-color="#B9C6D6"/></radialGradient>' +
'<radialGradient id="' + g('olho') + '" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E2E8F0"/></radialGradient>' +
'<radialGradient id="' + g('iris') + '" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#6B4A2E"/><stop offset="1" stop-color="#2A1A0E"/></radialGradient>' +
'<radialGradient id="' + g('boca') + '" cx="50%" cy="20%" r="85%"><stop offset="0" stop-color="#9E2B2B"/><stop offset="1" stop-color="#4A0F14"/></radialGradient>' +
'<linearGradient id="' + g('paleto') + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9BD14E"/><stop offset=".55" stop-color="#6DB33F"/><stop offset="1" stop-color="#3F7F2A"/></linearGradient>' +
'<linearGradient id="' + g('camisa') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9E2EC"/></linearGradient>' +
'<radialGradient id="' + g('bochecha') + '" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FF8A80" stop-opacity=".75"/><stop offset="1" stop-color="#FF8A80" stop-opacity="0"/></radialGradient>' +
'<radialGradient id="' + g('sombra') + '" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#002D5E" stop-opacity=".35"/><stop offset="1" stop-color="#002D5E" stop-opacity="0"/></radialGradient>' +
'<filter id="' + g('suave') + '" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter>' +
'<filter id="' + g('simb') + '" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1" stdDeviation=".9" flood-color="#1B3A12" flood-opacity=".55"/></filter>' +
'</defs>' +
'<ellipse cx="100" cy="203" rx="62" ry="6" fill="url(#' + g('sombra') + ')"/>' +
'<g class="m-corpo">' +
'<path d="M26 210 C28 176 50 160 76 153 L124 153 C150 160 172 176 174 210 Z" fill="url(#' + g('paleto') + ')"/>' +
'<path d="M78 153 L100 196 L122 153 Z" fill="#FFC21A"/>' +
'<path d="M86 160 L100 196 L114 160 Q100 166 86 160 Z" fill="#F2A900" opacity=".55"/>' +
'<path d="M78 153 L92 172 L100 160 Z M122 153 L108 172 L100 160 Z" fill="url(#' + g('camisa') + ')" stroke="#CBD5E1" stroke-width=".8"/>' +
'<path d="M76 153 L94 200 L70 182 L60 162 Z" fill="#5A9E35"/><path d="M124 153 L106 200 L130 182 L140 162 Z" fill="#5A9E35"/>' +
'<path d="M76 153 L94 200" stroke="#3F7F2A" stroke-width="1.2" fill="none"/><path d="M124 153 L106 200" stroke="#3F7F2A" stroke-width="1.2" fill="none"/>' +
'<image href="' + SIMBOLO + '" x="42" y="166" width="30" height="30" preserveAspectRatio="xMidYMid meet" filter="url(#' + g('simb') + ')"/>' +
'<path d="M112 158 Q118 170 124 178" stroke="#1F2937" stroke-width="2" fill="none"/>' +
'<rect x="120" y="176" width="12" height="20" rx="3" fill="#1F2937"/><rect x="122.5" y="179" width="7" height="9" rx="1.5" fill="#4B5563"/>' +
'</g>' +
'<g class="m-cabeca">' +
'<path d="M84 138 L84 158 Q100 166 116 158 L116 138 Z" fill="#E39E79"/>' +
'<g class="m-cabelo">' +
'<path d="M62 126 C46 124 34 112 34 98 C24 94 18 82 22 68 C28 74 34 76 40 74 C32 64 32 48 42 38 C44 50 50 56 58 58 L70 70 L130 66 ' +
'C134 52 146 36 166 30 C160 40 160 48 164 54 C174 48 186 50 194 58 C184 60 178 64 176 70 C186 76 190 88 186 100 C180 94 174 92 168 94 ' +
'C172 104 168 116 156 124 Z" fill="url(#' + g('cabelo') + ')"/>' +
'<path d="M42 38 C46 52 54 60 64 66 M22 68 C30 78 40 82 50 84 M34 98 C40 104 48 108 56 110 M166 30 C156 44 150 56 148 68 ' +
'M194 58 C182 62 170 70 162 80 M186 100 C176 96 166 98 158 104" stroke="#AFBDCD" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/>' +
'</g>' +
'<ellipse cx="52" cy="106" rx="11" ry="15" fill="url(#' + g('orelha') + ')"/><path d="M50 99 Q46 106 51 114" stroke="#C7714E" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="148" cy="106" rx="11" ry="15" fill="url(#' + g('orelha') + ')"/><path d="M150 99 Q154 106 149 114" stroke="#C7714E" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
'<path d="M54 96 C54 58 74 38 100 38 C126 38 146 58 146 96 L146 112 C146 140 126 158 100 158 C74 158 54 140 54 112 Z" fill="url(#' + g('pele') + ')"/>' +
'<path d="M80 66 Q100 60 120 66 M84 73 Q100 68 116 73" stroke="#D99272" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"/>' +
'<ellipse cx="84" cy="50" rx="14" ry="6" fill="#FFFFFF" opacity=".55" filter="url(#' + g('suave') + ')" transform="rotate(-18 84 50)"/>' +
'<path d="M55 88 C50 100 52 116 60 126 C60 112 60 100 64 92 Z" fill="url(#' + g('cabelo') + ')"/>' +
'<path d="M145 88 C150 100 148 116 140 126 C140 112 140 100 136 92 Z" fill="url(#' + g('cabelo') + ')"/>' +
'<ellipse class="m-boch" cx="73" cy="124" rx="14" ry="10" fill="url(#' + g('bochecha') + ')"/>' +
'<ellipse class="m-boch" cx="127" cy="124" rx="14" ry="10" fill="url(#' + g('bochecha') + ')"/>' +
'<ellipse cx="81" cy="99" rx="14" ry="13" fill="#C9805F" opacity=".22" filter="url(#' + g('suave') + ')"/>' +
'<ellipse cx="119" cy="99" rx="14" ry="13" fill="#C9805F" opacity=".22" filter="url(#' + g('suave') + ')"/>' +
'<g class="m-olhos">' +
'<ellipse cx="81" cy="98" rx="10" ry="11.5" fill="url(#' + g('olho') + ')" stroke="#C99A82" stroke-width="1"/>' +
'<ellipse cx="119" cy="98" rx="10" ry="11.5" fill="url(#' + g('olho') + ')" stroke="#C99A82" stroke-width="1"/>' +
'<g class="m-pupila"><circle cx="83" cy="100" r="5.8" fill="url(#' + g('iris') + ')"/><circle cx="121" cy="100" r="5.8" fill="url(#' + g('iris') + ')"/>' +
'<circle cx="85.2" cy="97.4" r="2" fill="#fff"/><circle cx="123.2" cy="97.4" r="2" fill="#fff"/>' +
'<circle cx="81.4" cy="102.2" r=".9" fill="#fff" opacity=".8"/><circle cx="119.4" cy="102.2" r=".9" fill="#fff" opacity=".8"/></g>' +
'<g class="m-palp m-palp-e"><path d="M70 98 C70 83 92 83 92 98 Z" fill="#F2B591"/><path d="M71 98 C76 100 86 100 91 98" stroke="#B9785A" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>' +
'<g class="m-palp m-palp-d"><path d="M108 98 C108 83 130 83 130 98 Z" fill="#F2B591"/><path d="M109 98 C114 100 124 100 129 98" stroke="#B9785A" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>' +
'<path d="M71 89 Q81 84 91 89 M109 89 Q119 84 129 89" stroke="#B9785A" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".6"/>' +
'</g>' +
'<g class="m-sobr">' +
'<path d="M62 86 C62 76 70 70 80 72 C84 68 92 70 95 76 C96 80 92 82 88 80 C84 78 80 80 76 82 C72 86 66 88 62 86 Z" fill="url(#' + g('branco') + ')" stroke="#B5C2D2" stroke-width="1"/>' +
'<path d="M138 86 C138 76 130 70 120 72 C116 68 108 70 105 76 C104 80 108 82 112 80 C116 78 120 80 124 82 C128 86 134 88 138 86 Z" fill="url(#' + g('branco') + ')" stroke="#B5C2D2" stroke-width="1"/>' +
'</g>' +
'<g class="m-boca">' +
'<path d="M80 131 Q100 158 120 131 Q100 139 80 131 Z" fill="url(#' + g('boca') + ')"/>' +
'<path d="M84 132 Q100 138 116 132 L115 136 Q100 141 85 136 Z" fill="#FFFFFF"/>' +
'<path d="M90 145 Q100 152 110 145 Q100 148 90 145 Z" fill="#E86A6A"/>' +
'</g>' +
'<g class="m-bigode">' +
'<path d="M100 121 C92 115 80 114 72 120 C66 125 58 126 52 118 C50 128 58 136 70 135 C80 134 88 136 94 135 C99 134 100 130 100 126 Z" fill="url(#' + g('branco') + ')" stroke="#B5C2D2" stroke-width="1"/>' +
'<path d="M100 121 C108 115 120 114 128 120 C134 125 142 126 148 118 C150 128 142 136 130 135 C120 134 112 136 106 135 C101 134 100 130 100 126 Z" fill="url(#' + g('branco') + ')" stroke="#B5C2D2" stroke-width="1"/>' +
'<path d="M70 126 C78 123 86 124 93 128 M130 126 C122 123 114 124 107 128" stroke="#C7D2DF" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
'</g>' +
'<path d="M100 98 C108 98 114 106 114 114 C114 122 108 126 100 126 C92 126 86 122 86 114 C86 106 92 98 100 98 Z" fill="url(#' + g('nariz') + ')"/>' +
'<path d="M92 121 Q95 124 98 122 M108 121 Q105 124 102 122" stroke="#B5584A" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>' +
'<ellipse cx="95" cy="107" rx="4" ry="3" fill="#FFFFFF" opacity=".7" filter="url(#' + g('suave') + ')"/>' +
'</g>' +
'</svg>';
  }
  function montarMascotes(raiz) {
    (raiz || sr).querySelectorAll('.masc-slot:not([data-ok])').forEach(function (el) {
      el.innerHTML = mascoteSVG('ms' + Math.random().toString(36).slice(2, 7), el.getAttribute('data-modo') || 'rosto');
      el.setAttribute('data-ok', '1');
    });
  }
  function falar(ms) {
    if (!sr) return;
    sr.querySelectorAll('.fab,.head,.msg-masc').forEach(function (e) { e.classList.add('falando'); });
    clearTimeout(V.calar);
    if (ms) V.calar = setTimeout(calar, ms);
  }
  function calar() { if (sr) sr.querySelectorAll('.falando').forEach(function (e) { e.classList.remove('falando'); }); }
  function seguirOlhar() {
    var pend = false, ultimo = 0, x = 0, y = 0;
    window.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY; ultimo = Date.now();
      if (pend || !sr) return; pend = true;
      requestAnimationFrame(function () {
        pend = false;
        sr.querySelectorAll('.fab,.head').forEach(function (el) {
          var r = el.getBoundingClientRect(); if (!r.width) return;
          var dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 220);
          el.style.setProperty('--mx', (dx / d * 2.8 * k).toFixed(2) + 'px');
          el.style.setProperty('--my', (dy / d * 2.2 * k).toFixed(2) + 'px');
          el.classList.add('segue');
        });
      });
    }, { passive: true });
    setInterval(function () {
      if (sr && Date.now() - ultimo > 2500) sr.querySelectorAll('.segue').forEach(function (e) { e.classList.remove('segue'); });
    }, 800);
  }

  // ------------------------------------------------------------------ fala "ao vivo"
  function dizer(html, o) {
    o = o || {};
    if (!montado || T.ativo) return;
    var b = $('bubble'), fab = $('fab');
    b.className = 'bubble' + (o.tipo ? ' ' + o.tipo : '');
    b.innerHTML = html + (o.digitando ? ' <span class="dots"><i></i><i></i><i></i></span>' : '');
    b.hidden = !!A.aberto;                       // com o painel aberto, a fala vai s\u00f3 pela boca
    fab.classList.toggle('trabalhando', !!o.digitando);
    falar();
    clearTimeout(V.t);
    if (o.ms !== 0) V.t = setTimeout(function () { b.hidden = true; fab.classList.remove('trabalhando'); calar(); }, o.ms || 2800);
  }
  function esconderBolha() {
    if (!montado) return;
    $('bubble').hidden = true; $('fab').classList.remove('trabalhando'); clearTimeout(V.t); calar();
  }
  function trabalhando(on, html) {
    if (on) dizer(html || 'Trabalhando', { digitando: true, ms: 0 });
    else esconderBolha();
  }
  /* etapas: textos mostrados em sequ\u00eancia enquanto o trabalho roda;
     trabalho: fun\u00e7\u00e3o (pode devolver Promise); fim: html, {html,tipo,ms} ou fun\u00e7\u00e3o(resultado) */
  function processo(etapas, trabalho, fim) {
    var id = ++V.seq, passo = 560;
    etapas = etapas && etapas.length ? etapas : ['Processando'];
    dizer(etapas[0], { digitando: true, ms: 0 });
    requestAnimationFrame(function () {
      setTimeout(function () {
        var resultado;
        try { resultado = trabalho ? trabalho() : undefined; } catch (err) { resultado = Promise.reject(err); }
        Promise.resolve(resultado).then(function (res) {
          etapas.slice(1).forEach(function (txt, k) {
            setTimeout(function () { if (id === V.seq) dizer(txt, { digitando: true, ms: 0 }); }, passo * (k + 1));
          });
          setTimeout(function () {
            if (id !== V.seq) return;
            var f = typeof fim === 'function' ? seguro(function () { return fim(res); }, null) : fim;
            if (!f) { esconderBolha(); return; }
            dizer(f.html || f, { tipo: f.tipo || 'ok', ms: f.ms || 3600 });
          }, passo * etapas.length);
        }).catch(function (err) {
          if (id === V.seq) dizer('Ops! ' + esc(err && err.message || String(err)), { tipo: 'erro', ms: 4500 });
        });
      }, 30);
    });
  }
  // envolve uma fun\u00e7\u00e3o global do sistema para o mascote narrar o que ela faz
  function envolver(nome, o) {
    var orig = window[nome];
    if (typeof orig !== 'function' || orig.__agtech) return false;
    o = o || {};
    var w = function () {
      var args = arguments, self = this, r, falou = false;
      if (o.antes) {
        var m = seguro(function () { return o.antes.apply(self, args); }, null);
        if (m) { falou = true; dizer(m.html || m, { digitando: m.digitando !== false, tipo: m.tipo, ms: m.ms != null ? m.ms : 0 }); }
      }
      try { r = orig.apply(self, args); }
      catch (err) {
        if (falou) dizer('Ops! ' + esc(err && err.message || String(err)), { tipo: 'erro', ms: 4500 });
        throw err;
      }
      if (o.depois) {
        var fim = function (v) {
          var m2 = seguro(function () { return o.depois.call(self, v, args); }, null);
          if (m2) dizer(m2.html || m2, { tipo: m2.tipo || 'ok', ms: m2.ms || 3800 });
          else if (falou && !o.manter) esconderBolha();
        };
        if (r && typeof r.then === 'function') r.then(fim, function (err) {
          dizer('Ops! ' + esc(err && err.message || String(err)), { tipo: 'erro', ms: 4500 });
        });
        else setTimeout(function () { fim(r); }, o.atraso || 0);
      }
      setTimeout(atualizarBadge, 400);
      return r;
    };
    w.__agtech = true; w.__orig = orig;
    try { window[nome] = w; } catch (e) { return false; }
    return window[nome] === w;
  }

  // ------------------------------------------------------------------ alvos e apontar
  function defAlvo(key) {
    var d = C && C.alvos ? C.alvos[key] : null;
    if (typeof d === 'string') return { rotulo: d };
    return d || null;
  }
  function rotuloAlvo(key) {
    var d = defAlvo(key);
    if (d && d.rotulo) return d.rotulo;
    if (C.rotuloAlvo) { var r = seguro(function () { return C.rotuloAlvo(key); }, ''); if (r) return r; }
    return key;
  }
  function resolverAlvo(key) {
    if (!key) return null;
    if (typeof key === 'function') return seguro(key, null);
    if (key === '@fab') return $('fab');
    if (key === '@ajuda') return ajudaEl;
    var d = defAlvo(key);
    if (d && d.el) return seguro(d.el, null);
    if (d && d.sel) return seguro(function () { return document.querySelector(d.sel); }, null);
    var el = document.getElementById(key);
    if (el) return el;
    if (C.resolverAlvo) { el = seguro(function () { return C.resolverAlvo(key); }, null); if (el) return el; }
    if (/^[#.\[]/.test(key) || /[\s>:]/.test(key)) return seguro(function () { return document.querySelector(key); }, null);
    return null;
  }
  var ultimoPulso = null;
  function pulsar(el) {
    if (ultimoPulso && ultimoPulso !== el) ultimoPulso.classList.remove('agtech-pulse');
    ultimoPulso = el;
    el.classList.remove('agtech-pulse'); void el.offsetWidth; el.classList.add('agtech-pulse');
    setTimeout(function () { el.classList.remove('agtech-pulse'); if (ultimoPulso === el) ultimoPulso = null; }, 3800);
  }
  function apontar(key) {
    var d = defAlvo(key);
    var prep = d && d.antes ? seguro(d.antes, null)
      : (C.antesApontar ? seguro(function () { return C.antesApontar(key); }, null) : null);
    setTimeout(function () {
      var el = resolverAlvo(key);
      if (!visivel(el)) {
        aviso((d && d.oculto) || 'Esse item ainda n\u00e3o est\u00e1 na tela \u2014 ele aparece em outra etapa.', 'aviso');
        return;
      }
      if (window.innerWidth <= 520) fecharPainel();
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      pulsar(el);
      if ((el.matches && el.matches('input,textarea,select')) || el.isContentEditable) {
        setTimeout(function () { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } }, 420);
      }
    }, prep ? 420 : 0);
  }

  // ------------------------------------------------------------------ aviso r\u00e1pido
  function aviso(msg, tipo) {
    if (!montado) return;
    var t = $('toast');
    t.className = 'toast ' + (tipo || 'info');
    t.textContent = msg; t.hidden = false;
    clearTimeout(aviso._t);
    aviso._t = setTimeout(function () { t.hidden = true; }, 3400);
  }

  // ------------------------------------------------------------------ diagn\u00f3stico
  function diag() {
    var L = C.diagnostico ? seguro(C.diagnostico, []) : [];
    if (!Array.isArray(L)) return [];
    var ordem = { erro: 0, aviso: 1, ok: 2, info: 3 };
    return L.filter(Boolean).map(function (x, i) { return { x: x, i: i }; }).sort(function (a, b) {
      var oa = ordem[a.x.nivel] != null ? ordem[a.x.nivel] : 3, ob = ordem[b.x.nivel] != null ? ordem[b.x.nivel] : 3;
      return oa - ob || a.i - b.i;
    }).map(function (o) { return o.x; });
  }
  function atualizarBadge() {
    if (!montado) return;
    var L = diag(), e = 0, a = 0;
    L.forEach(function (x) { if (x.nivel === 'erro') e++; else if (x.nivel === 'aviso') a++; });
    var b = $('badge'), n = e, cls = 'badge';
    if (!e && C.badgeAvisos && a) { n = a; cls = 'badge aviso'; }
    b.hidden = !n; b.textContent = n; b.className = cls;
  }
  function htmlDiag(lista) {
    var ic = { erro: '\u26d4', aviso: '\u26a0\ufe0f', info: '\u2139\ufe0f', ok: '\u2705' };
    return '<ul class="diag">' + lista.map(function (x) {
      return '<li class="' + esc(x.nivel) + '"><span>' + (ic[x.nivel] || '\u2139\ufe0f') + ' ' + esc(x.texto) + '</span>' +
        (x.alvo ? '<button type="button" class="apontar" data-alvo="' + esc(x.alvo) + '">\ud83d\udccd Mostrar</button>' : '') + '</li>';
    }).join('') + '</ul>';
  }
  function respFaltando() {
    var L = diag();
    var e = L.filter(function (x) { return x.nivel === 'erro'; }).length;
    var a = L.filter(function (x) { return x.nivel === 'aviso'; }).length;
    var cab;
    if (!L.length) cab = (C.semPendencias || 'N\u00e3o encontrei nada pendente nesta tela.');
    else if (e) cab = 'Encontrei <b>' + e + ' pend\u00eancia(s)</b>' + (a ? ' e ' + a + ' aviso(s)' : '') + '. Clique em "Mostrar" para ir direto ao ponto:';
    else if (a) cab = 'Nenhuma pend\u00eancia, mas h\u00e1 <b>' + a + ' aviso(s)</b> para conferir:';
    else cab = 'Nada pendente:';
    msgBot(cab + (L.length ? htmlDiag(L) : ''));
  }

  // ------------------------------------------------------------------ painel
  function abrirPainel() {
    if (!montado) return;
    A.aberto = true; $('panel').hidden = false; $('bubble').hidden = true;
    if (!A.iniciado) { A.iniciado = true; saudacao(); }
    setTimeout(function () { var i = $('inp'); if (i) i.focus(); }, 60);
  }
  function fecharPainel() { A.aberto = false; if (montado) $('panel').hidden = true; }
  function rolarFim() { var b = $('msgs'); b.scrollTop = b.scrollHeight; }
  function msgBot(html) {
    var d = document.createElement('div');
    d.className = 'msg bot'; d.innerHTML = html;
    $('msgs').appendChild(d); montarMascotes(d); rolarFim();
    if (!A.ocupado) falar(900);
    return d;
  }
  function msgUser(t) {
    var d = document.createElement('div');
    d.className = 'msg user'; d.textContent = t;
    $('msgs').appendChild(d); rolarFim();
  }
  function botoesApontar(html) {
    return html.replace(/\[\[apontar:([A-Za-z0-9_\-]+)\]\]/g, function (m, id) {
      return '<button type="button" class="apontar" data-alvo="' + esc(id) + '">\ud83d\udccd ' + esc(rotuloAlvo(id)) + '</button>';
    });
  }
  function md(t) {
    var h = esc(t);
    h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    h = h.replace(/(^|\n)\s*[-*\u2022]\s+(.+)/g, '$1\u2022 $2');
    h = h.replace(/\n/g, '<br>');
    return botoesApontar(h);
  }
  function saudacao() {
    var n = diag().filter(function (x) { return x.nivel === 'erro'; }).length;
    var s = typeof C.saudacao === 'function' ? seguro(C.saudacao, '') : (C.saudacao || '');
    msgBot('<div class="msg-masc"><span class="masc-slot" data-modo="busto"></span><div>' +
      (s || ('Ol\u00e1! Sou o <b>Assistente Tech</b>. Posso mostrar o que est\u00e1 faltando, explicar a tela e apontar o campo certo.')) +
      (n ? '<br><br>Agora h\u00e1 <b>' + n + ' pend\u00eancia(s)</b>. Clique em "O que est\u00e1 faltando?".' : '') +
      '</div></div>');
    falar(1400);
  }
  function chipsPadrao() {
    return [
      { id: 'faltando', rotulo: '\ud83d\udd0d O que est\u00e1 faltando?' },
      { id: 'conferir', rotulo: '\u2705 Conferir esta tela' },
      { id: 'tour', rotulo: '\ud83e\udded Fazer o tour' }
    ];
  }
  function chipsLista() { return (C.chips && C.chips.length ? C.chips : chipsPadrao()); }
  function rotuloLimpo(r) { return String(r || '').replace(/^[^A-Za-z\u00c0-\u00fa0-9]+/, '').trim(); }
  function chip(id) {
    var c = null;
    chipsLista().forEach(function (x) { if (x.id === id) c = x; });
    if (!c) return;
    if (id === 'faltando' && !c.acao) { msgUser(c.pergunta || 'O que est\u00e1 faltando?'); respFaltando(); return; }
    if (id === 'tour') { msgUser('Fazer o tour'); fecharPainel(); setTimeout(tourIniciar, 220); return; }
    if (id === 'conferir' && !c.acao) {
      if (A.ia) perguntar(c.prompt || 'Confira os dados desta tela: aponte inconsist\u00eancias, valores suspeitos e o que falta antes de concluir.', true, c.pergunta || 'Conferir esta tela');
      else { msgUser(c.pergunta || 'Conferir esta tela'); respFaltando(); }
      return;
    }
    if (c.ia && A.ia) { perguntar(c.ia, true, c.pergunta || rotuloLimpo(c.rotulo)); return; }
    if (c.acao) {
      msgUser(c.pergunta || rotuloLimpo(c.rotulo));
      var r = seguro(c.acao, null);
      if (r) msgBot(r);
    }
  }
  function montarChips() {
    $('chips').innerHTML = chipsLista().map(function (c) {
      return '<button type="button" class="chip" data-q="' + esc(c.id) + '">' + esc(c.rotulo) + '</button>';
    }).join('');
  }

  // ------------------------------------------------------------------ IA (Gemini)
  function iaConfigurada() { return !!(C.ia && (C.ia.url || C.ia.gas)); }
  function temGAS() { return !!(window.google && google.script && google.script.run); }
  function chamarIA(payload) {
    if (C.ia && C.ia.url) {
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, C.ia.timeout || 70000);
      return fetch(C.ia.url, { method: 'POST', body: JSON.stringify(payload), redirect: 'follow', signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .catch(function (e) { clearTimeout(to); throw (e && e.name === 'AbortError') ? new Error('a IA demorou demais para responder') : e; });
    }
    if (C.ia && C.ia.gas && temGAS()) {
      return new Promise(function (ok, nao) {
        google.script.run.withSuccessHandler(ok).withFailureHandler(nao)[C.ia.gas.perguntar || 'agenteTechPerguntar'](payload);
      });
    }
    return Promise.resolve({ ok: false, erro: 'IA n\u00e3o configurada' });
  }
  function consultarStatus() {
    if (C.ia && C.ia.url) {
      var u = C.ia.url + (C.ia.url.indexOf('?') >= 0 ? '&' : '?') + 'acao=status&projeto=' + encodeURIComponent(C.projeto);
      return fetch(u, { redirect: 'follow' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    }
    if (C.ia && C.ia.gas && temGAS()) {
      return new Promise(function (ok, nao) {
        google.script.run.withSuccessHandler(ok).withFailureHandler(nao)[C.ia.gas.status || 'agenteTechStatus']();
      });
    }
    return Promise.resolve(null);
  }
  function pintarIA() {
    var el = $('ia');
    el.className = 'ia ' + (A.ia ? 'on' : 'off');
    el.textContent = A.ia ? ('IA Gemini conectada' + (A.modelo ? ' \u00b7 ' + A.modelo : '')) : (A.erroIA || 'Diagn\u00f3stico autom\u00e1tico (IA desligada)');
  }
  function verificarIA() {
    if (!iaConfigurada()) { A.erroIA = ''; pintarIA(); return; }
    consultarStatus().then(function (s) {
      A.ia = !!(s && s.ok !== false && s.ativo);
      A.modelo = (s && s.modelo) || '';
      A.erroIA = A.ia ? '' : ('IA desligada: ' + ((s && (s.erro || s.motivo)) || 'chave GEMINI_API_KEY n\u00e3o encontrada na API'));
      pintarIA();
    }).catch(function (err) {
      A.ia = false; A.erroIA = 'IA indispon\u00edvel: ' + String(err && err.message || err).slice(0, 70);
      pintarIA();
    });
  }
  function alvosLista() {
    var L = [];
    Object.keys(C.alvos || {}).forEach(function (k) { L.push({ id: k, rotulo: rotuloAlvo(k) }); });
    return L;
  }
  function contextoIA() {
    var base = {
      sistema: C.nome, data: hojeBR(),
      tela: C.tela ? seguro(C.tela, null) : null,
      alvosDisponiveis: alvosLista(),
      diagnostico: diag().map(function (x) { return { nivel: x.nivel, texto: x.texto, campo: x.alvo || null }; })
    };
    var extra = C.contexto ? seguro(C.contexto, {}) : {};
    Object.keys(extra || {}).forEach(function (k) { base[k] = extra[k]; });
    return encolher(base, C.limiteContexto || 28000);
  }
  function respostaLocal(t) {
    var lista = C.respostas || [];
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].padrao && lista[i].padrao.test(t)) {
        var r = seguro(lista[i].acao, null);
        if (r) { msgBot(r); return true; }
      }
    }
    if (/falt|pend|erro|errad|problema|o que fa[\u00e7c]o|travad|n[\u00e3a]o funciona/.test(t)) { respFaltando(); return true; }
    if (/tour|passo a passo|como usar|tutorial|me ensina/.test(t)) {
      msgBot('Vou abrir o tour guiado.'); setTimeout(function () { fecharPainel(); tourIniciar(); }, 500); return true;
    }
    return false;
  }
  function perguntar(textoPergunta, viaIA, rotuloVisivel) {
    if (A.ocupado || !textoPergunta) return;
    msgUser(rotuloVisivel || textoPergunta);
    var t = textoPergunta.toLowerCase();
    if (!viaIA || !A.ia) {
      if (respostaLocal(t)) return;
      if (!A.ia) {
        msgBot(iaConfigurada()
          ? ('A IA (Gemini) n\u00e3o respondeu agora' + (A.erroIA ? ' (' + esc(A.erroIA) + ')' : '') + ', ent\u00e3o respondo com o diagn\u00f3stico autom\u00e1tico:')
          : 'Perguntas livres usam a IA Gemini, que ainda n\u00e3o foi ligada neste sistema. Por enquanto respondo com o diagn\u00f3stico autom\u00e1tico e os bot\u00f5es r\u00e1pidos abaixo:');
        respFaltando();
        return;
      }
    }
    A.ocupado = true; $('send').disabled = true;
    var espera = msgBot('Analisando os dados da tela\u2026'); espera.classList.add('typing'); falar();
    var payload = {
      acao: 'perguntar', projeto: C.projeto, sistema: C.nome, versao: VERSAO,
      pergunta: textoPergunta.slice(0, 2000), historico: A.historico.slice(-8),
      contexto: contextoIA(), conhecimento: String(C.conhecimento || '').slice(0, 9000)
    };
    chamarIA(payload).then(function (resp) {
      espera.remove();
      if (resp && resp.ok) {
        msgBot(md(resp.texto || ''));
        A.historico.push({ role: 'user', text: textoPergunta.slice(0, 1500) }, { role: 'model', text: String(resp.texto || '').slice(0, 1500) });
        if (resp.modelo && resp.modelo !== A.modelo) { A.modelo = resp.modelo; pintarIA(); }
      } else {
        msgBot('N\u00e3o consegui falar com a IA agora (' + esc(resp && resp.erro || 'sem resposta') + '). Segue o diagn\u00f3stico autom\u00e1tico:');
        respFaltando();
      }
    }).catch(function (err) {
      espera.remove();
      msgBot('Erro ao consultar a IA: ' + esc(err && err.message || String(err)) + '. Segue o diagn\u00f3stico autom\u00e1tico:');
      respFaltando();
    }).then(function () {
      A.ocupado = false; $('send').disabled = false; falar(1200);
    });
  }

  // ------------------------------------------------------------------ tour guiado
  function tourPassos() {
    var base = (typeof C.tour === 'function' ? seguro(C.tour, []) : (C.tour || [])).slice();
    if (C.tourFinal !== false) {
      base.push({ alvo: '@fab', titulo: 'Assistente Tech',
        texto: C.textoFab || 'Ficou com d\u00favida? Clique em mim: eu mostro <b>o que est\u00e1 faltando</b>, confiro os dados, aponto o campo certo na tela e respondo perguntas.' });
      if (ajudaEl) base.push({ alvo: '@ajuda', opcional: true, titulo: 'Ajuda a qualquer momento',
        texto: C.textoAjuda || 'Este bot\u00e3o refaz o tour quando voc\u00ea quiser. Bom trabalho!' });
    }
    return base;
  }
  function tourIniciar() {
    if (T.ativo || !montado) return;
    fecharPainel(); esconderBolha();
    T.passos = tourPassos();
    if (!T.passos.length) return;
    T.ativo = true; T.i = 0;
    T.ctx = C.tourInicio ? seguro(C.tourInicio, null) : null;
    $('tour').hidden = false;
    window.addEventListener('keydown', tourTeclas, true);
    window.addEventListener('resize', tourPosicionar);
    window.addEventListener('scroll', tourPosicionar, true);
    tourMostrar(1);
  }
  function tourFim(concluiu) {
    if (!T.ativo) return;
    var p = T.passos[T.i];
    if (p && p.depois) seguro(p.depois);
    T.ativo = false; T.seq++;
    $('tour').hidden = true;
    window.removeEventListener('keydown', tourTeclas, true);
    window.removeEventListener('resize', tourPosicionar);
    window.removeEventListener('scroll', tourPosicionar, true);
    LS.set('tour', '1');
    var ctx = T.ctx; T.ctx = null;
    if (C.tourFim) seguro(function () { C.tourFim(ctx); });
    aviso(concluiu ? 'Tour conclu\u00eddo \u2014 o bot\u00e3o Ajuda refaz quando quiser' : 'Tour fechado \u2014 o bot\u00e3o Ajuda abre de novo', concluiu ? 'ok' : 'info');
    setTimeout(atualizarBadge, 300);
  }
  function tourTeclas(e) {
    if (!T.ativo) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); tourFim(false); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); tourIr(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); tourIr(-1); }
  }
  function tourIr(d) {
    var n = T.i + d;
    if (n < 0) return;
    if (n >= T.passos.length) { tourFim(true); return; }
    var atual = T.passos[T.i];
    if (atual && atual.depois) seguro(atual.depois);
    T.i = n; tourMostrar(d);
  }
  function tourAlvo() {
    var s = T.passos[T.i];
    if (!s || !s.alvo) return null;
    var el = resolverAlvo(s.alvo);
    return visivel(el) ? el : null;
  }
  function tourMostrar(dir) {
    var s = T.passos[T.i], token = ++T.seq, total = T.passos.length;
    var espera = 0;
    if (s.antes) { seguro(s.antes); espera = s.esperar != null ? s.esperar : 380; }
    $('tstep').textContent = 'Passo ' + (T.i + 1) + ' de ' + total;
    $('ttitle').textContent = s.titulo || '';
    $('ttext').innerHTML = typeof s.texto === 'function' ? seguro(s.texto, '') : (s.texto || '');
    var ex = typeof s.ex === 'function' ? seguro(s.ex, '') : s.ex;
    $('tex').hidden = !ex; $('tex').textContent = ex || '';
    var hero = s.hero != null ? !!s.hero : (T.i === 0 || T.i === total - 1);
    $('thero').hidden = !hero;
    sr.querySelector('.ttop .masc-slot').style.display = hero ? 'none' : '';
    $('tbari').style.width = ((T.i + 1) / total * 100) + '%';
    $('tprev').hidden = T.i === 0;
    $('tnext').textContent = T.i === total - 1 ? 'Concluir' : 'Pr\u00f3ximo \u2192';
    tourPosicionar();
    setTimeout(function () {
      if (token !== T.seq || !T.ativo) return;
      var el = tourAlvo();
      if (!el && s.opcional) {
        var prox = T.i + (dir < 0 ? -1 : 1);
        if (prox >= 0 && prox < total) { T.i = prox; tourMostrar(dir); return; }
        if (prox >= total) { tourFim(true); return; }
      }
      if (el) {
        var r = el.getBoundingClientRect(), vh = window.innerHeight;
        if (r.height > vh * 0.5) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
        else if (r.top < 80 || r.bottom > vh - 20) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setTimeout(tourPosicionar, 380);
      }
      tourPosicionar();
    }, espera);
    setTimeout(function () { try { $('tnext').focus({ preventScroll: true }); } catch (_) {} }, 60);
  }
  function tourPosicionar() {
    if (!T.ativo) return;
    var spot = $('tspot'), card = $('tcard'), el = tourAlvo();
    var vw = window.innerWidth, vh = window.innerHeight, cw = card.offsetWidth, ch = card.offsetHeight, m = 12;
    if (!el) {
      spot.classList.add('center'); spot.style.left = (vw / 2) + 'px'; spot.style.top = (vh / 2) + 'px';
      card.style.left = Math.max(16, (vw - cw) / 2) + 'px'; card.style.top = Math.max(16, (vh - ch) / 2) + 'px';
      return;
    }
    spot.classList.remove('center');
    var r = el.getBoundingClientRect(), pad = 6;
    var top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad);
    var h = Math.min(r.height + pad * 2, vh - top - 4), w = Math.min(r.width + pad * 2, vw - left - 4);
    if (h > vh * 0.5) h = Math.round(vh * 0.42);        // alvo alto: destaca o come\u00e7o e deixa espa\u00e7o ao cart\u00e3o
    spot.style.top = top + 'px'; spot.style.left = left + 'px'; spot.style.width = w + 'px'; spot.style.height = h + 'px';
    var ct, cl;
    if (top + h + m + ch < vh) { ct = top + h + m; cl = left; }
    else if (top - m - ch > 0) { ct = top - m - ch; cl = left; }
    else if (left + w + m + cw < vw) { ct = Math.min(Math.max(16, top), vh - ch - 16); cl = left + w + m; }
    else if (left - m - cw > 0) { ct = Math.min(Math.max(16, top), vh - ch - 16); cl = left - m - cw; }
    else {
      // nada cabe: encurta o destaque e coloca o cart\u00e3o logo abaixo dele
      var maxH = vh - ch - m * 2 - top - 8;
      if (maxH >= 80 && maxH < h) { h = maxH; spot.style.height = h + 'px'; ct = top + h + m; cl = left; }
      else { ct = vh - ch - 16; cl = (vw - cw) / 2; }
    }
    cl = Math.min(Math.max(16, cl), vw - cw - 16);
    ct = Math.min(Math.max(16, ct), Math.max(16, vh - ch - 16));
    card.style.top = ct + 'px'; card.style.left = cl + 'px';
  }

  // ------------------------------------------------------------------ dicas espont\u00e2neas
  function iniciarDicas() {
    setInterval(function () {
      if (!montado || V.dicas >= 3 || T.ativo || A.aberto || !$('bubble').hidden || document.hidden) return;
      var p = diag().filter(function (x) { return x.nivel === 'erro' || (C.dicasAvisos && x.nivel === 'aviso'); });
      if (!p.length) return;
      V.dicas++;
      dizer('\ud83d\udca1 ' + esc(p[0].texto) + ' <u>Clique para ver</u>', { tipo: 'aviso', ms: 7000 });
    }, C.intervaloDicas || 45000);
  }

  // ------------------------------------------------------------------ bot\u00e3o Ajuda no cabe\u00e7alho
  var CSS_AJUDA = ':host{display:inline-flex;vertical-align:middle}' +
    '.aj{display:inline-flex;align-items:center;gap:6px;font:800 12px/1 "Plus Jakarta Sans","Segoe UI",system-ui,sans-serif;letter-spacing:.4px;' +
    'padding:7px 14px;border-radius:20px;cursor:pointer;transition:all .2s;white-space:nowrap;margin:0}' +
    '.aj b{display:inline-flex;width:18px;height:18px;border-radius:50%;align-items:center;justify-content:center;font-size:12px}' +
    '.aj.claro{color:#fff;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3)}' +
    '.aj.claro:hover{background:rgba(255,255,255,.26)}.aj.claro b{background:#fff;color:#002D5E}' +
    '.aj.escuro{color:#fff;background:linear-gradient(135deg,#0056B3,#002D5E);border:1px solid #002D5E;box-shadow:0 4px 12px rgba(0,45,94,.25)}' +
    '.aj.escuro:hover{filter:brightness(1.1)}.aj.escuro b{background:#fff;color:#002D5E}' +
    '.aj:focus-visible{outline:2px solid #3B82F6;outline-offset:2px}' +
    '@media(max-width:480px){.aj .t{display:none}.aj{padding:6px}}';
  function criarAjuda() {
    var a = C.ajuda;
    if (!a) return;
    if (a.existente) { ajudaEl = seguro(function () { return document.querySelector(a.existente); }, null); return; }
    var dentro = a.dentro ? document.querySelector(a.dentro) : null;
    var antesDe = a.antesDe ? document.querySelector(a.antesDe) : null;
    if (!dentro && !antesDe) return;
    var span = document.createElement('span');
    span.className = 'agtech-ajuda';
    if (a.estilo) span.setAttribute('style', a.estilo);
    var s = span.attachShadow({ mode: 'open' });
    s.innerHTML = '<style>' + CSS_AJUDA + '</style><button type="button" class="aj ' + (a.variante || 'claro') +
      '" aria-label="Ajuda: fazer o tour guiado"><b>?</b><span class="t">' + esc(a.texto || 'Ajuda') + '</span></button>';
    s.querySelector('button').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); tourIniciar(); });
    if (antesDe) antesDe.parentNode.insertBefore(span, antesDe); else dentro.appendChild(span);
    ajudaEl = span;
  }

  // ------------------------------------------------------------------ montagem
  function injetarPagina() {
    if (!document.querySelector('link[href*="Plus+Jakarta+Sans"]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONTE;
      (document.head || document.documentElement).appendChild(l);
    }
    var st = document.createElement('style');
    st.id = 'agtech-pagina';
    st.textContent =
      '#agtech-host{position:fixed!important;top:0!important;left:0!important;width:0!important;height:0!important;' +
      'margin:0!important;padding:0!important;border:0!important;z-index:2147483000!important;display:block!important;overflow:visible!important}' +
      '.agtech-pulse{outline:3px solid #FF9100!important;outline-offset:3px!important;animation:agtech-pulsar 1.2s ease 0s 3!important}' +
      '@keyframes agtech-pulsar{0%,100%{outline-color:#FF9100}50%{outline-color:rgba(255,145,0,.15)}}' +
      '.agtech-ajuda{display:inline-flex;vertical-align:middle}' +
      '@media print{#agtech-host,.agtech-ajuda{display:none!important}}' +
      (C.cssPagina || '');
    (document.head || document.documentElement).appendChild(st);
  }
  function htmlBase() {
    return '<div class="ag" id="ag">' +
      '<button class="fab" id="fab" type="button" aria-label="Abrir o Assistente Tech"><span class="masc-slot" data-modo="rosto"></span><span class="badge" id="badge" hidden>0</span></button>' +
      '<div class="bubble" id="bubble" hidden role="status" aria-live="polite"></div>' +
      '<section class="panel" id="panel" hidden aria-label="Assistente Tech">' +
        '<div class="head"><span class="masc-slot" data-modo="rosto"></span><div class="ht"><h4>Assistente Tech</h4><p>' + esc(C.subtitulo || C.nome) + '</p>' +
        '<span class="ia off" id="ia">Diagn\u00f3stico autom\u00e1tico</span></div><button class="x" type="button" id="fechar" aria-label="Fechar assistente">\u2715</button></div>' +
        '<div class="msgs" id="msgs" aria-live="polite"></div>' +
        '<div class="chips" id="chips"></div>' +
        '<form class="form" id="form"><textarea id="inp" placeholder="' + esc(C.placeholder || 'Pergunte sobre este sistema\u2026') + '" aria-label="Pergunta para o assistente"></textarea>' +
        '<button type="submit" id="send">Enviar</button></form>' +
      '</section>' +
      '<div class="toast" id="toast" hidden role="status"></div>' +
      '<div class="tour" id="tour" hidden>' +
        '<div class="tblock"></div><div class="tspot" id="tspot"></div>' +
        '<div class="tcard" id="tcard" role="dialog" aria-modal="true" aria-labelledby="ttitle">' +
          '<div class="thero" id="thero" hidden><span class="masc-slot" data-modo="busto"></span></div>' +
          '<div class="ttop"><span class="masc-slot" data-modo="rosto"></span><div><div class="tstep" id="tstep">Passo 1</div><div class="ttitle" id="ttitle"></div></div></div>' +
          '<div class="ttext" id="ttext"></div><div class="tex" id="tex" hidden></div>' +
          '<div class="tbar"><i id="tbari"></i></div>' +
          '<div class="tnav"><button class="tbtn link" type="button" id="tskip">Pular tour</button><span class="sp"></span>' +
          '<button class="tbtn sec" type="button" id="tprev">\u2190 Voltar</button><button class="tbtn pri" type="button" id="tnext">Pr\u00f3ximo \u2192</button></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  function ligarEventos() {
    $('fab').addEventListener('click', function () { if (A.aberto) fecharPainel(); else abrirPainel(); });
    $('bubble').addEventListener('click', abrirPainel);
    $('fechar').addEventListener('click', fecharPainel);
    $('msgs').addEventListener('click', function (e) {
      var b = e.target.closest('.apontar'); if (b) apontar(b.getAttribute('data-alvo'));
      var c = e.target.closest('[data-chip]'); if (c) chip(c.getAttribute('data-chip'));
    });
    $('chips').addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (c) chip(c.getAttribute('data-q')); });
    $('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('inp').value.trim(); if (!v) return;
      $('inp').value = ''; perguntar(v, true);
    });
    $('inp').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('form').requestSubmit ? $('form').requestSubmit() : $('send').click(); }
      if (e.key === 'Escape') { e.stopPropagation(); fecharPainel(); }
    });
    $('tnext').addEventListener('click', function () { tourIr(1); });
    $('tprev').addEventListener('click', function () { tourIr(-1); });
    $('tskip').addEventListener('click', function () { tourFim(false); });
  }
  function montar() {
    if (montado || !document.body) return;
    if (!document.body.attachShadow) { try { console.warn('[Agente Tech] navegador sem Shadow DOM'); } catch (_) {} return; }
    injetarPagina();
    host = document.createElement('div');
    host.id = 'agtech-host';
    sr = host.attachShadow({ mode: 'open' });
    sr.innerHTML = '<style>' + CSS + '</style>' + htmlBase();
    document.body.appendChild(host);
    var ag = $('ag');
    if (C.posicao) {
      if (C.posicao.direita != null) ag.style.setProperty('--ag-r', C.posicao.direita + 'px');
      if (C.posicao.baixo != null) ag.style.setProperty('--ag-b', C.posicao.baixo + 'px');
    }
    montado = true;
    montarMascotes(sr);
    montarChips();
    ligarEventos();
    criarAjuda();
    seguirOlhar();
    pintarIA();
    if (C.ganchos) seguro(function () { C.ganchos(API); });
    verificarIA();
    atualizarBadge();
    setInterval(atualizarBadge, C.intervaloBadge || 4000);
    iniciarDicas();
    var visto = LS.get('tour', '') === '1';
    if (!visto && C.tourAutomatico !== false) {
      if (C.aoPrimeiroAcesso) seguro(C.aoPrimeiroAcesso);
      var comecar = function () { if (!T.ativo) tourIniciar(); };
      setTimeout(function () {
        // espera o sistema carregar os dados (at\u00e9 9 s) para o tour mostrar a tela de verdade
        if (C.prontoParaTour) aguardar(C.prontoParaTour, 9000, 300).then(comecar, comecar);
        else comecar();
      }, C.atrasoTour || 1500);
    } else {
      setTimeout(function () {
        if (!A.aberto && !T.ativo && $('bubble').hidden) dizer(C.convite || 'Precisa de ajuda? Clique aqui \ud83d\udc4b', { ms: 8000 });
      }, 4200);
    }
  }
  function iniciar(cfg) {
    if (C) return API;
    C = cfg || {};
    C.projeto = String(C.projeto || 'sistema').replace(/[^A-Za-z0-9_\-]/g, '_');
    C.nome = C.nome || 'Sistema Techmetria';
    var go = function () { seguro(montar); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
    else go();
    return API;
  }

  var API = {
    versao: VERSAO,
    iniciar: iniciar,
    abrir: abrirPainel, fechar: fecharPainel,
    tour: function () { tourIniciar(); }, tourAtivo: function () { return T.ativo; },
    apontar: apontar, dizer: dizer, processo: processo, trabalhando: trabalhando, calar: esconderBolha,
    atualizar: atualizarBadge, perguntar: function (t) { abrirPainel(); perguntar(t, true); },
    envolver: envolver, aguardar: aguardar, aviso: aviso, md: md, esc: esc,
    diagnostico: function () { return diag(); },
    util: { num: num, br: br, money: money, mediana: mediana, dataBR: dataBR, dias: dias, hoje: hoje, hojeBR: hojeBR, texto: texto, visivel: visivel, esc: esc }
  };
  window.AgenteTech = API;
})();

