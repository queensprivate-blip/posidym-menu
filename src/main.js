import './styles.css';
import backgroundUrl from './lounge-background-original.jpg';
import logoUrl from './posidym-logo.png';

const app = document.querySelector('#app');

const venue = {
  address: 'Москва, ул. Центральная, 12',
  phone: '+7 (999) 123-45-67',
  hours: 'Вс–Чт 14:00–02:00 · Пт–Сб 14:00–04:00',
};

const menuData = {
  bar: {
    title: 'Бар',
    subtitle: 'Напитки, коктейли и чайная карта',
    categories: [
      {
        id: 'signature',
        title: 'Авторские коктейли',
        note: 'Фирменные сочетания от нашей барной команды',
        items: [
          { name: 'Royal Green', description: 'Джин, яблоко, базилик, цитрус', volume: '250 мл', price: 690, badge: 'Фирменный' },
          { name: 'Velvet Smoke', description: 'Виски, вишня, ваниль, лёгкая дымность', volume: '220 мл', price: 750 },
          { name: 'Посидым Sour', description: 'Бурбон, лимон, сахарный сироп, белок', volume: '180 мл', price: 650 },
        ],
      },
      {
        id: 'classic',
        title: 'Классические коктейли',
        note: 'Знакомая классика в спокойной подаче',
        items: [
          { name: 'Aperol Spritz', description: 'Апероль, игристое, содовая', volume: '300 мл', price: 650 },
          { name: 'Negroni', description: 'Джин, красный вермут, биттер', volume: '120 мл', price: 690 },
          { name: 'Whiskey Sour', description: 'Бурбон, лимон, сахарный сироп', volume: '180 мл', price: 650 },
        ],
      },
      {
        id: 'soft',
        title: 'Безалкогольные напитки',
        note: 'Лимонады, вода и прохладительные напитки',
        items: [
          { name: 'Домашний лимонад', description: 'Уточните доступные вкусы у официанта', volume: '400 мл', price: 390 },
          { name: 'Тоник', description: 'Классический или ягодный', volume: '250 мл', price: 290 },
          { name: 'Вода', description: 'Газированная или негазированная', volume: '500 мл', price: 250 },
        ],
      },
      {
        id: 'tea',
        title: 'Чай и кофе',
        note: 'Классические и авторские горячие напитки',
        items: [
          { name: 'Чай классический', description: 'Чёрный, зелёный или травяной', volume: '800 мл', price: 490 },
          { name: 'Чай авторский', description: 'Ягодный, облепиховый или цитрусовый', volume: '800 мл', price: 590, badge: 'Популярное' },
          { name: 'Американо', description: 'Двойной эспрессо и горячая вода', volume: '200 мл', price: 250 },
        ],
      },
    ],
  },
  hookah: {
    title: 'Кальяны',
    subtitle: 'Подберём вкус, крепость и чашу под ваше настроение',
    categories: [
      {
        id: 'classic-bowl',
        title: 'Классическая чаша',
        note: 'Сбалансированный кальян на классической чаше',
        items: [
          { name: 'Лёгкая крепость', description: 'Мягкий и ненавязчивый кальян', price: 1700 },
          { name: 'Средняя крепость', description: 'Выразительный вкус и комфортная плотность', price: 1900, badge: 'Популярное' },
          { name: 'Крепкий кальян', description: 'Плотная и насыщенная чашка', price: 2100 },
        ],
      },
      {
        id: 'premium-bowl',
        title: 'Премиальная чаша',
        note: 'Премиальные табаки и более сложные сочетания',
        items: [
          { name: 'Премиум Mix', description: 'Авторский микс на премиальных линейках', price: 2400 },
          { name: 'Тёмная чаша', description: 'Насыщенный профиль и повышенная крепость', price: 2700 },
        ],
      },
      {
        id: 'fruit',
        title: 'Кальян на фрукте',
        note: 'Яркая подача и более сочный вкус',
        items: [
          { name: 'На грейпфруте', description: 'Цитрусовая свежесть и насыщенная подача', price: 2900 },
          { name: 'На ананасе', description: 'Мягкая тропическая сладость', price: 3400 },
        ],
      },
      {
        id: 'extras',
        title: 'Дополнения',
        note: 'Дополнительные опции к кальяну',
        items: [
          { name: 'Замена чаши', description: 'Новая чаша без замены кальяна', price: 1200 },
          { name: 'Авторская подача', description: 'Особая сервировка и дополнительные элементы', price: 500 },
        ],
      },
    ],
  },
};

const promotions = [
  {
    type: 'Акция',
    title: 'Счастливые часы',
    text: 'По будням до 18:00 специальные условия на кальяны. Точные условия уточняйте у администратора.',
  },
  {
    type: 'Акция',
    title: 'День рождения',
    text: 'Специальное предложение для именинников при предварительном бронировании.',
  },
];

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
        <span class="brand-hint">Информация о заведении</span>
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
  return `
    <article class="product-card">
      <div class="product-copy">
        <div class="product-title-row">
          <h2>${esc(item.name)}</h2>
          ${item.badge ? `<span class="product-badge">${esc(item.badge)}</span>` : ''}
        </div>
        <p>${esc(item.description)}</p>
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
      <p class="menu-disclaimer">Демонстрационные позиции и цены. Реальное меню загрузим после утверждения структуры.</p>
    </section>`, { title: category.title, eyebrow: section.title });
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
            <article class="promotion-card">
              <small>${esc(promotion.type)}</small>
              <h3>${esc(promotion.title)}</h3>
              <p>${esc(promotion.text)}</p>
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
  if (section === 'hookah' && category) return categoryPage('hookah', category);
  if (section === 'bar') return menuOverview('bar');
  if (section === 'hookah') return menuOverview('hookah');
  if (section === 'info') return infoPage();
  if (section === 'home' || !section) return home();
  return notFound();
}

window.addEventListener('hashchange', route);
route();
