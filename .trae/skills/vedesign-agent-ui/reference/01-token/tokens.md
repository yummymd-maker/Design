# Tokens · 完整字典

本文件按需查阅，**不必通读**。React 项目的默认主题入口优先使用 `@ve-design/react/css/default.css`；如果已有项目已经统一使用 `@ve-design/web/css/default.css`，沿用项目现有入口即可。自定义主题入口是 `./themes/custom-theme.css`，并且必须放在默认主题之后覆盖。本目录的 `tokens.css` 作为规范参考和静态原型 fallback，不是 React 项目的首选主题入口。

业务代码**只引 Semantic Token**，禁止跨层引 Primitive。Primitive 色板（17 个色板 × 11 个台阶 × Light/Dark）不在此文档列出，需要时直接查 CSS 文件。

主题自定义必须先经过 HITL:先确认亮色 / 暗色,再确认默认主题 / 自定义主题。选择自定义主题时必须收集一个主题色,并通过默认主题之后的 `./themes/custom-theme.css` 覆盖 primary palette / semantic token,不要把用户主题色直接写进业务 CSS。只有在无法可靠派生色阶时,才暂用默认主题并说明需要补齐完整色阶或由设计侧确认。

---

## 0. 速查表（80% 场景看这一节就够）

| 类目 | 默认 token | 链路（指向 primitive）| 实际值来源 |
|------|-----------|--------------------|----------|
| 页面背景 | `--color-bg-base` | → `--color-white` / `--color-gray-dark-50` | `tokens.css` |
| 卡片背景 | `--color-bg-surface` | → `--color-gray-50` / `--color-gray-dark-100` | `tokens.css` |
| 浮层背景 | `--color-bg-overlay` | → `--color-white` / `--color-gray-dark-200` | `tokens.css` |
| 主按钮背景 | `--color-bg-primary` | → `--color-primary-600` / `--color-primary-dark-600` | `tokens.css` |
| 正文颜色 | `--color-text-primary` | → `--color-gray-950` / `--color-gray-dark-950` | `tokens.css` |
| 辅助文字 | `--color-text-secondary` | → `--color-gray-800` / `--color-gray-dark-800` | `tokens.css` |
| 弱提示文字 | `--color-text-tertiary` | → `--color-gray-600` / `--color-gray-dark-600` | `tokens.css` |
| 反色文字（深底） | `--color-text-foreground` | → `--color-white` / `--color-gray-dark-50` | `tokens.css` |
| **主要 icon** | `--color-icon-primary` ⭐ | → `--color-text-secondary` (alias) | `tokens.css` |
| 链接 | `--color-blue-600` | (primitive 直引，链接组件例外) | `tokens.css` |
| 默认描边 | `--color-border-default` | → `--color-gray-300` / `--color-gray-dark-300` | `tokens.css` |
| 默认间距 | `--space-s` | 16px（尺寸，无 light/dark）| `tokens.css` |
| 默认字号 | `--text-body` | 14px | `tokens.css` |
| 默认圆角 | `--radius-md` | 8px | `tokens.css` |
| 默认描边粗细 | `--stroke-weight-base` | 0.5px | `tokens.css` |
| 默认阴影 | `--shadow-sm` | 见 §9 | `tokens.css` |
| 默认动效时长 | `--motion-base` | 250ms | `tokens.css` |

⚠️ **本表只列"链路"（semantic → primitive 引用关系），不列 hex 真值**。需要 hex 时**永远去查 `reference/01-token/tokens.css`**，不要从本文件复制 hex 写进业务代码。原则是：业务代码引 `var(--color-bg-base)` → 浏览器查 tokens.css 解析 → 不需要你（人 / AI）知道 hex 是什么。

⭐ = v0.1.3 新增

---

## 1. Background Tokens

