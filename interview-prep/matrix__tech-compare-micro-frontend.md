# 选型矩阵：微前端（Micro-Frontend）

> 目的：把“为什么选 qiankun / iframe / Web Component / Module Federation”等从经验固化成决策剧本。
> 绑定真实上下文：`resume:devops`（Vue3 + qiankun）。

## Candidates

- qiankun（基于 single-spa 的应用级微前端）
- iframe（隔离最强但体验/通信成本高）
- Web Component（组件级封装与隔离，治理成本中等）
- Module Federation（依赖共享/运行时加载，治理与版本风险更高）

## Dimensions（评估维度）

- **Isolation**：CSS/JS/全局副作用隔离能力
- **Routing**：路由与多应用切换体验
- **Communication**：跨应用通信与数据一致性
- **Dependency**：依赖共享/版本治理/冲突风险
- **Performance**：加载与运行时性能（首屏、切换、缓存）
- **Deploy**：发布与回滚（独立发布、灰度、兼容窗口）
- **DX**：本地开发体验与调试成本
- **Security**：沙箱与边界（XSS/CSP/第三方脚本）

## Conclusion（结论）

- **多系统聚合 + 需要相对一致体验 + 独立发布**：qiankun 是平衡选项，但必须把“隔离/通信/发布协同”治理成规则。
- **强隔离优先（安全/合规/第三方不可控）**：iframe 更稳，但要接受体验损耗与通信/SEO 限制。
- **组件级插件化（可嵌入多系统）**：Web Component 适合“公告插件/组件 SDK”类场景，配合版本治理与兼容策略。
- **强依赖共享与远程加载**：Module Federation 适合大仓/多团队，但必须建立严格版本治理与回滚窗口。

## Risks & Rollback（风险与回滚）

- **CSS 冲突**：BEM/命名空间/Shadow DOM（可选）+ 样式隔离策略；冲突不可控时回退 iframe/强隔离
- **全局污染**：沙箱白名单、依赖注入边界；发现第三方污染即隔离/降级
- **发布协同**：定义兼容窗口（host 与 subapp 的版本兼容期），不满足即阻断发布
- **性能回归**：预加载/缓存/分包；切换卡顿则回退到更粗粒度的拆分或减少并行加载

## Verification（验证清单入口）

- `md:examples/micro-frontend-isolation/README.md`（隔离检查清单 + 可复现验证步骤）

## Org & Process constraints（组织/流程约束）

- 多团队协作：接口契约与版本治理必须前置
- 遗留系统：接入成本与兼容性是首要约束
- 发布频率：独立发布必须配合灰度/回滚与可观测性

## Links（互链）

- 条目：`micro-frontend-qiankun`
- 索引：`interview-prep/tech-profile__index.md`
