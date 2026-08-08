import { supabase } from './supabase-client.js';

const esc = (v='') => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const slug = (v='item') => String(v).toLowerCase().replace(/[^a-zа-я0-9]+/gi,'-').replace(/^-|-$/g,'').slice(0,60) || 'item';
let state = { tab:'items', items:[], sections:[], promotions:[], rules:[], venue:null, query:'', type:'all' };

async function loadAll(){
  const [items,sections,promotions,rules,venue] = await Promise.all([
    supabase.from('menu_items').select('*').order('sort_order'),
    supabase.from('menu_sections').select('*').order('sort_order'),
    supabase.from('promotions').select('*').order('sort_order'),
    supabase.from('rules').select('*').order('sort_order'),
    supabase.from('venue_settings').select('*').eq('id',1).maybeSingle(),
  ]);
  for (const r of [items,sections,promotions,rules,venue]) if(r.error) throw r.error;
  state.items=items.data||[]; state.sections=sections.data||[]; state.promotions=promotions.data||[]; state.rules=rules.data||[]; state.venue=venue.data||{};
}

async function upload(file,folder='items'){
  if(!file) return null;
  const ext=(file.name.split('.').pop()||'webp').toLowerCase();
  const path=`${folder}/${Date.now()}-${slug(file.name)}.${ext}`;
  const {error}=await supabase.storage.from('menu-media').upload(path,file,{cacheControl:'3600',upsert:false});
  if(error) throw error;
  return supabase.storage.from('menu-media').getPublicUrl(path).data.publicUrl;
}

function toast(text,error=false){ const n=document.querySelector('[data-admin-toast]'); if(!n)return; n.textContent=text; n.classList.toggle('is-error',error); n.hidden=false; setTimeout(()=>n.hidden=true,3500); }
function tabs(){ return [['items','Позиции'],['sections','Категории'],['promotions','Акции'],['rules','Правила'],['venue','Заведение']].map(([id,t])=>`<button data-admin-tab="${id}" class="${state.tab===id?'is-active':''}">${t}</button>`).join(''); }
function field(label,content){return `<label class="admin-field"><span>${label}</span>${content}</label>`;}
function filePicker(inputAttr,currentUrl=''){
  return `<div class="admin-file-picker" data-file-picker>
    <div class="admin-file-preview" data-file-preview>${currentUrl?`<img src="${esc(currentUrl)}" alt="Текущее фото">`:'<span>Нет фото</span>'}</div>
    <div class="admin-file-controls">
      <button type="button" class="admin-file-button" data-file-button>${currentUrl?'Заменить фото':'Добавить фотографию'}</button>
      <span class="admin-file-name" data-file-name>${currentUrl?'Текущее фото загружено':'Файл не выбран'}</span>
      <input ${inputAttr} data-file-input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" hidden>
    </div>
  </div>`;
}
function sectionOptions(selected=''){return state.sections.map(s=>`<option value="${esc(s.section_id)}" ${s.section_id===selected?'selected':''}>${esc(s.title)}</option>`).join('');}

function itemRows(){
 const q=state.query.toLowerCase();
 return state.items.filter(i=>(state.type==='all'||i.type===state.type)&&(!q||`${i.name} ${i.section_title}`.toLowerCase().includes(q))).map(i=>`<article class="admin-pro-card ${i.archived?'is-archived':i.available?'is-live':'is-stopped'}" data-item-key="${esc(i.item_key)}">
  <div class="admin-pro-head">${i.image_url?`<img src="${esc(i.image_url)}" alt="">`:'<span class="admin-photo-empty">Фото</span>'}<div><small>${esc(i.type)} · ${esc(i.section_title)}</small><strong>${esc(i.name)}</strong><span class="admin-state-pill ${i.archived?'is-archived':i.available?'is-live':'is-stopped'}">${i.archived?'Архив':i.available?'В меню':'Стоп-лист'}</span></div><button class="admin-danger-ghost" data-item-archive>${i.archived?'Восстановить':'Удалить'}</button></div>
  <div class="admin-form-grid">
   ${field('Название',`<input data-f="name" value="${esc(i.name)}">`)}
   ${field('Цена',`<input data-f="price" type="number" min="0" value="${esc(i.price)}">`)}
   ${field('Объём',`<input data-f="volume" value="${esc(i.volume||'')}">`)}
   ${field('Раздел',`<select data-f="section_id">${sectionOptions(i.section_id)}</select>`)}
   ${field('Описание',`<textarea data-f="description">${esc(i.description||'')}</textarea>`)}
   ${field('Фото',filePicker('data-item-file',i.image_url||''))}
   ${field('Порядок',`<input data-f="sort_order" type="number" value="${esc(i.sort_order||0)}">`)}
   ${field('В меню',`<input data-f="available" type="checkbox" ${i.available&&!i.archived?'checked':''}>`)}
  </div><button class="admin-primary small" data-item-save>Сохранить позицию</button>
 </article>`).join('') || '<p class="admin-empty">Ничего не найдено.</p>';
}