| Token | Light 链路 | Dark 链路 | 用途 |
|-------|-----------|-----------|-----|
| `--color-bg-base` | → `--color-white` | → `--color-gray-dark-50` | 页面根背景、应用主画布等基础容器场景、**input 等基础组件背景** |
| `--color-bg-surface` | → `--color-gray-50` | → `--color-gray-dark-100` | sidebar、对话气泡、表格行 hover、Skeleton、日志/工具调用面板等承载型背景 |
| `--color-bg-overlay` | → `--color-white` | → `--color-gray-dark-200` | header、Popover、Dropdown、Modal、Drawer、命令面板等浮层容器 |
| `--color-bg-muted` | → `--color-gray-100` | → `--color-gray-dark-200` | sidebar 选中、Avatar、表头等弱强调背景 |
| `--color-bg-control` | → `--color-gray-100` | → `--color-gray-dark-200` | ⚠️ 待定 · CSS 内注释为"待定"，谨慎使用 |
| `--color-bg-inverse` | → `--color-gray-950` | → `--color-gray-dark-950` | 需要与浅色容器形成反差的反色背景，如 Tooltip |
| `--color-bg-primary` | → `--color-primary-600` | → `--color-primary-dark-600` | **主按钮、关键确认操作等背景色（黑色基调）** ★ |
| `--color-bg-secondary` | → `--color-primary-50` | → `--color-gray-dark-200` | 次按钮、模版示例背景、低强调交互控件的默认背景 |
| `--color-bg-icon` | → `--color-gray-800` | → `--color-gray-dark-800` | icon 填充色（⚠️ 优先用 `--color-icon-*` 系列，本 token 仅作底层 fallback）|

### 状态背景（语义反馈 · 浅底深字风格）

| Token | Light 链路 | Dark 链路 | 用途 |
|-------|-----------|-----------|-----|
| `--color-bg-success` | → `--color-green-50` | → `--color-green-dark-50` | 成功态 Tag/Alert/Toast/完成反馈容器（浅绿底）|
| `--color-bg-warning` | → `--color-orange-50` | → `--color-orange-dark-50` | 警告态 Tag/风险提醒条/待处理提示容器（浅橙底）|
| `--color-bg-danger` | → `--color-rose-50` | → `--color-rose-dark-50` | 错误状态卡/危险态通知/失败反馈容器（浅红底）|
| `--color-bg-info` | → `--color-blue-50` | → `--color-blue-dark-50` | 系统提示气泡/说明卡片/信息通知容器（浅蓝底）|

⚠️ **风格变更**：status 反馈从"实心 500 色"改成"浅底（50）+ 深字（900）"组合，更现代。实际 hex 见 `tokens.css`。

---

## 2. Text & Icon Tokens

### 2.1 Text

| Token | Light 链路 | Dark 链路 | 用途 |
|-------|-----------|-----------|-----|
| `--color-text-primary` | → `--color-gray-950` | → `--color-gray-dark-950` | 标题、正文、段落、列表项、浅色按钮等主要文字 |
| `--color-text-secondary` | → `--color-gray-800` | → `--color-gray-dark-800` | 描述和辅助信息 |
| `--color-text-tertiary` | → `--color-gray-600` | → `--color-gray-dark-600` | Input/Composer 占位、Sidebar 分组标题、Stepper 待办态等弱提示 |
| `--color-text-disable` | → `--color-primary-400` | → `--color-primary-dark-400` | 禁用按钮、禁用输入、禁用菜单等不可操作状态 |
| `--color-text-foreground` | → `--color-white` | → `--color-gray-dark-50` | **Tooltip、深色按钮等深色背景组件中的反色文字** ★ |
| `--color-text-accent` | → `--color-primary-600` | → `--color-primary-dark-600` | 强调文字色（黑色基调）—— ⚠️ 这是黑色，**不要当链接色**，链接用 `--color-blue-600` |

### 2.2 Icon ⭐ 新增

**新版 CSS 把 icon 颜色独立出来，5 个 alias token 跟 text token 一一对应**。Icon 颜色优先用本组，不再硬编码也不再用 `--color-bg-icon`。

| Token | Alias 到 | 等价 primitive 链路 | 用途 |
|-------|---------|--------------------|-----|
| `--color-icon-primary` | → `--color-text-secondary` | gray-800 / gray-dark-800 | 主要 icon：导航图标、操作图标等，与辅助文字同层级 |
| `--color-icon-secondary` | → `--color-text-tertiary` | gray-600 / gray-dark-600 | 辅助 icon：占位图标、弱提示图标等，与弱提示文字同层级 |
| `--color-icon-disable` | → `--color-text-disable` | primary-400 / primary-dark-400 | 禁用 icon |
| `--color-icon-foreground` | → `--color-text-foreground` | white / gray-dark-50 | 深色背景上的反色 icon |
| `--color-icon-accent` | → `--color-text-accent` | primary-600 / primary-dark-600 | 强调/可交互 icon |

