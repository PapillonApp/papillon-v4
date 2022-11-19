# papillon-v4

![image](https://user-images.githubusercontent.com/32978709/202866365-940a2544-02fa-4107-96d9-6d4f9b8e8135.png)

This template should help get you started developing with Vue 3 in Vite.

## Le projet
Pronote+ à été imaginé comme un client de remplacement pour une application vieillisante qu'on est forcés à utiliser tous les jours. Il me fallait quelque chose de mieux pour profiter de ma vie scolaire numérique à nouveau.

## La nouvelle version
Pronote+ à déja eu plusieurs versions. Vous pouvez encore consulter la [version 2.1](https://github.com/ecnivtwelve/pronoteplus_app) et la [version 3.8](https://github.com/PapillonApp/Papillon) sur GitHub. Malheureusement ces versions ont mal vieilli car elles n'avaient pas été concu pour accueillir autant de fonctionnalités et d'itérations aujourd'hui. La v4 à donc pour objectif de créer une nouvelle version de Pronote+ conçue pour la collaboration et le partage.

## Configuration avec Vue

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```
