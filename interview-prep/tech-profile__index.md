# 技术画像（Tech Profile）索引

> 目标：把“我擅长什么 / 我怎么做决策 / 我如何验证”固化成可复述、可检索、可验收的结构化资产。
> 本索引与 `interview-prep/tech-profile__entries.json`、`tools/validate-tech-profile.mjs` 共同构成闭环。

## 入口

- **条目数据**：`interview-prep/tech-profile__entries.json`
- **校验脚本（替代验证）**：`node tools/validate-tech-profile.mjs --file interview-prep/tech-profile__entries.json`
- **决策剧本（矩阵）**：
  - 构建工具：`interview-prep/matrix__tech-compare-bundlers.md`
  - 微前端：`interview-prep/matrix__tech-compare-micro-frontend.md`
- **路线图**：`interview-prep/roadmap__skill-growth.md`

## 熟练度分层（proficiency rubric）

> 统一口径：避免“会用/熟悉/精通”定义不一致。

- **core**：能独立做架构设计/方案落地/风险控制，并能处理高压故障与性能攻坚；可输出可验证证据与复盘方法。
- **strong**：能在复杂业务中做关键决策与推进落地；能解释权衡、边界与替代方案；能为关键点提供验证入口。
- **working**：能在指导或既有模式下稳定交付；对坑点有经验，但对原理/边界/验证体系仍需补齐。
- **aware**：了解概念与适用场景，可做横向对比；缺少真实落地/可验证证据。

## 简历锚点（resume anchors）

> 所有条目必须引用至少一个 `resume:*` 标识，绑定真实上下文（见 `docs/job-description/web前端开发工程师-彭聪.md`）。

- `resume:user-center`：大疆用户中心重构（Vue3 + TS + Vite + Pinia，LCP 2.3s→1.4s）
- `resume:dji-rms`：大疆售后 RMS 系统重构（React18 + TS + Webpack + Antd，工程化与治理）
- `resume:announce-plugin`：跨平台公告插件系统（Rollup + Preact，包体积<15KB，热插拔接入）
- `resume:devops`：DevOps 平台维护（Vue3 + TS + qiankun，CI/CD 与流程治理）
- `resume:xdr`：XDR 大屏报表（React + ECharts + NestJS + mongoose，全栈交付）

## 分类导航（建议）

- **Framework**：React / Vue / Preact
- **Language**：TypeScript / JavaScript
- **Tooling**：Webpack / Vite / Rollup / CI/CD
- **Architecture**：Micro-Frontend / Plugin System / Low-code
- **Performance**：LCP / 大屏性能 / 万级数据秒开
- **Testing**：分层测试策略、可测性设计（待补齐）
- **Backend Integration**：NestJS / Node / 定时任务（以“前端视角的系统交付”表述）

## 条目清单（entries）

> 说明：条目内容在 `tech-profile__entries.json`，此处只做导航与演练入口。

### Top 5（面试高频 + 最能代表你）

1. `react18-arch-state`（React 18 架构与状态治理）
2. `typescript-boundaries`（TypeScript 类型安全与边界设计）
3. `webpack-governance`（Webpack 构建与发布治理）
4. `perf-lcp-firstscreen`（性能优化：LCP/首屏/万级数据）
5. `micro-frontend-qiankun`（微前端 qiankun 治理）

### 全量条目（至少 12）

- `react18-arch-state`
- `typescript-boundaries`
- `webpack-governance`
- `vite-migration-perf`
- `rollup-treeshaking`
- `micro-frontend-qiankun`
- `perf-lcp-firstscreen`
- `antd-design-system`
- `lowcode-platform`
- `cicd-docker-pipeline`
- `nestjs-fullstack-jobs`
- `echarts-dashboard-perf`

## 2-minute drill（2 分钟口述演练）

每次演练只做一条，按 CP-SO-L 结构复述：

- **Context**：项目/约束（必须带 resume anchor）
- **Problem**：遇到的真实问题（规模/性能/协作/发布/稳定性）
- **Solution**：关键方案（原则/模式/最佳实践 + 取舍）
- **Outcome**：量化结果（指标/效率/缺陷率等）
- **Learnings**：可迁移的规律 + 下次如何做更好

建议记录在：`interview-prep/roadmap__skill-growth.md` 的 Practice Log。

## Review checklist（条目审阅清单）

- **结构完整**：principles/patterns/bestPractices/alternatives/tradeOffs/boundaries/cpsol/verification 是否齐全？
- **边界清晰**：什么前提下成立？什么场景不适用？
- **证据可复现**：howToRun 可复制执行？success/failure 信号明确？
- **风险与回滚**：副作用是什么？如何兜底/回滚？
- **一致性**：术语/命名/结构是否符合约定？涉及 UX 时是否包含 a11y/错误态/空状态？

## Naming conventions（命名与引用规范）

- **条目 id**：`kebab-case`（示例：`webpack-governance`），稳定且可引用
- **refs 约定**：
  - `resume:*`：绑定简历项目上下文（必需至少 1 个）
  - `md:interview-prep/<file>.md`：引用仓库内 markdown（用于 link 校验）
  - `url:<...>`：外部资料（不做网络校验）
- **矩阵文件**：`matrix__tech-compare-*.md`，必须包含结论/边界/风险/回滚

## Validation snapshot（基线输出）

> 运行 `node tools/validate-tech-profile.mjs --file interview-prep/tech-profile__entries.json --strict` 后，
> 将摘要粘贴在这里作为基线证据。（待生成）