### 2.3 状态文字（浅底深字风格 · 配 §1 状态背景）

| Token | Light 链路 | Dark 链路 | 用途 |
|-------|-----------|-----------|-----|
| `--color-text-success` | → `--color-green-900` | → `--color-green-dark-900` | 成功态标签文本、日志成功信息、任务完成状态 |
| `--color-text-warning` | → `--color-orange-900` | → `--color-orange-dark-900` | 警告标签、风险提示文案、需关注状态说明 |
| `--color-text-danger` | → `--color-rose-900` | → `--color-rose-dark-900` | 错误态文本、异常日志、删除/停止等危险操作提示 |
| `--color-text-info` | → `--color-blue-900` | → `--color-blue-dark-900` | 系统消息、说明性提示、信息通知 |

⚠️ **配色配对原则**：成功/警告/错误/信息容器统一走 "bg-{status} (50 浅底) + text-{status} (900 深字)" 组合，保持视觉对比度。

#### 2.3.1 风险等级文字 / 容器(安全 / 风控 / 合规场景常用,但**所有产线可用**)

| Token | 同 | 用途 |
|-------|---|-----|
| `--color-text-risk-1` / `--color-bg-risk-1` | = danger 深色 / 浅底 | **严重风险**等级,跟 danger 同色 |
| `--color-text-risk-2` / `--color-bg-risk-2` | = danger 深色 / 浅底 | **高危风险**等级,跟 danger 同色 |
| `--color-text-risk-3` / `--color-bg-risk-3` | = warning 深色 / 浅底 | **中危风险**等级,跟 warning 同色 |
| `--color-text-risk-4` / `--color-bg-risk-4` | = yellow-900 / yellow-50 | **低危风险**等级,黄色弱化提示 |

#### 2.3.2 安全状态文字 / 容器

| Token | 同 | 用途 |
|-------|---|-----|
| `--color-text-safe` / `--color-bg-safe` | = success 深色 / 浅底 | **无风险**,跟 success 同色 |
| `--color-text-tip` / `--color-bg-tip` | = info 深色 / 浅底 | **提示**,跟 info 同色 |
| `--color-text-unknown` / `--color-bg-unknown` | = gray 深色 / 浅底(Dark 走 gray-dark)| **未知**状态,中性灰 |

**为什么这些 token 跟 danger / warning / success / info 长得一样还要单独存在?** —— 语义不同。"danger" 表达"操作危险"(如删除按钮),"risk-1" 表达"等级 1 风险(严重)"。组件 UI 上颜色一致,但语义层面是两套独立词汇,模型生成场景化 UI 时按语义选 token 即可。

### 2.4 链接（特殊约定）

本系统**没有 `--color-text-link` semantic token**。简单链接的 Default 文字色直接走 `var(--color-blue-600)`（brand-blue），状态映射：

| 状态 | Token |
|------|-------|
| Default | `--color-blue-600` |
| Hover | `--color-blue-500` |
| Active | `--color-blue-700` |
| Disabled | `--color-blue-300` |

具体 hex 见 `reference/01-token/tokens.css` 中 `--color-blue-*` 定义。

复合链接（带 icon / underline）走中性色：`--color-text-accent` → `--color-text-secondary` → `--color-text-accent` → `--color-text-disable`。

---

## 3. Border Tokens

| Token | Light | Dark | 用途 |
|-------|-------|------|-----|
| `--color-border-default` | `gray-300` | `gray-dark-300` | Card、Table、Input 等结构分隔 |
| `--color-border-strong` | `gray-400` | `gray-dark-400` | 增强识别的边框或分割线 |
| `--color-border-interactive` | `primary-600` | `primary-dark-600` | 可交互组件 hover 描边 |
| `--color-border-interactive-active` | `primary-700` | `primary-dark-700` | 可交互组件 active 描边 |

---

## 4. Interaction State Recipe Tokens

**配方型 token**：只存混合参数，由组件层用 `color-mix()` 计算实际颜色。

### Light Mode

