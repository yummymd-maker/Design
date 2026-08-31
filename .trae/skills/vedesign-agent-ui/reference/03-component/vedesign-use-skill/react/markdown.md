`Markdown` 用于将 Markdown 文本渲染为带样式的 HTML 内容，适合 AI Chat、Agent 对话和 智能助手 等场景。通过 `content` 传入 Markdown 源文本，可展示标题、段落、列表、代码块、表格、引用、链接和图片等常见内容。

## 何时使用

- 需要在 AI 对话消息中渲染模型输出的 Markdown 格式回复时。
- 需要在 Agent 面板中展示结构化的规划、分析或执行结果时。
- 需要在 智能助手 侧边栏中渲染富文本帮助文档或操作说明时。
- 需要展示包含代码片段、表格或列表的技术内容时。
- 需要统一 AI 输出内容的排版风格，与设计系统保持一致时。

## 引入组件

```tsx
import { Markdown } from '@ve-design/react';
```

## 示例

### 基础用法

使用 `content` 传入 Markdown 文本。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={`# 你好，Agent

这是一个为 AI 对话场景设计的 **Markdown** 组件。

开箱即用地支持 *斜体*、**加粗** 和 \`行内代码\` 等样式。`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 标题与段落

支持 H1 到 H6 各级标题，段落之间保持合理间距。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={`# 项目概览

本文档描述 Agent 平台的整体架构与关键决策。

## 架构

系统采用分层设计：

### 基础设施层

负责计算、存储与网络资源。

### 数据层

管理数据采集、处理与服务流水线。

### 应用层

对外暴露 API 与面向用户的功能。

> 各层之间通过明确定义的接口通信，确保松耦合与独立扩展能力。`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 列表

支持有序列表、无序列表和嵌套列表。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={`## 迁移检查清单

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
  - 数据库集群`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 代码块

支持行内代码和多行代码块。代码块使用等宽字体和深色背景，语言标签显示在右上角。

````tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={[
    '## 快速开始',
    '',
    '通过以下命令安装：',
    '',
    '```bash',
    'npm install @ve-design/react',
    '```',
    '',
    '然后注册组件：',
    '',
    '```js',
    "import { Markdown } from '@ve-design/react';",
    '```',
    '',
    '行内代码用于简短引用，例如 `console.log()` 或 `Array.from()`。',
  ].join('\n')}
  style={{ maxWidth: 720, padding: 24 }}
/>;
````

### 自动换行

默认情况下，超长内容不会换行：代码块对长行横向滚动（`white-space: pre`），表格中过长的单元格会撑开表格触发横向滚动。设置 `wrap` 属性后，二者都会自动换行——代码块切换为 `pre-wrap`，表格单元格被限制最大宽度（20rem）后在该宽度处折行。点击按钮可切换开关。

````tsx preview
import { useState } from 'react';
import { Button, Markdown } from '@ve-design/react';

function MarkdownWrapDemo() {
  const [wrap, setWrap] = useState(false);

  const content = [
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

  return (
    <section style={{ display: 'grid', gap: 16, maxWidth: 720, padding: 24 }}>
      <Button type="primary" onClick={() => setWrap((v) => !v)}>
        {wrap ? '关闭自动换行（wrap）' : '开启自动换行（wrap）'}
      </Button>
      <Markdown wrap={wrap} content={content} />
    </section>
  );
}
````

### 表格

支持 Markdown 表格渲染，表头加粗显示，行间使用分隔线区分。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={`## 模型对比

| 模型       | 上下文 | 速度   | 质量 |
| ---------- | ------ | ------ | ---- |
| GPT-4o     | 128K   | 快     | 高   |
| Model A | 200K   | 中等   | 高   |
| Model B | 1M     | 中等   | 中等 |
| Llama 3    | 8K     | 非常快 | 中等 |`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 宽表格（横向滚动）

列数较多时表格自动触发横向滚动，hover 时右上角显示复制/下载工具条，滚动边缘显示渐隐遮罩。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={`## IAM 角色对比

| 角色/对象 | 核心定位 | 主要解决的问题 | 管控范围 | 是否长期身份 | 是否可登录控制台 | 谁能进行配置 | 适用场景 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 主账号（Root） | 企业最高拥有者 | 管理整个云账号资产 | 全部资源 | 是 | 是 | 企业负责人 | 企业刚开通云服务时创建的账号 |
| 子账号（IAM User） | 人的身份 | 给员工分配独立权限 | 按策略授权 | 是 | 是 | IAM 管理员 | 为开发、运维、安全等员工创建独立账号 |
| 用户组（Group） | 权限集合 | 批量授权管理 | 组内成员 | 否 | 否 | IAM 管理员 | 批量管理相同职责人员（运维组、开发组） |
| 角色（Role） | 临时身份 | 安全地临时获取权限 | 临时会话 | 否 | 一般不能 | IAM 管理员 | 跨账号访问、临时提权、第三方协作 |
| 服务账号 | 程序身份 | 应用程序访问云资源 | 按策略授权 | 是 | 否 | IAM 管理员 | CI/CD 流水线、后端服务调用云 API |`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 引用与分割线

支持引用块和水平分割线。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={`## 重要通知

> 本次迁移将影响 APAC 区域的全部租户。在执行之前，请确认团队已完成回滚流程的演练。

---

如有疑问，请联系平台运维团队。`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 链接与图片

支持超链接和图片渲染。链接使用主题强调色，图片自适应容器宽度。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={`## 学习资源

访问 [VeDesign 文档](https://example.com/vedesign) 了解更多信息。

如需查看最新更新，请访问 [更新日志](https://example.com/vedesign/changelog)。

![架构示意图](https://picsum.photos/seed/markdown-architecture/960/420)`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 脚注

使用 `[^id]` 添加行内脚注引用，并在文档任意位置用 `[^id]: 内容` 定义脚注。引用渲染为灰色圆形数字标记，可点击跳转到文末自动汇总的脚注列表；未定义的引用按原文保留。脚注定义内容支持链接等行内 Markdown，会按原样渲染。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={`## 模型评测结论

新版摘要流程覆盖了问题拆解、引用整理和结果校验三个阶段[^1]。在多语言内容中，同样建议保留来源说明与复核步骤[^2]。详细说明见流程文档[^3]。

[^1]: 示例流程可根据业务场景调整，不限定具体任务类型。
[^2]: 多语言内容建议统一保留来源、时间和复核责任人。
[^3]: 完整说明见 [流程文档](https://example.com/process-guide)。`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 数学公式（LaTeX）

给 `Markdown` 加上 `enableLatex` 即可用 KaTeX 渲染数学公式，无需额外引入任何插件。组件会渲染行内 `$...$`、`\(...\)` 与块级 `$$...$$`、`\[...\]` 四种定界符。KaTeX 运行时与字体已内置在组件中，在设置 `enableLatex` 首次激活时按需初始化。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  enableLatex
  content={`## 质能方程

爱因斯坦的质能方程为 $E = mc^2$，其中 $c$ 为光速。

高斯积分是一个经典结果：

$$\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}$$

也支持 \\(a^2 + b^2 = c^2\\) 与块级 \\[\\frac{\\partial f}{\\partial x} = 2x\\] 写法。

矩阵与对齐环境：

$$
\\begin{aligned}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}
\\end{aligned}
$$`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 渲染自定义标签

React wrapper 支持通过 `customComponents` 将 Markdown 字符串里的自定义标签映射为 React 组件。字符串中仍使用 HTML 风格的标签名，例如 `<react-alert>`；组件会在渲染完成后挂载对应 React 组件。

````tsx preview
import { Alert, Markdown } from '@ve-design/react';

<section style={{ maxWidth: 720, padding: 24 }}>
  <Markdown
    customComponents={{ 'react-alert': Alert }}
    protectCustomTagNewlines
    dompurifyConfig={{ ADD_ATTR: ['type', 'show-icon'] }}
    content={[
      '# React Alert 自定义提示',
      '',
      '## 1. 最简形式（仅正文）',
      '',
      '<react-alert type="info" show-icon>',
      '这是一段提示正文，会作为 React Alert 的 children 渲染。',
      '</react-alert>',
      '',
      '## 2. 嵌套 Markdown',
      '',
      '<react-alert type="warning" show-icon>',
      '模型配额即将用尽。当前用量已达 **85%**，建议及时调整以下事项：',
      '',
      '- 提升 *配额上限* 或切换到更高规格的模型',
      '- 关注 `metrics.tokenUsage` 指标',
      '- 查看 [用量明细](https://example.com/usage)',
      '',
      '</react-alert>',
      '',
      '## 3. 多种类型并列',
      '',
      '<react-alert type="success" show-icon>操作成功，已保存当前会话。</react-alert>',
      '',
      '<react-alert type="warning" show-icon>部分依赖未安装，建议补充。</react-alert>',
      '',
      '<react-alert type="danger" show-icon>当前操作需要确认，请检查配置后再继续。</react-alert>',
      '',
      '## 4. 代码块里的 react-alert 不会被识别',
      '',
      '```html',
      '<react-alert type="info">不会变成 React 组件</react-alert>',
      '```',
    ].join('\n')}
  />
</section>;
````

### 自闭合标签

自定义标签也支持自闭合写法 `<react-stat />`，适合纯靠属性驱动、没有子内容的组件。属性会以 props 形式传入映射的 React 组件，多个相邻的自闭合标签会各自独立渲染。

```tsx preview
import { Markdown, Tag } from '@ve-design/react';

function MarkdownSelfClosingDemo() {
  return (
    <section style={{ maxWidth: 720, padding: 24 }}>
      <Markdown
        customComponents={{ 'react-stat': ReactStat }}
        dompurifyConfig={{ ADD_ATTR: ['label', 'value', 'trend'] }}
        content={[
          '# 核心指标',
          '',
          '<react-stat label="营收增速" value="23%" trend="同比加快" />',
          '',
          '<react-stat label="客户留存" value="85%" trend="环比提升" />',
          '',
          '<react-stat label="运营利润率" value="18%" />',
        ].join('\n')}
      />
    </section>
  );
}

function ReactStat({ label, value, trend }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 0',
      }}
    >
      <span style={{ minWidth: 96, color: 'var(--color-text-tertiary)' }}>{label}</span>
      <strong style={{ fontSize: 18 }}>{value}</strong>
      {trend ? <Tag status="success">{trend}</Tag> : null}
    </div>
  );
}
```

### 替换内置代码块与表格

通过 `components` 可以用自定义 React 组件整体替换内置的代码块和表格。组件会收到结构化的 props（代码块为 `code`/`lang`/`meta`/`state`，表格为 `head`/`rows`），而不是原始 HTML 字符串，便于接入自定义高亮、复制按钮或交互式表格。

````tsx preview
import { Markdown, Tag } from '@ve-design/react';

function MarkdownCustomBlocksDemo() {
  return (
    <section style={{ maxWidth: 720, padding: 24 }}>
      <Markdown
        components={{ code: CustomCode, table: CustomTable }}
        content={[
          '## 自定义渲染',
          '',
          '```ts title=demo',
          'const greeting = "hello";',
          'console.log(greeting);',
          '```',
          '',
          '| 模型 | 上下文 | 质量 |',
          '| :-- | :--: | --: |',
          '| GPT-4o | 128K | 高 |',
          '| Model A | 200K | 高 |',
        ].join('\n')}
      />
    </section>
  );
}

function CustomCode({ code, lang, state }) {
  return (
    <div
      style={{
        border: '1px solid var(--color-border-default)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          background: 'var(--color-bg-surface)',
        }}
      >
        <Tag size="small">{lang || 'text'}</Tag>
        {state === 'loading' ? (
          <span style={{ color: 'var(--color-text-tertiary)' }}>生成中…</span>
        ) : null}
      </div>
      <pre style={{ margin: 0, padding: 12, fontSize: 13 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CustomTable({ head, rows }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {head.map((cell, index) => (
            <th
              key={index}
              style={{
                border: '1px solid var(--color-border-default)',
                padding: '6px 12px',
                textAlign: cell.align ?? 'left',
                background: 'var(--color-bg-surface)',
              }}
            >
              {cell.text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                style={{
                  border: '1px solid var(--color-border-default)',
                  padding: '6px 12px',
                  textAlign: cell.align ?? 'left',
                }}
              >
                {cell.text}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
````

当自定义的 `code` 或 `table` 组件在某次渲染返回 `null`（或 `undefined`/`false`）时，会自动回退到内置的代码块 / 表格渲染，保留内置的语法高亮、复制、下载等能力。借此可以只对部分内容启用自定义渲染（例如仅接管 `lang === 'mermaid'` 的代码块），其余交给内置实现。该回退仅对普通函数组件生效；class 组件或经 `memo`/`forwardRef` 包装的组件不会自动回退。

下面的例子只接管 `mermaid` 代码块，其余语言（如 `ts`）通过返回 `null` 回退到内置代码块，仍保留内置高亮与复制能力：

````tsx preview
import { Markdown } from '@ve-design/react';

function MarkdownFallbackDemo() {
  return (
    <section style={{ maxWidth: 720, padding: 24 }}>
      <Markdown
        components={{ code: MermaidOnly }}
        content={[
          '## 仅接管 mermaid',
          '',
          '```mermaid',
          'graph TD; A-->B; B-->C;',
          '```',
          '',
          '下面的 TypeScript 代码块回退到内置渲染：',
          '',
          '```ts title=demo',
          'const greeting = "hello";',
          'console.log(greeting);',
          '```',
        ].join('\n')}
      />
    </section>
  );
}

// 普通函数组件：只处理 mermaid，其余 return null → 自动回退到内置代码块。
function MermaidOnly({ code, lang, state }) {
  if (lang !== 'mermaid') return null;

  return (
    <div
      style={{
        border: '1px dashed var(--color-info-600)',
        borderRadius: 8,
        padding: 16,
        background: 'var(--color-bg-info-secondary)',
        color: 'var(--color-info-600)',
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600 }}>
        Mermaid 图表{state === 'loading' ? '（生成中…）' : ''}
      </div>
      {/* 接入真实 mermaid 时，在此用 state==='done' 后调用 mermaid.render(code) */}
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{code}</pre>
    </div>
  );
}
````

### AI 对话场景

展示 `Markdown` 在 AI 对话中的典型用法：模型输出包含标题、列表、代码和表格的混合内容。

```tsx preview
import { Markdown } from '@ve-design/react';

<Markdown
  content={`## 分析结果

基于本次提供的数据，关键结论如下：

1. **营收增速** 同比加快至 23%
2. **客户留存率** 从 78% 提升至 85%
3. **运营利润率** 提升 4 个百分点

### 主要驱动因素

- 新企业版客户贡献了 40% 的增量营收
- 中端市场流失率显著下降
- 引导流程优化使首次价值实现时间缩短 30%

### 推荐查询

\`\`\`sql
SELECT segment, avg_revenue, churn_rate
FROM customer_metrics
WHERE quarter = 'Q4'
ORDER BY avg_revenue DESC;
\`\`\`

> 建议聚焦企业版客户的扩展，同时持续巩固中端市场的留存成效。`}
  style={{ maxWidth: 720, padding: 24 }}
/>;
```

### 动态更新内容

点击按钮后开始流式追加内容，组件配合 `streaming` 展示尾部光标；当一段完整的 Markdown 全部追加完毕后将 `streaming` 置为 `false` 结束本轮输出。

```tsx preview
import { useRef, useState } from 'react';
import { Button, Markdown } from '@ve-design/react';

function MarkdownDynamicDemo() {
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

  const timerRef = useRef<number | undefined>(undefined);
  const [content, setContent] = useState('');
  const [streaming, setStreaming] = useState(false);

  const startStreaming = () => {
    if (timerRef.current !== undefined) return;

    setContent('');
    setStreaming(true);

    let cursor = 0;
    const step = 4;

    timerRef.current = window.setInterval(() => {
      cursor = Math.min(cursor + step, fullContent.length);
      setContent(fullContent.slice(0, cursor));

      if (cursor >= fullContent.length) {
        window.clearInterval(timerRef.current);
        timerRef.current = undefined;
        setStreaming(false);
      }
    }, 30);
  };

  return (
    <section style={{ display: 'grid', gap: 12, maxWidth: 720, padding: 24 }}>
      <Button type="primary" disabled={streaming} onClick={startStreaming}>
        开始流式输出
      </Button>
      <Markdown content={content} streaming={streaming} />
    </section>
  );
}
```

### 排版尺寸

通过 `size` 控制整套排版的字号与节奏：`default`（默认）使用 16px 字号基准 / 8px 节奏单位，`small` 使用 14px / 7px。组件的字号、行高、间距与几何都由 `--md-font-base` 和 `--md-space-base` 两个 base 经 `calc()` 等比派生，`size` 仅切换这两个 base。点击按钮可在两种尺寸之间切换。

````tsx preview
import { useState } from 'react';
import { Button, Markdown } from '@ve-design/react';

function MarkdownSizeDemo() {
  const [size, setSize] = useState('default');

  const content = [
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

  return (
    <section style={{ display: 'grid', gap: 16, maxWidth: 720, padding: 24 }}>
      <Button
        type="primary"
        onClick={() => setSize(size === 'small' ? 'default' : 'small')}
      >
        {size === 'small'
          ? '切换为 default（16px / 8px）'
          : '切换为 small（14px / 7px）'}
      </Button>
      <Markdown size={size} content={content} />
    </section>
  );
}
````

如需更精细的缩放（例如 15px 基准），可直接覆盖 `--md-font-base` 和 `--md-space-base` 两个 CSS 变量，其余排版会自动等比跟随。

```tsx
<Markdown
  style={{ '--md-font-base': '15px', '--md-space-base': '7.5px' }}
  content={content}
/>
```

## API

### Props

| 属性名                     | 描述                                                                                                                                                                                                            | 类型                                | 默认值      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------- |
| `content`                  | Markdown 源文本。更新后组件重新解析和渲染。                                                                                                                                                                     | `string`                            | `''`        |
| `size`                     | 排版尺寸。`default` 为 16px / 8px 基准，`small` 为 14px / 7px。需要更精细的缩放时可直接覆盖 `--md-font-base` / `--md-space-base`。                                                                              | `'default' \| 'small'`              | `'default'` |
| `wrap`                     | 是否对超长内容自动换行。开启后代码块切换为 `pre-wrap`，表格单元格被限制最大宽度（20rem）后折行而非撑开横向滚动。可分别覆盖 `--ve-markdown-code-block-white-space` / `--ve-markdown-table-cell-max-width` 微调。 | `boolean`                           | `false`     |
| `streaming`                | 是否处于流式输入状态。设为 `true` 时保留流式缓冲区并显示尾部光标；设为 `false` 时刷新缓冲区并隐藏光标。                                                                                                         | `boolean`                           | `false`     |
| `hideCursor`               | 流式输出时是否隐藏尾部闪烁光标。设为 `true` 时即使 `streaming` 为 `true` 也不显示光标，其余流式行为（缓冲、刷新事件）不受影响。                                                                                  | `boolean`                           | `false`     |
| `enableAnimation`          | 是否为流式文本片段启用淡入动画。                                                                                                                                                                                | `boolean`                           | `false`     |
| `openLinksInNewTab`        | 是否为所有渲染的链接添加 `target="_blank"`，使其在新标签页打开。                                                                                                                                                | `boolean`                           | `false`     |
| `escapeRawHtml`            | 是否将 Markdown 中的原始 HTML 转义为纯文本显示。                                                                                                                                                                | `boolean`                           | `false`     |
| `protectCustomTagNewlines` | 是否保护 `customTags` 中自定义子标签内容中的空行，防止被解析为段落分隔。                                                                                                                                          | `boolean`                           | `false`     |
| `enableLatex`              | 是否用 KaTeX 渲染 LaTeX 数学公式，支持 `$...$`、`$$...$$`、`\(...\)`、`\[...\]` 四种定界符。KaTeX 已内置在组件中，无需额外引入插件。                                                                              | `boolean`                           | `false`     |
| `paragraphTag`             | 渲染 Markdown 段落所使用的 HTML 标签名。                                                                                                                                                                        | `keyof HTMLElementTagNameMap`       | `'p'`       |
| `customTags`               | 自定义子标签名列表，允许通过 DOMPurify 并追踪流式状态。                                                                                                                                                         | `readonly string[]`                 | `[]`        |
| `customComponents`         | 将 Markdown 字符串里的自定义标签映射为 React 组件，key 为标签名，value 为 React 组件。                                                                                                                          | `Record<string, React.ElementType>` | `-`         |
| `components`               | 用自定义 React 组件整体替换内置代码块（`code`）和表格（`table`），组件接收结构化 props。                                                                                                                        | `{ code?, table? }`                 | `-`         |
| `markedConfig`             | 额外的 marked 扩展配置，最后注册，可覆盖内置渲染器。                                                                                                                                                            | `MarkedExtension`                   | `-`         |
| `dompurifyConfig`          | 额外的 DOMPurify 配置，合并到默认配置中。                                                                                                                                                                       | `SanitizeConfig`                    | `-`         |

### 事件

| 事件名          | 描述                                                                               | 参数类型                           |
| --------------- | ---------------------------------------------------------------------------------- | ---------------------------------- |
| `onRender`      | Markdown 内容渲染完成后触发。                                                      | `CustomEvent<{ content: string }>` |
| `onStreamFlush` | 流式缓冲区刷新时触发（当 `streaming` 从 `true` 变为 `false` 且存在待处理内容时）。 | `CustomEvent<{ pending: string }>` |
