# Data Model: 面试准备知识库（文件即数据）

本项目不引入数据库；“数据模型”对应 **Markdown 文件契约（frontmatter + 内容分区）**。

## Enums

### UnitType

- `project`
- `tech`
- `matrix`
- `qna`

### Mastery

- `not_started`
- `in_progress`
- `mastered`

## Entities

### ResumeSource

- **path**: string（默认 `docs/job-description/web前端开发工程师-彭聪.md`）
- **version_hint**: string（可选：commit hash / 更新时间 / 手工填写）
- **last_generated_at**: string（ISO datetime，可选）
- **parse_status**: `ok | partial | failed`
- **notes**: string（可选）

### KnowledgeUnit（文件级实体）

- **id**: string（稳定唯一，例如 `tech__react`、`project__dji-rms`）
- **type**: UnitType
- **title**: string
- **tags**: string[]（例如 `["react","hooks","performance"]`）
- **projects**: string[]（关联项目 id，可为空）
- **source_refs**: SourceRef[]（回链简历/大纲）
- **mastery**: Mastery
- **priority**: number（可选：用于 INDEX 排序；或由 INDEX 单独维护）
- **updated_at**: string（ISO date，可选）

### Project（project 类知识单元的内容字段）

- **time_range**: string（例如 `2022.10-2024.04`）
- **role**: string
- **stack**: string[]（例如 `["React 18","TypeScript","Webpack","Ant Design"]`）
- **scale**: string[]（例如 `["日均工单 1W+","100+ 页面"]`）
- **outcomes**: string[]（指标/业务价值）
- **decisions**: Decision[]（需求 → 架构 → 模块划分 → 构建部署 → 调试验证）
- **qna**: InterviewQuestion[]（面试官视角追问）

### TechnologyTopic（tech 类知识单元的内容字段）

- **used_in**: string（你项目中的使用场景/角色）
- **core_mechanism**: string（核心机制概述）
- **key_paths**: string[]（源码关键路径：概念路径，不绑定具体 repo）
- **lifecycle**: string[]（适用时：初始化/更新/销毁等）
- **pitfalls**: Pitfall[]（常见坑 + 排查路径）
- **alternatives**: Alternative[]（至少 2 个）
- **decision_basis**: string（为什么选它：业务/团队/遗留/风险）
- **qna**: InterviewQuestion[]
- **hands_on**: HandsOn[]（手写/最小示例链接）

### ComparisonMatrix（matrix 类知识单元的内容字段）

- **candidates**: string[]（候选方案）
- **dimensions**: string[]（评估维度）
- **table**: string（Markdown table）
- **context**: string（你项目上下文约束）
- **decision**: string（结论）
- **risks**: string[]（风险）
- **rollback_or_migration**: string（回滚/迁移策略）

### InterviewQuestion（qna 结构）

- **id**: string（可选）
- **question**: string
- **expected_outline**: string（推荐回答结构：CP-SO-L）
- **follow_ups**: string[]（延伸追问）
- **status**: `unknown | ok | strong`（可选，与 mastery 独立）

### SourceRef

- **source**: `resume | outline`
- **file**: string（相对路径）
- **anchor**: string（标题/小节名）
- **lines**: string（可选：`L10-L20` 形式）

### Decision / Pitfall / Alternative / HandsOn

以 Markdown 小节结构表达，不强制细粒度字段；需要时通过 frontmatter 的数组字段扩展。

## Validation Rules（可人工/脚本验证）

- 所有知识单元 MUST 有 `id/type/title/mastery`
- `interview-prep/` 内 MUST 仅存在一级 `.md` 文件（不允许子目录）
- `mastery` 必须为枚举值之一
- `type` 与文件名前缀一致（`tech__/project__/matrix__/qna__`）
- 自动区块必须用 `AUTO-GENERATED` 标记，生成脚本不得覆盖人工区块
