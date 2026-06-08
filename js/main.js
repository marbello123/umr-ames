/* ============================================================
   UMR-AMES — Script principal
   - Menu mobile
   - Surlignage du lien actif au défilement (scroll-spy)
   - Ombre de l'en-tête au défilement
   - Bouton « retour en haut »
   - Compteurs animés (chiffres-clés)
   - Animations d'apparition au défilement
   - Filtres dynamiques (membres + publications)
   - Formulaire de contact (mailto)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 0. Détection de la langue (fr par défaut) ---------- */
  const LANG = (document.documentElement.lang || 'fr').toLowerCase().startsWith('en') ? 'en' : 'fr';
  const T = {
    fr: {
      open: 'Ouvrir le menu', close: 'Fermer le menu',
      mailSubject: name => `Contact site UMR-AMES — ${name}`,
      mailBody: (name, email, msg) => `Nom : ${name}\nEmail : ${email}\n\n${msg}`
    },
    en: {
      open: 'Open menu', close: 'Close menu',
      mailSubject: name => `UMR-AMES website contact — ${name}`,
      mailBody: (name, email, msg) => `Name: ${name}\nEmail: ${email}\n\n${msg}`
    }
  }[LANG];

  /* ---------- 1. Année dans le pied de page ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Menu mobile ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const open = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? T.close : T.open);
    });

    // Ferme le menu après un clic sur un lien (mobile)
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. Ombre de l'en-tête + bouton retour ---------- */
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (backToTop) backToTop.classList.toggle('show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- 4. Scroll-spy : lien actif selon la section visible ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.primary-nav a');

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(sec => spy.observe(sec));
  }

  /* ---------- 5. Animations d'apparition ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // léger décalage progressif pour les éléments d'un même groupe
          entry.target.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- 6. Compteurs animés (chiffres-clés) ---------- */
  const counters = document.querySelectorAll('.stat-num[data-count]');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easing out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length && 'IntersectionObserver' in window) {
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => countObs.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.count);
  }

  /* ---------- 7. Filtre des membres ---------- */
  const memberFilter = document.getElementById('memberFilter');
  const noResults = document.getElementById('noResults');

  if (memberFilter) {
    memberFilter.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      const rows = document.querySelectorAll('#membersTable tbody tr');
      let visible = 0;
      rows.forEach(row => {
        const match = row.textContent.toLowerCase().includes(q);
        row.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (noResults) noResults.hidden = visible !== 0;
    });
  }

  /* ---------- 8. Filtre des publications ---------- */
  const pubFilter = document.getElementById('pubFilter');
  const noPubResults = document.getElementById('noPubResults');

  if (pubFilter) {
    pubFilter.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      const items = document.querySelectorAll('#pubList .pub-item');
      let visible = 0;
      items.forEach(item => {
        const match = item.textContent.toLowerCase().includes(q);
        item.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (noPubResults) noPubResults.hidden = visible !== 0;
    });
  }

  /* ---------- 9. Formulaire de contact (mailto sur site statique) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const message = document.getElementById('cf-msg').value.trim();
      const subject = encodeURIComponent(T.mailSubject(name));
      const body = encodeURIComponent(T.mailBody(name, email, message));
      window.location.href = `mailto:contact@ames-univ-nkc.mr?subject=${subject}&body=${body}`;
    });
  }

});
