# Asset · 包与 Fallback

React 项目优先使用 `@ve-design/react`。Web Components 或静态 HTML 项目使用 `@ve-design/web`。reference 文件负责提供实现指引、布局约束、token 规则、资产和 fallback 策略。

## Registry

内网 registry 必须使用纯 URL，不要复制 Markdown 链接格式。错误示例：`[https://bnpm.byted.org](https://bnpm.byted.org)`。

`bnpm.byted.org` 是内网 npm registry。`@ve-design/react` / `@ve-design/web` 尚未对公网发布,但可在能访问字节内网 npm 的环境中安装,包括用户本地内网 / VPN 环境,以及字节内网云端环境。设置 registry 只会改变取包地址，不会自动获得内网 npm 访问能力。

## 内网可执行环境门禁

安装组件包前先判断当前任务是否在可访问内网 npm 的执行环境中运行。可继续安装的环境包括:

- 用户本地内网 / VPN 项目。
- 字节内网云端项目。
- 其他能通过 registry 连通性检查的公司内网执行环境。

只要出现以下任一情况,视为外部或不可确认环境:

- 工作区不是用户指定的项目。
- 运行环境看起来是外部云端 / 远程沙箱。
- 无法访问项目文件或项目路径。
- registry 连通性检查超时、DNS 失败或无响应。

外部或不可确认环境中不要继续安装,不要把包安装失败误判为组件包不存在,也不要直接降级成静态 HTML / 纯 CSS fallback。先提示用户:

> 当前运行环境可能访问不到字节内网 npm 包。请切换到本地内网/VPN项目或字节内网云端项目后再执行;我也可以帮你在可访问内网 npm 的环境中创建一个 Vite React + TypeScript 项目,写入 `.npmrc`,安装 `@ve-design/react`,再继续实现页面。

用户选择可访问内网 npm 的执行环境后再继续安装。只有用户明确要求静态原型,或拒绝/无法使用可访问内网 npm 的环境时,才允许 fallback。

优先在当前项目写入 `.npmrc`，避免修改用户全局 npm 配置：

```ini
registry=https://bnpm.byted.org/
```

如果只能用命令设置 registry，执行：

```bash
npm config set registry https://bnpm.byted.org/
```

使用 pnpm 时也可显式执行：

```bash
pnpm config set registry https://bnpm.byted.org/
```

沿用宿主项目已有包管理器。除非用户明确要求，不要从 pnpm 切到 npm 或 yarn。配置完成后再安装依赖。

安装前先验证 registry 连通性：

```bash
pnpm view @ve-design/react version --registry https://bnpm.byted.org/
```

如果连通性检查无响应、超时或 DNS 失败，回到“内网可执行环境门禁”：停止安装并提示用户切换到本地内网/VPN项目或字节内网云端项目，或由 Codex 帮用户在可访问内网 npm 的环境中创建 Vite React + TypeScript 项目。

React：

```bash
pnpm add @ve-design/react
```

Web Components：

```bash
pnpm add @ve-design/web
```

## 主题入口

React 项目优先使用 React 包主题入口：

```ts
import '@ve-design/react/css/default.css';

// 自定义主题覆盖放在默认主题之后。
import './themes/custom-theme.css';
```

如果宿主项目已经使用 `@ve-design/web/css/default.css` 作为统一 VeDesign 主题入口，保留现有引入，不要再添加重复的默认主题。

静态 HTML / Web Components：

```html
<link rel="stylesheet" href="./node_modules/@ve-design/web/css/default.css" />
```

`reference/01-token/tokens.css` 是规范参考和静态 prototype fallback。React 业务项目不要把它作为首选入口。

## 包索引

| 包 / 资产 | 内容 | 使用 |
|---|---|---|
| `@ve-design/react` | React 组件、React wrapper、icons、React CSS 入口 | React 页面首选 |
| `@ve-design/react/css/default.css` | React 主题 CSS 入口 | React 默认主题首选 |
| `@ve-design/react/icons` | React 图标组件 | React 图标首选来源 |
| `@ve-design/web` | Web Components 和 web CSS 入口 | 静态 HTML、跨框架或使用 web components 的宿主项目 |
| `@ve-design/web/css/default.css` | Web Components 主题 CSS | 既有宿主主题入口或静态 HTML |
| `./themes/custom-theme.css` | 项目主题覆盖 | 默认主题之后加载 |
| `reference/01-token/tokens.css` | token 规范 / 静态 fallback | 仅在静态 prototype 或组件包不可用时内联 |
| `reference/04-asset/motion/spotlight-dot-grid.*` | 背景粒子源码 | 仅用于欢迎页 / 大型 empty state 背景 |
| `reference/04-asset/motion/shimmer-border.*` | 输入框流光边框源码 | Composer / ChatInput 外层容器 |
| `reference/04-asset/images/gallery-*.jpg` | gallery 图片 | 欢迎页 gallery 或 prototype 封面图 |

## React 使用顺序

1. 检查项目是否已有 `@ve-design/react`。
2. 如果缺失且允许改依赖，用现有包管理器安装。
3. 在 app 级样式入口引入一次默认主题 CSS。
4. 如果项目已有 VeDesign 本地 wrapper，优先使用本地 wrapper。
5. 基础控件和 Agent 模块都优先使用组件库。
6. 页面组合参考页面配方、page-shot README 和 layout reference。
7. 只有组件库缺口,或用户明确要求静态原型 / 拒绝使用可访问内网 npm 的执行环境时才使用 fallback class。

## Fallback class 对齐

| fallback class | 语义 |
|---|---|
| `.ved-button` | Button |
| `.ved-input` | Input |
| `.ved-tag` | Tag / Badge |
| `.ved-dialog` | Dialog / Modal |
| `.ved-composer` | Agent composer |
| `.ved-message-bubble` | 消息气泡 |
| `.ved-markdown` | Agent markdown 回复 |
| `.ved-action-bar` | 回复操作栏 |
| `.ved-artifact-card` | 产物卡片 |
| `.ved-sidebar` | Agent 侧边栏 |
| `.ved-file-row` | 文件 / artifact 行 |
| `.ved-capability-item` | Skill / MCP 列表项 |

Fallback 仍必须使用 semantic token、page-shot 结构、真实交互状态和真实感 mock 数据。

## 禁止事项

- 不要使用 `@vedesign/*`；真实包命名空间是 `@ve-design/*`。
- 不要手写 `@ve-design/react` 已有组件的本地版本。
- 除非宿主项目有明确原因，不要同时引入 React 和 Web 两份默认 CSS。
- 不要为了使用本 skill 替换宿主项目的包管理器、bundler、router 或全局主题设置。
- 不要为 gallery cover 外链随机第三方图片。
- 如果包安装或 registry 访问失败，先按“内网可执行环境门禁”提示用户切换到本地内网/VPN项目或字节内网云端项目；只有用户明确要求静态原型或拒绝切换环境时，才继续使用 token、layout、component reference fallback。
