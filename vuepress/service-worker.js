if (!self.define) {
  const s = (s) => {
      'require' !== s && (s += '.js')
      let e = Promise.resolve()
      return (
        l[s] ||
          (e = new Promise(async (e) => {
            if ('document' in self) {
              const l = document.createElement('script')
              ;(l.src = s), document.head.appendChild(l), (l.onload = e)
            } else importScripts(s), e()
          })),
        e.then(() => {
          if (!l[s]) throw new Error(`Module ${s} didn’t register its module`)
          return l[s]
        })
      )
    },
    e = (e, l) => {
      Promise.all(e.map(s)).then((s) => l(1 === s.length ? s[0] : s))
    },
    l = { require: Promise.resolve(e) }
  self.define = (e, r, i) => {
    l[e] ||
      (l[e] = Promise.resolve().then(() => {
        let l = {}
        const a = { uri: location.origin + e.slice(1) }
        return Promise.all(
          r.map((e) => {
            switch (e) {
              case 'exports':
                return l
              case 'module':
                return a
              default:
                return s(e)
            }
          })
        ).then((s) => {
          const e = i(...s)
          return l.default || (l.default = e), l
        })
      }))
  }
}
define('./service-worker.js', ['./workbox-f7715658'], function (s) {
  'use strict'
  self.addEventListener('message', (s) => {
    s.data && 'SKIP_WAITING' === s.data.type && self.skipWaiting()
  }),
    s.precacheAndRoute(
      [
        { url: '404.html', revision: '27fbd0e0239d2f8f68ec1a998d6a4e35' },
        { url: 'assets/css/7339.styles.efb6fd39.css', revision: null },
        { url: 'assets/css/styles.86e107fd.css', revision: null },
        { url: 'assets/img/back-to-top.8b37f773.svg', revision: null },
        { url: 'assets/img/instasll.8c70bf30.jpg', revision: null },
        { url: 'assets/img/search.b017a09f.svg', revision: null },
        { url: 'assets/js/2338.6df637a1.js', revision: null },
        { url: 'assets/js/2961.e7c7a6a9.js', revision: null },
        { url: 'assets/js/3616.923c7839.js', revision: null },
        { url: 'assets/js/5205.d8806728.js', revision: null },
        { url: 'assets/js/9363.1015719a.js', revision: null },
        { url: 'assets/js/app.9267af72.js', revision: null },
        { url: 'assets/js/runtime~app.c4bd9219.js', revision: null },
        { url: 'assets/js/v-02b49bb5.9a8f508b.js', revision: null },
        { url: 'assets/js/v-0d6991cf.e629ccb0.js', revision: null },
        { url: 'assets/js/v-1128ff8f.c720f63a.js', revision: null },
        { url: 'assets/js/v-134daec4.26694552.js', revision: null },
        { url: 'assets/js/v-1993c2d1.b6557e38.js', revision: null },
        { url: 'assets/js/v-1df9b70c.d78c2c80.js', revision: null },
        { url: 'assets/js/v-29e2a472.79abd11d.js', revision: null },
        { url: 'assets/js/v-2aa367fe.0f83b55c.js', revision: null },
        { url: 'assets/js/v-2ab098c0.13d8c9b1.js', revision: null },
        { url: 'assets/js/v-2d633f67.cdd21da6.js', revision: null },
        { url: 'assets/js/v-314212cf.2c674199.js', revision: null },
        { url: 'assets/js/v-3448eb71.79074e3f.js', revision: null },
        { url: 'assets/js/v-349853b9.393e9c63.js', revision: null },
        { url: 'assets/js/v-3706649a.b5e9cbac.js', revision: null },
        { url: 'assets/js/v-3a1bce8b.3a1a4d8b.js', revision: null },
        { url: 'assets/js/v-3b303508.e9a0ebfb.js', revision: null },
        { url: 'assets/js/v-3dda66fa.83a0726d.js', revision: null },
        { url: 'assets/js/v-3ff2f74f.6d8fd944.js', revision: null },
        { url: 'assets/js/v-40748f39.aab0d2da.js', revision: null },
        { url: 'assets/js/v-43ebe826.8b6102ba.js', revision: null },
        { url: 'assets/js/v-46e6e855.1a75cf2d.js', revision: null },
        { url: 'assets/js/v-4bbf47d6.6d2e5e90.js', revision: null },
        { url: 'assets/js/v-4c78588a.807f79d1.js', revision: null },
        { url: 'assets/js/v-568d3b89.25e01e5b.js', revision: null },
        { url: 'assets/js/v-5f5e8084.27e8a010.js', revision: null },
        { url: 'assets/js/v-6657f713.baefd661.js', revision: null },
        { url: 'assets/js/v-6908e54b.b80d8794.js', revision: null },
        { url: 'assets/js/v-6abdbdea.9a4dac5c.js', revision: null },
        { url: 'assets/js/v-6c94be79.090adc1b.js', revision: null },
        { url: 'assets/js/v-6dcf6fe2.dc9d40b7.js', revision: null },
        { url: 'assets/js/v-73bc6b79.3a7d0bff.js', revision: null },
        { url: 'assets/js/v-74458d05.5999c6d2.js', revision: null },
        { url: 'assets/js/v-74473916.382828bf.js', revision: null },
        { url: 'assets/js/v-744e35e2.ae61c708.js', revision: null },
        { url: 'assets/js/v-759eeb6d.696cc5eb.js', revision: null },
        { url: 'assets/js/v-77d59f2c.a9698ac2.js', revision: null },
        { url: 'assets/js/v-7a5ee91d.98ad2949.js', revision: null },
        { url: 'assets/js/v-7bd3de6f.87df0615.js', revision: null },
        { url: 'assets/js/v-8daa1a0e.979f74c1.js', revision: null },
        { url: 'assets/js/v-8e6560ec.ff969146.js', revision: null },
        { url: 'assets/js/v-9588fb76.06e6c0cd.js', revision: null },
        { url: 'assets/js/v-ac6bd2fe.c290fd62.js', revision: null },
        { url: 'assets/js/v-aee1d2a4.be865eda.js', revision: null },
        { url: 'assets/js/v-b2f1bd9a.a41376db.js', revision: null },
        { url: 'assets/js/v-dd6edac6.6e22722f.js', revision: null },
        { url: 'assets/js/v-e687fcb4.408a2006.js', revision: null },
        { url: 'assets/js/v-eb8ea600.ee70f399.js', revision: null },
        { url: 'assets/js/v-f20d4d92.bbbfa957.js', revision: null },
        { url: 'css/index.html', revision: 'da9bcda2af25839a4b60cdf80af0f682' },
        { url: 'css/scss.html', revision: '2c53f6a6b87421bf753b98ba78fd9d80' },
        { url: 'css/skill.html', revision: '15fee979d3320464772a7f16a052cbc4' },
        {
          url: 'git/command.html',
          revision: 'f512d3bb63c73e62499fe5e3e5cea49b'
        },
        {
          url: 'git/commit.html',
          revision: 'd84990924a6a2e31f02f28d2cb101425'
        },
        { url: 'git/index.html', revision: 'ff66ad34fe1fac09990e67b2f36a8bfa' },
        { url: 'index.html', revision: '0dc048ec6df7bf93bd174f646534605f' },
        { url: 'issue/h5.html', revision: '2981dc70295e5a5b1e2c72bc12833078' },
        { url: 'issue/pc.html', revision: 'b3902f2b3aa6bb3195a23a9075328349' },
        {
          url: 'JavaScript/call、apply与bind.html',
          revision: 'ebf221079b625c81e75983cf6165bda0'
        },
        {
          url: 'JavaScript/index.html',
          revision: '24afa26e2551f5ba1d9929422cde04f2'
        },
        {
          url: 'JavaScript/js模拟bind方法.html',
          revision: 'ca6e1c341ca613c6a763e844534df476'
        },
        {
          url: 'JavaScript/js模拟new操作.html',
          revision: 'd050b7091ad313b35d43090761bc86f7'
        },
        {
          url: 'JavaScript/执行上下文-作用域链-闭包.html',
          revision: 'b3d96e6b3034be8b838d88e9d0a6db43'
        },
        {
          url: 'JavaScript/经典闭包处理.html',
          revision: 'bb1e014fab3242a06201f48c4e8627fe'
        },
        { url: 'logo.jpg', revision: 'bc708b3d27886ad0589bf5ea7ea96a2f' },
        { url: 'node/npm.html', revision: '0dedc790249b6d58e10039a8a467792e' },
        {
          url: 'node/toolkit.html',
          revision: '0a442429ebbf5b4abf40400f873ddf8e'
        },
        {
          url: 'online-tools/bookmark-scripts.html',
          revision: '4624ec99359b563f393f9eed24654430'
        },
        {
          url: 'online-tools/index.html',
          revision: '2c3980c9c8e8f8567c99e11adf5aa84b'
        },
        {
          url: 'react/class-hooks.html',
          revision: 'bf9aa23eead82de5f669a3d7bd7e8047'
        },
        {
          url: 'software/browser.html',
          revision: 'c3a4d9c5283981430923efab607f365c'
        },
        {
          url: 'software/cross-platform.html',
          revision: 'f275d7458be10953bcd2fca1116d5d75'
        },
        {
          url: 'software/mac.html',
          revision: 'c4349b2cdad8aadf5a1170c8b9a2c90b'
        },
        {
          url: 'software/vscode.html',
          revision: '4f4d8fc6bf7d2dcd33e3be4e8ee7aac6'
        },
        {
          url: 'software/webstorm.html',
          revision: '98ddac6bb017257ed6d11da96394ddb1'
        },
        {
          url: 'software/windows.html',
          revision: '229000d29d917427fe6b0eeb622aa7f6'
        },
        {
          url: 'software/zsh.html',
          revision: '99fef2266955d1f5fcc74557291bd2e6'
        },
        {
          url: 'theory/index.html',
          revision: '95b9ae2c5c7cfcd920a362feccaabe2e'
        },
        {
          url: 'TypeScript/index.html',
          revision: 'c95b77d29b497df832d552956c6159c4'
        },
        {
          url: 'utils/function.html',
          revision: '8282ff89454259803a5870173b3472c6'
        },
        {
          url: 'utils/library.html',
          revision: 'ba2efc8ee081fef79a7832db683f1ce5'
        },
        {
          url: 'utils/regexp.html',
          revision: 'debf3bbef687dfc351cd1ea3eaa63a71'
        },
        {
          url: 'vue/code/Object.defineproperty.html',
          revision: '5a4a923b1a991c3038806aec8aa34e74'
        },
        {
          url: 'vue/code/proxy-observe.html',
          revision: '97a81117b5e47cb01f49cf68408ec42b'
        },
        {
          url: 'vue/code/Proxy.html',
          revision: '5891bf8d86a5a6897baa4289d4034575'
        },
        { url: 'vue/index.html', revision: 'b9d561c8757f1257fb5d0587a6f2c28e' },
        {
          url: 'vue/vue_interview.html',
          revision: 'd778b2ae13452f4f85b2738b12350374'
        },
        {
          url: 'vue/vue_theory.html',
          revision: '0d33a391f793a0a9dbaea5bc3f32c177'
        },
        { url: 'vue/vue2.html', revision: '4ab24462641144a5f794ed6291ba7da6' },
        { url: 'vue/vue3.html', revision: 'b21687866010f7464a943f2d70d8ce84' },
        {
          url: 'webpack/install/index.html',
          revision: '245434761b48534403d559e16099516b'
        },
        {
          url: 'webpack/install/ni.html',
          revision: '4facbe972fbf0674c46fd79b7ef25f20'
        },
        {
          url: 'webpack/install/npm.html',
          revision: '0225e9b2cf794bf266a31fee35176be3'
        },
        {
          url: 'webpack/install/pnpm.html',
          revision: 'e43812c2e700ddfe9be0b21ddcdd8c52'
        },
        {
          url: 'webpack/install/yarn.html',
          revision: '4facbe972fbf0674c46fd79b7ef25f20'
        },
        {
          url: 'webpack/打包工具.html',
          revision: '4facbe972fbf0674c46fd79b7ef25f20'
        },
        {
          url: 'webpack/知识梳理.html',
          revision: '852a419bb2d557d7f5ea1d235b154a64'
        }
      ],
      {}
    )
})
