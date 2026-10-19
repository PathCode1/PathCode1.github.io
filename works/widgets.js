/* Плавающие виджеты демо-сайтов: кнопка связи с мессенджерами, «Обратный звонок», «Наверх»
   и приветственная подсказка. Цвета и действия задаются атрибутами тега <script>:
   data-accent  — фон главной кнопки (цвет или градиент)
   data-ink     — цвет иконки на главной кнопке
   data-panel   — фон подписей и подсказки, data-text — их текст
   data-callback — CSS-селектор кнопки окна заявки на сайте (или якорь формы)
   data-top="0" — не показывать «Наверх» (если на сайте своя кнопка)
   data-hello   — текст подсказки, data-phone — номер для «Позвонить» */
(()=>{
const me=document.currentScript, o=me?me.dataset:{};
const cfg={accent:o.accent||"#333",ink:o.ink||"#fff",panel:o.panel||"#fff",text:o.text||"#111",
  callback:o.callback||"",top:o.top!=="0",hello:o.hello||"Здравствуйте! Ответим на вопросы и поможем с записью",
  phone:o.phone||"+79000000000"};
const inFrame=window.parent!==window;

const I={
 chat:'<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 up:'<path d="M6 14l6-6 6 6"/>',
 phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 call:'<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19c0 1.5-2 2.5-5 2.5"/>',
 tg:'<path fill="currentColor" stroke="none" d="M21.4 4.2 2.9 11.3c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.8-1.4-1.4ZM8.6 14l9.8-6.2c.5-.3.9-.1.5.2l-8.1 7.3-.3 3.4L8.6 14Z"/>',
 wa:'<path fill="currentColor" stroke="none" d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 2a7 7 0 1 1-3.6 13l-.3-.2-2.3.6.6-2.2-.2-.3A7 7 0 0 1 12 5Zm-2.6 3.5c-.2 0-.5 0-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.4-.3-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1a5.7 5.7 0 0 1-2.8-2.4c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.8c-.2-.5-.4-.4-.5-.4h-.3Z"/>',
 vk:'<path fill="currentColor" stroke="none" d="M12.9 17.5C6.6 17.5 3 13.2 2.8 6h3.2c.1 5.3 2.4 7.5 4.3 8V6h3v4.6c1.8-.2 3.8-2.3 4.4-4.6h3c-.5 2.8-2.6 4.9-4.1 5.7 1.5.7 3.8 2.5 4.7 5.8h-3.3c-.7-2.2-2.5-3.9-4.7-4.2v4.2h-.4Z"/>'
};
const svg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;

const css=`
.fw{position:fixed;right:max(18px,env(safe-area-inset-right,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:35;display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:inherit;-webkit-tap-highlight-color:transparent;pointer-events:none}
.fw *{box-sizing:border-box}
.fw svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.fw-main{position:relative;width:60px;height:60px;border-radius:50%;border:0;padding:0;cursor:pointer;pointer-events:auto;background:${cfg.accent};color:${cfg.ink};display:grid;place-items:center;box-shadow:0 14px 30px -10px rgba(0,0,0,.55)}
.fw-main::before,.fw-main::after{content:"";position:absolute;inset:0;border-radius:50%;background:${cfg.accent};z-index:-1;animation:fwPulse 2.4s ease-out infinite}
.fw-main::after{animation-delay:1.2s}
.fw.open .fw-main::before,.fw.open .fw-main::after{animation:none;opacity:0}
.fw-main .ic{position:absolute;inset:0;display:grid;place-items:center;transition:transform .3s,opacity .3s}
.fw-main .ic+.ic{opacity:0;transform:rotate(-90deg)}
.fw.open .fw-main .ic:first-child{opacity:0;transform:rotate(90deg)}
.fw.open .fw-main .ic+.ic{opacity:1;transform:none}
@keyframes fwPulse{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.7);opacity:0}}
.fw-list{position:absolute;right:6px;bottom:72px;display:flex;flex-direction:column;align-items:flex-end;gap:10px;margin:0;padding:0;list-style:none}
.fw-list li{opacity:0;transform:translateY(12px) scale(.9);pointer-events:none;transition:opacity .2s,transform .25s}
.fw.open .fw-list li{opacity:1;transform:none;pointer-events:auto}
.fw.open .fw-list li:nth-last-child(2){transition-delay:.03s}.fw.open .fw-list li:nth-last-child(3){transition-delay:.06s}
.fw.open .fw-list li:nth-last-child(4){transition-delay:.09s}.fw.open .fw-list li:nth-last-child(5){transition-delay:.12s}
.fw-it{display:flex;align-items:center;gap:10px;border:0;padding:0;background:none;cursor:pointer;color:inherit;text-decoration:none;font:inherit}
.fw-lb{background:${cfg.panel};color:${cfg.text};font-size:13px;line-height:1;padding:9px 12px;border-radius:10px;white-space:nowrap;box-shadow:0 8px 22px -12px rgba(0,0,0,.5)}
.fw-b{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:#fff;box-shadow:0 10px 22px -10px rgba(0,0,0,.55);transition:transform .2s}
.fw-it:hover .fw-b{transform:scale(1.08)}
.fw-b.tg{background:#2AABEE}.fw-b.wa{background:#25D366}.fw-b.vk{background:#0077FF}.fw-b.ac{background:${cfg.accent};color:${cfg.ink}}
.fw-top{width:46px;height:46px;border-radius:50%;border:0;cursor:pointer;background:${cfg.panel};color:${cfg.text};display:grid;place-items:center;box-shadow:0 10px 24px -12px rgba(0,0,0,.55);opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .25s,transform .25s;margin-right:7px}
.fw-top.show{opacity:1;transform:none;pointer-events:auto}
.fw.open .fw-top{opacity:0;pointer-events:none}
.fw-hi{position:relative;max-width:min(260px,calc(100vw - 110px));background:${cfg.panel};color:${cfg.text};font-size:13.5px;line-height:1.4;padding:12px 30px 12px 14px;border-radius:14px 14px 4px 14px;box-shadow:0 14px 30px -14px rgba(0,0,0,.55);opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .3s,transform .3s;margin-right:4px;cursor:pointer}
.fw-hi.show{opacity:1;transform:none;pointer-events:auto}
.fw.open .fw-hi{display:none}
.fw-hi button{position:absolute;top:4px;right:4px;width:24px;height:24px;border:0;background:none;color:inherit;opacity:.6;cursor:pointer;display:grid;place-items:center;padding:0}
.fw-hi button svg{width:14px;height:14px}
.fw-toast{position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:36;transform:translate(-50%,10px);background:${cfg.panel};color:${cfg.text};font-size:13px;line-height:1.35;padding:10px 16px;border-radius:12px;box-shadow:0 14px 30px -12px rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;width:max-content;max-width:calc(100vw - 32px);text-align:center;font-family:inherit}
.fw-toast.show{opacity:1;transform:translate(-50%,0)}
@media (max-width:600px){.fw{right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px))}.fw-main{width:56px;height:56px}.fw-list{right:4px;bottom:68px}.fw-b{width:46px;height:46px}.fw-top{width:42px;height:42px}}
@media (prefers-reduced-motion:reduce){.fw-main::before,.fw-main::after{animation:none;opacity:0}.fw *{transition:none!important}}
`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

const root=document.createElement("div");root.className="fw";
root.innerHTML=`
<div class="fw-hi" role="status"><span>${cfg.hello}</span><button type="button" aria-label="Скрыть подсказку">${svg("x")}</button></div>
${cfg.top?`<button class="fw-top" type="button" aria-label="Наверх">${svg("up")}</button>`:""}
<ul class="fw-list" id="fwList">
  <li><button class="fw-it" type="button" data-fw="tg"><span class="fw-lb">Telegram</span><span class="fw-b tg">${svg("tg")}</span></button></li>
  <li><button class="fw-it" type="button" data-fw="wa"><span class="fw-lb">WhatsApp</span><span class="fw-b wa">${svg("wa")}</span></button></li>
  <li><button class="fw-it" type="button" data-fw="vk"><span class="fw-lb">ВКонтакте</span><span class="fw-b vk">${svg("vk")}</span></button></li>
  <li><a class="fw-it" href="tel:${cfg.phone}"><span class="fw-lb">Позвонить</span><span class="fw-b ac">${svg("phone")}</span></a></li>
  <li><button class="fw-it" type="button" data-fw="cb"><span class="fw-lb">Обратный звонок</span><span class="fw-b ac">${svg("call")}</span></button></li>
</ul>
<button class="fw-main" type="button" aria-label="Связаться с нами" aria-expanded="false" aria-controls="fwList"><span class="ic">${svg("chat")}</span><span class="ic">${svg("x")}</span></button>`;
document.body.appendChild(root);
const toast=document.createElement("div");toast.className="fw-toast";toast.setAttribute("role","status");document.body.appendChild(toast);

const main=root.querySelector(".fw-main"), hi=root.querySelector(".fw-hi"), top=root.querySelector(".fw-top");
const setOpen=v=>{root.classList.toggle("open",v);main.setAttribute("aria-expanded",v);main.setAttribute("aria-label",v?"Закрыть":"Связаться с нами");if(v)hideHi()};
main.addEventListener("click",()=>setOpen(!root.classList.contains("open")));
document.addEventListener("click",e=>{if(!root.contains(e.target))setOpen(false)});
addEventListener("keydown",e=>{if(e.key==="Escape")setOpen(false)});

let tt;
const say=t=>{toast.textContent=t;toast.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove("show"),3200)};
const NAMES={tg:"Telegram",wa:"WhatsApp",vk:"ВКонтакте"};
root.querySelectorAll("[data-fw]").forEach(b=>b.addEventListener("click",()=>{
  const k=b.dataset.fw;setOpen(false);
  if(k!=="cb"){say(`Это демо: здесь будет ссылка на ваш ${NAMES[k]}`);return}
  const t=cfg.callback&&document.querySelector(cfg.callback);
  if(!t){say("Это демо: здесь откроется форма обратного звонка");return}
  if(t.matches("form,section,div,#top")){t.scrollIntoView({behavior:"smooth",block:"center"});const i=t.querySelector("input[type=tel]")||t.querySelector("input");if(i)setTimeout(()=>i.focus({preventScroll:true}),600)}
  else t.click();
}));

if(top){
  const onScroll=()=>top.classList.toggle("show",scrollY>700);
  addEventListener("scroll",onScroll,{passive:true});onScroll();
  top.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
}

/* подсказка: один раз за визит и не в превью портфолио */
let seen=false;try{seen=sessionStorage.getItem("fw-hi")==="1"}catch(e){}
function hideHi(){hi.classList.remove("show");try{sessionStorage.setItem("fw-hi","1")}catch(e){}}
hi.querySelector("button").addEventListener("click",e=>{e.stopPropagation();hideHi()});
hi.addEventListener("click",()=>setOpen(true));
if(!seen&&!inFrame){setTimeout(()=>{if(!root.classList.contains("open"))hi.classList.add("show")},5000);setTimeout(()=>hi.classList.remove("show"),16000)}
})();
