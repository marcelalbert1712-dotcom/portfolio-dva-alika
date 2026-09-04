document.addEventListener('DOMContentLoaded', () => {
  const robot = document.querySelector('.hero-robot');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%';

  function scrambleElement(element, finalText, delay = 0) {
    if (!element) return;
    element.classList.add('scramble-text');
    if (reduceMotion) {
      element.textContent = finalText;
      return;
    }
    window.setTimeout(() => {
      const startedAt = performance.now();
      const duration = Math.max(520, finalText.length * 48);
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const revealed = Math.floor(progress * finalText.length);
        element.textContent = finalText.split('').map((char, index) => {
          if (index < revealed || char === ' ') return char;
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('');
        if (progress < 1) window.requestAnimationFrame(tick);
        else element.textContent = finalText;
      };
      window.requestAnimationFrame(tick);
    }, delay);
  }

  document.querySelectorAll('.hero-node').forEach((node, index) => {
    scrambleElement(node, node.textContent.trim(), index * 180);
  });

  const agentHeadingObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const heading = entry.target;
        scrambleElement(heading, heading.textContent.trim());
        observer.unobserve(heading);
      }
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.agent-card h3').forEach((heading) => agentHeadingObserver.observe(heading));

  if (!reduceMotion) {
    let ticking = false;
    const updateAtmosphere = () => {
      document.documentElement.style.setProperty('--city-shift', `${Math.min(window.scrollY * -0.08, 0).toFixed(1)}px`);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateAtmosphere);
        ticking = true;
      }
    }, { passive: true });
    updateAtmosphere();
  }
  if (robot && !reduceMotion) {
    robot.addEventListener('pointermove', (event) => {
      const rect = robot.getBoundingClientRect();
      const x = Math.max(-8, Math.min(8, (event.clientX - rect.left) / rect.width * 16 - 8));
      const y = Math.max(-8, Math.min(8, (event.clientY - rect.top) / rect.height * 16 - 8));
      robot.style.setProperty('--robot-x', `${x.toFixed(1)}px`);
      robot.style.setProperty('--robot-y', `${y.toFixed(1)}px`);
    });
    robot.addEventListener('pointerleave', () => {
      robot.style.setProperty('--robot-x', '0px');
      robot.style.setProperty('--robot-y', '0px');
    });
  }
  const reviewersToggle = document.querySelector('.reviewers-toggle');
  const reviewersStrip = document.querySelector('.reviewers-strip');
  reviewersToggle?.addEventListener('click', () => {
    const open = reviewersStrip.classList.toggle('is-open');
    reviewersToggle.setAttribute('aria-expanded', String(open));
    reviewersToggle.innerHTML = open ? 'Скрыть роли <span>−</span>' : 'Показать роли <span>+</span>';
  });

  // ===== THEME TOGGLE =====
  const ThemeManager = {
    init() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      this.set(theme);
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.set(e.matches ? 'dark' : 'light');
        }
      });
    },
    set(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      const btn = document.querySelector('.theme-toggle__icon');
      if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    },
    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      this.set(current === 'dark' ? 'light' : 'dark');
    }
  };

  document.getElementById('themeToggle').addEventListener('click', () => ThemeManager.toggle());
  ThemeManager.init();

  // ===== MOBILE MENU =====
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // ===== ACTIVE SECTION NAVIGATION =====
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const navSections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveNav = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveNav(visible.target.id);
  }, { rootMargin: '-24% 0px -60% 0px', threshold: [0.05, 0.2, 0.5] });

  navSections.forEach(section => navObserver.observe(section));
  setActiveNav('hero');

  // ===== HERO CANVAS (grid + particles) =====
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let animId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const dots = [];
  const GRID_SPACING = 60;
  const NUM_PARTICLES = 40;

  class Dot {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 110, 247, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM_PARTICLES; i++) {
    dots.push(new Dot());
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(79, 110, 247, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    for (let i = 0; i < dots.length; i++) {
      dots[i].update();
      dots[i].draw();
    }
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(79, 110, 247, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(animate);
  }
  animate();

  // ===== TYPEWRITER EFFECT =====
  const typewriterEl = document.getElementById('typewriter');
  const FALLBACK_PHRASES = [
    'Привет, мы Два Алика',
    'Делаем сайты на AI',
    'Парсим данные за минуты',
    'Ваш бизнес — наш код'
  ];
  function getPhrases() {
    if (window.I18N_DATA && window.ALIK_LANG && window.I18N_DATA[window.ALIK_LANG]) {
      return window.I18N_DATA[window.ALIK_LANG].typePhrases || FALLBACK_PHRASES;
    }
    return FALLBACK_PHRASES;
  }
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typewriterTick() {
    const phrases = getPhrases();
    phraseIdx = phraseIdx % phrases.length;
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      charIdx++;
      typewriterEl.textContent = current.substring(0, charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typewriterTick, 2000);
        return;
      }
    } else {
      charIdx--;
      typewriterEl.textContent = current.substring(0, Math.max(0, charIdx));
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typewriterTick, 500);
        return;
      }
    }
    setTimeout(typewriterTick, isDeleting ? 30 : 60);
  }
  typewriterTick();
  window.addEventListener('aliklang', () => {
    phraseIdx = 0; charIdx = 0; isDeleting = false;
  });

  // ===== STATS COUNTER =====
  const statsSection = document.getElementById('stats');
  let counted = false;

  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.hero__stat-num').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);

  // ===== SCROLL ANIMATIONS =====
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });

  // ===== AGENT TABS =====
  const tabBtns = document.querySelectorAll('.about__tab-btn');
  const panels = {
    parser: document.getElementById('panel-parser'),
    architect: document.getElementById('panel-architect')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Object.values(panels).forEach(p => p.classList.remove('active'));
      const target = panels[btn.dataset.tab];
      if (target) target.classList.add('active');
    });
  });

  // ===== YANDEX METRICA GOALS =====
  const reachGoal = (goalName, params) => {
    if (typeof window.ym === 'function') {
      window.ym(111593634, 'reachGoal', goalName, params);
    }
  };

  document.querySelectorAll('.project-card__link').forEach((link, index) => {
    link.addEventListener('click', () => {
      reachGoal('project_click', {
        project_index: index + 1,
        project_url: link.href
      });
    });
  });

  document.querySelectorAll('a[href*="t.me/"]').forEach(link => {
    link.addEventListener('click', () => reachGoal('telegram_click'));
  });

  // ===== TELEGRAM FORM =====
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formSubmit = document.getElementById('formSubmit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) {
      formStatus.className = 'contact__form-status error';
      formStatus.textContent = 'Заполните все поля';
      return;
    }

    formStatus.className = 'contact__form-status sending';
    formStatus.textContent = 'Отправляю...';
    formSubmit.disabled = true;
    formSubmit.textContent = 'Отправляю...';

    const text = `📩 Новое сообщение с портфолио\n\nИмя: ${name}\nEmail: ${email}\nСообщение: ${message}`;

    try {
      const res = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      if (res.ok) {
        reachGoal('form_submit');
        formStatus.className = 'contact__form-status success';
        formStatus.textContent = 'Сообщение отправлено! Мы свяжемся с вами в ближайшее время.';
        form.reset();
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (err) {
      formStatus.className = 'contact__form-status error';
      formStatus.textContent = 'Не удалось отправить. Попробуйте позже или напишите в Telegram.';
    } finally {
      formSubmit.disabled = false;
      formSubmit.textContent = 'Отправить';
    }
  });

});

