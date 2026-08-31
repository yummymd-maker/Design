# 配方 · Agent 二级页面

用于 Skill Store、MCP Store、插件发现、已安装 skill 管理、文件库、产物列表、设置页、定时任务和详情弹窗。

## 必读内容

1. `reference/02-layout/layouts.md` §2 和 §4
2. 发现类页面读取 `reference/05-page-shots/README.md` §09-skill-discovery + `09-skill-discovery.png`
3. 管理类页面读取 `reference/05-page-shots/README.md` §10-skill-manage + `10-skill-manage.png`
4. 文件库读取 `reference/05-page-shots/README.md` §08-file-library + `08-file-library.png`
5. 设置页读取 `reference/05-page-shots/README.md` §07-settings + `07-settings.png`
6. 搜索弹窗读取 `reference/05-page-shots/README.md` §05-search-modal + `05-search-modal.png`
7. 详情弹窗读取 `reference/05-page-shots/README.md` §06-skill-detail-modal + `06-skill-detail-modal.png`
8. `reference/03-component/component-routing.md`

## 发现页

用于 Skill Store、MCP Store、插件发现和能力市场。

所有二级页面必须复用全局 `Sidebar` 宽度契约:展开固定 220px,收起固定 54px。不要因为文件库、设置页、发现页、管理页内容宽度不同,在各 page shell 上分别覆盖 Sidebar 的 `width` / `flex-basis`。

必备组件：

- `Sidebar`
- `Input`
- `Tabs`
- `Button`
- `Tag` / `Badge`
- `Modal` 用于详情或安装流程
- `Empty` 用于无结果

必备 mock 数据：

- capabilities：包含 id、name、description、type、icon、installed status、tags；
- tabs：例如 all、skills、MCP、installed、recommended；
- search query 和 filters；
- 当前选中的 detail item。

必备交互：

- search 过滤可见列表；
- tabs 过滤列表；
- install / add 按钮改变 installed 状态或打开详情弹窗；
- 点击 item 打开详情弹窗；
- modal confirm 会更新状态；
- 过滤后无结果时展示 empty state。

硬约束：

- 外壳必须走 `layouts.md` §2 功能页骨架：`.main-card.feature-card` + `.page-title-row` + `.feature-body`，不要起 `.skill-discovery-layout`。
- 页面操作区为右侧搜索框 + 「管理」次按钮 + 「+ 安装」主按钮；「管理」是进入已安装 skill 管理页的唯一主入口。
- 二级 tab 使用 pill 形态，至少有「技能」和「MCP N」；filter icon 与 tab 同行。
- 网格默认 2 列等宽，不做 3 / 4 列；卡片内描述要能完整扫读。
- skill 卡片三段：左 icon，中间 name + desc + tags，右侧操作。未安装为 `+`，已安装为 settings icon；已安装卡片使用 `bg-secondary` / `bg-surface` 轻灰底。

## 管理页

用于已安装 skills、MCP 管理、自动化、定时任务或可启停能力。

必备组件：

- `Sidebar`
- `Input`
- `Tabs`
- `Switch`
- `Dropdown`
- `Button`
- `Popconfirm` 用于危险操作
- `Message` 用于真实操作反馈

必备交互：

- switch 切换 enable/disable 状态，并展示 loading 或乐观更新反馈；
- search 和 tabs 过滤行；
- more menu 打开 item 操作；
- 危险操作使用 `Popconfirm`；
- 状态变化必须在对应行中可见。

硬约束：

- 外壳同 §2 功能页骨架，禁止 `.skill-manage-layout`。
- 管理页不是 Sidebar 一级菜单，不要在侧边栏主导航里新增「管理」。只能从发现页右上角「管理」按钮进入；进入后 Sidebar active 仍保持「发现」。
- 页面标题为「< 管理」返回形态，右侧保留搜索框。
- 内容为 §2.4 单层 Tab + 列表，不要复用发现页网格。
- 每行三段：左 skill icon + name + desc，中间或右侧 toggle，hover 才显示 more。
- 主操作是启停开关；不要用「编辑 / 删除」文字按钮抢视觉。

## 文件库 / 产物列表

必备组件：

- `Upload`
- `Table` 或对齐 page-shot 的 file rows
- `Input`
- `Tabs`
- `Dropdown`
- `Button`
- 需要缩略图或媒体预览时使用 `ResourcePreview`

必备 mock 数据：

- file rows：包含 name、type、size、updatedAt、owner、status；
- upload queue：包含 uploading、done、error 示例；
- 如果有批量操作，包含 selected rows。

必备交互：

