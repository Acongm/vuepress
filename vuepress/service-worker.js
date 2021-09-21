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
        { url: '404.html', revision: '7ad8889bdf45d092e76a7b8c34e63d34' },
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
        { url: 'assets/js/app.0e06fff3.js', revision: null },
        { url: 'assets/js/runtime~app.f2c439b1.js', revision: null },
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
        { url: 'assets/js/v-349853b9.aef89cb9.js', revision: null },
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
        { url: 'css/index.html', revision: '22a66bdcf8c94812af851e019c003d61' },
        { url: 'css/scss.html', revision: 'd1e390eecdbeaab90148f0c9f8d81eb5' },
        { url: 'css/skill.html', revision: '2824392d20f8094f6e4e019c6c9ec223' },
        {
          url: 'git/command.html',
          revision: '923444d603c33e46adcbace3e15dac1d'
        },
        {
          url: 'git/commit.html',
          revision: '6011b0af9c972c0488584fb07c27ce1b'
        },
        { url: 'git/index.html', revision: '7ed58a98c10606b5f122940d933c608b' },
        { url: 'index.html', revision: '9a76bc5b5fcd25ef548a729fdcde4fda' },
        { url: 'issue/h5.html', revision: 'e5b996e7edf1135b8835f13df6900a1b' },
        { url: 'issue/pc.html', revision: '19ff2705e8de029f9c57ffab7d17f6e1' },
        {
          url: 'JavaScript/call、apply与bind.html',
          revision: 'd1fd9d5ecc2c3e8d0d3f38345ac7e47d'
        },
        {
          url: 'JavaScript/index.html',
          revision: '7e9d8577c43bb002a2721f30b13936b8'
        },
        {
          url: 'JavaScript/js模拟bind方法.html',
          revision: '997b56e75fb812d8d063ff9fe87817c3'
        },
        {
          url: 'JavaScript/js模拟new操作.html',
          revision: '12b3c5c1a5beb42d74d4f9dc0611042d'
        },
        {
          url: 'JavaScript/执行上下文-作用域链-闭包.html',
          revision: 'a1c0e94ccdaa9c3d958e591b55387210'
        },
        {
          url: 'JavaScript/经典闭包处理.html',
          revision: '722239f06761e6a0783b47f255af8f43'
        },
        { url: 'logo.jpg', revision: 'bc708b3d27886ad0589bf5ea7ea96a2f' },
        { url: 'node/npm.html', revision: 'e3a33b5b8dfae20eb86976be1a36a17d' },
        {
          url: 'node/toolkit.html',
          revision: 'df84dc69158f85901ee91f8b7f5c6aac'
        },
        {
          url: 'online-tools/bookmark-scripts.html',
          revision: 'd00464987ff97ab10013bf0c13daf928'
        },
        {
          url: 'online-tools/index.html',
          revision: 'a4e2500aa40814d455ab245153caaf2d'
        },
        {
          url: 'react/class-hooks.html',
          revision: '61fcd1c81a779fcef4671c86ec479e70'
        },
        {
          url: 'software/browser.html',
          revision: '96ace6fd932d2267b49777fa2cd2d857'
        },
        {
          url: 'software/cross-platform.html',
          revision: '8a3d8aaf8bf4be9fcec36ba2fcfd0ca3'
        },
        {
          url: 'software/mac.html',
          revision: '8b850c3bc714a0dbab6901eab204140e'
        },
        {
          url: 'software/vscode.html',
          revision: 'd79b5f933fee75c6c0532679ff48dcc5'
        },
        {
          url: 'software/webstorm.html',
          revision: 'd6beb7e5a041a75d85ba967998c14fee'
        },
        {
          url: 'software/windows.html',
          revision: '7fcf700655e3a2a0b5edea20b9b994b2'
        },
        {
          url: 'software/zsh.html',
          revision: '12da47aac4a5fac187ff6d38f6a5298b'
        },
        {
          url: 'theory/index.html',
          revision: '2b9062ee466b94e1622f392e07fbb2f4'
        },
        {
          url: 'TypeScript/index.html',
          revision: '6a5a3bc422dcf471746f526e2d5063c0'
        },
        {
          url: 'utils/function.html',
          revision: 'ba6743e5e7d539a783e17d8453ec61f1'
        },
        {
          url: 'utils/library.html',
          revision: '1ad08bc9e74e90bb18063c01ca77fd71'
        },
        {
          url: 'utils/regexp.html',
          revision: 'daa356c7582f445f204c9f31b57fbee1'
        },
        {
          url: 'vue/code/Object.defineproperty.html',
          revision: '6ccbb3f03802a8cfb4e4d686dc8ace41'
        },
        {
          url: 'vue/code/proxy-observe.html',
          revision: '654a11431849a50e61e215561d6475b6'
        },
        {
          url: 'vue/code/Proxy.html',
          revision: 'ca7f5ce45bbba007a787e083570055f2'
        },
        { url: 'vue/index.html', revision: '88bc29894e154c239c83ed4b5b676684' },
        {
          url: 'vue/vue_interview.html',
          revision: 'faf50552c83729e6f8d7cc23a9a87495'
        },
        {
          url: 'vue/vue_theory.html',
          revision: '99d87b326eb25a969a0ba1bfb0b2335c'
        },
        { url: 'vue/vue2.html', revision: 'bc5b5b46b51115993e6f3ccd854491bb' },
        { url: 'vue/vue3.html', revision: 'd4c6bcf8fcf025721862503e0bfc45b8' },
        {
          url: 'webpack/知识梳理.html',
          revision: 'da2d7bc8a27e3c51ddf03c1e42d0baaa'
        }
      ],
      {}
    )
})
