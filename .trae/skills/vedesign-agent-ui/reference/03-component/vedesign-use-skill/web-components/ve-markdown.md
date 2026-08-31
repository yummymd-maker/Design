`ve-markdown` 用于将 Markdown 文本渲染为带样式的 HTML 内容，专为 AI Chat、Agent 对话和 智能助手 场景设计。通过 `content` 属性传入 Markdown 源文本，组件自动解析并渲染；排版样式与设计系统对齐，支持标题、段落、列表、代码块、表格、引用等常见 Markdown 元素。

## 何时使用

- 需要在 AI 对话消息中渲染模型输出的 Markdown 格式回复时。
- 需要在 Agent 面板中展示结构化的规划、分析或执行结果时。
- 需要在 智能助手 侧边栏中渲染富文本帮助文档或操作说明时。
- 需要展示包含代码片段、表格或列表的技术内容时。
- 需要统一 AI 输出内容的排版风格，与设计系统保持一致时。

## 引入组件

```ts
import '@ve-design/web/ve-markdown';
```

## 示例

### 基础用法

通过 `content` 属性传入 Markdown 文本，组件自动解析并渲染。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
</script>

<ve-markdown
  content="# 你好，Agent

这是一个为 AI 对话场景设计的 **Markdown** 组件。

开箱即用地支持 *斜体*、**加粗** 和 `行内代码` 等样式。"
  style="max-width:720px; padding:24px;"
></ve-markdown>
```

### 标题与段落

支持 H1 到 H6 各级标题，段落之间自动保持合理间距。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
</script>

<ve-markdown
  content="# 项目概览

本文档描述 Agent 平台的整体架构与关键决策。

## 架构

系统采用分层设计：

### 基础设施层

负责计算、存储与网络资源。

### 数据层

管理数据采集、处理与服务流水线。

### 应用层

对外暴露 API 与面向用户的功能。

> 各层之间通过明确定义的接口通信，确保松耦合与独立扩展能力。"
  style="max-width:720px; padding:24px;"
></ve-markdown>
```

### 列表

支持有序列表、无序列表和嵌套列表。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
</script>

<ve-markdown
  content="## 迁移检查清单

切换至新版策略引擎之前，请确认以下事项：

- 所有工作空间均已完成备份
- 目标区域已开启审计日志
- 回滚流程已通过演练

### 操作步骤

1. 启用新的队列策略
2. 将重试窗口扩展至 30 秒
3. 持续监控错误率 24 小时
4. 通知租户管理员变更窗口

### 嵌套示例

- 前端
  - React 组件
  - 状态管理
- 后端
  - API 网关
  - 服务网格
  - 数据库集群"
  style="max-width:720px; padding:24px;"
></ve-markdown>
```

### 代码块

支持行内代码和多行代码块。代码块使用等宽字体和深色背景，语言标签显示在右上角。

````html preview
<script type="module">
  import '@ve-design/web/ve-markdown';

  document.getElementById('markdown-code-demo').content = [
    '## 快速开始',
    '',
    '通过以下命令安装：',
    '',
    '```bash',
    'npm install @ve-design/web',
    '```',
    '',
    '然后注册组件：',
    '',
    '```js',
    "import '@ve-design/web/ve-markdown';",
    '```',
    '',
    '行内代码用于简短引用，例如 `console.log()` 或 `Array.from()`。',
  ].join('\n');
</script>

<ve-markdown
  id="markdown-code-demo"
  style="max-width:720px; padding:24px;"
></ve-markdown>
````

### 自动换行

默认情况下，超长内容不会换行：代码块对长行横向滚动（`white-space: pre`），表格中过长的单元格会撑开表格触发横向滚动。设置 `wrap` 属性后，二者都会自动换行——代码块切换为 `pre-wrap`，表格单元格被限制最大宽度（20rem）后在该宽度处折行。点击按钮可切换开关。

````html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-markdown';
</script>

<section style="display:grid; gap:16px; max-width:720px; padding:24px;">
  <ve-button id="markdown-wrap-btn" type="primary"
    >开启自动换行（wrap）</ve-button
  >
  <ve-markdown id="markdown-wrap-demo"></ve-markdown>
