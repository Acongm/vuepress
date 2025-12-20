# Research: 高级前端面试准备中枢（极简/自包含/可追溯）

本 research 旨在将所有“技术实现与组织方式”的不确定点收敛为明确决策，并记录备选方案与取舍。

## Decision 1：以“纯 Markdown + 文件契约”为唯一知识载体

- **Decision**：所有知识单元以 Markdown 文件表示，并使用 YAML frontmatter 承载结构化字段。
- **Rationale**：
  - 便于 Git 版本管理、diff review、长期迭代
  - 可被 VS Code / Obsidian / Ripgrep 直接检索
  - 与“工具链极简”目标一致（无需服务端/数据库/构建）
- **Alternatives considered**：
  - Notion/语雀：协作强但可追溯性与离线/版本化弱
  - SQLite/JSON DB：查询强但增加工具链复杂度、偏离极简目标

## Decision 2：知识单元“非嵌套扁平化”落地为同目录文件 + 稳定 ID

- **Decision**：所有知识单元文件统一放在 `interview-prep/` 根目录，文件名采用前缀分类：
  - `project__*.md`、`tech__*.md`、`matrix__*.md`
- **Rationale**：
  - 目录层级是“隐式分类”，容易导致维护与检索偏差；扁平文件 + tags/refs 更符合“可检索/可演练”
  - 通过 frontmatter 的 `id/type/tags/projects` 实现可扩展的逻辑分类
- **Alternatives considered**：
  - 以目录区分（tech/, project/, matrix/）：更整齐但不满足“扁平（一级分类）”约束
  - 单一 index 大文件：冲突与编辑成本高，不利于渐进补全与复用

## Decision 3：增量生成必须“保留人工补充”，通过标记区块实现

- **Decision**：生成脚本只更新文件中的自动区块：
  - `<!-- AUTO-GENERATED:START -->` 到 `<!-- AUTO-GENERATED:END -->`
  - 其余内容视为人工区块，生成过程不得覆盖
- **Rationale**：
  - 自动提取只能提供骨架，核心价值来自人工补齐（真实踩坑、取舍、反思）
  - 保留人工区块是长期可维护的关键
- **Alternatives considered**：
  - 全量重写：简单但必然丢失人工内容
  - 双文件（auto + manual）：降低冲突但阅读与引用成本更高

## Decision 4：最小可运行 examples 用“Node 标准库 + 浏览器原生能力”实现

- **Decision**：`examples/` 不引入构建工具（webpack/vite/rollup）作为依赖；示例通过：
  - Node 直接运行（CommonJS/ESM）验证模块边界与加载逻辑
  - 浏览器原生 `<script type="module">` 与 UMD wrapper（手写）验证格式差异
- **Rationale**：
  - 与“无外部依赖”强约束对齐
  - 强迫把原理讲清楚（而不是把复杂度外包给工具）
- **Alternatives considered**：
  - Rollup/tsdx/esbuild：更贴近生产但会引入构建复杂度与依赖管理，偏离本体系目标

## Decision 5：掌握度标记以 frontmatter + INDEX checkbox 双轨呈现

- **Decision**：
  - 每个知识单元：`mastery: not_started | in_progress | mastered`
  - `interview-prep/INDEX.md`：用 checkbox 汇总（便于快速扫）
- **Rationale**：
  - 单文件大纲适合“今天练什么”；单卡片状态适合“长期追踪”
- **Alternatives considered**：
  - 只用 checkbox：难以跨文件聚合统计
  - 只用 frontmatter：不够直观，缺少日常清单体验

## Open Questions（已收敛为约束）

- 不做 Web 演练界面：本阶段用 Markdown + 目录 + 编辑器能力替代（符合极简目标）
- “源码关键路径”不绑定某个具体 repo：以概念路径表达（例如 React 调度链路/webpack compilation 生命周期）
