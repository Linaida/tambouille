# Présentation

Tambouille est un outil permettant de créer des recettes de cuisine simples, facilement imprimable et exportables en différents formats.

# Développement

## IDE Recommandé

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Extensions recommandées

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)



# Installation du projet

## Pré-requis
Version de node : **>=24.12**  
Gestionnaire de dépendances : **pnpm** 

## Installer les dépendances
```sh
pnpm install
```

### Lancer le serveur de dev

```sh
pnpm dev
```

### Compiler pour la production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.


## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

# Description du projet

## Structure 

```
src/
├── components/
│   ├── editor/
│   └── recipe/
│
├── database/
│   └── recipeDatabase.ts
│
├── repositories/
│   └── recipeRepository.ts
│
├── stores/
│   └── recipeStore.ts
│
├── types/
│   └── Recipe.ts
│
├── views/
│   ├── RecipeListView.vue
│   ├── RecipeView.vue
│   └── EditRecipeView.vue
│
└── router/
    └── index.ts
```

### Fonctionnement du stockage 

recipeDatabase.ts
→ configuration IndexedDB

recipeRepository.ts
→ ajouter, lire, modifier et supprimer des recettes

recipeStore.ts
→ état utilisé par Vue

Views
→ affichage des pages