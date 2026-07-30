import './styles.css';
import backgroundUrl from './lounge-background.png';
import logoUrl from './posidym-logo.png';

const app = document.querySelector('#app');
const venue = {address:'Москва, ул. Центральная, 12',phone:'+7 (999) 123-45-67',hours:'Вс–Чт 14:00–02:00 · Пт–Сб 14:00–04:00'};
const sections = {
  bar:{title:'Бар',subtitle:'Напитки и коктейли',groups:['Авторские коктейли','Классические коктейли','Крепкий алкоголь','Пиво и сидр','Безалкогольные напитки','Чай и кофе']},
  hookah:{title:'Кальяны',subtitle:'Подберём вкус и крепость',groups:['Классическая чаша','Премиальная чаша','Кальян на фрукте','Добавки']}
};
const esc=(v='')=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
function icon(type){const i={bar:'<svg viewBox="0 0 48 48"><path d="M10 10h28L25 26v12h8v4H15v-4h8V26L10 10Z"/><path d="M15 15h18"/><circle cx="34" cy="11" r="4"/></svg>',hookah:'<svg viewBox="0 0 48 48"><path d="M20 7h8M22 11h4v7l5 6v8H17v-8l5-6v-7ZM18 36h12l3 5H15l3-5Z"/><path d="M30 27c9-2 11 7 5 10"/></svg>',info:'<svg viewBox="0 0 48 48"><path d="M8 15h24l8 8-17 17L8 25V15Z"/><circle cx="16" cy="22" r="2"/><path d="M29 17 17 35M18 19h.01M29 33h.01"/></svg>'};return i[type]||i.info}
function bind(){document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>location.hash=b.dataset.route);document.querySelector('[data-back]')?.addEventListener('click',()=>location.hash='#home')}
function shell(content,{home=false,title=''}={}){app.innerHTML=`<main class="site ${home?'home-page':'inner-page'}" style="--hero-image:url('${backgroundUrl}')">${home?'':`<header class="inner-header"><button class="round-button" data-back aria-label="Назад">‹</button><h1>${esc(title)}</h1><span class="round-button ghost"></span></header>`}${content}</main>`;bind()}
function card(title,route,type){return `<button class="home-card" data-route="${route}"><span class="home-card-icon">${icon(type)}</span><strong>${esc(title)}</strong><span class="home-card-arrow">›</span></button>`}
function home(){shell(`<section class="home-content"><img class="brand-logo" src="${logoUrl}" alt="Посидым Lounge"><nav class="home-menu">${card('Бар','#bar','bar')}${card('Кальяны','#hookah','hookah')}${card('Акции и правила','#info','info')}</nav><section class="venue-card"><p><span>⌖</span><a href="https://maps.google.com/?q=${encodeURIComponent(venue.address)}">${esc(venue.address)}</a></p><p><span>☎</span><a href="tel:${venue.phone.replace(/[^+\d]/g,'')}">${esc(venue.phone)}</a></p><div></div><p><span>◷</span><strong>${esc(venue.hours)}</strong></p></section></section>`,{home:true})}
function menu(key){const s=sections[key];shell(`<section class="inner-content"><p class="section-subtitle">${esc(s.subtitle)}</p><div class="list-grid">${s.groups.map(x=>`<article class="list-card"><div><h2>${esc(x)}</h2><p>Позиции и цены добавим после утверждения структуры.</p></div><span>›</span></article>`).join('')}</div></section>`,{title:s.title})}
function info(){shell(`<section class="inner-content"><p class="section-subtitle">Специальные предложения и правила посещения</p><div class="info-stack"><article class="info-card"><small>Акция</small><h2>Счастливые часы</h2><p>Демонстрационный текст. Здесь появятся реальные условия акции.</p></article><article class="info-card"><small>Правила</small><h2>Посещение 18+</h2><p>Администратор может попросить документ, подтверждающий возраст.</p></article><article class="info-card"><small>Правила</small><h2>Бронирование</h2><p>Условия бронирования и депозита добавим после согласования.</p></article></div></section>`,{title:'Акции и правила'})}
function route(){const r=location.hash||'#home';if(r==='#bar')return menu('bar');if(r==='#hookah')return menu('hookah');if(r==='#info')return info();home()}
addEventListener('hashchange',route);route();
