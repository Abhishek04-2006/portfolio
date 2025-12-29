// script.js — simple load/test script
console.log('script.js loaded');

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  // 1) Update header/site title
  const headerName = document.querySelector('header nav h1');
  if (headerName) headerName.textContent = 'Abhishek Kumar Tiwari';

  // 2) Update hero content
  const heroTitle = document.querySelector('.hero h1');
  const heroSub = document.querySelector('.hero p');
  if (heroTitle) heroTitle.textContent = 'Hello — I build web experiences';
  if (heroSub) heroSub.textContent = 'Frontend & Full‑stack Developer — crafting usable interfaces';

  // 3) Style and annotate skill tags
  const skills = document.querySelectorAll('.skill-tag');
  skills.forEach((el) => {
    el.style.backgroundColor = '#5a6fe8';
    el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
    el.title = `Skill: ${el.textContent.trim()}`;
  });

  // 4) Inject helper styles for interactive states
  const injected = document.createElement('style');
  injected.textContent = `
    .project-card.selected { transform: translateY(-6px); box-shadow: 0 8px 20px rgba(0,0,0,0.12); border-left: 4px solid #667eea; background:#fff; }
    .project-card.hovered { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.10); }
    .skill-tag.enhanced { padding: 0.6rem 1.2rem; font-weight:600; }
  `;
  document.head.appendChild(injected);

  // 5) Make project cards interactive: click to toggle selected state
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const title = card.querySelector('h3')?.textContent?.trim() || 'project';
      console.log(`Toggled project: ${title}`);
    });
    card.addEventListener('mouseenter', () => {
      card.classList.add('hovered');
      console.log('project hover on:', card.querySelector('h3')?.textContent?.trim());
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovered');
    });
  });

  // 6) Update footer year dynamically
  const footerP = document.querySelector('footer p');
  if (footerP) {
    const year = new Date().getFullYear();
    footerP.innerHTML = `&copy; ${year} Abhishek Kumar Tiwari. All rights reserved.`;
  }

  // 7) Skill tag hover interactions
  skills.forEach((tag) => {
    tag.addEventListener('mouseenter', () => tag.classList.add('enhanced'));
    tag.addEventListener('mouseleave', () => tag.classList.remove('enhanced'));
  });

  // 8) Contact form handling: open link, submit
  const openContact = document.getElementById('open-contact');
  const contactForm = document.getElementById('contact-form');
  const statusP = document.getElementById('cf-status');
  const nameField = document.getElementById('cf-name');
  const emailField = document.getElementById('cf-email');
  const messageField = document.getElementById('cf-message');
  const submitBtn = document.getElementById('cf-submit');

  if (openContact && nameField) {
    openContact.addEventListener('click', (e) => {
      e.preventDefault();
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nameField.focus();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        statusP.style.display = 'block';
        statusP.style.color = 'crimson';
        statusP.textContent = 'Please fill in all fields.';
        return;
      }

      statusP.style.display = 'block';
      statusP.style.color = '#333';
      statusP.textContent = 'Sending message...';
      console.log('Contact form submit:', { name, email, message });

      // Simulate async send
      setTimeout(() => {
        statusP.style.color = 'green';
        statusP.textContent = 'Message sent — thank you! (simulated)';
        contactForm.reset();
        try { localStorage.removeItem('contact-draft'); } catch (err) { /* ignore */ }
      }, 900);
    });
  }

  // autosave contact draft
  try {
    const draftKey = 'contact-draft';
    function saveDraft() {
      try {
        const draft = { name: nameField?.value || '', email: emailField?.value || '', message: messageField?.value || '' };
        localStorage.setItem(draftKey, JSON.stringify(draft));
      } catch (e) { /* ignore */ }
    }
    function debounce(fn, wait = 300) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; }
    const saveDraftDebounced = debounce(saveDraft, 300);
    [nameField, emailField, messageField].forEach(f => { if (f) f.addEventListener('input', saveDraftDebounced); });
    const raw = localStorage.getItem(draftKey);
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj) {
        if (nameField && obj.name) nameField.value = obj.name;
        if (emailField && obj.email) emailField.value = obj.email;
        if (messageField && obj.message) messageField.value = obj.message;
      }
    }
  } catch (e) { /* ignore */ }

  // 9) Theme toggle: dark/light with persistence
  const themeToggle = document.getElementById('theme-toggle');
  const rootHtml = document.documentElement;
  function applyTheme(t) {
    if (t === 'dark') rootHtml.classList.add('dark'); else rootHtml.classList.remove('dark');
    if (themeToggle) themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
    if (themeToggle) themeToggle.setAttribute('aria-pressed', t === 'dark');
  }
  // load saved theme
  const saved = localStorage.getItem('site-theme');
  if (saved) applyTheme(saved);
  else {
    // prefer dark if user prefers-color-scheme
    const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(preferDark ? 'dark' : 'light');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = rootHtml.classList.contains('dark');
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('site-theme', next);
    });
  }

  // 10) Gallery / Lightbox behavior
  const galleryImgs = Array.from(document.querySelectorAll('.gallery img'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.querySelector('.lb-close');
  const lbPrev = document.querySelector('.lb-prev');
  const lbNext = document.querySelector('.lb-next');
  let currentIndex = 0;
  // restore last viewed gallery index so navigation starts there
  try {
    const savedGallery = localStorage.getItem('gallery-last');
    if (savedGallery !== null) {
      const si = parseInt(savedGallery, 10);
      if (!Number.isNaN(si) && si >= 0 && si < galleryImgs.length) currentIndex = si;
    }
  } catch (e) { /* ignore */ }

  function openLightbox(index) {
    const img = galleryImgs[index];
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbCaption.textContent = img.dataset.caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    currentIndex = index;
    try { localStorage.setItem('gallery-last', String(currentIndex)); } catch (e) { /* ignore */ }
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    lbCaption.textContent = '';
  }
  function showNext(dir = 1) {
    currentIndex = (currentIndex + dir + galleryImgs.length) % galleryImgs.length;
    openLightbox(currentIndex);
  }

  galleryImgs.forEach((g, i) => {
    g.addEventListener('click', () => openLightbox(i));
  });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => showNext(-1));
  if (lbNext) lbNext.addEventListener('click', () => showNext(1));
  // close on overlay click
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  // keyboard
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext(1);
    if (e.key === 'ArrowLeft') showNext(-1);
  });

  // 11) Persist project-card selections and restore on load
  const projectsStorageKey = 'projects-selected';
  function loadSelectedProjects() {
    try {
      const raw = localStorage.getItem(projectsStorageKey);
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return;
      projectCards.forEach((card, idx) => {
        if (arr.includes(String(idx)) || arr.includes(idx)) card.classList.add('selected');
      });
    } catch (e) { /* ignore */ }
  }

  function saveSelectedProjects() {
    try {
      const arr = [];
      projectCards.forEach((card, idx) => { if (card.classList.contains('selected')) arr.push(String(idx)); });
      localStorage.setItem(projectsStorageKey, JSON.stringify(arr));
    } catch (e) { /* ignore */ }
  }
  // wire saving when toggling selection
  projectCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      // saving handled after toggle in existing handler; ensure persisted
      saveSelectedProjects();
    });
  });
  // restore selections once
  loadSelectedProjects();

  console.log('DOM manipulation complete');
});
