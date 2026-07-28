'use strict';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// A short entrance transition keeps the first paint feeling intentional.
window.addEventListener('load', () => {
  window.setTimeout(() => $('.site-loader')?.classList.add('is-hidden'), 280);
});

// Sidebar controls remain compact on smaller screens.
const sidebar = $('[data-sidebar]');
$('[data-sidebar-btn]')?.addEventListener('click', () => sidebar?.classList.toggle('active'));

// Testimonials modal.
const modalContainer = $('[data-modal-container]');
const overlay = $('[data-overlay]');
const setModal = (open) => {
  modalContainer?.classList.toggle('active', open);
  overlay?.classList.toggle('active', open);
  document.body.classList.toggle('modal-open', open);
};

$$('[data-testimonials-item]').forEach((item) => {
  item.addEventListener('click', () => {
    const avatar = $('[data-testimonials-avatar]', item);
    const title = $('[data-testimonials-title]', item);
    const text = $('[data-testimonials-text]', item);
    const modalImg = $('[data-modal-img]');
    if (avatar && modalImg) {
      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
    }
    if (title) $('[data-modal-title]').textContent = title.textContent;
    if (text) $('[data-modal-text]').innerHTML = text.innerHTML;
    setModal(true);
  });
});

$$('[data-modal-close-btn], [data-overlay]').forEach((element) => {
  element.addEventListener('click', () => setModal(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setModal(false);
});

// Portfolio filtering.
const select = $('[data-select]');
const selectValue = $('[data-selecct-value]');
const filterItems = $$('[data-filter-item]');
const filterButtons = $$('[data-filter-btn]');

const filterProjects = (value) => {
  filterItems.forEach((item) => item.classList.toggle('active', value === 'all' || item.dataset.category === value));
};

select?.addEventListener('click', () => select.classList.toggle('active'));
$$('[data-select-item]').forEach((item) => {
  item.addEventListener('click', () => {
    const value = item.textContent.trim().toLowerCase();
    if (selectValue) selectValue.textContent = item.textContent;
    select?.classList.remove('active');
    filterProjects(value);
    filterButtons.forEach((button) => button.classList.toggle('active', button.textContent.trim().toLowerCase() === value));
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.textContent.trim().toLowerCase();
    filterProjects(value);
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    if (selectValue) selectValue.textContent = button.textContent;
  });
});

// Form state only; the static template intentionally does not submit data.
const form = $('[data-form]');
const formButton = $('[data-form-btn]');
$$('[data-form-input]').forEach((input) => {
  input.addEventListener('input', () => formButton?.toggleAttribute('disabled', !form?.checkValidity()));
});

// Page navigation with a gentle top reset and a simple programmable CTA target.
const navigationLinks = $$('[data-nav-link]');
const pages = $$('[data-page]');
const showPage = (pageName) => {
  const page = pages.find((item) => item.dataset.page === pageName);
  if (!page) return;

  pages.forEach((item) => item.classList.toggle('active', item === page));
  navigationLinks.forEach((link) => link.classList.toggle('active', link.textContent.trim().toLowerCase() === pageName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.setTimeout(initReveal, 120);
};

navigationLinks.forEach((link) => link.addEventListener('click', () => showPage(link.textContent.trim().toLowerCase())));
$$('[data-page-target]').forEach((button) => button.addEventListener('click', () => showPage(button.dataset.pageTarget)));

// Reveal content in a restrained way as it enters the viewport.
const revealTargets = [
  '.intro-hero', '.about-text', '.service-item', '.testimonials', '.clients',
  '.timeline', '.skill', '.project-item', '.blog-post-item', '.mapbox', '.contact-form'
];

revealTargets.forEach((selector) => $$(selector).forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${Math.min(index * 55, 280)}ms`);
}));

let revealObserver;
const initReveal = () => {
  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.active .reveal:not(.is-visible)').forEach((element) => revealObserver.observe(element));
};

initReveal();

// Soft parallax movement on the hero visual only; disabled for motion-sensitive users.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroVisual = $('.hero-visual');
if (!prefersReducedMotion && heroVisual) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    heroVisual.style.setProperty('--parallax-x', `${x}px`);
    heroVisual.style.setProperty('--parallax-y', `${y}px`);
  }, { passive: true });
}