| Token | 值 | 用途 |
|-------|-----|-----|
| `--state-hover-solid-ratio` | `90%` | 深色按钮 hover：原色 90% + white 10% |
| `--state-hover-solid-mix` | `white` | |
| `--state-pressed-solid-ratio` | `95%` | 深色按钮 press：原色 95% + gray-900 5% |
| `--state-pressed-solid-mix` | `gray-900` | |
| `--state-hover-subtle-ratio` | `97%` | 浅色按钮 hover：原色 97% + gray-900 3% |
| `--state-hover-subtle-mix` | `gray-900` | |
| `--state-pressed-subtle-ratio` | `95%` | 浅色按钮 press：原色 95% + gray-900 5% |
| `--state-pressed-subtle-mix` | `gray-900` | |
| `--state-disabled-ratio` | `40%` | disabled 透明度比例 |

### Dark Mode（值翻转）

| Token | Dark 值 |
|-------|---------|
| `--state-hover-solid-mix` | `gray-dark-50`（深底加亮）|
| `--state-pressed-solid-mix` | `gray-dark-50` |
| `--state-hover-subtle-mix` | `gray-dark-950`（亮底加深）|
| `--state-pressed-subtle-mix` | `gray-dark-950` |

### 使用示例

```css
.btn-primary:hover {
  background: color-mix(
    in oklab,
    var(--color-bg-primary) var(--state-hover-solid-ratio),
    var(--state-hover-solid-mix)
  );
}
```

---

## 5. Spacing Tokens

**8 级，4px 递增，默认 `--space-s` = 16px。**

| Token | 值 | 典型场景 |
|-------|-----|---------|
| `--space-xxxs` | 4px | 微间距：图标与文字、Tag 内边距、细节对齐 |
| `--space-xxs` | 8px | 小间距：按钮左右 padding、小组件间距、列表紧凑布局 |
| `--space-xs` | 12px | 常用小间距：表单项间距、卡片内边距（紧凑） |
| `--space-s` ★ | 16px | **基础间距**：模块间距、卡片内边距（默认）、栅格 gutter |
| `--space-m` | 20px | 中间距：区块分隔、侧边栏/内容区内边距（舒适） |
| `--space-l` | 24px | 大间距：页面 section 间距、弹层内容 padding |
| `--space-xl` | 32px | 更大间距：页面主区块之间、空状态/引导页布局 |
| `--space-xxl` | 40px | 最大间距：大页面留白、顶级容器 padding、落地页布局 |

---

## 6. Typography Tokens

### 6.1 字体族

| Token | 栈 | 用途 |
|-------|----|-----|
| `--font-cn` | `'PingFang SC', -apple-system, 'Noto Sans SC', 'Microsoft YaHei', sans-serif` | 中文界面：页面正文、卡片内容、导航、表单标签 |
| `--font-en` | `'SF Pro Display', 'SF Pro Icons', 'Geist', 'Geist Fallback', 'Helvetica Neue', Helvetica, Arial, sans-serif` | 英文/数字：仪表盘数据、版本号、API 文档、纯英文段落 |
| `--font-mono` | `'Geist Mono', 'SF Mono', 'Fira Code', ui-monospace, monospace` | 等宽：代码块、日志输出、JSON、终端命令、文件路径 |
| `--font-sans` | → `--font-cn` | 全局 body 默认（中文优先）|

### 6.2 字号

| Token | 值 | 用途 |
|-------|-----|-----|
| `--text-page-title` | 36px | 页面主标题 / Hero |
| `--text-page-title-secondary` | 32px | 页面二级主标题 |
| `--text-panel-title-lg` | 30px | 大面板标题 |
| `--text-dialog-title` | 24px | 弹窗 / 区块主标题 |
| `--text-section-title` | 20px | 区块标题 |
| `--text-subsection-title` | 18px | 分组 / 副标题 |
| `--text-ui-strong` | 16px | 按钮 / 表头 / 强调正文 / 大号正文（兼任旧 body-lg）|
| `--text-body` ★ | 14px | **正文默认** |
| `--text-body-sm` | 13px | 次级 / 辅助正文 |
| `--text-caption` | 12px | 注释 / 时间戳 / Caption |

### 6.3 字重

| Token | 值 | 用途 |
|-------|-----|-----|
| `--font-weight-normal` | 400 | 正文/说明文本 |
| `--font-weight-medium` | 500 | 按钮/Tab/强调正文 |
| `--font-weight-semibold` | 600 | 标题/表头/关键数值 |
| `--font-weight-bold` | 700 | 强强调：仅用于少量关键标题或品牌语 |

### 6.4 行高

