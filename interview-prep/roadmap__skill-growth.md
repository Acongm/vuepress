# 能力提升路线图（Skill Growth Roadmap）

> 目标：聚焦“不自信领域 + 深水区 + 新趋势”，用可执行、可验证、可复盘的方式持续迭代。
> 该路线图与 `tech-profile__entries.json`（条目）以及 `tools/validate-tech-profile.mjs`（验证入口）联动。

## 运行原则（非谈资，是真门禁）

- 每周必须产出**可验证证据**（测试或替代验证脚本/可运行示例/可复现步骤）
- 每周至少 1 次 **2 分钟口述演练**（CP-SO-L），并记录“卡点/追问/改进点”
- 每月一次“结构化复盘”：淘汰过期结论，补齐薄弱项的证据链

## 周迭代模板（RoadmapItem）

> 建议每周一个 timebox（如 2025-W52），只攻克一个主题。

### RoadmapItem: [theme]

- **Timebox**: [YYYY-W##]
- **Focus Areas**:
  - [1] …
  - [2] …
- **Deliverables**（本周必须交付）：
  - 新增/补强条目：`interview-prep/tech-profile__entries.json`（至少 1 个）
  - 更新索引：`interview-prep/tech-profile__index.md`（导航/演练入口）
  - 证据：脚本/示例/检查清单（至少 1 个可执行验证）
- **Verification（如何验收）**：
  - `node tools/validate-tech-profile.mjs --file interview-prep/tech-profile__entries.json --strict`
  - success: exit code 0 + summary “PASS”
  - failure: exit code 1 + error list
- **Reflection（复盘）**：
  - whatWentWell:
  - gaps:
  - nextActions:

## 月度复盘模板（Monthly Review）

> 目标：把“堆条目”升级为“体系化提升”。

- **新增条目**：本月新增/强化了哪些条目？是否都带可执行证据？
- **淘汰条目**：哪些结论过期？过期原因是什么（工具演进/业务约束变化/最佳实践变化）？
- **薄弱项变化**：本月最明显的 3 个短板是什么？下月如何拆成周任务？
- **趋势追踪**：本月新增 1 个趋势主题对比矩阵（结论 + 边界 + 风险 + 回滚）
- **面试复盘**：本月被追问击穿的点是什么？对应条目如何补齐“边界 + 证据 + 反例”？

## 季度复盘模板（Quarterly Retro）

- **Top 5 条目变化**：哪些进入/退出 Top 5？原因是什么？
- **证据质量**：可复现性是否足够强？失败信号是否清晰？是否存在“不可复现/不可验收”的条目？
- **回滚案例**：本季度是否遇到“优化副作用”？如何记录回滚策略并沉淀为条目经验？
- **体系升级**：是否需要新增一张对比矩阵？是否需要升级校验规则（strict）？

## Practice Log（演练记录）

> 记录 2 分钟口述演练：卡点、追问、改进方案。每周至少 1 条。

- [YYYY-MM-DD] Entry: [id]
  - 卡点：
  - 面试追问：
  - 我当前回答的漏洞：
  - 下次改进（补齐边界/证据/对比）：
