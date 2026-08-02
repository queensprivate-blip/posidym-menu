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
import { supabase } from './supabase-client.js';

const app = document.querySelector('#app');

const venue = {
  address: 'Москва, ул. Центральная, 12',
  phone: '+7 (999) 123-45-67',
  hours: 'Вс–Чт 14:00–02:00 · Пт–Сб 14:00–04:00',
  reviewUrl: 'https://yandex.ru/maps/?text=%D0%9F%D0%BE%D1%81%D0%B8%D0%B4%D1%8B%D0%BC%20Lounge',
};

const categoryById = Object.fromEntries(barCategories.map((category) => [category.id, category]));

const groupedBarCategories = [
  {
    id: 'soft-tea-coffee',
    title: 'Напитки, чай и кофе',
    note: 'Безалкогольные напитки, чайные подачи и кофе',
    sections: [categoryById['vdsiob-uwa'], categoryById['tpzfbqwhfe'], categoryById['vgejqoyhou'], categoryById['bjhbvwhhq-'], categoryById['jlabxgucjm']].filter(Boolean),
  },
  {
    id: 'beer-wine',
    title: 'Пиво и вино',
    note: 'Пиво, сидр, тихие и игристые вина',
    sections: [categoryById['uhomlq-uur'], categoryById['mcwxofzjor'], categoryById['faebghfnif'], categoryById['ckwsbynkaa']].filter(Boolean),
  },
  {
    id: 'strong-alcohol',
    title: 'Крепкий алкоголь',
    note: 'Виски, водка, настойки и другие крепкие напитки',
    sections: [categoryById['vabrnaxbka'], categoryById['pc-mfaoysx'], categoryById['unwppmnaty'], categoryById['oddjbxha-b'], categoryById['huvdrclwbz'], categoryById['whyrjhpgtm'], categoryById['g-e-wegcug'], categoryById['lvbnegxo-i'], categoryById['vtmh-rtiff']].filter(Boolean),
  },
  {
    id: 'cocktails',
    title: 'Коктейли',
    note: 'Классические и авторские коктейли',
    sections: [categoryById['euazcndqwm']].filter(Boolean),
  },
  {
    id: 'food-desserts',
    title: 'Кухня и десерты',
    note: 'Закуски, пицца и десерты',
    sections: [categoryById['futdsvldkq'], categoryById['bifsxyjojt'], categoryById['hijuf-uq-n']].filter(Boolean),
  },
];

function remoteKey(type, section, name) {
  const slug = String(name).toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, '');
  return `${type}:${section}:${slug}`;
}
barCategories.forEach((category) => category.items.forEach((item) => { item.remoteKey = remoteKey('bar', category.id, item.name); }));

