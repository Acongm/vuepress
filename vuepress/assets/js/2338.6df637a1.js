;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [2338],
  {
    2338: (a, s, t) => {
      'use strict'
      t.r(s), t.d(s, { default: () => u })
      var e = t(6252)
      const o = (0, e.Wm)(
          'div',
          { class: 'adsbygoogle-box' },
          [
            (0, e.Wm)('ins', {
              class: 'adsbygoogle',
              style: { display: 'block' },
              'data-ad-layout': 'in-article',
              'data-ad-format': 'fluid',
              'data-ad-client': 'ca-pub-6846038091720568',
              'data-ad-slot': '1554369026'
            })
          ],
          -1
        ),
        d = (0, e.Uk)(' (adsbygoogle = window.adsbygoogle || []).push({}); ')
      var l = t(2961),
        c = t(1070)
      const u = {
        components: { Layout: l.Z },
        setup(a) {
          ;(0, c.X6)()
        },
        render: function (a, s, t, l, c, u) {
          const p = (0, e.up)('scriptx'),
            n = (0, e.up)('Layout', !0)
          return (
            (0, e.wg)(),
            (0, e.j4)(n, null, {
              'page-bottom': (0, e.w5)(() => [
                (0, e.Wm)(p, {
                  type: 'text/javascript',
                  src: '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
                  async: 'true'
                }),
                o,
                (0, e.Wm)(
                  p,
                  { type: 'text/javascript' },
                  { default: (0, e.w5)(() => [d]), _: 1 }
                )
              ]),
              _: 1
            })
          )
        }
      }
    }
  }
])
