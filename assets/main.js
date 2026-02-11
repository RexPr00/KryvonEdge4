const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.lang-select').forEach((select) => {
  select.addEventListener('change', (e) => {
    window.location.href = e.target.value;
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nav?.classList.remove('open');
  });
});

const amount = document.getElementById('amount');
const returnRate = document.getElementById('returnRate');
const years = document.getElementById('years');

const amountValue = document.getElementById('amountValue');
const returnValue = document.getElementById('returnValue');
const yearsValue = document.getElementById('yearsValue');

const projectedValue = document.getElementById('projectedValue');
const profitValue = document.getElementById('profitValue');
const gainValue = document.getElementById('gainValue');
const calcProgress = document.getElementById('calcProgress');

const formatCurrency = (num) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

function animateNumber(el, value, formatter = (v) => String(v)) {
  if (!el) return;
  const start = Number(el.dataset.current || 0);
  const end = Number(value);
  const duration = 450;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = start + (end - start) * progress;
    el.textContent = formatter(current);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.dataset.current = String(end);
    }
  };
  requestAnimationFrame(tick);
}

function updateCalculator() {
  if (!amount || !returnRate || !years) return;
  const principal = Number(amount.value);
  const annual = Number(returnRate.value) / 100;
  const term = Number(years.value);

  const projected = principal * (1 + annual) ** term;
  const profit = projected - principal;
  const gainPct = (profit / principal) * 100;

  amountValue.textContent = formatCurrency(principal);
  returnValue.textContent = `${annual * 100}%`;
  yearsValue.textContent = `${term} years`;

  animateNumber(projectedValue, projected, (v) => formatCurrency(v));
  animateNumber(profitValue, profit, (v) => formatCurrency(v));
  animateNumber(gainValue, gainPct, (v) => `${v.toFixed(1)}%`);

  const normalized = Math.min(100, Math.max(4, (gainPct / 220) * 100));
  if (calcProgress) calcProgress.style.width = `${normalized}%`;
}

[amount, returnRate, years].forEach((input) => input?.addEventListener('input', updateCalculator));
updateCalculator();

const assumptionBtn = document.querySelector('.assumption-toggle');
const assumptionContent = document.querySelector('.assumption-content');
if (assumptionBtn && assumptionContent) {
  assumptionBtn.addEventListener('click', () => {
    const expanded = assumptionBtn.getAttribute('aria-expanded') === 'true';
    assumptionBtn.setAttribute('aria-expanded', String(!expanded));
    assumptionBtn.textContent = expanded ? 'Show assumptions' : 'Hide assumptions';
    assumptionContent.hidden = expanded;
  });
}

const modal = document.getElementById('privacyModal');
const closeModalBtn = document.querySelector('.close-modal');

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function openModal() {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

document.querySelectorAll('[data-open-privacy]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

closeModalBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      animateNumber(el, target, (v) => `${Math.round(v)}`);
      observer.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.count-up').forEach((item) => observer.observe(item));

document.querySelectorAll('.contact-form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = form.querySelector('button');
    if (!button) return;
    const original = button.textContent;
    button.textContent = 'Submitted';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
      form.reset();
      updateCalculator();
    }, 1500);
  });
});
