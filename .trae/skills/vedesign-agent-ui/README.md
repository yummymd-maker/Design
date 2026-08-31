# VeDesign Agent UI Skill

火山引擎 / 方舟 Agent UI 生产级页面构建 skill。

这个 skill 用来指导大模型在 Agent / 智能体 / chatbot / 助手 / 欢迎页 / 对话页 / 三栏产物页 / 文件库 / Skill 广场 / MCP 广场 / 设置页等场景中，优先使用 VeDesign 组件库和 semantic token，生成可运行、可交互、可渐进接入业务项目的前端页面。

## 当前定位

- **生产页面入口**：`SKILL.md` 负责模式判断、reference 路由和交付验收。
- **组件库优先**：React 项目优先使用 `@ve-design/react`，只在不可用或组件缺口时 fallback。
- **输入框流光**：Composer / ChatInput 必须使用 `reference/04-asset/motion/shimmer-border.css` 和 `reference/04-asset/motion/shimmer-border.js`。宿主使用 `.ved-shimmer-host` + `data-shimmer` + 正确 `data-shimmer-radius`，不要只用组件内置 `borderGlow` / `border-glow` 代替。
- **画廊真图**：欢迎页 gallery 必须从 `reference/04-asset/images/gallery-01.jpg` 到 `gallery-11.jpg` 选图。React / Vite 项目复制到 `src/assets/images` 后 import；单文件 HTML 才转 base64 内联。
- **Token 优先**：业务 CSS 使用 semantic token，不凭经验写 hex、阴影、间距、圆角。
- **场景配方优先**：欢迎页、对话页、三栏页、二级页、文件库、设置页等先读 `reference/06-recipes/`。
- **渐进接入优先**：已有项目中保留原路由、包管理器、主题入口、数据契约和组件封装。

## 组件库

内部 npm registry 必须使用纯 URL，不要复制 Markdown 链接格式。错误示例：`[https://bnpm.byted.org](https://bnpm.byted.org)`。

`bnpm.byted.org` 是内网 npm registry。`@ve-design/react` / `@ve-design/web` 尚未对公网发布,但可在能访问字节内网 npm 的环境中安装,包括用户本地内网 / VPN 环境,以及字节内网云端环境。设置 registry 只会改变取包地址，不会自动获得内网 npm 访问能力。

安装组件包前先做内网可执行环境门禁：如果当前运行环境不是本地内网/VPN项目、字节内网云端项目，或不能确认能访问内网 registry，不要继续安装，也不要直接降级成静态页面。先提示用户切换到可访问内网 npm 的项目，或让 Codex 在可访问内网 npm 的环境中创建一个 Vite React + TypeScript 项目，写入 `.npmrc` 后再安装组件包。

优先在当前项目写入 `.npmrc`：

```ini
registry=https://bnpm.byted.org/
```

如果只能用命令设置 registry：

```bash
npm config set registry https://bnpm.byted.org/
```

安装组件包前先验证连通性：

```bash
pnpm view @ve-design/react version --registry https://bnpm.byted.org/
```

如果这里超时、DNS 失败或无响应，说明当前运行环境不像可安装内网包的执行环境。停止安装并提示用户切换到本地内网/VPN项目或字节内网云端项目，或由 Codex 帮用户在可访问内网 npm 的环境中创建 Vite React + TypeScript 项目。

React 项目：

```bash
pnpm add @ve-design/react
```

普通 HTML / Web Components 项目：

```bash
pnpm add @ve-design/web
```

React 主题入口优先：

```ts
import '@ve-design/react/css/default.css';

// 需要自定义主题时，放在默认主题之后覆盖。
import './themes/custom-theme.css';
```

如果已有项目已经统一使用 `@ve-design/web/css/default.css`，沿用现有主题入口，不要重复引入两份默认主题。

## 目录结构

```text
vedesign-agent-ui-skill/
├── SKILL.md                (skill 规范入口：YAML frontmatter + 指令，所有宿主通用)
├── agents/
│   └── openai.yaml         (可选：OpenAI/Codex 类宿主的调用元数据，非通用 skill 规范的一部分)
└── reference/
    ├── 00-workflows.md
    ├── 01-token/
    │   ├── tokens.css
    │   └── tokens.md
    ├── 02-layout/
    │   └── layouts.md
    ├── 03-component/
    │   ├── component-routing.md
    │   └── vedesign-use-skill/
    │       ├── index.md
    │       ├── react/
    │       └── web-components/
    ├── 04-asset/
    │   ├── asset-packages.md
    │   ├── images/
    │   └── motion/
    ├── 05-page-shots/
    │   ├── README.md
    │   ├── 01-welcome.png
    │   ├── 02-chat.png
    │   ├── 03-three-pane.png
    │   ├── 04-thinking.png
    │   ├── 05-search-modal.png
    │   ├── 06-skill-detail-modal.png
    │   ├── 07-settings.png
    │   ├── 08-file-library.png
    │   ├── 09-skill-discovery.png
    │   └── 10-skill-manage.png
    └── 06-recipes/
        ├── agent-welcome-page.md
        ├── agent-chat-page.md
        ├── secondary-agent-pages.md
        └── mock-interactions.md
```

## 使用顺序

1. 从 `SKILL.md` 判断是 `prototype`、`integration`、`review` 还是 `component` 模式。
2. 读 `reference/00-workflows.md`。
3. 根据页面场景读 `reference/06-recipes/` 和 `reference/05-page-shots/`。
4. 读 `reference/03-component/component-routing.md`，再打开精确组件文档。
5. 按 `reference/04-asset/asset-packages.md` 检查包、主题和 fallback。
6. 实现或评审时用 mock 数据、真实交互和 token 自检。

## 同步原则

- 新增组件后，优先更新 `reference/03-component/vedesign-use-skill/*/index.md` 和 `component-routing.md`。
- 新增页面类型后，优先新增或更新 `reference/06-recipes/`，再同步 `SKILL.md` 页面路由。
- 页面截图规则更新后，同步 `reference/05-page-shots/README.md` 对应章节和 PNG。
- 包入口或主题入口变化后，同步 `reference/04-asset/asset-packages.md`、`README.md` 和 `SKILL.md`。
