import './styles.css';
import backgroundUrl from './lounge-background-premium.webp';
import logoUrl from './posidym-logo-premium.png';
import hookahClassicUrl from './hookah-images/classic.webp';
import hookahGrapefruitUrl from './hookah-images/grapefruit.webp';
import hookahAuthorUrl from './hookah-images/author.webp';
import hookahElectroUrl from './hookah-images/electro.webp';
import hookahExclusiveUrl from './hookah-images/exclusive.webp';
import hookahPremiumUrl from './hookah-images/premium.webp';
import { barCategories, importedPromotions } from './menu-data.js';

const app = document.querySelector('#app');

const venue = {
  address: 'Москва, ул. Центральная, 12',
  phone: '+7 (999) 123-45-67',
  hours: 'Вс–Чт 14:00–02:00 · Пт–Сб 14:00–04:00',
};

const menuData = {
  bar: {
    title: 'Бар',
    subtitle: 'Напитки, алкоголь, коктейли, закуски и десерты',
    categories: barCategories,
  },
};


const hookahItems = [
  {
    name: 'Классический кальян',
    description: 'Традиционная подача и мягкий, сбалансированный вкус.',
    price: 2150,
    image: hookahClassicUrl,
  },
  {
    name: 'На грейпфруте',
    description: 'Сочная цитрусовая подача с более ярким ароматом.',
    price: 2600,
    image: hookahGrapefruitUrl,
  },
  {
    name: 'Авторский',
    description: 'Фирменное сочетание вкусов и особая подача от мастера.',
    price: 2800,
    image: hookahAuthorUrl,
  },
  {
    name: 'Электронная чаша',
    description: 'Современный нагрев, стабильный вкус и чистая подача.',
    price: 3000,
    image: hookahElectroUrl,
  },
  {
    name: 'Эксклюзивный',
    description: 'Премиальная подача, редкие сочетания и максимум внимания к деталям.',
    price: 3500,
    image: hookahExclusiveUrl,
  },
  {
    name: 'Добавка премиум табаков',
    description: 'Дополнение к выбранному кальяну премиальными линейками табака.',
    price: 450,
    image: hookahPremiumUrl,
  },
];

const promotions = importedPromotions;

const rules = [
  { title: 'Только 18+', text: 'При посещении заведения администратор вправе попросить документ, подтверждающий возраст.' },
  { title: 'Бронирование', text: 'Стол считается забронированным после подтверждения администратора. Для отдельных дат возможен депозит.' },
  { title: 'Время брони', text: 'При опоздании более чем на 15 минут бронь может быть отменена, если вы не предупредили администратора.' },
  { title: 'Поведение гостей', text: 'Просим бережно относиться к имуществу заведения и уважительно общаться с другими гостями и персоналом.' },
];

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const money = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

function icon(type) {
  const icons = {
    bar: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 10h28L25 26v12h8v4H15v-4h8V26L10 10Z"/><path d="M15 15h18"/><circle cx="34" cy="11" r="4"/></svg>',
    hookah: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M20 7h8M22 11h4v7l5 6v8H17v-8l5-6v-7ZM18 36h12l3 5H15l3-5Z"/><path d="M30 27c9-2 11 7 5 10"/></svg>',
    info: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 15h24l8 8-17 17L8 25V15Z"/><circle cx="16" cy="22" r="2"/><path d="M29 17 17 35M18 19h.01M29 33h.01"/></svg>',
  };
  return icons[type] || icons.info;
}

function setRoute(route) {
  window.location.hash = route;
}

function bindRoutes() {
  document.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => setRoute(button.dataset.route));
  });

  document.querySelector('[data-back]')?.addEventListener('click', () => {
    if (window.history.length > 1) window.history.back();
    else setRoute('#home');
  });

  const venueDialog = document.querySelector('#venue-dialog');
  document.querySelector('[data-venue-open]')?.addEventListener('click', () => {
    venueDialog?.showModal();
  });
  document.querySelector('[data-venue-close]')?.addEventListener('click', () => {
    venueDialog?.close();
  });
  venueDialog?.addEventListener('click', (event) => {
    if (event.target === venueDialog) venueDialog.close();
  });
}