</section>

<script>
  const wrapBtn = document.getElementById('markdown-wrap-btn');
  const wrapMd = document.getElementById('markdown-wrap-demo');

  wrapMd.content = [
    '## 长行代码示例',
    '',
    '```ts',
    "const endpoint = 'https://api.example.com/v1/resources?expand=owner,members,settings&filter=active&sort=created_at:desc&page=1&pageSize=50';",
    "const config = { endpoint, retries: 3, timeoutMs: 30000, accept: 'application/json' };",
    '```',
    '',
    '## 长内容表格示例',
    '',
    '| 字段 | 说明 |',
    '| --- | --- |',
    '| endpoint | 请求地址 https://api.example.com/v1/resources?expand=owner,members,settings&filter=active&sort=created_at:desc，超长且无空格时也会按需折行 |',
    '| retries | 失败后的最大重试次数，超出后抛出错误并上报监控 |',
  ].join('\n');

  wrapBtn?.addEventListener('click', () => {
    const next = !wrapMd.hasAttribute('wrap');
    wrapMd.toggleAttribute('wrap', next);
    wrapBtn.textContent = next
      ? '关闭自动换行（wrap）'
      : '开启自动换行（wrap）';
  });
</script>
````

### 表格

支持 Markdown 表格渲染，表头加粗显示，行间使用分隔线区分。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
</script>

<ve-markdown
  content="## 模型对比

| 模型       | 上下文 | 速度   | 质量 |
| ---------- | ------ | ------ | ---- |
| GPT-4o     | 128K   | 快     | 高   |
| Model A | 200K   | 中等   | 高   |
| Model B | 1M     | 中等   | 中等 |
| Llama 3    | 8K     | 非常快 | 中等 |"
  style="max-width:720px; padding:24px;"
></ve-markdown>
```

### 宽表格（横向滚动）

列数较多时表格自动触发横向滚动，hover 时右上角显示复制/下载工具条，滚动边缘显示渐隐遮罩。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
</script>

<ve-markdown
  content="## IAM 角色对比

| 角色/对象 | 核心定位 | 主要解决的问题 | 管控范围 | 是否长期身份 | 是否可登录控制台 | 谁能进行配置 | 适用场景 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 主账号（Root） | 企业最高拥有者 | 管理整个云账号资产 | 全部资源 | 是 | 是 | 企业负责人 | 企业刚开通云服务时创建的账号 |
| 子账号（IAM User） | 人的身份 | 给员工分配独立权限 | 按策略授权 | 是 | 是 | IAM 管理员 | 为开发、运维、安全等员工创建独立账号 |
| 用户组（Group） | 权限集合 | 批量授权管理 | 组内成员 | 否 | 否 | IAM 管理员 | 批量管理相同职责人员（运维组、开发组） |
| 角色（Role） | 临时身份 | 安全地临时获取权限 | 临时会话 | 否 | 一般不能 | IAM 管理员 | 跨账号访问、临时提权、第三方协作 |
| 服务账号 | 程序身份 | 应用程序访问云资源 | 按策略授权 | 是 | 否 | IAM 管理员 | CI/CD 流水线、后端服务调用云 API |"
  style="max-width:720px; padding:24px;"
></ve-markdown>
```

### 引用与分割线

支持引用块和水平分割线。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
</script>

<ve-markdown
  content="## 重要通知

> 本次迁移将影响 APAC 区域的全部租户。在执行之前，请确认团队已完成回滚流程的演练。

---

如有疑问，请联系平台运维团队。"
  style="max-width:720px; padding:24px;"
></ve-markdown>
```

### 链接与图片

支持超链接和图片渲染。链接使用主题强调色，图片自适应容器宽度。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
</script>

<ve-markdown
  content="## 学习资源

访问 [VeDesign 文档](https://example.com/vedesign) 了解更多信息。

如需查看最新更新，请访问 [更新日志](https://example.com/vedesign/changelog)。

![架构示意图](https://picsum.photos/seed/markdown-architecture/960/420)"
  style="max-width:720px; padding:24px;"
></ve-markdown>
```

