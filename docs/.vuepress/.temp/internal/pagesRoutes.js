import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/","Acongm",["/index.html","/README.md"]],
  ["v-568d3b89","/JavaScript/","js 基础知识",["/JavaScript/index.html","/JavaScript/README.md"]],
  ["v-29e2a472","/JavaScript/call%E3%80%81apply%E4%B8%8Ebind.html","call、apply 与 bind",["/JavaScript/call、apply与bind.html","/JavaScript/call、apply与bind.md","/JavaScript/call%E3%80%81apply%E4%B8%8Ebind.md"]],
  ["v-1128ff8f","/JavaScript/js%E6%A8%A1%E6%8B%9Fbind%E6%96%B9%E6%B3%95.html","js 模拟 bind 方法",["/JavaScript/js模拟bind方法.html","/JavaScript/js模拟bind方法.md","/JavaScript/js%E6%A8%A1%E6%8B%9Fbind%E6%96%B9%E6%B3%95.md"]],
  ["v-ac6bd2fe","/JavaScript/js%E6%A8%A1%E6%8B%9Fnew%E6%93%8D%E4%BD%9C.html","能否模拟实现 JS 的 new 操作符",["/JavaScript/js模拟new操作.html","/JavaScript/js模拟new操作.md","/JavaScript/js%E6%A8%A1%E6%8B%9Fnew%E6%93%8D%E4%BD%9C.md"]],
  ["v-aee1d2a4","/JavaScript/%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-%E9%97%AD%E5%8C%85.html","执行上下文-作用域链-闭包",["/JavaScript/执行上下文-作用域链-闭包.html","/JavaScript/执行上下文-作用域链-闭包.md","/JavaScript/%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-%E9%97%AD%E5%8C%85.md"]],
  ["v-2aa367fe","/JavaScript/%E7%BB%8F%E5%85%B8%E9%97%AD%E5%8C%85%E5%A4%84%E7%90%86.html","经典闭包处理",["/JavaScript/经典闭包处理.html","/JavaScript/经典闭包处理.md","/JavaScript/%E7%BB%8F%E5%85%B8%E9%97%AD%E5%8C%85%E5%A4%84%E7%90%86.md"]],
  ["v-3448eb71","/TypeScript/","TypeScript",["/TypeScript/index.html","/TypeScript/README.md"]],
  ["v-74458d05","/css/","CSS 语法相关",["/css/index.html","/css/README.md"]],
  ["v-134daec4","/css/scss.html","常用 SCSS 宏",["/css/scss.md"]],
  ["v-43ebe826","/css/skill.html","CSS 奇淫技巧",["/css/skill.md"]],
  ["v-74473916","/git/","Git",["/git/index.html","/git/README.md"]],
  ["v-5f5e8084","/git/command.html","Git 命令清单",["/git/command.md"]],
  ["v-77d59f2c","/git/commit.html","Git commit 规范",["/git/commit.md"]],
  ["v-dd6edac6","/issue/h5.html","H5 相关",["/issue/h5.md"]],
  ["v-f20d4d92","/issue/pc.html","PC 相关",["/issue/pc.md"]],
  ["v-6dcf6fe2","/node/npm.html","npm 相关",["/node/npm.md"]],
  ["v-7bd3de6f","/node/toolkit.html","常用工具包",["/node/toolkit.md"]],
  ["v-4bbf47d6","/online-tools/","网页工具",["/online-tools/index.html","/online-tools/README.md"]],
  ["v-6657f713","/online-tools/bookmark-scripts.html","书签脚本",["/online-tools/bookmark-scripts.md"]],
  ["v-2d633f67","/react/class-hooks.html","react",["/react/class-hooks.md"]],
  ["v-2ab098c0","/software/browser.html","浏览器扩展",["/software/browser.md"]],
  ["v-4c78588a","/software/cross-platform.html","多平台",["/software/cross-platform.md"]],
  ["v-6c94be79","/software/mac.html","Mac 平台",["/software/mac.md"]],
  ["v-eb8ea600","/software/vscode.html","Visual Studio Code 扩展",["/software/vscode.md"]],
  ["v-02b49bb5","/software/webstorm.html","WebStorm 配置",["/software/webstorm.md"]],
  ["v-9588fb76","/software/windows.html","Windows 平台",["/software/windows.md"]],
  ["v-73bc6b79","/software/zsh.html","zsh",["/software/zsh.md"]],
  ["v-1993c2d1","/theory/","面试题汇总",["/theory/index.html","/theory/README.md"]],
  ["v-8e6560ec","/utils/function.html","常用方法",["/utils/function.md"]],
  ["v-46e6e855","/utils/library.html","库收集",["/utils/library.md"]],
  ["v-40748f39","/utils/regexp.html","常用正则",["/utils/regexp.md"]],
  ["v-744e35e2","/vue/","Vue",["/vue/index.html","/vue/README.md"]],
  ["v-6908e54b","/vue/vue2.html","vue 原理",["/vue/vue2.md"]],
  ["v-6abdbdea","/vue/vue3.html","vue3 原理 - 总结",["/vue/vue3.md"]],
  ["v-b2f1bd9a","/vue/vue_interview.html","vue 面试题",["/vue/vue_interview.md"]],
  ["v-349853b9","/vue/vue_theory.html","vue 原理",["/vue/vue_theory.md"]],
  ["v-3dda66fa","/webpack/%E7%9F%A5%E8%AF%86%E6%A2%B3%E7%90%86.html","webpack",["/webpack/知识梳理.html","/webpack/知识梳理.md","/webpack/%E7%9F%A5%E8%AF%86%E6%A2%B3%E7%90%86.md"]],
  ["v-1df9b70c","/vue/code/Object.defineproperty.html","Object.defineproperty 核心代码 自定义实现",["/vue/code/Object.defineproperty.md"]],
  ["v-3a1bce8b","/vue/code/Proxy.html","Proxy 核心代码 自定义实现",["/vue/code/Proxy.md"]],
  ["v-3b303508","/vue/code/proxy-observe.html","proxy-observe 核心代码 自定义实现",["/vue/code/proxy-observe.md"]],
  ["v-3706649a","/404.html","",[]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, title, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta: { title },
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: Vuepress,
    }
  ]
)