const menuData = {
  bar: {
    title: 'Бар',
    subtitle: 'Всё меню собрано в пяти понятных разделах',
    categories: groupedBarCategories,
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
hookahItems.forEach((item) => { item.remoteKey = remoteKey('hookah', 'hookah', item.name); });

const promotions = importedPromotions;

const rules = [
  { title: 'Только 18+', text: 'При посещении заведения администратор вправе попросить документ, подтверждающий возраст.' },
  { title: 'Бронирование', text: 'Стол считается забронированным после подтверждения администратора. Для отдельных дат возможен депозит.' },
  { title: 'Время брони', text: 'При опоздании более чем на 15 минут бронь может быть отменена, если вы не предупредили администратора.' },
  { title: 'Поведение гостей', text: 'Просим бережно относиться к имуществу заведения и уважительно общаться с другими гостями и персоналом.' },
  { title: 'Кальянная подача', text: 'Для комфортного отдыха действует минимальное количество кальянов на компанию: для 1–3 гостей — 1 кальян, для 3–5 гостей — 2 кальяна, для компаний от 5 гостей — 3 кальяна. Стандартное время курения одного кальяна составляет до 2 часов.' },
];

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const money = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

const CHOICE_STORAGE_KEY = 'posidym-choice-v1';
const ADMIN_STORAGE_KEY = 'posidym-admin-overrides-v1';
let remoteMenuItems = new Map();
let adminSession = null;
let backendStatus = 'loading';


function readAdminOverrides() {
  try {
    const value = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function writeAdminOverrides(value) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(value));
}

function effectiveItem(item) {
  const remote = remoteMenuItems.get(item.remoteKey) || {};
  const local = readAdminOverrides()[choiceId(item)] || {};
  return {
    ...item,
    name: remote.name ?? item.name,
    description: remote.description ?? item.description,
    price: Number.isFinite(Number(remote.price)) ? Number(remote.price) : (Number.isFinite(Number(local.price)) ? Number(local.price) : item.price),
    image: remote.image_url || item.image,
    hidden: remote.available === false || local.hidden === true,
  };
}

function allEditableItems() {
  const result = [];
  barCategories.forEach((category) => {
    category.items.forEach((item) => result.push({ section: category.title, type: 'Бар', item }));
  });
  hookahItems.forEach((item) => result.push({ section: 'Кальяны', type: 'Кальяны', item }));
  return result;
}

function isAdminAuthenticated() { return Boolean(adminSession?.user); }

function choiceId(item) {
  const source = item.image || `${item.name}-${item.price}`;
  return String(source).replace(/[^a-zA-Zа-яА-Я0-9_-]+/g, '-').replace(/^-|-$/g, '');
}

function getChoiceCatalog() {
  const catalog = new Map();
  const add = (item) => { const effective = effectiveItem(item); if (!effective.hidden) catalog.set(choiceId(item), effective); };
  menuData.bar.categories.forEach((category) => {
    if (category.sections) category.sections.forEach((section) => section.items.forEach(add));
    else category.items?.forEach(add);
  });
  hookahItems.forEach(add);
  return catalog;
}

function readChoice() {
  try {
    const value = JSON.parse(localStorage.getItem(CHOICE_STORAGE_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter((id) => typeof id === 'string'))] : [];
  } catch {
    return [];
  }
}

function writeChoice(ids) {
  localStorage.setItem(CHOICE_STORAGE_KEY, JSON.stringify([...new Set(ids)]));
}

function updateChoiceUI() {
  const selected = new Set(readChoice());
  document.querySelectorAll('[data-choice-count]').forEach((badge) => {
    badge.textContent = String(selected.size);
    badge.hidden = selected.size === 0;
  });
  document.querySelectorAll('[data-choice-add]').forEach((button) => {
    const active = selected.has(button.dataset.choiceAdd);
    button.classList.toggle('is-added', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    const label = button.querySelector('[data-choice-label]');
    if (label) label.textContent = active ? 'Добавлено' : 'Добавить';
  });
}

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

  document.querySelectorAll('[data-menu-jump]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.menuJump);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-choice-add]').forEach((button) => {
    button.addEventListener('click', () => {
      const ids = readChoice();
      const id = button.dataset.choiceAdd;
      writeChoice(ids.includes(id) ? ids.filter((entry) => entry !== id) : [...ids, id]);
      updateChoiceUI();
    });
  });

  document.querySelectorAll('[data-choice-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      writeChoice(readChoice().filter((id) => id !== button.dataset.choiceRemove));
      choicePage();
    });
  });

  document.querySelector('[data-choice-clear]')?.addEventListener('click', () => {
    writeChoice([]);
    choicePage();
  });


  document.querySelector('[data-admin-login]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');
    const errorNode = document.querySelector('[data-admin-error]');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (errorNode) { errorNode.textContent = error.message; errorNode.hidden = false; }
      return;
    }
    adminSession = data.session;
    adminPage();
  });

  document.querySelector('[data-admin-logout]')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    adminSession = null;
    adminPage();
  });

  document.querySelectorAll('[data-admin-save]').forEach((button) => {
    button.addEventListener('click', async () => {
      button.disabled = true;
      const updates = [...document.querySelectorAll('[data-admin-item]')].map((row) => ({
        item_key: row.dataset.adminItem,
        price: Math.max(0, Number(row.querySelector('[data-admin-price]')?.value || 0)),
        available: Boolean(row.querySelector('[data-admin-available]')?.checked),
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from('menu_items').upsert(updates, { onConflict: 'item_key' });
      const status = document.querySelector('[data-admin-status]');
      if (status) {
        status.textContent = error ? `Ошибка: ${error.message}` : 'Изменения сохранены и доступны всем гостям';
        status.hidden = false;
      }
      if (!error) await loadRemoteMenu();
      button.disabled = false;
    });
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

  const reviewDialog = document.querySelector('#review-dialog');
  document.querySelector('[data-review-open]')?.addEventListener('click', () => {
    reviewDialog?.showModal();
  });
  document.querySelector('[data-review-close]')?.addEventListener('click', () => {
    reviewDialog?.close();
  });
  reviewDialog?.addEventListener('click', (event) => {
    if (event.target === reviewDialog) reviewDialog.close();
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

function initPromotionCarousel() {
  const track = document.querySelector('[data-promotion-track]');
  const dots = [...document.querySelectorAll('[data-promotion-dot]')];
  if (!track || !dots.length) return;

  const slides = [...track.querySelectorAll('.promotion-slide')];
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
          <button class="round-button choice-header-button" type="button" data-route="#choice" aria-label="Мой выбор" title="Мой выбор">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>
            <span class="choice-count" data-choice-count hidden>0</span>
          </button>
        </header>`}
      ${content}
    </main>`;
  bindRoutes();
  updateChoiceUI();
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
    <header class="home-header">
      <button class="round-button review-header-button" type="button" data-review-open aria-label="Оставить отзыв" title="Оставить отзыв">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H10l-5 4v-4.5A2.5 2.5 0 0 1 4 12.5v-7Z"/><path d="M8 8.5h8M8 11.5h5"/></svg>
      </button>
      <button class="round-button choice-header-button" type="button" data-route="#choice" aria-label="Мой выбор" title="Мой выбор">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>
        <span class="choice-count" data-choice-count hidden>0</span>
      </button>
    </header>
    <section class="home-content">
      <button class="brand-trigger" type="button" data-venue-open aria-label="Открыть информацию о заведении">
        <img class="brand-logo" src="${logoUrl}" alt="Посидым Lounge">
      </button>

      <nav class="home-menu" aria-label="Разделы меню">
        ${homeCard('Бар', '#bar', 'bar', 'Коктейли, напитки и чай')}
        ${homeCard('Кальяны', '#hookah', 'hookah', 'Вкусы, чаши и дополнения')}
        ${homeCard('Акции и правила', '#info', 'info', 'Предложения и важная информация')}
      </nav>


      <dialog class="review-dialog" id="review-dialog" aria-labelledby="review-dialog-title">
        <div class="review-dialog-card">
          <button class="venue-dialog-close" type="button" data-review-close aria-label="Закрыть">×</button>
          <div class="review-dialog-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H10l-5 4v-4.5A2.5 2.5 0 0 1 4 12.5v-7Z"/><path d="m9 9 2 2 4-4"/></svg>
          </div>
          <div class="review-dialog-heading">
            <span>Нам важно ваше мнение</span>
            <h2 id="review-dialog-title">Оставить отзыв</h2>
          </div>
          <p>Если вам всё понравилось или у вас есть предложения, поделитесь впечатлениями о нас. Ваш отзыв помогает нам становиться лучше, и мы будем вам очень благодарны.</p>
          <a class="review-dialog-link" href="${esc(venue.reviewUrl)}" target="_blank" rel="noopener noreferrer">Перейти к отзыву в картах</a>
        </div>
      </dialog>

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
    <section class="inner-content compact-top">
      <div class="category-list">
        ${section.categories.map((category) => categoryCard(sectionKey, category)).join('')}
      </div>
    </section>`, { title: section.title, eyebrow: 'Меню' });
}

function productCard(sourceItem) {
  const item = effectiveItem(sourceItem);
  if (item.hidden) return '';
  const hasImage = Boolean(item.image);
  const id = choiceId(sourceItem);
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
      <div class="product-actions">
        <strong class="product-price">${money(item.price)}</strong>
        <button class="choice-add-button" type="button" data-choice-add="${esc(id)}" aria-pressed="false">
          <span aria-hidden="true">＋</span><span data-choice-label>Добавить</span>
        </button>
      </div>
    </article>`;
}

function categoryPage(sectionKey, categoryId) {
  const section = menuData[sectionKey];
  const category = section.categories.find((entry) => entry.id === categoryId);
  if (!category) return notFound();

  const quickNavigation = category.sections?.length > 1
    ? `<nav class="menu-quick-nav" aria-label="Быстрый переход по разделам">
        ${category.sections.map((subsection, index) => `
          <button type="button" data-menu-jump="menu-section-${index}">${esc(subsection.title)}</button>`).join('')}
      </nav>`
    : '';

  const groupedContent = category.sections
    ? category.sections.map((subsection, index) => `
        <section class="menu-subsection" id="menu-section-${index}">
          <header class="menu-subsection-heading">
            <h2>${esc(subsection.title)}</h2>
          </header>
          <div class="product-list">
            ${subsection.items.map(productCard).join('')}
          </div>
        </section>`).join('')
    : `<div class="product-list">${category.items.map(productCard).join('')}</div>`;

  shell(`
    <section class="inner-content category-page compact-top">
      ${quickNavigation}
      ${groupedContent}
      <p class="menu-disclaimer">Позиции, цены и доступные фотографии перенесены из действующего электронного меню.</p>
    </section>`, { title: category.title, eyebrow: section.title });
}


function hookahPage() {
  shell(`
    <section class="hookah-page" aria-label="Меню кальянов">
      <div class="hookah-carousel" data-hookah-track>
        ${hookahItems.map(effectiveItem).filter((item) => !item.hidden).map((item) => `
          <article class="hookah-slide" style="--hookah-image:url('${item.image}')">
            <div class="hookah-slide-copy">
              <h2>${esc(item.name)}</h2>
              <span class="hookah-divider" aria-hidden="true"></span>
              <p>${esc(item.description)}</p>
              <div class="hookah-slide-actions">
                <strong>${money(item.price)}</strong>
                <button class="choice-add-button hookah-choice-button" type="button" data-choice-add="${esc(choiceId(item))}" aria-pressed="false">
                  <span aria-hidden="true">＋</span><span data-choice-label>Добавить</span>
                </button>
              </div>
            </div>
          </article>`).join('')}
      </div>
      <div class="hookah-dots" aria-label="Выбор позиции">
        ${hookahItems.map(effectiveItem).filter((item) => !item.hidden).map((item, index) => `
          <button type="button" data-hookah-dot class="hookah-dot${index === 0 ? ' is-active' : ''}" aria-label="${esc(item.name)}" aria-current="${index === 0 ? 'true' : 'false'}"></button>`).join('')}
      </div>
      <p class="hookah-note">Крепость и вкусовой профиль можно подобрать вместе с кальянным мастером.</p>
    </section>`, { title: 'Кальяны' });
  initHookahCarousel();
}

function infoPage() {
  shell(`
    <section class="inner-content">
      <section class="content-section">
        <div class="content-section-heading">
          <h2>Акции</h2>
        </div>
        <div class="promotion-carousel" data-promotion-track>
          ${promotions.map((promotion) => `
            <article class="promotion-slide">
              ${promotion.image ? `<img src="${esc(promotion.image)}" alt="${esc(promotion.title)}" loading="lazy" decoding="async">` : ''}
              <div class="promotion-slide-copy">
                <small>${esc(promotion.type)}</small>
                <h3>${esc(promotion.title)}</h3>
                <p>${esc(promotion.text)}</p>
              </div>
            </article>`).join('')}
        </div>
        <div class="promotion-dots" aria-label="Выбор акции">
          ${promotions.map((promotion, index) => `
            <button type="button" data-promotion-dot class="promotion-dot${index === 0 ? ' is-active' : ''}" aria-label="${esc(promotion.title)}" aria-current="${index === 0 ? 'true' : 'false'}"></button>`).join('')}
        </div>
      </section>

      <section class="content-section rules-section">
        <div class="content-section-heading">
          <h2>Правила</h2>
        </div>
        <div class="rules-list">
          ${rules.map((rule) => `
            <article class="rule-card">
              <div>
                <h3>${esc(rule.title)}</h3>
                <p>${esc(rule.text)}</p>
              </div>
            </article>`).join('')}
        </div>
      </section>
    </section>`, { title: 'Акции и правила', eyebrow: 'Информация' });
  initPromotionCarousel();
}

function choicePage() {
  const catalog = getChoiceCatalog();
  const selectedItems = readChoice().map((id) => ({ id, item: catalog.get(id) })).filter((entry) => entry.item);
  const total = selectedItems.reduce((sum, entry) => sum + Number(entry.item.price || 0), 0);

  shell(`
    <section class="inner-content choice-page">
      ${selectedItems.length ? `
        <div class="choice-list">
          ${selectedItems.map(({ id, item }) => `
            <article class="choice-item">
              ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" decoding="async">` : '<span class="choice-item-placeholder" aria-hidden="true"></span>'}
              <div class="choice-item-copy">
                <h2>${esc(item.name)}</h2>
                <strong>${money(item.price)}</strong>
              </div>
              <button type="button" class="choice-remove-button" data-choice-remove="${esc(id)}" aria-label="Удалить ${esc(item.name)}">×</button>
            </article>`).join('')}
        </div>
        <div class="choice-summary">
          <span>Ориентировочная сумма</span>
          <strong>${money(total)}</strong>
          <button type="button" data-choice-clear>Очистить список</button>
        </div>` : `
        <div class="choice-empty">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>
          <h2>Пока ничего не выбрано</h2>
          <p>Добавляйте позиции из бара и раздела кальянов.</p>
          <button type="button" data-route="#bar">Перейти в меню</button>
        </div>`}
    </section>`, { title: 'Мой выбор' });
}


function adminPage() {
  if (!isAdminAuthenticated()) {
    shell(`
      <section class="admin-login-wrap">
        <form class="admin-login-card" data-admin-login>
          <span>Защищённое управление</span>
          <h2>Вход в админку</h2>
          <label><span>Email</span><input name="email" type="email" autocomplete="username" required></label>
          <label><span>Пароль</span><input name="password" type="password" autocomplete="current-password" required></label>
          <p class="admin-error" data-admin-error hidden></p>
          <button type="submit">Войти</button>
          <small>Вход выполняется через Supabase Auth.</small>
        </form>
      </section>`, { title: 'Админка' });
    return;
  }

  const rows = allEditableItems().map(({ section, type, item }) => {
    const current = effectiveItem(item);
    return `
      <article class="admin-item" data-admin-item="${esc(item.remoteKey)}">
        ${current.image ? `<img src="${esc(current.image)}" alt="" loading="lazy">` : '<span class="admin-item-placeholder"></span>'}
        <div class="admin-item-copy"><small>${esc(type)} · ${esc(section)}</small><strong>${esc(current.name)}</strong></div>
        <label class="admin-price-field"><span>Цена</span><input type="number" min="0" step="10" value="${esc(current.price)}" data-admin-price></label>
        <label class="admin-switch"><input type="checkbox" data-admin-available ${current.hidden ? '' : 'checked'}><span>В меню</span></label>
      </article>`;
  }).join('');

  shell(`
    <section class="inner-content admin-page">
      <div class="admin-toolbar"><div><span>Supabase подключён</span><h2>Цены и стоп-лист</h2></div><button type="button" data-admin-logout>Выйти</button></div>
      <div class="admin-notice">Изменения сохраняются в общей базе и отображаются у всех гостей после обновления меню.</div>
      <div class="admin-actions"><button type="button" class="admin-primary" data-admin-save>Сохранить изменения</button></div>
      <p class="admin-status" data-admin-status hidden></p>
      <div class="admin-list">${rows}</div>
      <div class="admin-actions admin-actions-bottom"><button type="button" class="admin-primary" data-admin-save>Сохранить изменения</button></div>
    </section>`, { title: 'Админка', eyebrow: 'Посидым' });
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
  if (section === 'choice') return choicePage();
  if (section === 'admin') return adminPage();
  if (section === 'home' || !section) return home();
  return notFound();
}

async function loadRemoteMenu() {
  try {
    const { data, error } = await supabase.from('menu_items').select('*').order('sort_order');
    if (error) throw error;
    remoteMenuItems = new Map((data || []).map((row) => [row.item_key, row]));
    backendStatus = 'ready';
  } catch (error) {
    backendStatus = 'fallback';
    console.warn('Supabase menu fallback:', error.message);
  }
}

async function bootstrap() {
  const { data } = await supabase.auth.getSession();
  adminSession = data.session;
  await loadRemoteMenu();
  window.addEventListener('hashchange', route);
  supabase.auth.onAuthStateChange((_event, session) => { adminSession = session; });
  route();
}
bootstrap();
