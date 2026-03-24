# Тестовое задание - PieCharts


**Стек:** 
- TS
- Vue3 (composition api) 
- chart.js 
- vue3-colorpicker 
---
**Задачи:**
- [x] Реализовать на Vue 3 (composition api) без использования сторонних библиотек компонент кругового прогресс бара.
  - [x] SVG вариант (основной)
  - [x] Canvas вариант (дополнительный)
- [x] Реализовать круговую диаграмму используя библиотеку chartjs. Так же реализовать форму, состоящую из полей: наименование, значение, цвет.
  - [x] ChartJs вариант (основной)
  - [x] SVG вариант, без использования дополнительных библиотек (дополнительный)
  - [x] Canvas вариант, без использования дополнительных библиотек (дополнительный)
---
## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