### 脚注

使用 `[^id]` 添加行内脚注引用，并在文档任意位置用 `[^id]: 内容` 定义脚注。引用渲染为灰色圆形数字标记，可点击跳转到文末自动汇总的脚注列表；未定义的引用按原文保留。脚注定义内容支持链接等行内 Markdown，会按原样渲染。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
</script>

<ve-markdown
  content="## 模型评测结论

新版摘要流程覆盖了问题拆解、引用整理和结果校验三个阶段[^1]。在多语言内容中，同样建议保留来源说明与复核步骤[^2]。详细说明见流程文档[^3]。

[^1]: 示例流程可根据业务场景调整，不限定具体任务类型。
[^2]: 多语言内容建议统一保留来源、时间和复核责任人。
[^3]: 完整说明见 [流程文档](https://example.com/process-guide)。"
  style="max-width:720px; padding:24px;"
></ve-markdown>
```

### 数学公式（LaTeX）

给 `<ve-markdown>` 加上 `enable-latex` 属性即可用 KaTeX 渲染数学公式，无需额外引入任何插件。组件会渲染行内 `$...$`、`\(...\)` 与块级 `$$...$$`、`\[...\]` 四种定界符。KaTeX 运行时与字体已内置在组件中，在设置 `enable-latex` 首次激活时按需初始化。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
</script>

<ve-markdown
  enable-latex
  content="## 质能方程

爱因斯坦的质能方程为 $E = mc^2$，其中 $c$ 为光速。

高斯积分是一个经典结果：

$$\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}$$

也支持 \(a^2 + b^2 = c^2\) 与块级 \[\frac{\partial f}{\partial x} = 2x\] 写法。

矩阵与对齐环境：

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$"
  style="max-width:720px; padding:24px;"
></ve-markdown>
```

### 渲染自定义标签

通过 `customTags` 把自定义元素加入 DOMPurify 白名单，让 Markdown 中的 `<ve-alert>` 等标签按真实自定义元素渲染。配合 `protect-custom-tag-newlines` 可保护标签内容中的空行，避免被 marked 解析为段落分隔；通过 `dompurifyConfig.ADD_ATTR` 可放行业务自定义属性（例如 `slot`）。

````html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
  import '@ve-design/web/ve-alert';
</script>

<ve-markdown
  id="markdown-custom-tag"
  style="max-width:720px; padding:24px;"
></ve-markdown>

<script>
  // 配置 ve-markdown：开放 ve-alert 标签 + 保护标签空行 + 允许 type / slot 属性
  const md = document.getElementById('markdown-custom-tag');
  md.customTags = ['ve-alert'];
  md.protectCustomTagNewlines = true;
  md.dompurifyConfig = { ADD_ATTR: ['type', 'show-icon', 'slot'] };

  // 构造覆盖典型场景的测试内容
  md.content = [
    '# ve-alert 自定义提示',
    '',
    '## 1. 最简形式（仅正文）',
    '',
    '<ve-alert type="info">',
    '这是一段提示正文，应原样渲染在 ve-alert 内容区。',
    '</ve-alert>',
    '',
    '## 2. 标题 + 嵌套 Markdown',
    '',
    '<ve-alert type="warning">',
    '<span slot="title">模型配额即将用尽</span>',
    '',
    '当前用量已达 **85%**，建议及时调整以下事项：',
    '',
    '- 提升 *配额上限* 或切换到更高规格的模型',
    '- 关注 `metrics.tokenUsage` 指标',
    '- 查看 [用量明细](https://example.com/usage)',
    '',
    '</ve-alert>',
    '',
    '## 3. 多种类型并列',
    '',
    '<ve-alert type="success">操作成功，已保存当前会话。</ve-alert>',
    '',
    '<ve-alert type="warning">部分依赖未安装，建议补充。</ve-alert>',
    '',
    '<ve-alert type="danger">当前操作需要确认，请检查配置后再继续。</ve-alert>',
    '',
    '## 4. 代码块里的 ve-alert 不会被识别',
    '',
    '```html',
    '<ve-alert type="info">不会变成真实自定义元素</ve-alert>',
    '```',
  ].join('\n');
</script>
````

### 自闭合标签

自定义元素也支持自闭合写法 `<ve-icon />`，适合纯靠属性驱动、没有子内容的标签。多个相邻的自闭合标签会各自独立渲染，不会相互嵌套。

```html preview
<script type="module">
  import '@ve-design/web/ve-markdown';
  import '@ve-design/web/icons/success';
  import '@ve-design/web/icons/warning';
  import '@ve-design/web/icons/info';
</script>

<ve-markdown
  id="markdown-self-close"
  style="max-width:720px; padding:24px;"
></ve-markdown>

<script>
  const md = document.getElementById('markdown-self-close');
  md.customTags = ['ve-icon'];
  md.dompurifyConfig = { ADD_ATTR: ['name', 'size'] };

  md.content = [
    '# 自闭合标签渲染',
    '',
    '行内使用：构建成功 <ve-icon name="success" size="16" />，存在告警 <ve-icon name="warning" size="16" />。',
    '',
    '多个相邻的自闭合标签各自独立渲染：',
    '',
    '<ve-icon name="success" size="24" />',
    '',
    '<ve-icon name="warning" size="24" />',
    '',
    '<ve-icon name="info" size="24" />',
  ].join('\n');
</script>
```

### AI 对话场景

展示 `ve-markdown` 在 AI 对话中的典型用法：模型输出包含标题、列表、代码和表格的混合内容。

````html preview
<script type="module">
  import '@ve-design/web/ve-markdown';

  document.getElementById('markdown-chat-demo').content = [
    '## 分析结果',
    '',
    '基于本次提供的数据，关键结论如下：',
    '',
    '1. **营收增速** 同比加快至 23%',
    '2. **客户留存率** 从 78% 提升至 85%',
    '3. **运营利润率** 提升 4 个百分点',
    '',
    '### 主要驱动因素',
    '',
    '- 新企业版客户贡献了 40% 的增量营收',
    '- 中端市场流失率显著下降',
    '- 引导流程优化使首次价值实现时间缩短 30%',
    '',
    '### 推荐查询',
    '',
    '```sql',
    'SELECT segment, avg_revenue, churn_rate',
    'FROM customer_metrics',
    "WHERE quarter = 'Q4'",
    'ORDER BY avg_revenue DESC;',
    '```',
    '',
    '> 建议聚焦企业版客户的扩展，同时持续巩固中端市场的留存成效。',
  ].join('\n');
</script>

<ve-markdown
  id="markdown-chat-demo"
  style="max-width:720px; padding:24px;"
></ve-markdown>
````

### 动态更新内容

点击按钮后开始流式追加内容，组件配合 `streaming` 属性显示尾部光标；当一段完整的 Markdown 全部追加完毕后将 `streaming` 置为 `false` 结束本轮输出。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-markdown';
</script>

<section style="display:grid; gap:12px; max-width:720px; padding:24px;">
  <ve-button id="markdown-stream-btn" type="primary">开始流式输出</ve-button>
  <ve-markdown id="markdown-dynamic" content=""></ve-markdown>
</section>

<script>
  const btn = document.getElementById('markdown-stream-btn');
  const md = document.getElementById('markdown-dynamic');
  const fullContent = [
    '# 季度分析报告',
    '',
    '本报告汇总了当前季度观察到的 **关键指标**、*风险信号* 与 ~~已废弃~~ 项。',
    '',
    '## 核心亮点',
    '',
    '- **营收增速** 同比加快至 23%',
    '- **客户留存率** 从 78% 提升至 85%',
    '- **运营利润率** 提升 4 个百分点',
    '- 行内代码：`metrics.computeARR()` 与 `customer.churn`',
    '',
    '### 嵌套结论',
    '',
    '1. 获客渠道',
    '   - 付费搜索贡献了 38% 的新增注册',
    '   - 合作伙伴推荐环比翻倍',
    '2. 留存驱动',
    '   1. 引导流程重构',
    '   2. 主动客户成功外联',
    '   3. 全新计费提醒',
    '3. 产品投入',
    '',
    '## 模型对比',
    '',
    '| 模型       | 上下文 | 速度   | 质量 |',
    '| ---------- | ------ | ------ | ---- |',
    '| GPT-4o     | 128K   | 快     | 高   |',
    '| Model A | 200K   | 中等   | 高   |',
    '| Model B | 1M     | 中等   | 中等 |',
    '| Llama 3    | 8K     | 非常快 | 中等 |',
    '',
    '## 学习资源',
    '',
    '请访问 [VeDesign 文档](https://example.com/vedesign) 查看组件规范，或在 [发布日志](https://example.com/vedesign/changelog) 查阅变更历史。',
    '',
    '![架构示意图](https://placehold.co/600x180?text=Architecture+Diagram)',
    '',
    '## 推荐策略',
    '',
    '> 建议聚焦 **企业版客户** 的扩展，同时持续巩固中端市场的留存成效。',
    '> 在下个计费周期之后重新评估当前的定价实验。',
    '',
    '---',
    '',
    '_由分析 Agent 生成。所有数值均为初步结果，可能在后续修订中调整。_',
  ].join('\n');

  let timer = null;

  btn?.addEventListener('click', () => {
    if (timer) return;
    md.setAttribute('content', '');
    md.setAttribute('streaming', '');
    btn.setAttribute('disabled', '');
    let cursor = 0;
    const step = 4;
    timer = setInterval(() => {
      cursor = Math.min(cursor + step, fullContent.length);
      md.setAttribute('content', fullContent.slice(0, cursor));
      if (cursor >= fullContent.length) {
        clearInterval(timer);
        timer = null;
        md.removeAttribute('streaming');
        btn.removeAttribute('disabled');
      }
    }, 30);
  });
</script>
```

### 排版尺寸

通过 `size` 控制整套排版的字号与节奏：`default`（默认）使用 16px 字号基准 / 8px 节奏单位，`small` 使用 14px / 7px。组件的字号、行高、间距与几何都由 `--md-font-base` 和 `--md-space-base` 两个 base 经 `calc()` 等比派生，`size` 仅切换这两个 base。点击按钮可在两种尺寸之间切换。

````html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-markdown';
</script>

<section style="display:grid; gap:16px; max-width:720px; padding:24px;">
  <ve-button id="markdown-size-btn" type="primary"
    >切换为 small（14px / 7px）</ve-button
  >
  <ve-markdown id="markdown-size-demo" size="default"></ve-markdown>
</section>

<script>
  const sizeBtn = document.getElementById('markdown-size-btn');
  const sizeMd = document.getElementById('markdown-size-demo');

  sizeMd.content = [
    '# 季度分析报告',
    '',
    '本报告汇总当前季度的 **关键指标** 与 *风险信号*，并给出后续行动建议。',
    '',
    '## 核心结论',
    '',
    '1. **营收增速** 同比加快至 23%',
    '2. **客户留存率** 从 78% 提升至 85%',
    '3. **运营利润率** 提升 4 个百分点',
    '',
    '### 主要驱动因素',
    '',
    '- 新企业版客户贡献了 40% 的增量营收',
    '- 中端市场流失率显著下降',
    '- 行内代码示例：`metrics.computeARR()`',
    '',
    '```ts',
    'const growth = computeGrowth(revenue);',
    'console.log(growth);',
    '```',
    '',
    '> 建议聚焦企业版客户的扩展，同时持续巩固中端市场的留存成效。',
  ].join('\n');

  sizeBtn?.addEventListener('click', () => {
    const next = sizeMd.size === 'small' ? 'default' : 'small';
    sizeMd.size = next;
    sizeBtn.textContent =
      next === 'small'
        ? '切换为 default（16px / 8px）'
        : '切换为 small（14px / 7px）';
  });
