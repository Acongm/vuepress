# interview-prep（扁平知识库）

本目录是“面试准备中枢”的**知识单元**存放区，遵循极简、聚焦、自包含原则：

- **扁平结构（硬约束）**：`interview-prep/` 下不允许子目录；所有知识单元都是一级 `.md` 文件
- **可追溯**：每个知识单元都必须在 frontmatter 中回链到简历或面试大纲（`source_refs/seed_refs`）
- **可演练**：每个知识单元都固定包含四个模块：原理简述 / 对比表格 / 模拟问答 / 手写代码区
- **可增量更新**：自动生成只允许改写 `<!-- AUTO-GENERATED:START -->...<!-- AUTO-GENERATED:END -->` 区块；其余内容视为人工补充，脚本不得覆盖

## 命名规范（稳定 ID）

- `project__<slug>.md`
- `tech__<slug>.md`
- `matrix__<slug>.md`

slug 使用小写 + `-` 连接（避免中文路径依赖）。

## 掌握度标记（mastery）

每个知识单元 frontmatter 必须包含：

- `mastery: not_started | in_progress | mastered`

建议日常通过 `INDEX.md` 的 checkbox 来跑清单，通过单元文件的 `mastery` 做长期追踪。

## 优先级排序（ORDER）

优先级顺序**只存储在** `INDEX.md` 的 `ORDER` 区块中（脚本会保留并在 `index` 生成时复用）：

- 你可以手改 ORDER 区块，或用命令 `reorder` 调整
- 不将顺序写入每个卡片 frontmatter（避免卡片频繁变更导致噪声 diff）

## 模拟问答状态规范

- `- [ ] ...`：未掌握/待补齐（会进入 `BLINDSPOTS.md`）
- `- [x] ...`：已掌握
- `- [!] ...`：高风险盲区（优先补齐，会进入 `BLINDSPOTS.md`）

## mastery 同步规则（选择：Manual-only）

`mastery` 字段不由脚本自动推断（避免误判）：

- 建议当你能稳定口述并手写关键片段后，再手动从 `in_progress` 改为 `mastered`

## 维护约定：人工区块（Manual）

每个知识单元建议保留以下小节作为人工补充区（脚本不会覆盖）：

- `## 我的补充（Manual）`
- `## 复盘与反思（Learnings）`（包含“如果重做会怎么改？”）

## 编辑器与格式

仓库根目录已有 `.editorconfig` 与 `.prettierrc`：

- `.editorconfig` 对 Markdown 默认不 trim trailing whitespace（允许列表/换行排版）
- 建议用 VS Code/Obsidian + 全局搜索（ripgrep/内置搜索）完成检索

## 边界声明：为什么不做 Web UI（CP-SO-L）

- **Context**：目标是高效面试准备与可追溯复盘
- **Problem**：Web UI/拖拽需要引入前端应用与状态持久化，增加工具链与维护成本
- **Solution**：用 `INDEX.md` + `reorder` 命令 + Markdown 链接替代“卡片主界面”
- **Outcome**：保留“可重排/可演练/可追溯”，同时维持零依赖与长期可维护
- **Learnings**：如果未来需要多人协作/统计分析，再考虑上 Web 层（但不作为当前阶段目标）