| Token | 值 | 用途 |
|-------|-----|-----|
| `--line-height-display` | 1.2 | 展示级标题：更紧凑，适合短标题 |
| `--line-height-display-1` | 1.3 | 展示级标题：多行标题可读性更好 |
| `--line-height-title` | 1.4 | 标题：兼顾密度与可读性 |
| `--line-height-body` | 1.5 | 正文：默认阅读行高 |
| `--line-height-mono` | 1.6 | 等宽：代码/日志/数据列，提升可扫读性 |

### 6.5 字距

| Token | 值 | 用途 |
|-------|-----|-----|
| `--letter-spacing-display-3` | −0.03em | 大标题：收紧字距，增强视觉张力 |
| `--letter-spacing-display-2` | −0.02em | 标题：轻微收紧 |
| `--letter-spacing-display-1` | −0.01em | 标题/强调：极轻微收紧 |
| `--letter-spacing-normal` | 0 | 正文/默认 |

---

## 7. Radius Tokens

**Base = 8px（Agent 默认）。**

| Token | 值 | 组件 |
|-------|-----|-----|
| `--radius-xs` | 4px | Tag、Badge、缩略图、Checkbox、次级小控件 |
| `--radius-sm` | 6px | 小尺寸按钮、Input、Select、下拉/弹层面板 |
| `--radius-md` ★ | 8px | **Button 默认、卡片等基础组件** |
| `--radius-lg` | 12px | 大卡片、Popover、Dropdown、信息面板等承载型容器 |
| `--radius-xl` | 16px | Modal、Drawer、主内容面板等大面积容器 |
| `--radius-2xl` | 20px | chatbot 输入框（Composer）、搜索框等大圆角输入容器 |
| `--radius-full` | 99px | pill 按钮、Chip、胶囊形输入框 |

**嵌套原则**：子圆角 = 父圆角 − padding。父子禁止同级圆角。

---

## 8. Stroke Tokens

简化为 3 档。默认 0.5px。

| Token | 别名 | 值 | 用途 |
|-------|-----|-----|-----|
| `--stroke-0_5` | `--stroke-weight-base` ★ | 0.5px | **默认描边**：Input、Button、Card、Tag、弱分隔 |
| `--stroke-1` | `--stroke-weight-strong` | 1px | 增强识别的边框/分割线 |
| `--stroke-2` | `--stroke-weight-bold` | 2px | Focus / 选中 / 当前态 |

---

## 9. Shadow Tokens

3 级层级，Light / Dark 自适应（暗色透明度翻倍补偿）。

### Light Mode

| Token | 值 | 用途 |
|-------|-----|-----|
| `--shadow-sm` | `0 1px 3px -1px rgba(16,16,19,0.08), 0 1px 8px 0 rgba(16,16,19,0.05)` | 小层级：下拉菜单 |
| `--shadow-md` | `0 2px 4px -2px rgba(16,16,19,0.05), 0 4px 26px -1px rgba(16,16,19,0.05)` | 高层级：Alert、Message、Chat Input、Tooltip、Popover、气泡卡片 |
| `--shadow-lg` | `0 8px 10px -2px rgba(16,16,19,0.05), 0 20px 25px -3px rgba(16,16,19,0.05)` | 顶层强调：Drawer、Modal |

### Dark Mode（自动覆写，业务不感知）

| Token | 值 |
|-------|-----|
| `--shadow-sm` | `0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 2px -1px rgba(0,0,0,0.2)` |
| `--shadow-md` | `0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -4px rgba(0,0,0,0.2)` |
| `--shadow-lg` | `0 20px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.2)` |

---

## 10. Motion Tokens

### 10.1 Duration

| Token | 值 | 典型场景 |
|-------|-----|---------|
| `--motion-fast` | 150ms | 微交互：按钮按压、checkbox/radio 切换、hover 高亮、color shift |
| `--motion-base` ★ | 250ms | **状态切换**：菜单展开、Tooltip、Tab、Dropdown |
| `--motion-slow` | 400ms | 布局变化：Accordion、Modal、Drawer、Popover 显隐 |

- 退场默认用进场时长的 75%
- 微交互尽量贴近 80ms 感知阈值
- 超过 500ms 的反馈要谨慎

### 10.2 Easing

