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
        { url: '404.html', revision: '3ad918c425c29b282ae82ac784161f12' },
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
        { url: 'assets/js/app.f36ab19c.js', revision: null },
        { url: 'assets/js/runtime~app.c684472e.js', revision: null },
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
        { url: 'assets/js/v-349853b9.0eb1a044.js', revision: null },
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
        { url: 'css/index.html', revision: '72bd05db5e2a6e1b6ae575aa2161baff' },
        { url: 'css/scss.html', revision: '78fd94fe77038d83d244a36e7e1ca9dc' },
        { url: 'css/skill.html', revision: 'fffc08c09b009b0abcf69cde310d7d4f' },
        {
          url: 'git/command.html',
          revision: 'e1c672e188fc31114b41c4d75cfd59ee'
        },
        {
          url: 'git/commit.html',
          revision: 'b6e1bf304bcb6c66655fa2bb5068f841'
        },
        { url: 'git/index.html', revision: 'cdeaa3a65dfb2ca3b0227bfcd75bb284' },
        { url: 'index.html', revision: 'f455b89e834253aaccdf9a221ad129d5' },
        { url: 'issue/h5.html', revision: '80ecee2b65488245c6705871105d9544' },
        { url: 'issue/pc.html', revision: '03d2f4765e1c0569ef7d645ddecfd33b' },
        {
          url: 'JavaScript/call、apply与bind.html',
          revision: '33341b6f1b9835b5b041e2b96763975a'
        },
        {
          url: 'JavaScript/index.html',
          revision: 'fbe91722e36ea57fcd6b338fe0cc04e7'
        },
        {
          url: 'JavaScript/js模拟bind方法.html',
          revision: '3d7d6313e33fc1c42c444533d9a537e8'
        },
        {
          url: 'JavaScript/js模拟new操作.html',
          revision: 'd4e086f9070b5e2db1436d93139c97db'
        },
        {
          url: 'JavaScript/执行上下文-作用域链-闭包.html',
          revision: '5478a772c5d09bddef2b7c8f3362399f'
        },
        {
          url: 'JavaScript/经典闭包处理.html',
          revision: '3bf4739080d00670d600fbde91fc8757'
        },
        { url: 'logo.jpg', revision: 'bc708b3d27886ad0589bf5ea7ea96a2f' },
        { url: 'node/npm.html', revision: '0c71f5b7f795b9bdd2b2961095f0b642' },
        {
          url: 'node/toolkit.html',
          revision: '738bb4b5ef2de39709d6a910058476a9'
        },
        {
          url: 'online-tools/bookmark-scripts.html',
          revision: '155b0b4619c0608db667af8510e4cd73'
        },
        {
          url: 'online-tools/index.html',
          revision: '2186a3486c28ec8c3ee2bbec8351b029'
        },
        {
          url: 'react/class-hooks.html',
          revision: '7bf365752870bffc268a10fc1e025e19'
        },
        {
          url: 'software/browser.html',
          revision: 'aec01a5c2c11c9562a6d59a54c1d0f28'
        },
        {
          url: 'software/cross-platform.html',
          revision: '6e6c42166beaec51677c353a4477e46c'
        },
        {
          url: 'software/mac.html',
          revision: 'cdb581bb17a65f0c7acc8136c88af0ae'
        },
        {
          url: 'software/vscode.html',
          revision: 'eb89fdb4a7640d594bbd659c4514b3ff'
        },
        {
          url: 'software/webstorm.html',
          revision: '5415311b033421bce55d72af015cba09'
        },
        {
          url: 'software/windows.html',
          revision: 'dee9d845aa1a88c006c83e02c44febce'
        },
        {
          url: 'software/zsh.html',
          revision: '53e087b300dec22302e8f6982f92d51b'
        },
        {
          url: 'theory/index.html',
          revision: '70835c02df6eb3c997d6c6d3e30036ac'
        },
        {
          url: 'TypeScript/index.html',
          revision: '2ed72161a307145c2a4924689e901714'
        },
        {
          url: 'utils/function.html',
          revision: '98bc70162ded362d5f7ef8d6a36ce7b1'
        },
        {
          url: 'utils/library.html',
          revision: '868a2ee5429e8048dd676955a27721d8'
        },
        {
          url: 'utils/regexp.html',
          revision: '1aae857238a092796c1675f1e6dd2001'
        },
        {
          url: 'vue/code/Object.defineproperty.html',
          revision: '21f07c64d111a48358d99647838e1a07'
        },
        {
          url: 'vue/code/proxy-observe.html',
          revision: '313380416c0323a91156cd1e35a88282'
        },
        {
          url: 'vue/code/Proxy.html',
          revision: '9f5f660967280a36a42d4189581791af'
        },
        { url: 'vue/index.html', revision: '696f18ba5327a2023acae842dd957603' },
        {
          url: 'vue/vue_interview.html',
          revision: '841141a33e8b9a8c77d5dd463ecc32c3'
        },
        {
          url: 'vue/vue_theory.html',
          revision: 'c145e924213dbfe3f08f67e7100ded1a'
        },
        { url: 'vue/vue2.html', revision: '39d1f7aa2c1bf56114938d0e8f9545d4' },
        { url: 'vue/vue3.html', revision: '61d34247bf9817e263461691cf4a0025' },
        {
          url: 'webpack/知识梳理.html',
          revision: 'd38fe86e35b28344a894fec7b0145e43'
        }
      ],
      {}
    )
})
