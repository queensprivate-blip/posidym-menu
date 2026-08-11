-- Обновляет картинку акции «Скидка в день рождения»
update promotions
set image_url = '/menu-images/birthday-discount-v34.webp?v=34'
where lower(title) like '%день рождения%'
   or lower(title) like '%день рожд%';
