import {
  h
} from "./chunk-RD23DWRW.js";
import "./chunk-U7GNEWGK.js";
import {
  init_define_MZ_ZOOM_OPTIONS,
  init_define_SEARCH_HOT_KEYS,
  init_define_SEARCH_LOCALES
} from "./chunk-MGOF5EPL.js";

// dep:vue-scriptx
init_define_MZ_ZOOM_OPTIONS();
init_define_SEARCH_HOT_KEYS();
init_define_SEARCH_LOCALES();

// node_modules/vue-scriptx/dist/index.js
init_define_MZ_ZOOM_OPTIONS();
init_define_SEARCH_HOT_KEYS();
init_define_SEARCH_LOCALES();

// node_modules/vue-scriptx/dist/utils.js
init_define_MZ_ZOOM_OPTIONS();
init_define_SEARCH_HOT_KEYS();
init_define_SEARCH_LOCALES();
var utils_default = class {
  static isUndefined(x) {
    return x === void 0;
  }
  static pick(o, props) {
    let x = {};
    props.forEach((k) => {
      x[k] = o[k];
    });
    return x;
  }
  static omit(o, props) {
    let x = {};
    Object.keys(o).forEach((k) => {
      if (props.indexOf(k) === -1)
        x[k] = o[k];
    });
    return x;
  }
  static omitBy(o, pred) {
    let x = {};
    Object.keys(o).forEach((k) => {
      if (!pred(o[k]))
        x[k] = o[k];
    });
    return x;
  }
  static defaults(o, ...sources) {
    sources.forEach((s) => {
      Object.keys(s).forEach((k) => {
        if (this.isUndefined(o[k]) || o[k] === "")
          o[k] = s[k];
      });
    });
  }
};

// node_modules/vue-scriptx/dist/index.js
var VueScriptX = class {
  constructor() {
    this.installed = false;
    this.promise = Promise.resolve();
    this.loaded = {};
    this.props = ["unload", "src", "type", "async", "integrity", "text", "crossorigin"];
  }
  install(app) {
    app.config.globalProperties.$scriptx = this;
    let self = this;
    if (self.installed)
      return;
    app.component("scriptx", {
      props: self.props,
      render() {
        return h("div", { style: "display:none" }, this.$slots.default ? this.$slots.default() : void 0);
      },
      mounted() {
        let parent = this.$el.parentElement;
        if (!this.src) {
          self.promise = self.promise.then(() => {
            let script = document.createElement("script");
            let el = this.$el.innerHTML;
            el = el.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&");
            script.type = "text/javascript";
            script.appendChild(document.createTextNode(el));
            parent.appendChild(script);
            this.$emit("loaded");
          });
        } else {
          let opts = utils_default.omitBy(utils_default.pick(this, self.props), utils_default.isUndefined);
          opts.parent = parent;
          let load = () => {
            self.load(this.src, opts).then(() => this.$emit("loaded"), (err) => this.$emit("error", err));
          };
          if (utils_default.isUndefined(this.async) || this.async === "false")
            self.promise = self.promise.then(load);
          else
            load();
        }
        this.$nextTick(() => {
          this.$el.parentElement.removeChild(this.$el);
        });
      },
      unmounted() {
        if (this.unload) {
          new Function(this.unload)();
          delete self.loaded[this.src];
        }
      }
    });
    self.installed = true;
  }
  load(src, opts = { parent: document.head }) {
    if (!this.loaded[src]) {
      this.loaded[src] = new Promise((resolve, reject) => {
        let script = document.createElement("script");
        utils_default.defaults(script, utils_default.omit(opts, ["unload", "parent"]), { type: "text/javascript" });
        script.async = false;
        script.src = src;
        if (opts.crossorigin) {
          script.crossOrigin = opts.crossorigin;
        }
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(src));
        opts.parent.appendChild(script);
      });
    }
    return this.loaded[src];
  }
};
var dist_default = new VueScriptX();

// dep:vue-scriptx
var vue_scriptx_default = dist_default;
export {
  vue_scriptx_default as default
};
//# sourceMappingURL=vue-scriptx.js.map
