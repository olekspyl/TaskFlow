# todo-project

This template should help get you started developing with Vue 3 in Vite.

## Try it out

Want to explore the app without setting up your own account? Use the test credentials below to log in and poke around:

```
Email:    test-user@gmail.com
Password: 12345678
```

This account has every permission except the admin role, so you can try out:

- **Lists** — create, edit, and delete lists, open a list to manage its tasks, filter by title, and sort by recently updated / A–Z / Z–A.
- **Analytics** — view usage stats for a selected period.
- **Dashboard** — the landing overview after login.
- **Profile** — view/update your own account info.
- Switching **language** (Ukrainian / English) and **theme** from the header.

Since this account isn't an admin, the **Admin Panel** (user management and role/permission editing) won't show up in the navigation and isn't accessible — that part requires a real admin account.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