| Token | 值 | 用途 |
|-------|-----|-----|
| `--ease-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | 元素进入（出现/展开）|
| `--ease-exit` | `cubic-bezier(0.7, 0, 0.84, 0)` | 元素退出（消失/收起）|
| `--ease-standard` | `cubic-bezier(0.65, 0, 0.35, 1)` | 双向切换（toggle / tab / 状态翻转）|

🚫 不允许使用 `bounce` / `elastic` / 夸张 overshoot。

---

## 11. Dark Mode

在 `<html>` 或业务容器上加 `.dark` 类即可整站切换：

```html
<html class="dark">
```

所有 semantic token 自动改指 `*-dark-*` primitive；阴影透明度自动翻倍补偿暗色背景。**业务代码不感知**，无需写双份样式。

---

## 12. Primitive 色板（映射说明）

⚠️ **本节不列 hex 真值**——所有真值在 `reference/01-token/tokens.css` 文件里，那是唯一可信源。本节只解释：有哪些 primitive 族、每族用在哪、Light/Dark 怎么翻转。

### 12.1 业务代码的铁律

**禁止业务代码直接引 primitive**，永远引 semantic：

```css
/* ✅ 业务代码 */
background: var(--color-bg-primary);

/* ❌ 业务代码（即使你知道 hex 也不准这么写）*/
background: var(--color-primary-600);
background: #1f1f23;
```

唯一例外：**链接组件**可以直接引 `var(--color-blue-{300,500,600,700})`，因为链接没有 semantic token（见 §2.4 链接约定）。

### 12.2 Primitive 族总览

CSS 里一共 17 个 primitive 色板族（每族 11 阶 + Dark 翻转版），按用途分 3 组：

**① 灰阶基色（UI 骨架最常用）**

| Family | Light 版 | Dark 版 | 主要消费它的 semantic token |
|--------|---------|--------|----------------------------|
| `--color-primary-*` | 50 → 950 | `--color-primary-dark-*` | `--color-bg-primary`（主按钮黑底）、`--color-bg-secondary`、`--color-text-accent`、`--color-text-disable` |
| `--color-gray-*` | 50 → 950 | `--color-gray-dark-*` | `--color-bg-surface/muted/control`、`--color-bg-icon`、`--color-text-*`、`--color-border-default` |
| `--color-white` | 单值 | （Dark 用 `gray-dark-50`）| `--color-bg-base`、`--color-bg-overlay`、`--color-text-foreground` |

**② 语义基色（status / 链接专用）**

| Family | Light 版 | Dark 版 | 消费它的 semantic token |
|--------|---------|--------|----------------------|
| `--color-blue-*` | 50 → 950 | `--color-blue-dark-*` | 链接（直引）、`--color-bg-info`、`--color-text-info` |
| `--color-green-*` | 50 → 950 | `--color-green-dark-*` | `--color-bg-success`、`--color-text-success` |
| `--color-orange-*` | 50 → 950 | `--color-orange-dark-*` | `--color-bg-warning`、`--color-text-warning` |
| `--color-rose-*` | 50 → 950 | `--color-rose-dark-*` | `--color-bg-danger`、`--color-text-danger` |
| `--color-red-*` | 50 → 950 | `--color-red-dark-*` | 备用异常基色（暂无 semantic 引用）|

**③ 扩展基色（暂无 semantic 引用，备用）**

`--color-cyan-*` / `--color-purple-*` / `--color-pink-*` / `--color-yellow-*` / `--color-teal-*` / `--color-moss-*`（每个都有 Light + Dark 两套）

### 12.3 Light / Dark 翻转机制

每族 `*-dark-*` 是 Light 版的**反序映射**（不是简单"调暗"）：

- Light `primary-50`（最浅）↔ Dark `primary-dark-950`（在暗模式下最浅）
- Light `primary-950`（最深）↔ Dark `primary-dark-50`（在暗模式下最深）

`tokens.css` 中 `.dark` selector 会把 semantic token 重新指向 dark 族：

```css
:root {
  --color-bg-base: var(--color-white);
  --color-text-primary: var(--color-gray-950);
}
.dark {
  --color-bg-base: var(--color-gray-dark-50);
  --color-text-primary: var(--color-gray-dark-950);
}
```

→ **业务代码永远只引 semantic，不管 light/dark 模式，浏览器自动解析**。

### 12.4 阶位语义（11 阶用法约定）

每族 11 阶（50 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900 / 950）的语义约定：

| 阶位 | 典型用途 |
|------|---------|
| 50 | 最浅，状态浅底背景（success-50 / danger-50 等）|
| 100-200 | 弱底色、hover 态、disabled 底色 |
| 300 | 描边默认色（gray-300）|
| 400 | disabled 文字、placeholder |
| 500 | 中性中位色（gray-500 等）|
| 600 | **主交互色**（bg-primary = primary-600，link = blue-600）★ |
| 700 | Active / Pressed 态 |
| 800-900 | 主要文字色（gray-800 / 950 = text-secondary/primary）|
| 950 | 最深，反色背景（bg-inverse = gray-950）|

⚠️ 这只是约定，**具体哪一阶被哪个 semantic 用**完全以 `tokens.css` 为准。

## 13. 完整 CSS 引入（铁律）

> **⚠️ 适用范围限定**：本节**仅适用于无法安装组件包的静态 HTML / 单文件 prototype fallback 场景**。
>
> - **React / Next.js / Vite React 等能安装 `@ve-design/react` 的项目**：主题入口只引一次 `@ve-design/react/css/default.css`（宿主已统一用 `@ve-design/web/css/default.css` 时沿用现有入口）。**不要**内联或外链本目录的 `tokens.css`，否则会与官方默认主题重复甚至冲突。此时本节的"整段内联 / 外链 tokens.css"规则**不适用**。
> - **无法安装组件包的静态 HTML / 单文件 demo**：才按本节内联或外链 `tokens.css`。
>
> 判断顺序：能装组件包 → 走官方默认主题入口；不能装组件包 → 才走本节 fallback。

**在允许的 fallback 场景下生成 demo 页面时，绝不允许自己抄 CSS / 自己拼 token 定义**。永远走下面之一：

### 方式 A：外链 `reference/01-token/tokens.css`（开发环境推荐）

```html
<link rel="stylesheet" href="./tokens.css">
```

### 方式 B：整段内联（单文件 demo 必用）

```html
<style>
  /* === 下面是 reference/01-token/tokens.css 的完整内容 === */
  /* 不许只复制速查表 / §1-§11 表里出现的子集 */
  /* 不许"我看着用得着的才复制" */
  /* 把 tokens.css 整个文件 cat 进来 */

  /* ...完整 tokens.css... */