function itemsTab(){return `<div class="admin-tab-toolbar"><input placeholder="Поиск по меню" data-admin-search value="${esc(state.query)}"><select data-admin-type><option value="all">Все</option><option value="bar" ${state.type==='bar'?'selected':''}>Бар</option><option value="hookah" ${state.type==='hookah'?'selected':''}>Кальяны</option></select><button class="admin-primary" data-add-item>Добавить позицию</button></div><div class="admin-pro-list">${itemRows()}</div>`;}
function sectionsTab(){return `<div class="admin-actions-line"><button class="admin-primary" data-add-section>Добавить категорию</button></div><div class="admin-pro-list">${state.sections.map(s=>`<article class="admin-pro-card" data-section-id="${esc(s.section_id)}"><div class="admin-form-grid">${field('Название',`<input data-f="title" value="${esc(s.title)}">`)}${field('Описание',`<input data-f="note" value="${esc(s.note||'')}">`)}${field('Тип',`<select data-f="type"><option value="bar" ${s.type==='bar'?'selected':''}>Бар</option><option value="hookah" ${s.type==='hookah'?'selected':''}>Кальяны</option></select>`)}${field('Группа',`<input data-f="parent_group" value="${esc(s.parent_group||'')}">`)}${field('Порядок',`<input data-f="sort_order" type="number" value="${s.sort_order||0}">`)}${field('Показывать',`<input data-f="visible" type="checkbox" ${s.visible?'checked':''}>`)}</div><div class="admin-card-actions"><button class="admin-primary small" data-section-save>Сохранить</button><button class="admin-danger-ghost" data-section-delete>Удалить</button></div></article>`).join('')}</div>`;}
function promotionsTab(){return `<div class="admin-actions-line"><button class="admin-primary" data-add-promotion>Добавить акцию</button></div><div class="admin-pro-list">${state.promotions.map(p=>`<article class="admin-pro-card" data-promotion-id="${p.id}">${p.image_url?`<img class="admin-banner-preview" src="${esc(p.image_url)}" alt="">`:''}<div class="admin-form-grid">${field('Название',`<input data-f="title" value="${esc(p.title)}">`)}${field('Метка',`<input data-f="type_label" value="${esc(p.type_label||'Акция')}">`)}${field('Текст',`<textarea data-f="text">${esc(p.text||'')}</textarea>`)}${field('Изображение',filePicker('data-promo-file',p.image_url||''))}${field('Порядок',`<input data-f="sort_order" type="number" value="${p.sort_order||0}">`)}${field('Показывать',`<input data-f="visible" type="checkbox" ${p.visible?'checked':''}>`)}</div><div class="admin-card-actions"><button class="admin-primary small" data-promotion-save>Сохранить</button><button class="admin-danger-ghost" data-promotion-delete>Удалить</button></div></article>`).join('')}</div>`;}
function rulesTab(){return `<div class="admin-actions-line"><button class="admin-primary" data-add-rule>Добавить правило</button></div><div class="admin-pro-list">${state.rules.map(r=>`<article class="admin-pro-card" data-rule-id="${r.id}"><div class="admin-form-grid">${field('Заголовок',`<input data-f="title" value="${esc(r.title)}">`)}${field('Текст',`<textarea data-f="text">${esc(r.text||'')}</textarea>`)}${field('Порядок',`<input data-f="sort_order" type="number" value="${r.sort_order||0}">`)}${field('Показывать',`<input data-f="visible" type="checkbox" ${r.visible?'checked':''}>`)}</div><div class="admin-card-actions"><button class="admin-primary small" data-rule-save>Сохранить</button><button class="admin-danger-ghost" data-rule-delete>Удалить</button></div></article>`).join('')}</div>`;}
function venueTab(){const v=state.venue||{};return `<article class="admin-pro-card" data-venue>${field('Название',`<input data-f="venue_name" value="${esc(v.venue_name||'')}">`)}${field('Адрес',`<input data-f="address" value="${esc(v.address||'')}">`)}${field('Телефон',`<input data-f="phone" value="${esc(v.phone||'')}">`)}${field('Режим работы',`<input data-f="hours" value="${esc(v.hours||'')}">`)}${field('Ссылка на отзывы',`<input data-f="review_url" value="${esc(v.review_url||'')}">`)}<button class="admin-primary" data-venue-save>Сохранить настройки</button></article>`;}
function body(){return ({items:itemsTab,sections:sectionsTab,promotions:promotionsTab,rules:rulesTab,venue:venueTab}[state.tab]||itemsTab)();}

