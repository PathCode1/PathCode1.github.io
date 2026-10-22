/* Общий движок демо-приложений PathCode: каркас страницы, экраны по адресу #/экран/параметр,
   состояние в localStorage, шторки, подтверждения, уведомления, значки и форматирование. */
const K = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const NB = " ";
  const num = n => Math.round(n).toLocaleString("ru-RU").replace(/\s/g, NB);
  const rub = n => (n < 0 ? "−" : "") + num(Math.abs(n)) + NB + "₽";

  /* значки: обводка currentColor, 24×24 */
  const P = {
    home: '<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    heartf: '<path fill="currentColor" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    back: '<path d="M15 5l-7 7 7 7"/>', next: '<path d="M9 5l7 7-7 7"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', star: '<path fill="currentColor" stroke="none" d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>', list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>', phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    bag: '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>', tag: '<path d="M4 12V5a1 1 0 0 1 1-1h7l8 8-8 8z"/><circle cx="8.5" cy="8.5" r="1.3"/>',
    qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2M14 18h2v2M18 18h2v2h-2"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    chart: '<path d="M5 20V10M10 20V5M15 20v-7M20 20v-4"/>', doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>', task: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
    play: '<path fill="currentColor" stroke="none" d="M8 5.5v13l11-6.5z"/>', pause: '<path d="M9 6v12M15 6v12"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>', edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    card: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/>', cash: '<rect x="3" y="7" width="18" height="11" rx="2"/><circle cx="12" cy="12.5" r="2.5"/>',
    sbp: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 17.5h2"/>', box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
    fire: '<path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-3 4-3 8a6 6 0 0 0 6 6z"/>', pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>', bike: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9l2 7h6M14 6h2"/>',
    leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19l8-8"/>', dumbbell: '<path d="M3 12h18M6 8v8M9 9v6M15 9v6M18 8v8"/>', wave: '<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
    nail: '<path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/>', scissors: '<circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M8 8.5 20 18M8 15.5 20 6"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>', palette: '<path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z"/>',
    award: '<circle cx="12" cy="9" r="5"/><path d="M9 13.5 8 21l4-2 4 2-1-7.5"/>', home2: '<path d="M4 11 12 4l8 7M6 9.5V20h12V9.5"/>', people: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5a3 3 0 0 1 0 6M17.5 19a5.5 5.5 0 0 0-2-4.2"/>',
    megaphone: '<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M17 9a4 4 0 0 1 0 6"/>', truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    wifi: '<path d="M4 9a12 12 0 0 1 16 0M7 12.5a8 8 0 0 1 10 0M10 16a3.5 3.5 0 0 1 4 0M12 19.5h.01"/>', receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    dots: '<path d="M6 12h.01M12 12h.01M18 12h.01" stroke-width="3"/>', share: '<path d="M12 15V4M8 8l4-4 4 4M5 13v7h14v-7"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    sparkle: '<path d="M12 4l1.8 4.6L18.5 10l-4.7 1.6L12 16l-1.8-4.4L5.5 10l4.7-1.4z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'
  };
  const ic = (n, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;

  /* даты */
  const MON = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const MON1 = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const DOW = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const DOWL = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  const iso = d => { const z = new Date(d); return `${z.getFullYear()}-${String(z.getMonth() + 1).padStart(2, "0")}-${String(z.getDate()).padStart(2, "0")}`; };
  const fromIso = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const z = new Date(d); z.setDate(z.getDate() + n); return z; };
  const today = () => { const z = new Date(); z.setHours(0, 0, 0, 0); return z; };
  const dmy = d => { const z = typeof d === "string" ? fromIso(d) : d; return `${z.getDate()} ${MON[z.getMonth()]}`; };
  const plural = (n, a, b, c) => { const m = Math.abs(n) % 100, k = m % 10; return m > 10 && m < 20 ? c : k > 1 && k < 5 ? b : k === 1 ? a : c; };

  /* детерминированный генератор чисел для «занятых» слотов и демо-данных */
  const rnd = seed => { let s = typeof seed === "string" ? [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7) : seed; return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

  const dl = (name, text, mime = "text/plain") => {
    const b = new Blob([text], { type: mime + ";charset=utf-8" }), a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };

  let cfg, view, tabbar, sheetWrap, toastEl, curName = "", curArgs = [], timers = [];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* счётчик: <b data-count="12345" data-fmt="rub|num">…</b> плавно набирает значение при входе на экран */
  function countUp(el){
    const to = +el.dataset.count, fmt = el.dataset.fmt === "rub" ? rub : num, t0 = performance.now(), d = 700;
    const step = t => { const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(to * e); if (k < 1 && el.isConnected) requestAnimationFrame(step); };
    el.textContent = fmt(0); requestAnimationFrame(step);
  }
  /* «отскок» элемента — для корзины, счётчиков и т.п. */
  const bump = el => { if (!el || RM) return; el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };
  const acts = {}, ins = {}, chs = {};
  const api = { $, esc, rub, num, ic, iso, fromIso, addDays, today, dmy, plural, rnd, dl, MON, MON1, DOW, DOWL, NB, s: null };
  api.bump = sel => bump(typeof sel === "string" ? $(sel) : sel);

  api.save = () => { try { localStorage.setItem(cfg.key, JSON.stringify(api.s)); } catch (e) { } };
  api.reset = () => { try { localStorage.removeItem(cfg.key); } catch (e) { } api.s = cfg.defaults(); api.save(); };
  api.on = (name, fn) => { acts[name] = fn; };
  api.onInput = (name, fn) => { ins[name] = fn; };
  api.onChange = (name, fn) => { chs[name] = fn; };
  api.timer = (fn, ms) => { const t = setInterval(fn, ms); timers.push(t); return t; };
  api.later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

  api.go = (path, replace) => { const h = "#/" + path; if (location.hash === h) { render(); return; } api._dir = replace ? (api._dir || "fade") : "fwd"; if (replace) location.replace(h); else { api._depth++; location.hash = h; } };
  api.back = fallback => { api._dir = "back"; if (api._depth > 0) { api._depth--; history.back(); } else api.go(fallback || cfg.start, true); };
  api._depth = 0;
  api.route = () => curName;
  api.args = () => curArgs;
  api.render = () => render(true);
  /* перерисовать экран с анимацией появления (смена фильтра, периода, дня) */
  api.replay = () => { render(true); if (RM) return; view.classList.remove("soft"); void view.offsetWidth; view.classList.add("soft"); clearTimeout(api._st); api._st = setTimeout(() => view.classList.remove("soft"), 1500); view.querySelectorAll("[data-count]").forEach(countUp); };

  api.toast = t => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(api._tt); api._tt = setTimeout(() => toastEl.classList.remove("show"), 2600); };
  api.sheet = html => { $(".sheet", sheetWrap).innerHTML = '<div class="grab"></div>' + html; sheetWrap.classList.add("open"); };
  api.close = () => sheetWrap.classList.remove("open");
  api.ask = ({ title, text = "", ok = "Да", cancel = "Отмена", danger }) => new Promise(res => {
    api.sheet(`<h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ""}<div class="two"><button class="btn ghost" data-a="_no">${esc(cancel)}</button><button class="btn" ${danger ? 'style="background:var(--bad);color:#fff"' : ""} data-a="_yes">${esc(ok)}</button></div>`);
    api._ask = res;
  });
  acts._yes = () => { api.close(); api._ask && api._ask(true); api._ask = null; };
  acts._no = () => { api.close(); api._ask && api._ask(false); api._ask = null; };

  function parse() { const h = location.hash.replace(/^#\/?/, ""); const parts = h ? h.split("/").map(decodeURIComponent) : []; return parts.length && cfg.routes[parts[0]] ? parts : [cfg.start]; }

  function render(keep) {
    const [name, ...args] = parse();
    const changed = name !== curName || args.join("/") !== curArgs.join("/");
    if (changed) { timers.forEach(t => { clearInterval(t); clearTimeout(t); }); timers = []; }
    curName = name; curArgs = args;
    const top = view.scrollTop;
    view.innerHTML = cfg.routes[name](...args);
    const full = (cfg.noTabs || []).includes(name);
    tabbar.classList.toggle("hide", full);
    view.classList.toggle("full", !!view.querySelector(".dock"));
    tabbar.querySelectorAll(".tab").forEach(t => t.classList.toggle("on", t.dataset.r === name || (t.dataset.m || "").split(",").includes(name)));
    if (keep && !changed) view.scrollTop = top; else view.scrollTop = 0;
    if (changed && !RM) {
      view.classList.remove("enter", "d-fwd", "d-back", "d-fade"); void view.offsetWidth;
      view.classList.add("enter", "d-" + (api._dir || "fade")); clearTimeout(api._et); api._et = setTimeout(() => view.classList.remove("enter"), 1600);
      view.querySelectorAll("[data-count]").forEach(countUp);
    }
    api._dir = null;
    cfg.mounted && cfg.mounted[name] && cfg.mounted[name](...args);
  }

  api.app = c => {
    cfg = c;
    try { api.s = JSON.parse(localStorage.getItem(c.key)); } catch (e) { api.s = null; }
    if (!api.s || api.s.v !== c.defaults().v) { api.s = c.defaults(); api.save(); }
    const sd = c.side;
    document.body.innerHTML = `
<div class="stage">
  <aside class="side"><span class="tag">${esc(sd.tag)}</span><h1>${esc(sd.h1)}<br><span>${esc(sd.h1b)}</span></h1><p>${esc(sd.text)}</p>
    <ul>${sd.feats.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
    <div class="links"><a class="pri" href="https://t.me/BeauG0sse" target="_blank" rel="noopener">Заказать такое приложение</a><a href="../../index.html#works" target="_top">← На сайт</a></div>
    <small>Демо-приложение PathCode. Данные вымышленные и хранятся только в вашем браузере.</small></aside>
  <div class="device"><div class="app">
    <div class="status"><span>9:41</span><span class="r"><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 16 12"><path d="M8 2.5c2.4 0 4.6.9 6.3 2.5L16 3.3A11 11 0 0 0 8 0a11 11 0 0 0-8 3.3L1.7 5A9 9 0 0 1 8 2.5zm0 4c1.3 0 2.5.5 3.5 1.3l1.7-1.7A7.5 7.5 0 0 0 8 4a7.5 7.5 0 0 0-5.2 2.1l1.7 1.7c1-.8 2.2-1.3 3.5-1.3zM8 12l2.4-2.4a3.4 3.4 0 0 0-4.8 0z"/></svg><svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="18" height="8" rx="2"/><rect x="25" y="4" width="2" height="4" rx="1" opacity=".45"/></svg></span></div>
    <main class="view" id="view"></main>
    <nav class="tabbar" id="tabbar" aria-label="Разделы">${c.tabs.map(t => `<button class="tab" data-r="${t.r}" data-m="${(t.m || []).join(",")}" type="button"><i>${ic(t.i)}</i>${esc(t.l)}</button>`).join("")}</nav>
    <div class="sheet-wrap" id="sheetWrap"><div class="sheet" role="dialog" aria-modal="true"></div></div>
    <div class="toast" id="toast" role="status"></div>
  </div></div>
</div>`;
    if (c.title) document.title = c.title;
    view = $("#view"); tabbar = $("#tabbar"); sheetWrap = $("#sheetWrap"); toastEl = $("#toast");
    tabbar.addEventListener("click", e => { const t = e.target.closest(".tab"); if (t) { api._depth = 0; api._dir = "fade"; api.go(t.dataset.r, true); } });
    document.addEventListener("click", e => {
      const el = e.target.closest("[data-a]"); if (!el) return;
      const fn = acts[el.dataset.a]; if (fn) { e.preventDefault(); fn(el, e); }
    });
    document.addEventListener("input", e => { const el = e.target.closest("[data-in]"); if (el && ins[el.dataset.in]) ins[el.dataset.in](el, e); });
    document.addEventListener("change", e => { const el = e.target.closest("[data-ch]"); if (el && chs[el.dataset.ch]) chs[el.dataset.ch](el, e); });
    sheetWrap.addEventListener("click", e => { if (e.target === sheetWrap) { acts._no(); } });
    addEventListener("keydown", e => { if (e.key === "Escape" && sheetWrap.classList.contains("open")) acts._no(); });
    addEventListener("hashchange", () => { api.close(); render(); });
    acts.go = el => { api.go(el.dataset.to); };
    acts.back = el => api.back(el.dataset.to);
    acts.close = () => api.close();
    render();
  };
  return api;
})();
