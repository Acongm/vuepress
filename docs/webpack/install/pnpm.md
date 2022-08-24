## node_modules 问题

过去的安装方式很简单：运行`yarn install`Yarn 时会生成一个`node_modules`目录，然后 Node 可以使用其内置的[Node Resolution Algorithm](https://nodejs.org/api/modules.html#modules_all_together)来使用该目录。在这种情况下，Node 不必首先知道“包”是什么：它只根据文件进行推理。“这个文件在这里存在吗？不：好的，让我们看看父文件`node_modules`。它在这里存在吗？仍然不存在：好的……”，它继续运行，直到找到正确的文件。由于以下几个原因，这个过程非常低效：

- 这些`node_modules`目录通常包含大量文件。生成它们可以弥补运行所需时间的 70% 以上`yarn install`。即使有预先存在的安装也不会拯救你，因为包管理器仍然必须区分`node_modules`它*应该*包含的内容。
- 因为`node_modules`生成是一个 I/O 繁重的操作，包管理器除了做一个简单的文件复制之外没有太多的余地来优化它——即使它可以在可能的情况下使用硬链接或写时复制，它也会在进行一堆系统调用来操作磁盘之前，仍然需要区分文件系统的当前状态。
- 因为 Node 没有包的概念，它也不知道文件是否*应该*被访问。完全有可能您编写的代码有一天在开发中有效，但后来在生产中中断，因为您忘记在`package.json`.
- 即使在运行时，Node 解析也必须进行大量调用`stat`，`readdir`以确定从何处加载每个所需文件。这是非常浪费的，也是启动 Node 应用程序花费如此多时间的部分原因。
- 最后，`node_modules`文件夹的设计是不切实际的，因为它不允许包管理器正确地对包进行重复数据删除。尽管可以使用一些算法来优化树布局（[提升](https://yarnpkg.com/advanced/lexicon#hoisting)），但我们仍然无法优化某些特定模式——不仅导致磁盘使用率高于所需，而且一些包在内存中被多次实例化.

## 修复 node_modules

Yarn 已经知道关于你的依赖树的所有信息——它甚至会为你将它安装在磁盘上。那么，为什么要由 Node 来查找你的包在哪里呢？相反，包管理器的工作应该是通知解释器包在磁盘上的位置，并管理包之间的任何依赖关系，甚至包的版本。这就是创建即插即用的原因。

在这种安装模式下（默认从 Yarn 2.0 开始），Yarn 生成单个文件而不是包含各种包副本`.pnp.cjs`的通常文件夹。`node_modules`该`.pnp.cjs`文件包含各种映射：一个将包名称和版本链接到它们在磁盘上的位置，另一个将包名称和版本链接到它们的依赖项列表。有了这些查找表，Yarn 可以立即告诉 Node 在哪里可以找到它需要访问的任何包，只要它们是依赖关系树的一部分，并且只要这个文件被加载到您的环境中（下一节将详细介绍） ）。

这种方法有多种好处：

- 安装现在几乎是即时的。Yarn 只需要生成一个文本文件（而不是可能的数万个）。主要瓶颈是项目中依赖项的数量而不是磁盘性能。
- 由于减少了 I/O 操作，安装更加稳定和可靠。尤其是在 Windows 上（批量写入和删除文件可能会触发与 Windows Defender 和类似工具的各种意外交互），I/O 繁重的`node_modules`操作更容易失败。
- 完美优化依赖树（又名完美提升）和可预测的包实例化。
- 生成的`.pnp.cjs`文件可以作为[零安装](https://yarnpkg.com/features/zero-installs)工作的一部分提交到您的存储库，从而无需首先运行`yarn install`。
- 更快的应用程序启动！节点解析不必像以前那样迭代文件系统层次结构（很快就不必这样做了！）。

## 初始化即插即用

Yarn 会生成一个`.pnp.cjs`需要安装的文件，以便 Node 知道在哪里可以找到相关的包。这种注册通常是透明的：`node`通过您的条目之一执行的任何直接或间接命令`scripts`都会自动将该`.pnp.cjs`文件注册为运行时依赖项。对于绝大多数用例，以下内容将按照您的预期工作：

```json
{
  "scripts": {
    "start": "node ./server.js",
    "test": "jest"
  }
}
```

对于一些剩余的边缘情况，可能需要一个小的设置：

- 如果您需要运行任意 Node 脚本，请使用[`yarn node`](https://yarnpkg.com/cli/node)解释器，而不是`node`. 这足以将`.pnp.cjs`文件注册为运行时依赖项。

```text
yarn node ./server.js
```

- 如果您在自动执行 Node 脚本的系统上操作（例如在 Google Cloud Platform 上（--此处需要参考--）），只需在 init 脚本顶部需要 PnP 文件并调用其`setup`函数即可。

```text
require('./.pnp.cjs').setup();
```

作为一个快速提示，`yarn node`通常所做的只是将`NODE_OPTIONS`环境变量设置为使用[`--require`](https://nodejs.org/api/cli.html#cli_r_require_module)来自 Node 的选项，与`.pnp.cjs`文件的路径相关联。如果您愿意，您可以自己轻松地应用此操作：

```text
node -r ./.pnp.cjs ./server.js
NODE_OPTIONS="--require $(pwd)/.pnp.cjs" node ./server.js
```

## 即插即用`loose`模式

由于提升启发式不是标准化和可预测的，因此在严格模式下运行的 PnP 将阻止包需要未明确列出的依赖项；即使其他依赖项也依赖它。这可能会导致某些软件包出现问题。

为了解决这个问题，Yarn 提供了一种“松散”模式，这将导致 PnP 链接器与提升器协同工作`node-modules`- 我们将首先生成在典型安装中将被提升到顶层的软件包列表`node_modules`，然后记住这个列表，我们称之为“后备池”。

> 请注意，因为松散模式直接调用提升器，它遵循与[链接器](https://github.com/yarnpkg/berry/tree/master/packages/plugin-nm)`node-modules`使用的真正算法完全相同的实现！[`node-modules`](https://github.com/yarnpkg/berry/tree/master/packages/plugin-nm)

在运行时，如果依赖项的任何版本最终在回退池中，仍然允许需要未列出的依赖项的包访问它们（可以使用[pnpFallbackMode](https://yarnpkg.com/configuration/yarnrc#pnpFallbackMode)调整哪些包完全被允许依赖回退池）。

请注意，备用池的内容是不确定的。如果依赖关系树包含同一个包的多个版本，则无法确定将哪个版本提升到顶层。因此，访问回退池的包仍然会生成警告（通过[process.emitWarning](https://nodejs.org/api/process.html#process_process_emitwarning_warning_type_code_ctor) API）。

此模式提供了`strict`PnP 链接器和`node_modules`链接器之间的折衷方案。

为了启用`loose`模式，请确保该[`nodeLinker`](https://yarnpkg.com/configuration/yarnrc#nodeLinker)选项设置为`pnp`（默认）并将以下内容添加到您的本地[`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc)文件中：

```yaml
pnpMode: loose
```

[有关该`pnpMode`选项的更多信息。](https://yarnpkg.com/configuration/yarnrc#pnpMode)

### 警告

因为我们在解决错误时*发出*警告（而不是*抛出*错误），所以应用程序无法*捕获*它们。这意味着`require`如果缺少依赖项，尝试在 try/catch 块内尝试可选对等依赖项的常见模式将在运行时打印警告，即使它不应该。唯一的运行时含义是这样的警告可能会导致混淆，但可以放心地忽略它。

因此，从 2.1 版开始，即插即用`loose`模式**将不再是**默认模式（正如我们最初计划的那样）。它将继续作为替代方案得到支持，希望能够轻松过渡到默认和推荐的工作流程：即插即用`strict`模式。

## 备择方案

在 Plug'n'Play 被批准为主要安装策略之前的几年里，其他项目提出了节点解析算法的替代实现——通常是为了规避`require.resolve`API 的缺点。示例包括 Webpack ( `enhanced-resolve`)、Babel ( `resolve`)、Jest ( `jest-resolve`) 和 Metro ( `metro-resolver`)。这些替代方案应被视为与 Plug'n'Play 的适当集成所取代。

### 兼容性表

下面的兼容性表让您了解与社区中各种工具的集成状态。请注意，此处仅列出了 CLI 工具，因为前端库（例如`react`, `vue`, `lodash`, ...）不会重新实现节点解析，因此不需要任何特殊逻辑来利用 Plug'n'Play：

**[建议在此表中添加](https://github.com/yarnpkg/berry/edit/master/packages/gatsby/content/features/plugnplay.md)**

#### 原生支持

许多常见的前端工具现在原生支持即插即用！

| 项目名            | 笔记                                                                                                                  |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------- |
| 角                | 从 13+ 开始                                                                                                           |
| 通天塔            | 从`resolve`1.9 开始                                                                                                   |
| 创建反应应用程序  | 从 2.0+ 开始                                                                                                          |
| 剑龙              | 从 2.0.0-beta.14 开始                                                                                                 |
| ESLint            | 共享配置的一些兼容性问题（可使用[@rushstack/eslint-patch 修复](https://yarnpkg.com/package/@rushstack/eslint-patch)） |
| 盖茨比            | 支持版本 ≥2.15.0、≥3.7.0                                                                                              |
| 吞咽              | 支持 4.0+ 版本                                                                                                        |
| 沙哑              | 从 4.0.0-1+ 开始                                                                                                      |
| 笑话              | 从 24.1+ 开始                                                                                                         |
| Next.js           | 从 9.1.2+ 开始                                                                                                        |
| 包裹              | 从 2.0.0-nightly.212+ 开始                                                                                            |
| Preact CLI        | 从 3.1.0+ 开始                                                                                                        |
| 更漂亮            | 从 1.17+ 开始                                                                                                         |
| 卷起              | 从`resolve`1.9+开始                                                                                                   |
| 故事书            | 从 6.0+ 开始                                                                                                          |
| 打字稿            | 通过[`plugin-compat`](https://github.com/yarnpkg/berry/tree/master/packages/plugin-compat)（默认启用）                |
| TypeScript-ESLint | 从 2.12+ 开始                                                                                                         |
| VSCode-Stylelint  | 从 1.1+ 开始                                                                                                          |
| 网络风暴          | 从 2019.3+开始；请参阅[编辑器 SDK](https://yarnpkg.com/getting-started/editor-sdks)                                   |
| 网页包            | 从 5+ 开始（[插件](https://github.com/arcanis/pnp-webpack-plugin)可用于 4.x）                                         |

#### 通过插件支持

| 项目名        | 笔记                                                                                                                                    |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| ESBuild       | 通过[`@yarnpkg/esbuild-plugin-pnp`](https://github.com/yarnpkg/berry/tree/master/packages/esbuild-plugin-pnp#yarnpkgesbuild-plugin-pnp) |
| VSCode-ESLint | 关注[编辑器 SDK](https://yarnpkg.com/getting-started/editor-sdks)                                                                       |
| VSCode        | 关注[编辑器 SDK](https://yarnpkg.com/getting-started/editor-sdks)                                                                       |
| Webpack 4.x   | Via [`pnp-webpack-plugin`](https://github.com/arcanis/pnp-webpack-plugin)（5 岁以上原生）                                               |

#### 不相容

以下工具不能用于纯即插即用安装（即使在松散模式下）。

**重要提示：**即使某个工具与 Plug'n'Play 不兼容，您仍然可以启用该[`node-modules`插件](https://github.com/yarnpkg/berry/tree/master/packages/plugin-nm)。只需按照[说明操作](https://yarnpkg.com/getting-started/migration#if-required-enable-the-node-modules-plugin)，您就可以在一分钟内准备好 🙂

| 项目名                   | 笔记                                                                                                                                                                                                                                             |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 流动                     | 关注[yarnpkg/berry#634](https://github.com/yarnpkg/berry/issues/634)                                                                                                                                                                             |
| 反应原生                 | 关注[react-native-community/cli#27](https://github.com/react-native-community/cli/issues/27)                                                                                                                                                     |
| 普鲁米                   | 关注[pulumi/pulumi#3586](https://github.com/pulumi/pulumi/issues/3586)                                                                                                                                                                           |
| VSCode 扩展管理器 (vsce) | 使用启用插件的[vsce-yarn-patch](https://www.npmjs.com/package/vsce-yarn-patch)分支`node-modules`。[在合并 microsoft/vscode-vsce#493](https://github.com/microsoft/vscode-vsce/pull/493)之前需要 fork ，因为`vsce`当前使用已删除的`yarn list`命令 |
| 雨果                     | 雨果管道期待一个`node-modules`目录。启用`node-modules`插件                                                                                                                                                                                       |
| 诏书                     | 按照[rescript-lang/rescript-compiler#3276](https://github.com/rescript-lang/rescript-compiler/issues/3276)                                                                                                                                       |

此列表根据我们从 v2 开始发布的最新版本保持更新。如果您发现自己的项目中有问题，请先尝试升级 Yarn 和有问题的包，然后随时提出问题。也许是公关？😊

## 经常问的问题

### 为什么不使用导入地图？

Yarn Plug'n'Play 提供语义错误（解释为什么一个包不能从另一个包访问的确切原因）和一个[合理的 JS API](https://yarnpkg.com/advanced/pnpapi)来解决`require.resolve`. 这些是导入地图无法自行解决的功能。[这在这个线程](https://github.com/nodejs/modules/issues/477#issuecomment-578091424)中有更详细的回答。

我们今天陷入这种混乱的一个主要原因是，最初的`node_modules`设计试图将包抽象出来，以便提供一个可以在没有任何包概念的情况下工作的通用系统。这成为一个挑战，促使许多实施者提出自己的解释。导入地图也存在同样的缺陷。

### 包存储在 Zip 档案中：我如何访问他们的文件？

使用 PnP 时，包被直接存储在 Zip 存档中并从缓存中访问。PnP 运行时 ( `.pnp.cjs`) 会自动修补 Node 的`fs`模块，以添加对访问 Zip 存档中文件的支持。这样，您不必做任何特别的事情：

```js
const { readFileSync } = require(`fs`)

// Looks similar to `/path/to/.yarn/cache/lodash-npm-4.17.11-1c592398b2-8b49646c65.zip/node_modules/lodash/ceil.js`
const lodashCeilPath = require.resolve(`lodash/ceil`)

console.log(readFileSync(lodashCeilPath))
```

### 后备模式

回到 PnP 第一次实现的时候，兼容性还没有现在那么好。为了帮助过渡，我们设计了一种回退机制：如果一个包试图访问一个未列出的依赖项，_如果顶级包将其列为一个依赖项_，它仍然可以解决它。我们允许这样做是因为没有分辨率歧义，因为任何项目中都有一个顶级包。不幸的是，这可能会导致令人困惑的行为，具体取决于您的项目设置方式。当这种情况发生时，即插即用总是正确的，它在不在工作区时工作的唯一原因是由于一些额外的松懈。

此行为只是一个补丁，最终将被删除以消除任何混乱。[`pnpFallbackMode`](https://yarnpkg.com/configuration/yarnrc#pnpFallbackMode)您现在可以通过设置来为此做准备`none`，这将完全禁用回退机制。install

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

![Graph of the alotta-files results](https://github.com/pnpm/benchmarks-of-javascript-package-managers/raw/main/results/imgs/alotta-files.svg)

![img](https://camo.githubusercontent.com/83b108abddef5c40f6afc985fa8214edc92b6f2226a83d577074a720907463c8/68747470733a2f2f706e706d2e696f2f696d672f62656e63686d61726b732f616c6f7474612d66696c65732e737667)