function readCard(card){const o={}; card.querySelectorAll('[data-f]').forEach(el=>{o[el.dataset.f]=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value.trim();}); return o;}
async function refresh(render){await loadAll(); render();}

function bind(render){
 document.querySelectorAll('[data-admin-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.adminTab;render();});
 document.querySelector('[data-admin-search]')?.addEventListener('input',e=>{state.query=e.target.value;render();});
 document.querySelector('[data-admin-type]')?.addEventListener('change',e=>{state.type=e.target.value;render();});
 document.querySelector('[data-admin-logout]')?.addEventListener('click',async()=>{await supabase.auth.signOut();location.hash='#home';location.reload();});
 document.querySelectorAll('[data-file-picker]').forEach(picker=>{
  const input=picker.querySelector('[data-file-input]');
  const button=picker.querySelector('[data-file-button]');
  const name=picker.querySelector('[data-file-name]');
  const preview=picker.querySelector('[data-file-preview]');
  button?.addEventListener('click',()=>input?.click());
  input?.addEventListener('change',()=>{
    const file=input.files?.[0];
    if(!file)return;
    if(!file.type.startsWith('image/')){toast('Выберите файл изображения',true);input.value='';return;}
    if(file.size>12*1024*1024){toast('Фото слишком большое. Максимум 12 МБ.',true);input.value='';return;}
    if(name) name.textContent=file.name;
    if(button) button.textContent='Выбрать другое фото';
    if(preview){
      const url=URL.createObjectURL(file);
      preview.innerHTML=`<img src="${url}" alt="Новое фото">`;
    }
  });
 });
 document.querySelector('[data-add-item]')?.addEventListener('click',async()=>{const s=state.sections.find(x=>x.type==='bar')||state.sections[0]; const key=`bar:${s?.section_id||'new'}:${Date.now()}`; const {error}=await supabase.from('menu_items').insert({item_key:key,type:s?.type||'bar',section_id:s?.section_id||'new',section_title:s?.title||'Новый раздел',name:'Новая позиция',price:0,sort_order:999}); if(error)return toast(error.message,true); await refresh(render);});
 document.querySelectorAll('[data-item-save]').forEach(b=>b.onclick=async()=>{
  const c=b.closest('[data-item-key]'), values=readCard(c);
  const section=state.sections.find(s=>s.section_id===values.section_id);
  values.section_title=section?.title||values.section_id; values.type=section?.type||'bar';
  const file=c.querySelector('[data-item-file]')?.files?.[0];
  try{
    if(file){b.disabled=true;b.textContent='Загружаю фото…';values.image_url=await upload(file,'items');}
    const {error}=await supabase.from('menu_items').update(values).eq('item_key',c.dataset.itemKey);
    if(error)throw error;
    toast(file?'Фото загружено, позиция сохранена':'Позиция сохранена');
    await refresh(render);
  }catch(e){toast(`Не удалось сохранить: ${e.message}`,true);b.disabled=false;b.textContent='Сохранить позицию';}
 });
 document.querySelectorAll('[data-item-archive]').forEach(b=>b.onclick=async()=>{const c=b.closest('[data-item-key]'), row=state.items.find(i=>i.item_key===c.dataset.itemKey); const {error}=await supabase.from('menu_items').update({archived:!row.archived,available:row.archived}).eq('item_key',row.item_key); if(error)return toast(error.message,true); await refresh(render);});
 document.querySelector('[data-add-section]')?.addEventListener('click',async()=>{const id=`section-${Date.now()}`; const {error}=await supabase.from('menu_sections').insert({section_id:id,type:'bar',title:'Новая категория',sort_order:999}); if(error)return toast(error.message,true); await refresh(render);});
 document.querySelectorAll('[data-section-save]').forEach(b=>b.onclick=async()=>{const c=b.closest('[data-section-id]');const {error}=await supabase.from('menu_sections').update(readCard(c)).eq('section_id',c.dataset.sectionId);if(error)return toast(error.message,true);toast('Категория сохранена');await refresh(render);});
 document.querySelectorAll('[data-section-delete]').forEach(b=>b.onclick=async()=>{const c=b.closest('[data-section-id]');if(!confirm('Удалить категорию? Позиции останутся в базе.'))return;const {error}=await supabase.from('menu_sections').delete().eq('section_id',c.dataset.sectionId);if(error)return toast(error.message,true);await refresh(render);});
 document.querySelector('[data-add-promotion]')?.addEventListener('click',async()=>{const {error}=await supabase.from('promotions').insert({title:'Новая акция',sort_order:999});if(error)return toast(error.message,true);await refresh(render);});
 document.querySelectorAll('[data-promotion-save]').forEach(b=>b.onclick=async()=>{
  const c=b.closest('[data-promotion-id]'),v=readCard(c),file=c.querySelector('[data-promo-file]')?.files?.[0];
  try{
    if(file){b.disabled=true;b.textContent='Загружаю фото…';v.image_url=await upload(file,'promotions');}
    const {error}=await supabase.from('promotions').update(v).eq('id',c.dataset.promotionId);
    if(error)throw error;
    toast(file?'Фото акции загружено':'Акция сохранена');
    await refresh(render);
  }catch(e){toast(`Не удалось сохранить: ${e.message}`,true);b.disabled=false;b.textContent='Сохранить';}
 });
 document.querySelectorAll('[data-promotion-delete]').forEach(b=>b.onclick=async()=>{const c=b.closest('[data-promotion-id]');if(!confirm('Удалить акцию?'))return;const {error}=await supabase.from('promotions').delete().eq('id',c.dataset.promotionId);if(error)return toast(error.message,true);await refresh(render);});
 document.querySelector('[data-add-rule]')?.addEventListener('click',async()=>{const {error}=await supabase.from('rules').insert({title:'Новое правило',sort_order:999});if(error)return toast(error.message,true);await refresh(render);});
 document.querySelectorAll('[data-rule-save]').forEach(b=>b.onclick=async()=>{const c=b.closest('[data-rule-id]');const {error}=await supabase.from('rules').update(readCard(c)).eq('id',c.dataset.ruleId);if(error)return toast(error.message,true);toast('Правило сохранено');await refresh(render);});
 document.querySelectorAll('[data-rule-delete]').forEach(b=>b.onclick=async()=>{const c=b.closest('[data-rule-id]');if(!confirm('Удалить правило?'))return;const {error}=await supabase.from('rules').delete().eq('id',c.dataset.ruleId);if(error)return toast(error.message,true);await refresh(render);});
 document.querySelector('[data-venue-save]')?.addEventListener('click',async()=>{const c=document.querySelector('[data-venue]');const {error}=await supabase.from('venue_settings').update(readCard(c)).eq('id',1);if(error)return toast(error.message,true);toast('Настройки сохранены');await refresh(render);});
}

export async function renderAdvancedAdmin(app,{session,backgroundUrl,logoUrl}){
 if(!session?.user){ app.innerHTML='<main class="site inner-page"><section class="admin-login-wrap"><form class="admin-login-card" data-login><h2>Вход в админку</h2><label><span>Email</span><input name="email" type="email" required></label><label><span>Пароль</span><input name="password" type="password" required></label><p data-error hidden></p><button>Войти</button></form></section></main>'; const f=app.querySelector('[data-login]');f.onsubmit=async e=>{e.preventDefault();const fd=new FormData(f);const {error}=await supabase.auth.signInWithPassword({email:fd.get('email'),password:fd.get('password')});if(error){const n=f.querySelector('[data-error]');n.textContent=error.message;n.hidden=false;}else location.reload();}; return; }
 const render=()=>{app.innerHTML=`<main class="site inner-page admin-shell" style="--hero-image:url('${backgroundUrl}')"><header class="admin-top"><img src="${logoUrl}" alt=""><div><small>Посидым Lounge</small><h1>Управление меню</h1></div><button data-admin-logout>Выйти</button></header><nav class="admin-tabs">${tabs()}</nav><section class="admin-workspace">${body()}</section><p class="admin-toast" data-admin-toast hidden></p></main>`;bind(render);};
 try{await loadAll();render();}catch(e){app.innerHTML=`<main class="site inner-page"><section class="admin-login-wrap"><div class="admin-login-card"><h2>Нужно обновить базу</h2><p>${esc(e.message)}</p><small>Выполните supabase/upgrade-v22.sql в SQL Editor.</small></div></section></main>`;}
}
