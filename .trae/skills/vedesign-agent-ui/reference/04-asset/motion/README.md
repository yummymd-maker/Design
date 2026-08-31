# Asset · Motion

> **状态：✅ 保留两个 motion pattern** —— `spotlight-dot-grid` 用于欢迎页/Empty State 背景,`shimmer-border` 用于 Composer / ChatInput 输入框流光边框。

---

## 职责边界

| 在哪 | 放什么 |
|---|---|
| `reference/01-token/tokens.css` | 动效 token：`--motion-fast/base/slow`、`--ease-standard/enter/exit` |
| 本目录 | 背景粒子 pattern、输入框流光边框 pattern 的规格与源码 |
| 组件库 / 项目代码 | 其他组件动效、loading、hover、进入退出动画 |

如果任务需要本目录未提供的其他动效，优先使用 `@ve-design/react` 或项目现有动效规范；不要从本 skill 推导额外动效。

---

## 保留 Pattern

### spotlight-dot-grid · 漂浮光斑点阵

用途：欢迎页主面板 / Empty State 大插画区的持续氛围背景。静态点阵 + 光斑缓慢扫过，形成克制的背景粒子效果。

完整规格见：

- `reference/04-asset/motion/SPOTLIGHT-DOT-GRID.md`
- `reference/04-asset/motion/spotlight-dot-grid.css`
- `reference/04-asset/motion/spotlight-dot-grid.js`

消费方式：

1. 在 `<head>` 内联或引入 `spotlight-dot-grid.css`。
2. 在页面脚本中引入 `spotlight-dot-grid.js`。
3. 背景宿主加 `data-spotlight-dots` 和 `ved-spotlight-host`。
4. 内容用 `.ved-spotlight-content` 包裹，避免被 canvas 覆盖。
5. 页面 ready 时调用 `autoInitSpotlightDotGrids()`，动态插入时调用 `initSpotlightDotGrid()`。

### shimmer-border · 输入框 / artifact 单圈流光边框

用途：欢迎页 Composer 进入页面时立即单圈播放流光边框;对话流 artifact 卡片插入 DOM 时也可立即单圈播放。它用于宣告关键输入区或新产物出现,不替代组件库的输入、发送、附件、loading 或命令面板能力。

完整规格见：

- `reference/04-asset/motion/SHIMMER-BORDER.md`
- `reference/04-asset/motion/shimmer-border.css`
- `reference/04-asset/motion/shimmer-border.js`

消费方式：

1. 在 `<head>` 内联或引入 `shimmer-border.css`。
2. 在页面脚本中引入 `shimmer-border.js`。
3. Composer / ChatInput 外层容器添加 `.ved-shimmer-host`、`data-shimmer`、`data-shimmer-radius="20"`、`data-shimmer-stroke="1.5"`、`data-shimmer-duration="2.7"`、`data-shimmer-loops="1"`。
4. 页面 ready 时会自动初始化;动态插入时调用 `autoInitShimmerBorders()` 或 `initShimmerBorder(element, { radius: 20 })`。artifact 卡片若使用 `--radius-lg`，传 `data-shimmer-radius="12"`。

---

## 使用限制

- 只用于欢迎页主面板和 Empty State 大插画区。
- 不要加在对话气泡、artifact 卡、列表项、小尺寸卡片或正文阅读区域。
- host 必须有确定宽高、`position: relative` 和 `overflow: hidden`。
- 主题切换通过 `--ved-spotlight-color` 这类 CSS variable 控制即可，不需要重建实例。
- 浅色 / 深色的点阵颜色必须按背景关系反向：浅色白底用更深一点的浅冷灰 `232,232,240`；深色黑底用更亮一点的深冷灰 `60,60,70`。不要在浅色模式沿用深色的 `60,60,70`，也不要在深色模式沿用浅色的 `232,232,240`。

### shimmer-border 限制

- 默认只加在欢迎页 Composer 和动态插入的 artifact 卡片上;其他元素要先确认设计意图。
- 不要加在 textarea、发送按钮、Sidebar、对话气泡、列表行或大面积页面背景上。
- host 必须有确定尺寸,`.ved-shimmer-host` 负责 `position: relative`;`data-shimmer-radius` 必须等于宿主视觉圆角。
- 设计助手 Agent 必须使用本资产;`ChatInput borderGlow` / `ve-chat-input border-glow` 只能作为组件内置能力说明或辅助效果,不能替代 `shimmer-border.css/js`。

---

## 不再包含

组件进场、思考中指示器、loading 等动效需求交给组件库或项目现有动效系统处理。
