# laravel-request

Клиентская библиотека для работы с Laravel API. Поддерживает JSON и MessagePack, fluent-интерфейс в стиле Eloquent Query Builder.

## Содержание

- [Установка](#установка)
- [Переменные окружения](#переменные-окружения)
- [Api](#api)
- [ApiRequest](#apirequest)
  - [Два типа запросов](#два-типа-запросов)
  - [Выборки: примеры и payload](#выборки-примеры-и-payload)
  - [Действия: call()](#действия-call)
  - [Отключение уведомлений](#отключение-уведомлений)
  - [Прямой вызов по URL](#прямой-вызов-по-url)
  - [Отмена запроса](#отмена-запроса)
- [Лицензия](#лицензия)

---

## Установка

```bash
npm install laravel-request
```

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `REACT_APP_API_URL` | Базовый URL API |
| `REACT_APP_DEBUG` | `true`/`false` — логирование запросов и ответов |

---

## Api

```javascript
import { Api } from 'laravel-request';
```

| Метод | Описание |
|-------|----------|
| `Api.get(controller, action, data)` | GET |
| `Api.post(controller, action, data)` | POST |
| `Api.put(controller, action, data)` | PUT |
| `Api.patch(controller, action, data)` | PATCH |
| `Api.delete(controller, action, id, data)` | DELETE |
| `Api.getArg(controller, action, arg, data)` | GET с аргументом в URL (например, index/123) |
| `Api.getUrl(url, data)` | Прямой GET по URL |

URL формируется как: `{domain}/api/v1/call/{controller}/{action}`

---

## ApiRequest

### Два типа запросов

**Выборка (список)** — `Api.get(controller, 'index')` или `'list'`  
Цепочка `where()`, `select()`, `orderBy()` и т.д. + метод выполнения:

| Метод | Результат |
|-------|-----------|
| `first()` | Первая страница |
| `all()` | Все записи |
| `paginate(page, perPage)` | Страница с пагинацией |
| `pluck(fields)` | Только указанные поля |
| `call()` | Без указания способа |

**Действие** — POST/PUT/PATCH/DELETE или GET одной записи (index)  
Всегда завершается `call()`.

### Выборки: примеры и payload

Данные уходят в query-параметрах URL (или в теле POST, если длина >5000 символов).

При `REACT_APP_API_URL=https://api.example.com` URL формируется как `https://api.example.com/api/v1/call/{controller}/{action}`.

**first():**

URL: `https://api.example.com/api/v1/call/product/index` (GET)

```javascript
Api.get('product', 'index')
  .select(['id', 'name', 'price'])
  .where('status', '=', 'active')
  .orderBy('created_at', 'desc')
  .first(success, error, final);
```
```json
{
  "arguments": [],
  "query": [
    { "select": [["id", "name", "price"]] },
    { "where": ["status", "=", "active"] },
    { "orderBy": ["created_at", "desc"] }
  ],
  "data": { "paginateType": "first" },
  "unique_hash": "xK9...",
  "timestamp": 1708123456789
}
```

**all():**

URL: `https://api.example.com/api/v1/call/product/index` (GET)

```javascript
Api.get('product', 'index')
  .where('category_id', '=', 1)
  .all(success, error, final);
```
```json
{
  "arguments": [],
  "query": [{ "where": ["category_id", "=", 1] }],
  "data": { "paginateType": "all" },
  "unique_hash": "xK9...",
  "timestamp": 1708123456789
}
```

**paginate():**

URL: `https://api.example.com/api/v1/call/product/index` (GET)

```javascript
Api.get('product', 'index')
  .whereIn('category_id', [1, 2, 3])
  .orderBy('name')
  .paginate(2, 15, success, error, final);
```
```json
{
  "arguments": [],
  "query": [
    { "whereIn": ["category_id", [1, 2, 3]] },
    { "orderBy": ["name"] }
  ],
  "data": {
    "paginateType": "paginate",
    "page": 2,
    "perPage": 15
  },
  "unique_hash": "xK9...",
  "timestamp": 1708123456789
}
```

**pluck():**

URL: `https://api.example.com/api/v1/call/product/index` (GET)

```javascript
Api.get('product', 'index')
  .pluck(['id', 'name'], success, error, final);
```
```json
{
  "arguments": [],
  "query": [],
  "data": {
    "paginateType": "pluck",
    "fields": ["id", "name"]
  },
  "unique_hash": "xK9...",
  "timestamp": 1708123456789
}
```

**first() — сложный (whereHas, with):**

URL: `https://api.example.com/api/v1/call/product/index` (GET)

```javascript
Api.get('product', 'index')
  .select(['id', 'name', 'price'])
  .where('status', '=', 'active')
  .whereHas('category', (q) => q.where('visible', true))
  .with(['images', 'category'])
  .orderBy('created_at', 'desc')
  .first(success, error, final);
```
```json
{
  "arguments": [],
  "query": [
    { "select": [["id", "name", "price"]] },
    { "where": ["status", "=", "active"] },
    { "whereHas": ["category", { "query": [{ "where": ["visible", true] }] }] },
    { "with": [["images", "category"]] },
    { "orderBy": ["created_at", "desc"] }
  ],
  "data": { "paginateType": "first" },
  "unique_hash": "xK9...",
  "timestamp": 1708123456789
}
```

**getArg()** (например, index/123):

URL: `https://api.example.com/api/v1/call/user/index` (GET, id=123 в payload)

```javascript
Api.getArg('user', 'index', 123).call(success, error, final);
```
```json
{
  "arguments": [123],
  "query": [],
  "data": {},
  "unique_hash": "xK9...",
  "timestamp": 1708123456789
}
```

### Действия: call()

```javascript
// URL: https://api.example.com/api/v1/call/user/store (POST)
Api.post('user', 'store', { name: 'John', email: 'john@example.com' })
  .call(success, error, final);

// URL: https://api.example.com/api/v1/call/user/update (PUT)
Api.put('user', 'update', { id: 1, name: 'John' })
  .call(success, error, final);

// URL: https://api.example.com/api/v1/call/user/destroy (DELETE, id=123 в payload)
Api.delete('user', 'destroy', 123)
  .call(success, error, final);

// URL: https://api.example.com/api/v1/call/user/index (GET, id=123 в payload)
Api.getArg('user', 'index', 123)
  .call(success, error, final);
```

### Отключение уведомлений

```javascript
Api.get('product', 'index').withoutNotify().first(success, error, final);

Api.post('user', 'store', data)
  .withoutNotify((status) => status !== 422)
  .call(success, error, final);
```

### Прямой вызов по URL

```javascript
Api.getUrl('https://api.example.com/custom/endpoint')
  .callUrl(success, error, final);
```

### Отмена запроса

```javascript
const request = Api.get('product', 'index').first(success, error, final);
request.getSource().cancel();
```

---

## Лицензия

MIT © Abramov Oleg
