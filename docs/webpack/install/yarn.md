# install

## 前言

从 npm 到 yarn，再到之后的 pnpm， ni 等安装工具

不断进步， 不断升级， 升级了哪些，又存在哪些问题

### 问题

- 嵌套安装

  - 路径过长
  - 同一依赖， 多次安装

- 扁平安装

  - 仅一个版本根据包的安装顺序被提升，且升级版本后，会存在新的问题（依赖提升的不确定性）

- npm 分身

  - hoist 机制

- 幽灵依赖

  - 项目未安装某个依赖，但因为安装的某个依赖中使用了该依赖， 导致可以项目中使用未安装的依赖， 但在项目升级后， 若去掉该依赖， 就会报错

  ## 结构

```
node_modules
└─ foo
   ├─ index.js
   ├─ package.json
   └─ node_modules
      └─ bar
         ├─ index.js
         └─ package.json

```

## npm

```sh
npm i
```

## yarn

```sh
yarn
```

## pnpm

```sh
pnpm i
```

## ni

```sh
ni
```
