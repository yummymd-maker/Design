# 00 · 工作流

先用本文件判断如何应用 skill。同一套视觉体系既支持快速 prototype，也支持已有生产项目接入，但执行顺序不同。

## Prototype 流程

适用于用户要求快速创建 Agent 页面、demo、mock 页面或可交互体验。

1. 从 `reference/06-recipes/` 选择最接近的页面配方。
2. 读取 `reference/05-page-shots/` 下匹配的 page-shot README。
3. 读取 `reference/03-component/component-routing.md`，再只打开需要的精确 React 组件文档。
4. 写 JSX 前先准备真实感本地 mock 数据。
5. 实现可运行页面，并保证状态真实变化：
   - welcome 输入提交后进入 chat 或 task 状态；
   - chat 展示用户消息、生成中、完成回复、操作、引用和可选 artifact；
   - search、tabs、filters、switches、upload、modal、sidebar 控件会改变可见状态。
6. 基础控件和 Agent 专属模块都优先使用 VeDesign 组件。
7. 自定义 CSS 只承担必要页面布局，并使用 semantic token。
8. 运行项目的 build、lint、test 或最接近的验证命令。

Prototype 可以使用 mock 数据，但结构应接近生产：数据数组独立、项目支持时使用类型、组件边界清楚、没有无效控件。

## Integration 流程

适用于编辑已有业务项目。

1. 改代码前先检查项目：
   - 包管理器和 lockfile；
   - framework、app/router 结构；
   - 已有设计系统或组件 alias；
   - 主题 CSS 入口；
   - 图标体系；
   - 状态管理和数据请求风格；
   - 现有 test、lint、build 脚本。
2. 检查是否已安装 `@ve-design/react`。如果缺失且允许改依赖，用项目现有包管理器和内网 registry 安装。
3. 在 app 级样式入口引入一次 VeDesign 默认主题。如果项目已经有等价 VeDesign 主题入口，不要重复引入。
4. 围绕已有数据契约做 UI，不要虚构后端行为。
5. 只替换用户请求的页面或模块，不做无关路由、store、全局 CSS、数据服务重构。
6. 如果项目已有本地 VeDesign wrapper，优先使用本地 wrapper。
7. 自定义 CSS 保持 feature scope，并使用 token。
8. 保留宿主应用的 accessibility 和交互语义。
9. 运行宿主项目验证命令。

仅在目标页面暂无可用 API 时使用 mock 数据。mock 应放在明显的本地 fixture 或组件常量中，方便后续替换成真实数据。

## Review 流程

适用于评审页面、截图或代码。

1. 找到最接近的 page-shot 和 recipe。
2. 对比页面外壳、组件选择、密度、token 使用、内容层级、交互状态、empty/loading/error 覆盖。
3. 优先指出生产风险：
   - 手写了组件库已有组件；
   - 使用 raw color、任意间距或不匹配的字体层级；
   - 控件点击后没有状态变化；
   - 缺失 loading、error、empty 状态；
   - 响应式布局损坏或文字重叠；
   - 把截图中的示例内容当成业务真相照抄。
4. 输出具体修复建议，并标注组件和 token 依据。

## 生产可用最低标准

任何不只是一次性草图的实现都应包含：

- 稳定页面外壳；
- 真实感内容密度；
- 相关场景下的 empty、loading、success、failure 反馈；
- Dialog、Menu、Input 的键盘和指针交互；
- selected tab、filter、sidebar state 等状态只有一个事实来源；
- 仅在能消除真实重复时抽取页面局部组件；
- token-based CSS；
- 没有只有占位效果的 click handler；
- gallery 或 cover art 不外链随机第三方图片，除非宿主产品已拥有该资产路径。

## 编码约束与常见坑

- React 组件的 slot 属性必须传入已经创建好的 React element,不要传只返回 DOM 的函数组件。包括 `logo` / `pinned` / `footer` / `prefix` / `suffix` / `avatar` / `header` / `leftAction` / `rightAction` 等 `React.ReactNode` slot。组件库会用 `cloneElement` 给传入 element 挂 `slot` 属性;若传入函数组件且没有把 props 展开到根 DOM,真实 DOM 拿不到 `slot`,内容会落到默认 slot。正确: `const logo = <svg ... />; <Sidebar logo={logo} />`。如需组件封装,写成 `function Logo(props) { return <svg {...props} ... />; }`。
- Composer 流光边框必须挂在真正拥有输入框圆角和可见边框的外层 shell 上。使用新版 `shimmer-border` 时给该 shell 加 `.ved-shimmer-host`、`data-shimmer` 和与宿主圆角一致的 `data-shimmer-radius`;不要只在更外层布局容器、`.composer-wrap`、普通 `<textarea>` 或按钮上加 `data-shimmer`,否则流光不会贴着输入框视觉边框。
- 欢迎页 gallery 必须读取 `reference/04-asset/images/README.md` 并使用 `reference/04-asset/images/gallery-01.jpg` 到 `gallery-11.jpg` 的真实图片。React / Vite 项目复制到 `src/assets/images` 后 import;单文件 HTML 才转 base64 内联。不要用图标、emoji、文字或纯色块顶替画廊封面。
