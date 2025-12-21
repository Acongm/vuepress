# 选型矩阵：构建工具（Bundlers）

> 目的：把“为什么选 Webpack / Vite / Rollup / Rspack”从口头经验固化为可复述的决策剧本（含边界与回滚）。
> 与条目互链：见 `interview-prep/tech-profile__index.md` 与 `interview-prep/tech-profile__entries.json`。

## Candidates

- Webpack
- Vite
- Rollup
- Rspack（趋势/替代项）

## Constraints（前提约束）

- 现有项目形态：多模块、多权限、100+ 页面（`resume:dji-rms`）
- 生态与历史包袱：既有 Webpack 插件/loader、构建链路与发布治理
- 产物形态：UMD/ESM 双产物（SDK/插件场景）可能需要（`resume:announce-plugin`）
- 团队协作：多人并行、Code Review、质量门禁（lint/构建/发布）

## Dimensions（评估维度）

- **DX**：开发体验（热更新/构建速度/调试）
- **Ecosystem**：插件生态成熟度（loader/plugin、SSR 适配等）
- **Output**：产物形态与可控性（tree-shaking、chunk 策略）
- **Migration**：迁移成本（配置/约束/历史债）
- **Performance**：构建性能与产物性能（bundle size/缓存）
- **Risk**：风险与回滚策略（灰度/双轨/可逆）

## Conclusion（结论）

- **应用型复杂系统（多页面 + 强插件生态）**：优先 Webpack（稳定、生态完整、治理手段成熟），除非迁移收益明显且可双轨运行。
- **新项目/偏应用但强调速度**：优先 Vite（冷启动/热更新优势），但要明确插件/兼容边界与回滚路径。
- **SDK/插件/库**：优先 Rollup（产物更小、tree-shaking 更好），需明确 UMD/ESM 产物策略与边界。
- **趋势项**：Rspack 可作为“Webpack 生态 + 更快构建”的候选，但必须以小范围双轨验证为前提。

## Rollback（回滚策略）

- **构建双轨**：保留原构建链路，新增候选链路并行产出，先在非关键模块灰度
- **产物对比**：体积/运行错误/监控指标对比，出现回归即回滚
- **可逆配置**：迁移期间不引入不可逆目录结构/大规模 API 改写

## Testing strategy matrix（build-time / runtime）

- **build-time**：产物体积预算、chunk 数量、sourcemap 可用性、构建时长阈值
- **runtime**：核心页面首屏/交互指标、错误率、长任务、资源加载瀑布
- **compat**：低端机/弱网、浏览器兼容、polyfill 策略

## Org & Process constraints（组织/流程约束）

- 团队规模与并行开发：需要稳定的 lint/构建门禁与回归防线
- 遗留系统：历史插件与 loader 迁移难度不可低估
- 发布频率：高频发布必须确保“可回滚”与“可观测”

## Links（互链）

- 条目：
  - `webpack-governance`
  - `vite-migration-perf`
  - `rollup-treeshaking`
- 索引：`interview-prep/tech-profile__index.md`
