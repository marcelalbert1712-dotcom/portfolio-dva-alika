document.addEventListener('DOMContentLoaded', () => {

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
  const phrases = [
    'Привет, мы Два Алика',
    'Делаем сайты на AI',
    'Парсим данные за минуты',
    'Ваш бизнес — наш код'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typewriterTick() {
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
      typewriterEl.textContent = current.substring(0, charIdx);
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
      const res = await fetch(`https://api.telegram.org/botTELEGRAM_BOT_TOKEN_PLACEHOLDER/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: 'TELEGRAM_CHAT_ID_PLACEHOLDER',
          text: text,
          parse_mode: 'HTML'
        })
      });

      if (res.ok) {
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