</script>
````

如需更精细的缩放（例如 15px 基准），可直接覆盖 `--md-font-base` 和 `--md-space-base` 两个 CSS 变量，其余排版会自动等比跟随。

```html
<ve-markdown
  style="--md-font-base: 15px; --md-space-base: 7.5px;"
></ve-markdown>
```

## API

### 属性

| 属性                          | 类型                   | 默认值      | 说明                                                                                                                                                                                                            |
| ----------------------------- | ---------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`                     | `string`               | `''`        | Markdown 源文本。更新后组件自动重新解析和渲染。                                                                                                                                                                 |
| `size`                        | `'default' \| 'small'` | `'default'` | 排版尺寸。`default` 为 16px / 8px 基准，`small` 为 14px / 7px。需要更精细的缩放时可直接覆盖 `--md-font-base` / `--md-space-base`。                                                                              |
| `wrap`                        | `boolean`              | `false`     | 是否对超长内容自动换行。开启后代码块切换为 `pre-wrap`，表格单元格被限制最大宽度（20rem）后折行而非撑开横向滚动。可分别覆盖 `--ve-markdown-code-block-white-space` / `--ve-markdown-table-cell-max-width` 微调。 |
| `streaming`                   | `boolean`              | `false`     | 是否处于流式输入状态。设为 `true` 时保留流式缓冲区并显示尾部光标；设为 `false` 时刷新缓冲区并隐藏光标。                                                                                                         |
| `hide-cursor`                 | `boolean`              | `false`     | 流式输出时是否隐藏尾部闪烁光标。设为 `true` 时即使 `streaming` 为 `true` 也不显示光标，其余流式行为（缓冲、刷新事件）不受影响。                                                                                  |
| `enable-animation`            | `boolean`              | `false`     | 是否为流式文本片段启用淡入动画。                                                                                                                                                                                |
| `open-links-in-new-tab`       | `boolean`              | `false`     | 是否为所有渲染的链接添加 `target="_blank"`，使其在新标签页打开。                                                                                                                                                |
| `escape-raw-html`             | `boolean`              | `false`     | 是否将 Markdown 中的原始 HTML 转义为纯文本显示。                                                                                                                                                                |
| `protect-custom-tag-newlines` | `boolean`              | `false`     | 是否保护 `customTags` 中自定义子标签内容中的空行，防止被解析为段落分隔。                                                                                                                                          |
| `enable-latex`                | `boolean`              | `false`     | 是否用 KaTeX 渲染 LaTeX 数学公式，支持 `$...$`、`$$...$$`、`\(...\)`、`\[...\]` 四种定界符。KaTeX 已内置在组件中，无需额外引入插件。 |
| `paragraph-tag`               | `string`               | `'p'`       | 渲染 Markdown 段落所使用的 HTML 标签名。                                                                                                                                                                        |
| `customTags`                  | `string[]`             | `[]`        | 自定义子标签名列表，允许通过 DOMPurify 并追踪流式状态。仅属性设置，无 HTML attribute 映射。                                                                                                                     |
| `markedConfig`                | `MarkedExtension`      | —           | 额外的 marked 扩展配置，最后注册，可覆盖内置渲染器。仅属性设置。                                                                                                                                                |
| `dompurifyConfig`             | `SanitizeConfig`       | —           | 额外的 DOMPurify 配置，合并到默认配置中。仅属性设置。                                                                                                                                                           |

### 事件

| 事件名                     | 触发时机                                                                           | `event.detail`        |
| -------------------------- | ---------------------------------------------------------------------------------- | --------------------- |
| `ve-markdown-render`       | Markdown 内容渲染完成后触发。                                                      | `{ content: string }` |
| `ve-markdown-stream-flush` | 流式缓冲区刷新时触发（当 `streaming` 从 `true` 变为 `false` 且存在待处理内容时）。 | `{ pending: string }` |

### 方法

| 方法        | 说明                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| `refresh()` | 强制重新解析当前 `content` 并重新渲染。适用于外部修改了解析器配置后需要刷新的场景。 |

### 插槽

| 插槽名   | 说明                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| 默认插槽 | 当未设置 `content` 属性时，可直接传入 HTML 内容作为渲染输出，组件仍会应用排版样式。 |