- upload 打开文件选择器，或追加 mock upload item；
- search 过滤文件；
- tabs 按类型 / 状态过滤；
- column sort 改变排序；
- 如存在 view toggle，切换 list/grid 状态；
- file row 的 more menu 打开操作；
- preview 打开 `ResourcePreview` 或 modal。

硬约束：

- 文件库默认且唯一主形态是列表；不要以网格态作为默认。
- 外壳同 §2 功能页骨架，禁止 `.files-layout` / `.file-list-page`。
- 页面操作区右侧为搜索框 + 「+ 上传」主按钮。
- filter-bar 同行包含 `全部` / `图片 N` / `文件 N` pill tab、filter icon、视图切换器；网格按钮本期只做视觉占位。
- 表头为 `名称` / `修改时间` / `大小`，排序字段带 chevron-down。
- 文件类型图标保留多色 type icon 原色，24×24 固定；普通操作按钮仍用线性 icon。
- 行 hover 使用 `bg-surface`，默认隐藏 more，hover 出现。

## 设置页

除非宿主产品已有独立设置外壳，否则使用同一套二级页 shell。

推荐组件：

- `Tabs`
- `Switch`
- `Radio`
- `Checkbox`
- `Select`
- `Input`
- `DigitalInput`
- `Alert`
- `Button`

必备交互：

- 控件应为 controlled 或 default-controlled，并有可见 saved/dirty 状态；
- save 按钮保存本地状态或调用既有项目 handler；
- reset / cancel 能回滚状态；
- invalid field 附近展示 validation。

硬约束：

- 设置页是独立整页，不是 Modal；外壳同 §2 功能页骨架，禁止 `.settings-layout` / `.settings-content`。
- 内容走 §2.3 二级布局：左 `.feature-sub-nav`，右 `.feature-detail`。
- sub-nav 项可按业务调整，默认第一项选中；选中态不要加左侧 vertical bar。
- 设置项统一为 `.feature-group` + `.setting-row`；左侧 label / desc，右侧控件。
- 「外观」分组必须同时包含两行：第 1 行「主题」亮/暗切换；第 2 行「所属产线」5 个 chip：Agent / Arkclaw / 安全 / 火山引擎 / 火山方舟。
- 亮暗切换修改 dark class；产线切换修改 `data-theme`。两者正交，不能合并成一个控件。
- theme 切换器业务颜色使用 token；只有产线 swatch 代表色允许用固定 hex。
- `setBrandTheme(name)` 负责更新主题状态、`data-theme`、持久化和必要重渲染。不要引用本 skill 不存在的 `data-shimmer`、`data-breathing-blob` 或私有 motion registry；若宿主项目有自定义 motion 系统，在项目侧按其协议同步。

## 详情弹窗

用于 Skill 详情、MCP 详情、插件详情、安装确认、权限检查或试用入口。

必备组件：

- `Modal`
- `Button`
- `Tag`
- `Tabs`
- `Markdown`
- 涉及权限时使用 `Authorization`

必备交互：

- Esc、遮罩、关闭按钮都能关闭 modal；
- install / enable 按钮更新父级 item 状态；
- tabs 在 modal 内切换内容；
- 权限动作必须明确：拒绝、允许一次、始终允许。

硬约束：

- Skill / MCP 详情用 Modal lg 档，宽度参考 `layouts.md` §4.3，内容不足时也保持详情弹窗结构。
- Header 左侧为 icon + 标题 + 副标题，右侧为 Switch + more + close。
- 内容区必须有一个二级内容卡，卡内顶部是 pill tab（文档 / 代码）+ copy icon，正文可在 markdown / code 间切换。
- Footer 左侧为「卸载」浅红软危险按钮，右侧为「在对话中试用」主按钮。
- 关闭、启停、卸载、试用都必须更新父级或可见状态，不要空 handler。

## 搜索 Modal

用于 Sidebar 搜索、Header 搜索或 cmd-K 命令面板。

必备组件：

- `Modal`
- `Input`
- `Button`
- `IconSearch`、`IconAdd`、`IconFolder`、`IconMessage`

必备交互：

- 输入搜索过滤列表；
- ↑/↓ 切换高亮、Enter 进入、Esc 关闭；静态 prototype 至少要有点击进入和关闭；
- 点击「新对话」关闭 modal 并进入欢迎页；
- 点击文件库 / 设置等命令关闭 modal 并切对应整页。

硬约束：

- 走 `layouts.md` §4 sm 命令面板档；无 footer。
- 顶部输入区独立一段，底部有分隔线；search icon + placeholder「搜索对话/项目」+ close icon。
- 第一项「新对话」固定置顶且默认高亮。
- 列表分组至少包含「今天」「更早」，组名用 `text-tertiary`。
- 遮罩保持轻量，不要用重遮罩压暗整个工作台。
