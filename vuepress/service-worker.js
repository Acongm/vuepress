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
        { url: '404.html', revision: '015c6a0a1a2ec506c69792d01e536ef0' },
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
        { url: 'assets/js/app.c3cc03e6.js', revision: null },
        { url: 'assets/js/runtime~app.c916060c.js', revision: null },
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
        { url: 'assets/js/v-349853b9.c5151a29.js', revision: null },
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
        { url: 'css/index.html', revision: '26873441269a7c4d8396fc54ce0cb97b' },
        { url: 'css/scss.html', revision: '85724b3979ad4bf38791b5546bde5c17' },
        { url: 'css/skill.html', revision: '97273842afddf9ad12e15ab76285b615' },
        {
          url: 'git/command.html',
          revision: 'f608c76a37dee29cf58c5118844f7f79'
        },
        {
          url: 'git/commit.html',
          revision: 'a15f769e200f4da233a88383969c7d76'
        },
        { url: 'git/index.html', revision: 'eaaf29d94c7ae4ddb32be64a511dbda6' },
        { url: 'index.html', revision: '505397a7ccfa6e54fababfcfb094b113' },
        { url: 'issue/h5.html', revision: '27ba19ed8c229d7db8462e0f3196a1b1' },
        { url: 'issue/pc.html', revision: '1fd8301a1eae3d4082b8172a65156979' },
        {
          url: 'JavaScript/call、apply与bind.html',
          revision: '0b57881e5bcea4bd3ee07b024a274cda'
        },
        {
          url: 'JavaScript/index.html',
          revision: '4cce0c52369438c86f3687147db5bc1a'
        },
        {
          url: 'JavaScript/js模拟bind方法.html',
          revision: 'd623c5f61ab980ae7bba9232c897644b'
        },
        {
          url: 'JavaScript/js模拟new操作.html',
          revision: 'c88274edacff914a20889721ca811610'
        },
        {
          url: 'JavaScript/执行上下文-作用域链-闭包.html',
          revision: 'cb912ffc55a82f66b31dd858b2c1163b'
        },
        {
          url: 'JavaScript/经典闭包处理.html',
          revision: 'c688bac7b9d16d312b35dbb9a033d21f'
        },
        { url: 'logo.jpg', revision: 'bc708b3d27886ad0589bf5ea7ea96a2f' },
        { url: 'node/npm.html', revision: 'e7cb5f36af3b435a1211a1e6ef48ebb8' },
        {
          url: 'node/toolkit.html',
          revision: '535163de7087af9eb6e2ea3cbd93fe92'
        },
        {
          url: 'online-tools/bookmark-scripts.html',
          revision: '5b4757814d6cf2561034a32f34ff34d6'
        },
        {
          url: 'online-tools/index.html',
          revision: '7a07baec9bc8ed0205011f60e89e17c9'
        },
        {
          url: 'react/class-hooks.html',
          revision: '5c0c2ba988ffb7d5b8bc774b22f98238'
        },
        {
          url: 'software/browser.html',
          revision: '3283c55e6578019f3e299ece6301b4b1'
        },
        {
          url: 'software/cross-platform.html',
          revision: '85aea0a68bad9875ae2bd8fb0d91bac5'
        },
        {
          url: 'software/mac.html',
          revision: 'fc7e39d1d31ebf57c3f30997aa1b2323'
        },
        {
          url: 'software/vscode.html',
          revision: '2e8725ae6fd4a025cc7ec0ebb50c9275'
        },
        {
          url: 'software/webstorm.html',
          revision: '3bff9d9d75aae3661c96ef56ed7ff32e'
        },
        {
          url: 'software/windows.html',
          revision: 'd9f8721935cf69c9e08ddc484a02712b'
        },
        {
          url: 'software/zsh.html',
          revision: '7e72d77285b68bc0f850e77b8a0a82f4'
        },
        {
          url: 'theory/index.html',
          revision: '14789bd0d9ed3a19be4052e1b5591a69'
        },
        {
          url: 'TypeScript/index.html',
          revision: 'd66db8f3123f70ee604d5e84512b8c10'
        },
        {
          url: 'utils/function.html',
          revision: 'a46ddfe59f68e2439222015e2179b611'
        },
        {
          url: 'utils/library.html',
          revision: 'e855ac1d637f41226e6166be24834c0c'
        },
        {
          url: 'utils/regexp.html',
          revision: '4046432a62b4c66a2784f313c0272eaf'
        },
        {
          url: 'vue/code/Object.defineproperty.html',
          revision: '73fe0afe226260fed5353ff95ae4021c'
        },
        {
          url: 'vue/code/proxy-observe.html',
          revision: 'cf62600035d8e6bdc49a49ed2108019e'
        },
        {
          url: 'vue/code/Proxy.html',
          revision: 'f27bb8dfb49b5eb69e0fd8d23aa948c0'
        },
        { url: 'vue/index.html', revision: '5f7d6b8d936ca738225fe579bcff9582' },
        {
          url: 'vue/vue_interview.html',
          revision: '164cba680c71238021faa70e4e911b5a'
        },
        {
          url: 'vue/vue_theory.html',
          revision: 'db114f65145c5cf65aa8a97c96f4e4c5'
        },
        { url: 'vue/vue2.html', revision: 'ef09608750b5780d538e5d808155696c' },
        { url: 'vue/vue3.html', revision: '0e3926b2681562557fd5d012e3dae764' },
        {
          url: 'webpack/知识梳理.html',
          revision: 'fb814eba7aff82f903e7e532b6475627'
        }
      ],
      {}
    )
})