function initHookahCarousel() {
  const track = document.querySelector('[data-hookah-track]');
  const dots = [...document.querySelectorAll('[data-hookah-dot]')];
  if (!track || !dots.length) return;

  const slides = [...track.querySelectorAll('.hookah-slide')];
  let frame = 0;

  const setActive = (index) => {
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  const nearestSlide = () => {
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    slides.forEach((slide, index) => {
      const center = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(center - trackCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    setActive(bestIndex);
  };

  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(nearestSlide);
  }, { passive: true });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      slides[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });

  requestAnimationFrame(() => {
    slides[0]?.scrollIntoView({ inline: 'center', block: 'nearest' });
    setActive(0);
  });
}

function shell(content, { home = false, title = '', eyebrow = '' } = {}) {
  app.innerHTML = `
    <main class="site ${home ? 'home-page' : 'inner-page'}" style="--hero-image:url('${backgroundUrl}')">
      ${home ? '' : `
        <header class="inner-header">
          <button class="round-button" data-back aria-label="Назад">‹</button>
          <div class="inner-heading">
            ${eyebrow ? `<span>${esc(eyebrow)}</span>` : ''}
            <h1>${esc(title)}</h1>
          </div>
          <span class="round-button ghost" aria-hidden="true"></span>
        </header>`}
      ${content}
    </main>`;
  bindRoutes();
}

function homeCard(title, route, type, subtitle) {
  return `
    <button class="home-card" data-route="${route}">
      <span class="home-card-icon">${icon(type)}</span>
      <span class="home-card-copy">
        <strong>${esc(title)}</strong>
        <small>${esc(subtitle)}</small>
      </span>
      <span class="home-card-arrow">›</span>
    </button>`;
}

function home() {
  shell(`
    <section class="home-content">
      <button class="brand-trigger" type="button" data-venue-open aria-label="Открыть информацию о заведении">
        <img class="brand-logo" src="${logoUrl}" alt="Посидым Lounge">
      </button>

      <nav class="home-menu" aria-label="Разделы меню">
        ${homeCard('Бар', '#bar', 'bar', 'Коктейли, напитки и чай')}
        ${homeCard('Кальяны', '#hookah', 'hookah', 'Вкусы, чаши и дополнения')}
        ${homeCard('Акции и правила', '#info', 'info', 'Предложения и важная информация')}
      </nav>

      <dialog class="venue-dialog" id="venue-dialog" aria-labelledby="venue-dialog-title">
        <div class="venue-dialog-card">
          <button class="venue-dialog-close" type="button" data-venue-close aria-label="Закрыть">×</button>
          <img class="venue-dialog-logo" src="${logoUrl}" alt="">
          <div class="venue-dialog-heading">
            <span>Кальянная и бар</span>
            <h2 id="venue-dialog-title">Посидым Lounge</h2>
          </div>
          <div class="venue-details">
            <a href="https://maps.google.com/?q=${encodeURIComponent(venue.address)}">
              <span>Адрес</span><strong>${esc(venue.address)}</strong>
            </a>
            <a href="tel:${venue.phone.replace(/[^+\d]/g, '')}">
              <span>Телефон</span><strong>${esc(venue.phone)}</strong>
            </a>
            <div>
              <span>Режим работы</span><strong>${esc(venue.hours)}</strong>
            </div>
          </div>
        </div>
      </dialog>
    </section>`, { home: true });
}

function categoryCard(sectionKey, category) {
  return `
    <button class="category-card" data-route="#${sectionKey}/${category.id}">
      <span class="category-index">${String(menuData[sectionKey].categories.indexOf(category) + 1).padStart(2, '0')}</span>
      <span class="category-copy">
        <strong>${esc(category.title)}</strong>
        <small>${esc(category.note)}</small>
      </span>
      <span class="category-arrow">›</span>
    </button>`;
}

function menuOverview(sectionKey) {
  const section = menuData[sectionKey];
  shell(`
    <section class="inner-content">
      <p class="section-subtitle">${esc(section.subtitle)}</p>
      <div class="category-list">
        ${section.categories.map((category) => categoryCard(sectionKey, category)).join('')}
      </div>
    </section>`, { title: section.title, eyebrow: 'Меню' });
}

function productCard(item) {
  const hasImage = Boolean(item.image);
  return `
    <article class="product-card${hasImage ? ' has-image' : ''}">
      ${hasImage ? `
        <div class="product-media">
          <img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" decoding="async">
        </div>` : ''}
      <div class="product-copy">
        <div class="product-title-row">
          <h2>${esc(item.name)}</h2>
          ${item.badge ? `<span class="product-badge">${esc(item.badge)}</span>` : ''}
        </div>
        ${item.description ? `<p>${esc(item.description)}</p>` : ''}
        ${item.volume ? `<small>${esc(item.volume)}</small>` : ''}
      </div>
      <strong class="product-price">${money(item.price)}</strong>
    </article>`;
}

function categoryPage(sectionKey, categoryId) {
  const section = menuData[sectionKey];
  const category = section.categories.find((entry) => entry.id === categoryId);
  if (!category) return notFound();

  shell(`
    <section class="inner-content category-page">
      <p class="section-subtitle">${esc(category.note)}</p>
      <div class="product-list">
        ${category.items.map(productCard).join('')}
      </div>
      <p class="menu-disclaimer">Позиции, цены и доступные фотографии перенесены из действующего электронного меню.</p>
    </section>`, { title: category.title, eyebrow: section.title });
}


function hookahPage() {
  shell(`
    <section class="hookah-page" aria-label="Меню кальянов">
      <p class="hookah-intro">Листайте карточки свайпом и выбирайте подходящую подачу.</p>
      <div class="hookah-carousel" data-hookah-track>
        ${hookahItems.map((item) => `
          <article class="hookah-slide" style="--hookah-image:url('${item.image}')">
            <div class="hookah-slide-copy">
              <h2>${esc(item.name)}</h2>
              <span class="hookah-divider" aria-hidden="true"></span>
              <p>${esc(item.description)}</p>
              <strong>${money(item.price)}</strong>
            </div>
          </article>`).join('')}
      </div>
      <div class="hookah-dots" aria-label="Выбор позиции">
        ${hookahItems.map((item, index) => `
          <button type="button" data-hookah-dot class="hookah-dot${index === 0 ? ' is-active' : ''}" aria-label="${esc(item.name)}" aria-current="${index === 0 ? 'true' : 'false'}"></button>`).join('')}
      </div>
      <p class="hookah-note">Крепость и вкусовой профиль можно подобрать вместе с кальянным мастером.</p>
    </section>`, { title: 'Кальяны' });
  initHookahCarousel();
}

function infoPage() {
  shell(`
    <section class="inner-content">
      <p class="section-subtitle">Специальные предложения и важная информация для гостей</p>

      <section class="content-section">
        <div class="content-section-heading">
          <span>01</span>
          <h2>Акции</h2>
        </div>
        <div class="promotion-grid">
          ${promotions.map((promotion) => `
            <article class="promotion-card${promotion.image ? ' has-image' : ''}">
              ${promotion.image ? `<img src="${esc(promotion.image)}" alt="" loading="lazy" decoding="async">` : ''}
              <div class="promotion-card-copy">
                <small>${esc(promotion.type)}</small>
                <h3>${esc(promotion.title)}</h3>
                <p>${esc(promotion.text)}</p>
              </div>
            </article>`).join('')}
        </div>
      </section>

      <section class="content-section rules-section">
        <div class="content-section-heading">
          <span>02</span>
          <h2>Правила</h2>
        </div>
        <div class="rules-list">
          ${rules.map((rule, index) => `
            <article class="rule-card">
              <span>${String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>${esc(rule.title)}</h3>
                <p>${esc(rule.text)}</p>
              </div>
            </article>`).join('')}
        </div>
      </section>
    </section>`, { title: 'Акции и правила', eyebrow: 'Информация' });
}

function notFound() {
  shell(`
    <section class="inner-content empty-state">
      <span>404</span>
      <h2>Раздел не найден</h2>
      <button data-route="#home">Вернуться в начало</button>
    </section>`, { title: 'Ошибка' });
}

function route() {
  const current = window.location.hash || '#home';
  const clean = current.slice(1);
  const [section, category] = clean.split('/');

  if (section === 'bar' && category) return categoryPage('bar', category);
  if (section === 'hookah' && category) return hookahPage();
  if (section === 'bar') return menuOverview('bar');
  if (section === 'hookah') return hookahPage();
  if (section === 'info') return infoPage();
  if (section === 'home' || !section) return home();
  return notFound();
}

window.addEventListener('hashchange', route);
route();
