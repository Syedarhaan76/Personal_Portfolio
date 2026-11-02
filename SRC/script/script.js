/**
 * SYED MUZAMIL QADRI - LUXURY INTERACTIVE PORTFOLIO ENGINE
 * Includes: Interactive Canvas Particles, Recruiter Terminal, Card Spotlights,
 * Project Filtering, Modal Drawers, Animated Counters, and Navigation Logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initNavbar();
  initProjectFilters();
  initProjectModal();
  initTerminal();
  initAnimatedCounters();
  initCardSpotlights();
  initContactForm();
});

/* ==========================================================================
   1. AMBIENT PARTICLES CONSTELLATION CANVAS
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(139, 92, 246, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 2.5;
          const dirY = (dy / dist) * force * 2.5;
          this.x -= dirX;
          this.y -= dirY;
        }
      }

      this.draw();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    const maxDist = 130;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.25;
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => p.update());
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. NAVBAR & MOBILE DRAWER LOGIC
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menu-icon-js');
  const navbar = document.querySelector('.navbar');
  const navTouchClose = document.getElementById('nav-tc-js');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', () => {
      navbar.classList.toggle('open');
      navTouchClose?.classList.toggle('nav-touch-close-open');
    });
  }

  // Close when tapping outside overlay
  if (navTouchClose) {
    navTouchClose.addEventListener('click', () => {
      navbar?.classList.remove('open');
      navTouchClose.classList.remove('nav-touch-close-open');
    });
  }

  // Close when clicking any nav link
  document.querySelectorAll('.navbar a').forEach((link) => {
    link.addEventListener('click', () => {
      navbar?.classList.remove('open');
      navTouchClose?.classList.remove('nav-touch-close-open');
    });
  });
}

/* ==========================================================================
   3. PROJECT FILTER TABS
   ========================================================================== */
function initProjectFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterTabs.length || !projectCards.length) return;

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. PROJECT DETAILS MODAL SYSTEM
   ========================================================================== */