</style>
```

### 为什么必须整段引

`tokens.css` 包含：

- 完整 `:root {}`（所有 semantic token + 17 色板 × 11 阶 × Light/Dark 两套）
- `.dark` selector 暗色模式翻转规则
- `@property` 注册（color-mix 配方依赖）
- 间距 / 字号 / 圆角 / 阴影 / 动效 所有 token 声明

如果你只复制"用得着的子集"，业务代码引 `var(--color-bg-info)` 时浏览器解析链路会断（找不到 `--color-blue-50`）—— 渲染失败 / 渲染错误。

### 给 AI 模型的判定 checklist

**先判断场景**：如果是能安装 `@ve-design/react` 的 React 项目，跳过本 checklist —— 只引一次官方默认主题入口即可，不要内联 `tokens.css`。以下 checklist 仅用于静态 HTML / 单文件 fallback 场景，写每一行 CSS / HTML 之前问自己：

1. 我现在内联 / 外链了 `tokens.css` 吗？（没的话立刻加）
2. 我业务样式里有 `#xxxxxx` hex 吗？（有的话改成 `var(--xxx)`）
3. 我用了哪些 `var(--xxx)` token？它们在 tokens.css 里都有定义吗？（没有的话查 §1-§11 找正确名字）
4. 我有没有自己写 `:root { --xxx: ... }`？（不许，永远引 tokens.css 不许自定义）

任何一条没满足 → 整段代码重写。


---

## §所属产线路由规则

> **⚠️ 术语 disambiguation**:本节讲的「所属产线」是 5 套品牌身份(agent / arkclaw / security / volcengine / volcark),**不是亮/暗主题**。亮/暗主题(`.dark` 选择器)跟本节正交,详见 §跟亮/暗主题的关系 段。

vedesign Agent skill 支持 **5 套所属产线**,通过 `[data-theme="..."]` 切换。所有品牌共享同一份 base token,**只覆盖 `--color-primary-*` / `--color-primary-dark-*` 以及部分 palette token**(volcark 同时覆盖 `--color-blue-*`)。

### 5 套所属产线速查

