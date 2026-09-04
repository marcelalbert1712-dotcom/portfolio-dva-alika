/* i18n движок портфолио «Два Алика» — RU/EN без перезагрузки */
(function(){
  const D = window.I18N_DATA;
  let lang = localStorage.getItem('aliklang') || 'ru';
  window.ALIK_LANG = lang;

  function setLang(l){
    lang = l;
    localStorage.setItem('aliklang', l);
    window.ALIK_LANG = l;
    document.documentElement.lang = (l === 'ru' ? 'ru' : 'en');
    const d = D[l];

    // 1. Навигация
    document.querySelectorAll('#mainNav a').forEach((a,i)=>{ if(d.nav[i]) a.textContent = d.nav[i]; });
    document.querySelectorAll('.footer__links a').forEach((a,i)=>{ if(d.footer.links[i]) a.textContent = d.footer.links[i]; });

    // 2. Hero
    const eb = document.querySelector('.hero__eyebrow'); if(eb) eb.textContent = d.hero.eyebrow;
    const ht = document.querySelector('.hero__title'); if(ht) ht.innerHTML = d.hero.title;
    const hs = document.querySelector('.hero__subtitle'); if(hs) hs.textContent = d.hero.subtitle;
    const cta = document.querySelector('.hero__actions .btn--primary'); if(cta) cta.textContent = d.hero.ctaTeam;
    const hl = document.querySelector('.hero__link'); if(hl) hl.innerHTML = d.hero.ctaProjects + ' <span>→</span>';
    document.querySelectorAll('.hero__stat-label').forEach((el,i)=>{ if(d.stats[i]) el.textContent = d.stats[i]; });

    // 3. Секции: about / architecture / projects / contact
    function section(sel, block){
      const root = document.querySelector(sel); if(!root || !block) return;
      const tag = root.querySelector('.section__tag'); if(tag) tag.textContent = block.tag;
      const h2 = root.querySelector('h2'); if(h2 && block.title) h2.innerHTML = block.title;
      const desc = root.querySelector('.section__desc'); if(desc && block.desc) desc.textContent = block.desc;
    }
    section('#about', { tag:d.about.tag, title:d.about.title, desc:d.about.desc });
    section('.architecture-section', { tag:d.arch.tag, title:d.arch.title, desc:d.arch.desc });
    section('#tech', { tag:d.tech.tag, title:d.tech.title, desc:d.tech.desc });
    section('#projects', { tag:d.projHead.tag, title:d.projHead.title, desc:d.projHead.desc });
    section('#contact', { tag:d.contact.tag, title:d.contact.title, desc:d.contact.desc });

    // 3b. Технологии — описания по порядку
    document.querySelectorAll('#tech .tech__item .tech__desc').forEach((el,i)=>{ if(d.tech.descs[i]) el.textContent = d.tech.descs[i]; });

    // 4. Workflow
    document.querySelectorAll('#architecture.workflow > div').forEach((div,i)=>{
      if(!d.workflow[i]) return;
      const sp = div.querySelector('span'); if(sp) sp.textContent = d.workflow[i][0];
      const sm = div.querySelector('small'); if(sm) sm.textContent = d.workflow[i][1];
    });

    // 5. Агенты
    document.querySelectorAll('#agents .agent-card p').forEach((p,i)=>{ if(d.agentsDesc[i]) p.textContent = d.agentsDesc[i]; });

    // 6. Ревьюеры
    const rt = document.querySelector('.reviewers-strip h3'); if(rt) rt.textContent = d.reviewers.title;
    const rp = document.querySelector('.reviewers-strip p'); if(rp) rp.textContent = d.reviewers.text;
    const rbtn = document.querySelector('.reviewers-toggle');
    if(rbtn) rbtn.innerHTML = d.reviewers.toggle + ' <span>+</span>';

    // 7. Архитектурный поток
    const flow = document.querySelector('.architecture-flow');
    if(flow){ flow.innerHTML = d.arch.flow.map(x => x + ' <span>→</span>').join(' ').replace(/ (<span>→<\/span>)$/,''); }

    // 8. Проекты (12 карточек) + ссылки «Смотреть»
    document.querySelectorAll('#projectsGrid .project-card').forEach((card,i)=>{
      const p = d.projects[i]; if(!p) return;
      const ty = card.querySelector('.project-card__type'); if(ty) ty.textContent = p.type;
      const tt = card.querySelector('.project-card__title'); if(tt) tt.textContent = p.title;
      const de = card.querySelector('.project-card__desc'); if(de) de.textContent = p.desc;
      const lk = card.querySelector('.project-card__link'); if(lk && d.projHead.link) lk.textContent = d.projHead.link;
    });

    // 9. Форма контактов
    const lblN = document.querySelector('label[for="formName"]'); if(lblN) lblN.textContent = d.contact.name;
    const lblE = document.querySelector('label[for="formEmail"]'); if(lblE) lblE.textContent = d.contact.email;
    const lblM = document.querySelector('label[for="formMessage"]'); if(lblM) lblM.textContent = d.contact.message;
    const phN = document.getElementById('formName'); if(phN) phN.placeholder = d.contact.phName;
    const phM = document.getElementById('formMessage'); if(phM) phM.placeholder = d.contact.phMessage;
    const sub = document.getElementById('formSubmit'); if(sub) sub.textContent = d.contact.submit;

    // 10. Футер
    const logo = document.querySelector('.footer__logo'); if(logo) logo.textContent = d.footer.logo;
    const copy = document.querySelector('.footer__copy'); if(copy) copy.textContent = d.footer.copy;

    // 11. Переключатель
    document.querySelectorAll('.lang-switcher button').forEach(b=>{
      b.classList.toggle('active', b.dataset.lang === l);
    });

    // 12. Сообщить виджетам
    window.dispatchEvent(new CustomEvent('aliklang', { detail:{ lang:l } }));
  }

  function injectSwitcher(){
    const headerInner = document.querySelector('.header__inner');
    if (!headerInner || document.getElementById('langSwitcher')) return;
    const sw = document.createElement('div');
    sw.className = 'lang-switcher';
    sw.id = 'langSwitcher';
    sw.innerHTML = '<button data-lang="ru">RU</button><button data-lang="en">EN</button>';
    headerInner.insertBefore(sw, document.getElementById('themeToggle'));
    sw.querySelectorAll('button').forEach(b=>b.addEventListener('click', ()=>setLang(b.dataset.lang)));
  }

  // стили переключателя
  const st = document.createElement('style');
  st.textContent = `
  .lang-switcher{display:flex;gap:4px;margin-left:14px}
  .lang-switcher button{padding:4px 11px;border-radius:999px;border:1px solid var(--line,#262e40);
    background:transparent;color:inherit;font-family:'JetBrains Mono','Manrope',monospace;font-size:12px;
    font-weight:600;letter-spacing:.06em;cursor:pointer;transition:.2s;opacity:.75}
  .lang-switcher button:hover{opacity:1;border-color:#56c8b2}
  .lang-switcher button.active{background:#56c8b2;color:#0d0f14;border-color:#56c8b2;opacity:1}
  @media(max-width:900px){.lang-switcher{margin-left:auto}}
  `;
  document.head.appendChild(st);

  injectSwitcher();
  setLang(lang);
})();

