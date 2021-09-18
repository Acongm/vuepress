;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [3616],
  {
    3616: (e, t, n) => {
      'use strict'
      n.r(t), n.d(t, { default: () => h })
      var o = n(6252),
        u = n(3577)
      const l = { class: 'theme-container' },
        a = { class: 'theme-default-content' },
        s = (0, o.Wm)('h1', null, '404', -1)
      var m = n(7621),
        r = n(1070)
      const c = (0, o.aZ)({
        name: '404',
        setup() {
          var e, t, n
          const o = (0, m.I)(),
            u = (0, r.X6)(),
            l = null != (e = u.value.notFound) ? e : ['Not Found']
          return {
            getMsg: () => l[Math.floor(Math.random() * l.length)],
            homeLink: null != (t = u.value.home) ? t : o.value,
            homeText: null != (n = u.value.backToHome) ? n : 'Back to home'
          }
        }
      })
      c.render = function (e, t, n, m, r, c) {
        const h = (0, o.up)('RouterLink')
        return (
          (0, o.wg)(),
          (0, o.j4)('div', l, [
            (0, o.Wm)('div', a, [
              s,
              (0, o.Wm)('blockquote', null, (0, u.zw)(e.getMsg()), 1),
              (0, o.Wm)(
                h,
                { to: e.homeLink },
                {
                  default: (0, o.w5)(() => [
                    (0, o.Uk)((0, u.zw)(e.homeText), 1)
                  ]),
                  _: 1
                },
                8,
                ['to']
              )
            ])
          ])
        )
      }
      const h = c
    }
  }
])
