# Как выложить сайт в интернет

Сайт полностью статический: четыре файла (`index.html`, `styles.css`, `data.js`,
`app.js`) без сборки, бэкенда и зависимостей. Поэтому любой бесплатный
статический хостинг подходит. Ниже — три способа, от «одна минута» до «по-взрослому».

Готовый к загрузке архив уже собран: **`ai-model-index-site.zip`** (48 КБ).

---

## Способ 1. Netlify Drop — быстрее всего, без git (~2 минуты)

1. Зарегистрируйтесь на [netlify.com](https://www.netlify.com) (можно через Google/GitHub).
2. Откройте **[app.netlify.com/drop](https://app.netlify.com/drop)**.
3. Перетащите туда архив `ai-model-index-site.zip` (или распакованную папку
   с этими четырьмя файлами).
4. Через несколько секунд получите публичный адрес вида
   `https://sluchaynoe-imya-12345.netlify.app` — им можно делиться сразу.
5. Красивое имя задаётся там же: *Site configuration → Change site name*,
   например `ai-model-index.netlify.app`.

**Обновление сайта позже:** *Deploys → drag and drop* — перетащить новый архив
поверх, адрес не изменится.

Ограничений бесплатного тарифа (100 ГБ трафика/мес) такому сайту хватит на годы.

---

## Способ 2. GitHub Pages — если хочется хранить код и историю изменений

Понадобится аккаунт [github.com](https://github.com) и git в терминале.

```bash
# один раз: создаём репозиторий и заливаем сайт
cd ai-model-index
git init
git add index.html styles.css data.js app.js README.md DEPLOY.md
git commit -m "AI Model Index: статистика нейросетей, снимок 22.10.2026"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/ai-model-index.git
git push -u origin main
```

Затем на сайте GitHub: **репозиторий → Settings → Pages → Source: Deploy from a
branch → Branch: `main`, папка `/ (root)` → Save.**

Через минуту сайт будет на адресе:

```
https://ВАШ_ЛОГИН.github.io/ai-model-index/
```

Все пути на сайте относительные, поэтому подпапка `/ai-model-index/` работает
без дополнительных настроек.

**Обновление сайта позже:**

```bash
# после правок data.js:
node scripts/build-standalone.mjs   # только если нужен single-file
git add -A && git commit -m "данные: обновление от <дата>" && git push
```

GitHub Pages пересоберёт страницу сам за ~30 секунд.

### Бонус: авто-проверка данных
Если захотите, чтобы GitHub сам напоминал обновить снимок, добавьте файл
`.github/workflows/remind.yml` с cron-заданием, которое раз в неделю создаёт
issue «Проверь источники». Скажите — напишу.

---

## Способ 3. Vercel или Cloudflare Pages — то же самое, другой бренд адреса

- **Vercel:** [vercel.com/new](https://vercel.com/new) → Import Git Repository →
  Framework: *Other* → Deploy. Адрес: `ai-model-index.vercel.app`.
- **Cloudflare Pages:** dash.cloudflare.com → Workers & Pages → Create →
  Pages → Connect to Git → build command оставить пустым, папка сборки `/`.
  Адрес: `ai-model-index.pages.dev`.

Оба варианта дают бесплатные HTTPS, CDN по всему миру и авто-деплой при каждом
push в репозиторий.

---

## Своё доменное имя (по желанию)

Любой из трёх хостингов умеет привязывать_custom-домен_ бесплатно:
покупаете домен у регистратора (например, `aimodelindex.ru` или `.cc/.dev`),
в настройках хостинга добавляете его и прописываете две DNS-записи, которые
хостинг покажет (обычно CNAME на их адрес). HTTPS-сертификат выпустится сам.

---

## Чек-лист перед публикацией

- [ ] Дата снимка в шапке и в `META.snapshot` (`data.js`) соответствует данным.
- [ ] Раздел «Источники» на странице содержит живые ссылки и даты проверки.
- [ ] Проверили сайт в приватном окне браузера (тема по умолчанию + светлая/тёмная).
- [ ] Если правили `data.js` — пересобрали `standalone.html`
      (`node scripts/build-standalone.mjs`), чтобы single-file версия не отстала.
- [ ] Прогнали `node tests/smoke.mjs` (нужны `jsdom` и локальный сервер, см. README).

## Что НЕ нужно делать

- Ставить Node.js, npm или какой-либо сервер на хостинг — сайт без сборки.
- Подключать базу данных — все данные лежат в `data.js`.
- Платить за хостинг — перечисленных бесплатных тарифов достаточно.