| 主题 | data-theme | primary 主色样例 | 适用产品形态 |
|------|-----------|-----------------|------------|
| **agent** ⭐默认 | `data-theme="agent"` 或不设 | `#383740` 深灰 | Agent / chatbot / 助手 / 通用 ToB / 默认场景 |
| **arkclaw** | `data-theme="arkclaw"` | `#383740` 深灰 | Arkclaw(占位等同 agent,留扩展位)|
| **security** 安全 | `data-theme="security"` | `#383740` 深灰 | 安全 / 合规 / 风控 / 等保 / 态势感知类(走灰色主调,risk-* / safe / tip 等专用 status token 区分风险态)|
| **volcengine** 火山引擎 | `data-theme="volcengine"` | `#1664ff` 火山蓝 | 火山引擎官网 / 公有云控制台 / volcengine.com |
| **volcark** 火山方舟 | `data-theme="volcark"` | `#5252FF` AI 紫蓝 | 火山方舟 / Ark / 大模型平台 / AI Studio |

### 怎么选所属产线(给模型的判断规则)

按**项目归属**决定,**不是按视觉偏好**:

| 用户原话提到 | 选哪个 |
|------------|-------|
| "agent" / "智能体" / "chatbot" / "助手" / 没明确归属 | **agent**(默认)|
| "Arkclaw" / "claw" | **arkclaw** |
| "安全" / "云安全" / "态势" / "等保" / "合规" / "风控" | **security** |
| "火山引擎" / "火山官网" / "volcengine" / "公有云" / "云服务" | **volcengine** |
| "火山方舟" / "ark" / "方舟" / "大模型" / "AI 平台" / "AI Studio" | **volcark** |

**判断不确定 → 默认 agent**,不要瞎猜。
**绝对禁止**:用户没明确选,凭"我觉得 AI 产品用紫色更酷"就上 volcark = 违反产品归属原则。

### 集成方式

**HTML 加 data-theme 属性**(单文件 demo 标准做法):

```html
<!-- 亮色 + 安全品牌 -->
<html data-theme="security">

<!-- 暗色 + 火山方舟品牌(两个属性正交,可任意组合) -->
<html data-theme="volcark" class="dark">

<!-- 默认 agent(可省 data-theme) -->
<html>
```

**CSS 不需要选择**,内联完整 `tokens.css`(包含 5 个 `[data-theme=...]` 段)就够了 —— 浏览器按 `data-theme` 自动选对应覆盖段。

### 跟亮 / 暗主题的关系(⚠️ 这是两个独立维度)

**亮 / 暗 ≠ 5 套所属产线**,两者**正交**:

| 维度 | 决定的是 | 切换方式 |
|------|--------|--------|
| **所属产线**(本节)| `--color-primary-*` 色阶基底(灰 / 蓝 / 紫蓝 ...)| `<html data-theme="...">` 属性 |
| **亮 / 暗主题** | 同一品牌内的色阶反转 | `<html class="dark">` 或 `documentElement.classList.toggle('dark')` |

可以叠加(`<html data-theme="volcark" class="dark">` 是合法的"暗色 + 火山方舟品牌")。

**多步向导里这是两个独立问题,不要合并**:先问「所属产线(5 选 1)」,再问「默认主题(亮/暗/跟随系统)」。

### ⚠️ 反 Pattern

| ❌ | ✅ |
|----|----|
| 把"所属产线"和"默认主题(亮/暗)"合并成一问 | **2 个独立问题**,所属产线问完后还要问亮/暗 |
| 看到"主题"二字就以为是亮/暗,跳过所属产线 | 「所属产线」和「亮/暗主题」是两件事,术语别混 |
| 用户没指定品牌就默认 volcark 因为"看起来像 AI 产品" | 默认 agent,显式问"产品归属是?" |
| 在亮 / 暗 toggle 里塞 5 个品牌选项 | 亮 / 暗只切 `.dark`,5 品牌走 `[data-theme]` 独立切 |
| 改 tokens.css 里非 primary 段 token 来"自定义品牌" | 不许 —— 5 个品牌严格共享 base,改其他 token 会让品牌不能互换 |
| 单页 / 单组件任务反复追问品牌 | 优先沿用项目现有 tokens / data-theme；没有上下文且必须选择时默认 agent |
| 自己改 `[data-theme="..."]` 段 token | 不许 —— 设计师维护,模型只复述 + 选择,不修改 |
