/* Chat widget «Алик» — портфолио Два Алика */
(function(){
  if (document.getElementById('alik-chat-btn')) return;

  function L(){ return (window.I18N_DATA && window.I18N_DATA[window.ALIK_LANG || 'ru']) ? (window.ALIK_LANG || 'ru') : 'ru'; }
  function CT(){ return window.I18N_DATA[L()].chat; }

  const css = `
  #alik-chat-wrap{position:fixed;right:22px;bottom:22px;z-index:9998}
  #alik-chat-btn{position:relative;width:60px;height:60px;border-radius:50%;border:2px solid rgba(224,164,88,.8);cursor:pointer;
    background:#0d0f14;padding:0;overflow:hidden;display:block;
    box-shadow:0 0 0 4px rgba(86,200,178,.30), 0 0 26px rgba(86,200,178,.40), 0 12px 32px rgba(0,0,0,.5);transition:.25s;display:block}
  #alik-chat-btn:hover{transform:scale(1.08);box-shadow:0 0 0 6px rgba(86,200,178,.42), 0 0 34px rgba(86,200,178,.55), 0 12px 32px rgba(0,0,0,.5)}
  #alik-chat-btn img{width:100%;height:100%;object-fit:cover}
  .ac-badge{position:absolute;right:-4px;bottom:-4px;width:24px;height:24px;border-radius:50%;background:#56c8b2;
    border:2.5px solid #12161f;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,.4)}
  .ac-badge svg{width:13px;height:13px;fill:#0d1119}
  .ac-hint{position:absolute;right:72px;top:50%;transform:translateY(-50%) translateX(6px);white-space:nowrap;
    background:#141926;border:1px solid #262e40;color:#e8edf5;font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;
    padding:9px 15px;border-radius:12px;opacity:0;pointer-events:none;transition:.25s;box-shadow:0 8px 24px rgba(0,0,0,.4)}
  #alik-chat-wrap:hover .ac-hint{opacity:1;transform:translateY(-50%) translateX(0)}
  .ac-pop{position:absolute;bottom:74px;right:0;width:max-content;max-width:250px;background:#141926;border:1px solid rgba(86,200,178,.45);
    border-radius:16px 16px 4px 16px;padding:13px 34px 13px 16px;color:#e8edf5;font-family:'Manrope',sans-serif;font-size:13.5px;
    box-shadow:0 14px 40px rgba(0,0,0,.5);display:none;animation:acpop .35s ease}
  .ac-pop.show{display:block}
  @keyframes acpop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @media(prefers-reduced-motion:reduce){.ac-pop{animation:none}}
  .ac-pop .x{position:absolute;top:6px;right:9px;background:none;border:none;color:#8b96ab;cursor:pointer;font-size:14px}
  .ac-pop .x:hover{color:#e8edf5}
  .footer{padding-bottom:88px}
  #alik-chat-panel{position:fixed;right:22px;bottom:94px;width:min(370px,calc(100vw - 32px));height:min(520px,70vh);
    background:#12161f;border:1px solid #262e40;border-radius:22px;z-index:9999;display:none;flex-direction:column;
    box-shadow:0 30px 80px rgba(0,0,0,.6);overflow:hidden;font-family:'Manrope',sans-serif}
  #alik-chat-panel.open{display:flex}
  .ac-head{padding:16px 18px;background:linear-gradient(135deg,#182130,#141926);border-bottom:1px solid #262e40;display:flex;align-items:center;gap:11px}
  .ac-ava{width:38px;height:38px;border-radius:50%;overflow:hidden;border:1.5px solid rgba(224,164,88,.6);background:#0d0f14;flex-shrink:0}
  .ac-head b{font-size:14.5px;color:#e8edf5;display:block;line-height:1.2}
  .ac-head span{font-size:11.5px;color:#56c8b2;display:flex;align-items:center;gap:5px}
  .ac-head span::before{content:'';width:6px;height:6px;border-radius:50%;background:#56c8b2;box-shadow:0 0 7px #56c8b2;display:inline-block}
  .ac-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:
    radial-gradient(400px 200px at 100% 0%, rgba(86,200,178,.05), transparent),#0d1119}
  .ac-msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:13.8px;line-height:1.5;color:#e8edf5;white-space:pre-wrap;word-wrap:break-word}
  .ac-msg.bot{background:#1b2231;border-bottom-left-radius:5px;align-self:flex-start}
  .ac-msg.user{background:linear-gradient(135deg,#e0a458,#cf8f42);color:#241505;font-weight:500;border-bottom-right-radius:5px;align-self:flex-end}
  .ac-typing{align-self:flex-start;display:none;padding:12px 15px;background:#1b2231;border-radius:16px;border-bottom-left-radius:5px}
  .ac-typing i{width:7px;height:7px;border-radius:50%;background:#56c8b2;display:inline-block;margin-right:4px;animation:acblink 1.2s infinite}
  .ac-typing i:nth-child(2){animation-delay:.18s}.ac-typing i:nth-child(3){animation-delay:.36s;margin-right:0}
  @keyframes acblink{50%{opacity:.25}}
  @media(prefers-reduced-motion:reduce){.ac-typing i{animation:none}}
  .ac-input{display:flex;gap:8px;padding:12px;border-top:1px solid #262e40;background:#141926}
  .ac-input input{flex:1;background:#0d1119;border:1px solid #262e40;border-radius:12px;padding:11px 14px;color:#e8edf5;font-family:'Manrope';font-size:13.8px;outline:none}
  .ac-input input:focus{border-color:#56c8b2}
  .ac-input button{background:#56c8b2;border:none;border-radius:12px;width:44px;cursor:pointer;font-size:17px;color:#0d1119}
  .ac-input button:hover{filter:brightness(1.1)}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.id = 'alik-chat-wrap';
  wrap.innerHTML = `
    <div class="ac-pop" id="acPop"><span id="acPopText"></span><button class="x" id="acPopX">✕</button></div>
    <button id="alik-chat-btn" title="">
      <img src="images/alik-avatar.png" alt="Алик">
      <span class="ac-badge"><svg viewBox="0 0 24 24"><path d="M4 4h16v12H8l-4 4V4z"/></svg></span>
    </button>
    <span class="ac-hint" id="acHint"></span>`;
  document.body.appendChild(wrap);
  const btn = document.getElementById('alik-chat-btn');

  function refreshBtnLang(){
    const c = CT();
    const hint = document.getElementById('acHint'); if (hint) hint.textContent = c.hover;
    const pop = document.getElementById('acPopText'); if (pop) pop.textContent = c.popup;
  }
  refreshBtnLang();
  window.addEventListener('aliklang', refreshBtnLang);

  // Попап первого визита
  if (!localStorage.getItem('alikchatpop')) {
    setTimeout(() => {
      document.getElementById('acPop').classList.add('show');
      localStorage.setItem('alikchatpop', '1');
      setTimeout(()=>{ const p=document.getElementById('acPop'); if(p) p.classList.remove('show'); }, 8000);
    }, 4000);
  }
  document.getElementById('acPopX').addEventListener('click', ()=>
    document.getElementById('acPop').classList.remove('show'));

  const panel = document.createElement('div');
  panel.id = 'alik-chat-panel';
  panel.innerHTML = `
    <div class="ac-head">
      <div class="ac-ava"><img src="images/alik-avatar.png" alt="Алик" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>
      <div><b id="acTitle">${CT().title}</b><span id="acStatus">${CT().status}</span></div>
    </div>
    <div class="ac-msgs" id="acMsgs"></div>
    <div class="ac-input">
      <input id="acInput" type="text" placeholder="${CT().placeholder}" maxlength="500">
      <button id="acSend">➤</button>
    </div>`;
  document.body.appendChild(panel);

  const msgs = panel.querySelector('#acMsgs');
  const input = panel.querySelector('#acInput');
  const history = [];
  let busy = false;

  function add(role, text){
    const d = document.createElement('div');
    d.className = 'ac-msg ' + role;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }
  function typing(on){
    let t = msgs.querySelector('.ac-typing');
    if (on && !t) {
      t = document.createElement('div');
      t.className = 'ac-typing';
      t.innerHTML = '<i></i><i></i><i></i>';
      msgs.appendChild(t);
      msgs.scrollTop = msgs.scrollHeight;
    }
    if (!on && t) t.remove();
  }

  add('bot', CT().greeting);

  window.addEventListener('aliklang', () => {
    const c = CT();
    const t = document.getElementById('acTitle'); if (t) t.textContent = c.title;
    const s = document.getElementById('acStatus'); if (s) s.textContent = c.status;
    input.placeholder = c.placeholder;
    // если диалог ещё не начат — обновим приветствие
    const first = msgs.querySelector('.ac-msg.bot');
    if (first && history.length === 0) first.textContent = c.greeting;
  });

  async function send(text){
    if (busy || !text.trim()) return;
    busy = true;
    add('user', text);
    history.push({ role:'user', content:text });
    input.value = '';
    typing(true);
    try {
      const r = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages: history, lang: L() })
      });
      const j = await r.json();
      typing(false);
      add('bot', j.reply || 'Что-то заглючило, повтори ещё раз 🙏');
      if (j.ok) history.push({ role:'assistant', content:j.reply });
    } catch(e){
      typing(false);
      add('bot','Связь моргнула 📡 Попробуй ещё раз или напиши в @dvaalika_bot');
    }
    busy = false;
  }

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    document.getElementById('acPop').classList.remove('show');
    if (panel.classList.contains('open')) setTimeout(()=>input.focus(), 100);
  });
  panel.querySelector('#acSend').addEventListener('click', ()=> send(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(input.value); });
})();

