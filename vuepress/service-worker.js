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
        { url: '404.html', revision: 'aaacf20be20b91add92596b924cb186c' },
        { url: 'assets/css/7339.styles.efb6fd39.css', revision: null },
        { url: 'assets/css/styles.715acfc1.css', revision: null },
        { url: 'assets/img/back-to-top.8b37f773.svg', revision: null },
        { url: 'assets/img/instasll.8c70bf30.jpg', revision: null },
        { url: 'assets/img/search.b017a09f.svg', revision: null },
        { url: 'assets/js/2338.6df637a1.js', revision: null },
        { url: 'assets/js/2961.e7c7a6a9.js', revision: null },
        { url: 'assets/js/3616.923c7839.js', revision: null },
        { url: 'assets/js/5205.d8806728.js', revision: null },
        { url: 'assets/js/9363.1015719a.js', revision: null },
        { url: 'assets/js/app.6dc342fa.js', revision: null },
        { url: 'assets/js/runtime~app.b2fe5ccd.js', revision: null },
        { url: 'assets/js/v-02b49bb5.9a8f508b.js', revision: null },
        { url: 'assets/js/v-1128ff8f.c720f63a.js', revision: null },
        { url: 'assets/js/v-134daec4.26694552.js', revision: null },
        { url: 'assets/js/v-1993c2d1.b6557e38.js', revision: null },
        { url: 'assets/js/v-1df9b70c.d78c2c80.js', revision: null },
        { url: 'assets/js/v-29e2a472.79abd11d.js', revision: null },
        { url: 'assets/js/v-2aa367fe.0f83b55c.js', revision: null },
        { url: 'assets/js/v-2ab098c0.13d8c9b1.js', revision: null },
        { url: 'assets/js/v-2d633f67.cdd21da6.js', revision: null },
        { url: 'assets/js/v-3448eb71.79074e3f.js', revision: null },
        { url: 'assets/js/v-349853b9.e24ee99b.js', revision: null },
        { url: 'assets/js/v-3706649a.b5e9cbac.js', revision: null },
        { url: 'assets/js/v-3a1bce8b.3a1a4d8b.js', revision: null },
        { url: 'assets/js/v-3b303508.e9a0ebfb.js', revision: null },
        { url: 'assets/js/v-3dda66fa.d90b2a64.js', revision: null },
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
        { url: 'assets/js/v-74473916.c6c8f43c.js', revision: null },
        { url: 'assets/js/v-744e35e2.ae61c708.js', revision: null },
        { url: 'assets/js/v-77d59f2c.a9698ac2.js', revision: null },
        { url: 'assets/js/v-7bd3de6f.87df0615.js', revision: null },
        { url: 'assets/js/v-8daa1a0e.83d6283d.js', revision: null },
        { url: 'assets/js/v-8e6560ec.ff969146.js', revision: null },
        { url: 'assets/js/v-9588fb76.06e6c0cd.js', revision: null },
        { url: 'assets/js/v-ac6bd2fe.c290fd62.js', revision: null },
        { url: 'assets/js/v-aee1d2a4.be865eda.js', revision: null },
        { url: 'assets/js/v-b2f1bd9a.a41376db.js', revision: null },
        { url: 'assets/js/v-dd6edac6.6e22722f.js', revision: null },
        { url: 'assets/js/v-eb8ea600.ee70f399.js', revision: null },
        { url: 'assets/js/v-f20d4d92.bbbfa957.js', revision: null },
        { url: 'css/index.html', revision: '07d5d0c1be319a62d4ab1a953a0f250f' },
        { url: 'css/scss.html', revision: '6f4b181be7e140d336a6dd8ffbf2a414' },
        { url: 'css/skill.html', revision: '86befb8876e60d841c0da5f0b3739955' },
        {
          url: 'git/command.html',
          revision: 'd94a9b23e8e7d09fd28be0ea210f0696'
        },
        {
          url: 'git/commit.html',
          revision: '570361b34cfb7817c59c3fabd72b5169'
        },
        { url: 'git/index.html', revision: '2ded7cef29dec3ad765753eccb9e984c' },
        { url: 'index.html', revision: '7991263d49d26754978d9fac2a5d1a49' },
        { url: 'issue/h5.html', revision: '53ed9de79d463c4f746a20735861da52' },
        { url: 'issue/pc.html', revision: '7c2e8e13a23bbf16457feb215f7d35be' },
        {
          url: 'JavaScript/call、apply与bind.html',
          revision: 'd45b77667492f09e8317e9cf9526eeaa'
        },
        {
          url: 'JavaScript/index.html',
          revision: '35cfd39bc6ded1376cc97db01305fe3f'
        },
        {
          url: 'JavaScript/js模拟bind方法.html',
          revision: 'a22c818dba3984b528f8136df5d29478'
        },
        {
          url: 'JavaScript/js模拟new操作.html',
          revision: 'aa9afcde3c1416d4d00140837c270f2a'
        },
        {
          url: 'JavaScript/执行上下文-作用域链-闭包.html',
          revision: '94d79abe0f769d3646b27fda204fa713'
        },
        {
          url: 'JavaScript/经典闭包处理.html',
          revision: '844271f177e09861ff5ee4b88a5cf9ab'
        },
        { url: 'logo.jpg', revision: 'bc708b3d27886ad0589bf5ea7ea96a2f' },
        { url: 'node/npm.html', revision: '8bdccd89ae0155dec868fe650b5b46f2' },
        {
          url: 'node/toolkit.html',
          revision: '81b2e8d287bc3f94d5eda935f9d3f2a7'
        },
        {
          url: 'online-tools/bookmark-scripts.html',
          revision: 'b66780e2cecd51379dc48601c78747ea'
        },
        {
          url: 'online-tools/index.html',
          revision: 'ab6f18d75ed854ed6bccff8a8a3badf7'
        },
        {
          url: 'react/class-hooks.html',
          revision: '70fae1400e17ef095745a0595b0264bd'
        },
        {
          url: 'software/browser.html',
          revision: 'c4da295a571834de28951da7202c884e'
        },
        {
          url: 'software/cross-platform.html',
          revision: 'c8e2936f315373ad8e08b63976022006'
        },
        {
          url: 'software/mac.html',
          revision: 'adcb7c60e1cb3a75419e9ca7a52b7682'
        },
        {
          url: 'software/vscode.html',
          revision: '3c5fdde467ffee18c6a9a5675da76f4b'
        },
        {
          url: 'software/webstorm.html',
          revision: 'd7a2d7e86f42defbe34b1a236cdc1001'
        },
        {
          url: 'software/windows.html',
          revision: '51a73a9da3b57bb360b04816763ea39d'
        },
        {
          url: 'software/zsh.html',
          revision: '218963423dcc64609619ae632877f6ee'
        },
        {
          url: 'theory/index.html',
          revision: '2fac01bac0da576b5ecd95949985565b'
        },
        {
          url: 'TypeScript/index.html',
          revision: '2d105a4adb5937144b1801c21a203f81'
        },
        {
          url: 'utils/function.html',
          revision: '804f02e486cfc7466f9829401efeabd9'
        },
        {
          url: 'utils/library.html',
          revision: '0e0c17203fe5f16e0fde5e4d9a3a0af1'
        },
        {
          url: 'utils/regexp.html',
          revision: '84ee2ce7d360acfea6177a9fe17a5f74'
        },
        {
          url: 'vue/code/Object.defineproperty.html',
          revision: 'c3e1c128f3474c9c058f42285ab4ed39'
        },
        {
          url: 'vue/code/proxy-observe.html',
          revision: '6ff5f28211abb72bbe5c2a610443eeeb'
        },
        {
          url: 'vue/code/Proxy.html',
          revision: 'b9bc52fe1413c9dd8d430128cd0a7d90'
        },
        { url: 'vue/index.html', revision: 'f378d141f38ff3f5dbffade6cf9c5bb4' },
        {
          url: 'vue/vue_interview.html',
          revision: '03a873162e9bb7aaa05fc0c57c55de2d'
        },
        {
          url: 'vue/vue_theory.html',
          revision: '26b9232df0cd78f07ededd8a2453ae5d'
        },
        { url: 'vue/vue2.html', revision: '711e2ea2beb2b3cf5a425cd6bdc5a230' },
        { url: 'vue/vue3.html', revision: 'b3ff2befb5ca7c8fafe3e12c592877b1' },
        {
          url: 'webpack/知识梳理.html',
          revision: 'be6329f202ca6e2ff94efc9c34ba68f1'
        }
      ],
      {}
    )
})