const projectDatabase = {
  'programmers-planet': {
    title: 'Programmers Planet - Software & Web Agency',
    category: 'Full-Stack Agency Platform',
    image: 'Assets/projects/programmers-planet.jpg',
    url: 'https://www.programmersplanet.in/',
    caseStudyUrl: 'https://www.programmersplanet.in/projects/programmers-planet-web-agency',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'REST APIs', 'Node.js', 'AI'],
    metrics: [
      { label: 'Google Lighthouse Score', value: '99/100' },
      { label: 'Page Load Speed', value: '0.4s FCP' },
      { label: 'SEO Visibility', value: '100%' },
      { label: 'Conversion Lift', value: '+42%' }
    ],
    overview:
      'Programmers Planet is a full-cycle software engineering and digital product agency platform built with high velocity Next.js 15 App Router architecture. Designed to showcase enterprise web apps, portfolio case studies, and transparent service packages.',
    architecture: [
      'Engineered with Next.js 15 App Router and React 19 Server Components for instant rendering.',
      'Tokenized responsive design system built on Vanilla CSS & Tailwind utility primitives with dark-mode aesthetic.',
      'Turbopack-accelerated builds with zero layout shifts (CLS 0.0) and high Core Web Vitals.',
      'Dynamic OpenGraph generation and structured JSON-LD schema markup for high-ranking search engine indexing.',
      'Interactive pricing configurator and direct client consultation scheduling.'
    ]
  },
  'elite-guard': {
    title: 'Elite Guard Insurance Services',
    category: 'Commercial Fintech Platform',
    image: 'Assets/projects/elite-guard.jpg',
    url: 'https://eliteguardinsuranceservices.com/',
    caseStudyUrl: 'https://www.programmersplanet.in/projects/insurance',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Interactive Calculators', 'REST API'],
    metrics: [
      { label: 'Client Inquiry Growth', value: '+68%' },
      { label: 'Bounce Rate Reduction', value: '-35%' },
      { label: 'Mobile Conversion', value: '94%' },
      { label: 'Client Rating', value: '5.0 / 5' }
    ],
    overview:
      'Elite Guard Insurance Services is a modern, high-trust digital portal designed to streamline insurance coverage discovery, quote estimation, and claim consultation for businesses and personal policyholders.',
    architecture: [
      'Interactive Coverage Calculator allowing prospective clients to estimate commercial risk and premium packages in real-time.',
      'Framer Motion smooth scroll-triggered micro-interactions that instill trust and professionalism.',
      'Multi-step responsive lead capture forms integrated with automated inquiry routing.',
      'Meticulously tested cross-device responsiveness from 320px mobile screens to 4K ultra-wide monitors.',
      'Endorsed by corporate client Syed Mohd Farooq, Insurance Advisor at Elite Guard.'
    ]
  },
  'cine-media': {
    title: 'Cine Media - Digital Publishing & Media Platform',
    category: 'High-Traffic Digital Publication',
    image: 'Assets/projects/cine-media.jpg',
    url: 'https://www.cine-media.in/',
    caseStudyUrl: 'https://www.programmersplanet.in/projects/cine-media',
    tags: ['Next.js', 'Tailwind CSS', 'Dynamic Categories', 'Instant Search', 'Dark Mode', 'SEO'],
    metrics: [
      { label: 'Active Readers', value: '50K+ Monthly' },
      { label: 'Avg Session Duration', value: '3m 45s' },
      { label: 'Core Web Vitals', value: 'Passing' },
      { label: 'Dark Mode Adoption', value: '82%' }
    ],
    overview:
      'Cine Media is a modern digital publishing platform built for trending entertainment news, tech analysis, culture stories, and multimedia video/podcast experiences with a magazine-grade layout.',
    architecture: [
      'Instant content filtering across technology, film reviews, business, and community spotlights.',
      'Dynamic article categorization with sub-second client-side search indexing.',
      'Sleek dark-mode first UI that reduces eye fatigue and enhances reading immersion.',
      'Optimized edge image delivery pipelines with responsive srcset for lightning-fast article transitions.'
    ]
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const detailButtons = document.querySelectorAll('.btn-project-details');

  if (!modalBackdrop) return;

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const project = projectDatabase[projectId];
      if (!project) return;

      // Populate modal
      document.getElementById('modal-img').src = project.image;
      document.getElementById('modal-category').textContent = project.category;
      document.getElementById('modal-title').textContent = project.title;
      document.getElementById('modal-overview').textContent = project.overview;
      document.getElementById('modal-live-link').href = project.url;
      document.getElementById('modal-case-link').href = project.caseStudyUrl;

      // Tech tags
      const tagsContainer = document.getElementById('modal-tags');
      tagsContainer.innerHTML = project.tags
        .map((tag) => `<span class="tech-tag">${tag}</span>`)
        .join('');

      // Metrics
      const metricsContainer = document.getElementById('modal-metrics');
      if (metricsContainer) {
        metricsContainer.innerHTML = project.metrics
          .map(
            (m) => `
          <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 14px; text-align: center;">
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--cyan-light); font-family: var(--font-display);">${m.value}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 4px;">${m.label}</div>
          </div>`
          )
          .join('');
      }

      // Architecture List
      const archContainer = document.getElementById('modal-architecture');
      if (archContainer) {
        archContainer.innerHTML = project.architecture
          .map(
            (item) => `
          <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 0.92rem; color: #cbd5e1;">
            <i class="fa-solid fa-check" style="color: var(--cyan-light); margin-top: 4px;"></i>
            <span>${item}</span>
          </li>`
          )
          .join('');
      }

      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. INTERACTIVE RECRUITER & DEVELOPER TERMINAL
   ========================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const chips = document.querySelectorAll('.terminal-chip');

  if (!terminalInput || !terminalHistory) return;

  const commands = {
    help: `Available commands:
  • <span style="color:var(--cyan-light)">skills</span>      : Technical proficiencies & engineering stack
  • <span style="color:var(--cyan-light)">projects</span>    : Showcase production apps & case studies
  • <span style="color:var(--cyan-light)">hire</span>        : Why hire Syed, availability & interview links
  • <span style="color:var(--cyan-light)">stats</span>       : Speed metrics & Lighthouse performance
  • <span style="color:var(--cyan-light)">whoami</span>      : Recruiter personality profile
  • <span style="color:var(--cyan-light)">contact</span>     : Direct email & phone for fast responses
  • <span style="color:var(--cyan-light)">clear</span>       : Clear the console screen`,

    whoami: `<span style="color:#a78bfa">Identity Verified:</span> You are an engineering leader / hiring manager seeking a high-caliber frontend & full-stack software engineer who writes clean code and moves fast.`,

    skills: `<span style="color:var(--emerald-primary)">⚡ Core Engineering Stack:</span>
  • Frontend  : Next.js 15, React 19, TypeScript, Vanilla CSS, Tailwind CSS, Framer Motion
  • Backend   : Node.js, Express, REST APIs, GraphQL, C/C++ Systems Logic
  • Database  : PostgreSQL, MongoDB, Redis Distributed Caching
  • Tools     : Git/GitHub, Docker, Vercel Edge, Figma, Webpack/Turbopack`,

    projects: `<span style="color:var(--cyan-light)">🚀 Production Highlights:</span>
  1. <strong style="color:#fff">Programmers Planet</strong> (Next.js 15, TypeScript, AI) → <a href="https://www.programmersplanet.in" target="_blank" style="color:var(--cyan-light);text-decoration:underline;">programmersplanet.in</a>
  2. <strong style="color:#fff">Elite Guard Insurance</strong> (React, Framer Motion, Fintech) → <a href="https://eliteguardinsuranceservices.com" target="_blank" style="color:var(--cyan-light);text-decoration:underline;">eliteguardinsuranceservices.com</a>
  3. <strong style="color:#fff">Cine Media Platform</strong> (Next.js, Dark Mode, High Traffic) → <a href="https://www.cine-media.in" target="_blank" style="color:var(--cyan-light);text-decoration:underline;">cine-media.in</a>`,

    stats: `<span style="color:#34d399">📊 Engineering Performance Metrics:</span>
  • 99/100 Lighthouse Performance & Accessibility Scores
  • 15+ Web applications engineered & shipped
  • 0.4s First Contentful Paint (FCP) on modern edge CDN
  • 100% On-time milestone completion record`,

    hire: `<span style="color:#38bdf8">💼 Ready for Immediate Impact:</span>
  • <strong style="color:#fff">Status:</strong> Open to Full-Time & Contract Engineering Roles
  • <strong style="color:#fff">Email:</strong> syedarhaan436@gmail.com
  • <strong style="color:#fff">Phone:</strong> +91 7780889134
  • <strong style="color:#fff">Location:</strong> Srinagar, J&K (Available for Worldwide Remote & Relocation)
  • <a href="./SRC/Updated Resume.pdf" target="_blank" style="color:var(--cyan-light);text-decoration:underline;">[Download Official Resume PDF]</a>`,

    contact: `<span style="color:#f59e0b">📬 Direct Communication:</span>
  • Email: syedarhaan436@gmail.com
  • Phone / WhatsApp: +91 7780889134
  • LinkedIn: linkedin.com/in/syed-muzamil-qadri-219386221/
  • GitHub: github.com/Syedarhaan76`,

    clear: 'CLEAR_ACTION'
  };

  function executeCommand(cmdText) {
    const cleanCmd = cmdText.trim().toLowerCase();
    if (!cleanCmd) return;

    if (cleanCmd === 'clear') {
      terminalHistory.innerHTML = '';
      return;
    }

    const output =
      commands[cleanCmd] ||
      `<span style="color:#f87171">Command not recognized: '${cmdText}'. Type <strong style="color:var(--cyan-light)">help</strong> for available commands.</span>`;

    const entry = document.createElement('div');
    entry.style.marginBottom = '12px';
    entry.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
        <span style="color:var(--emerald-primary); font-weight:700;">visitor@portfolio:~$</span>
        <span style="color:#fff;">${cmdText}</span>
      </div>
      <div style="padding-left:14px; border-left:2px solid rgba(56,189,248,0.3); margin-top:4px;">${output}</div>
    `;

    terminalHistory.appendChild(entry);
    terminalHistory.scrollTop = terminalHistory.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

/* ==========================================================================
   6. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.metric-num[data-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 30);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   7. DYNAMIC CARD SPOTLIGHT
   ========================================================================== */
function initCardSpotlights() {
  const cards = document.querySelectorAll(
    '.project-card, .value-card, .skill-category-card, .edu-card, .testimonial-card'
  );

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   8. CONTACT FORM INTERACTIVITY
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please provide a valid email address.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
    submitBtn.disabled = true;

    // Simulate sending or submit to FormSubmit
    setTimeout(() => {
      showStatus(
        'Thank you! Your message has been sent successfully. I will get back to you within 24 hours.',
        'success'
      );
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1200);
  });

  function showStatus(text, type) {
    if (!statusMsg) return;
    statusMsg.className = `form-status-msg ${type}`;
    statusMsg.innerHTML =
      type === 'success'
        ? `<i class="fa-solid fa-circle-check"></i> ${text}`
        : `<i class="fa-solid fa-circle-exclamation"></i> ${text}`;
    statusMsg.style.display = 'flex';
  }
}
