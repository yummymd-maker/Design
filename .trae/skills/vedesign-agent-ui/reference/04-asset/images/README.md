# Asset · 配图（Images）

> **状态**：✅ 100% —— skill 内置默认配图池（11 张授权可商用，可用于 React import 或单文件 base64 内联）。
> **默认方案**：从 `reference/04-asset/images/` 选图。React / Vite 项目复制到 `src/assets/images` 后 import;单文件 HTML 才 base64 内联。
> **兜底方案**：token 占位块（任何"没有合适语义图"或"环境无法读图"时回退）。

---

## 0. 铁律

1. **默认从 `reference/04-asset/images/` 选图**（skill 内置 11 张，已经压到 15-65KB 一张，全部 ≤400px 宽，可商用授权）。
2. **React / Vite 默认**：选 1-4 张 → 复制到项目 `src/assets/images/` → `import gallery01 from './assets/images/gallery-01.jpg'` → `<img src={gallery01}>`。不要用图标、emoji、文字或灰块代替。
3. **单文件 HTML 默认**：选 1-4 张 → 转 base64 → 直接 `<img src="data:image/jpeg;base64,...">` 内联，**不要外链**，**不要再走 Unsplash**。
4. **方案二（兜底）**：找不到合适语义图、或一次性要 4 张以上场景一致的图 → 走 token 占位块（见 §2）。
5. 单文件交付 4 张图 base64 内联约 +120-200KB，可接受。
6. 不在 demo 之外再分发图片，不外链到第三方 CDN。
7. **⛔ 单文件 HTML 禁止相对路径**(`./images/foo.jpg` / `images/foo.jpg` / `../assets/...`)。Mode A 是单文件 HTML,部署到 dev server 时浏览器找不到这些 jpg → 404 → fallback 灰底。**必须真 base64 内联**。React / Vite 项目则禁止裸字符串相对路径,必须复制进 `src/assets/images` 并通过 import 交给 bundler。
8. **⛔ 禁止用文字 / emoji / 纯色块当画廊封面**(最常见偷懒陷阱)—— 不许写 `<div class="task-cover">图片分类</div>`(把任务标题塞进 cover 当文字)、不许放 emoji `🖼️` 占位、不许只留空白纯色块。**task-cover 的视觉真相是真实图像内容**(grid4 4 张图 / single 单图 / pair 1×2 / video 单图加播放按钮),里面必须有真实 `<img>`:React / Vite 用 import 后的图片变量,单文件 HTML 用 `data:image/jpeg;base64,...`。漏图 = 重做。
9. **⛔ Mode A build script 必须真调 readFileSync 读 gallery jpg** —— 如果 build script 里 `gallery-` 出现 0 次 / `readFileSync(...jpg)` 出现 0 次,**就是漏了画廊图**,重做。

---

## 1. 方案一 · 内置图池 base64 内联（默认）

### 1.1 图池

`reference/04-asset/images/` 下 11 张：

| 文件 | 推荐场景 |
|------|---------|
| `gallery-01.jpg` | 通用 / 场景 1 |
| `gallery-02.jpg` | 通用 / 场景 2 |
| `gallery-03.jpg` | 通用 / 场景 3 |
| `gallery-04.jpg` | 通用 / 场景 4 |
| `gallery-05.jpg` | 通用 / 场景 5 |
| `gallery-06.jpg` | 通用 / 场景 6 |
| `gallery-07.jpg` | 通用 / 场景 7 |
| `gallery-08.jpg` | 通用 / 场景 8 |
| `gallery-09.jpg` | 通用 / 场景 9 |
| `gallery-10.jpg` | 通用 / 场景 10 |
| `gallery-11.jpg` | 通用 / 场景 11 |

> 全部走"通用"语义 —— **任意场景都可选用**。如果某场景需要特定语义（如"批改英文作文"配文档图、"识别视频"配视频图），从池中**挑视觉最匹配的一张**，不必每张都精确语义。

### 1.2 流程

```python
# Python
# Step 1: 选图（按场景挑 N 张，N 通常 4，跟欢迎页画廊卡数对应）
selected = ['gallery-01.jpg', 'gallery-04.jpg', 'gallery-07.jpg', 'gallery-09.jpg']

# Step 2: 读文件 → base64
import base64
for f in selected:
    with open(f'reference/04-asset/images/{f}', 'rb') as fp:
        b64 = base64.b64encode(fp.read()).decode()
    print(f"data:image/jpeg;base64,{b64}")
```

```javascript
// Node 等价
const fs = require('fs');
const selected = ['gallery-01.jpg', 'gallery-04.jpg', 'gallery-07.jpg', 'gallery-09.jpg'];
const galleryB64 = selected.map(name => {
  const b64 = fs.readFileSync(`reference/04-asset/images/${name}`).toString('base64');
  return `data:image/jpeg;base64,${b64}`;
});
// 后面 HTML 模板里:
//   <img class="task-cover-img" src="${galleryB64[0]}" alt="">
```

```html
<!-- Step 3: 写进 <img>，塞进 .task-cover 容器 -->
<div class="task-cover">
  <img class="task-cover-img" src="data:image/jpeg;base64,..." alt="" />
</div>
```

```css
.task-cover-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: var(--radius-lg);
}
```

### 1.2.1 ⛔ build script 自检(model 自己 verify)

写完 build script 后,**先 grep 一下自己的脚本读没读 images 目录**:

```javascript
// Node 自检
const script = require('fs').readFileSync('build.js', 'utf8');
const imgReads = script.match(/reference\/04-asset\/images\/gallery-\d+\.jpg/g) || [];
console.assert(imgReads.length >= 4, `至少要读 4 张画廊图,实际 ${imgReads.length}`);
```

```python
# Python 自检
import re
script = open('build.py').read()
img_reads = re.findall(r'reference/04-asset/images/gallery-\d+\.jpg', script)
assert len(img_reads) >= 4, f"至少要读 4 张画廊图,实际 {len(img_reads)}"
```

**Mode A 欢迎页画廊 4 张卡片必须有 4 张真图**。如果 build script 里 `reference/04-asset/images/gallery-` 出现次数 < 4,**画廊一定缺图**,重做。

### 1.3 选图原则

- **同页同主题**：欢迎页 4 张画廊卡用同风格的图（都偏写实 / 都偏抽象），不要混搭
- **多页同 agent**：同一 agent 内多次出现配图，**优先复用同几张图**（一致感）
- **不深度匹配语义**：池子是通用素材，按"视觉舒服"选即可，不必每张严格语义匹配

---

## 2. 方案二 · token 占位块（兜底）

适用场景：① 不需要"真实图"的视觉表达（如设置页 / 列表页）② 需要超过 4 张同主题图但池子里凑不齐 ③ 故意做"克制"视觉。

```css
.task-cover {
  position: relative; overflow: hidden;
  height: 150px; border-radius: var(--radius-lg);
  background: linear-gradient(150deg, var(--color-bg-muted) 0%, var(--color-bg-surface) 100%);
  display: flex; align-items: center; justify-content: center;
}
.task-cover::before {
  content: ''; position: absolute; inset: 0;
  background-image: radial-gradient(var(--color-border-default) 1px, transparent 1.5px);
  background-size: 14px 14px; opacity: 0.55;
}
.task-cover::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(150deg, transparent 55%, var(--color-bg-base) 100%);
  opacity: 0.5;
}
.task-cover-badge {
  position: relative; z-index: 1;
  width: 46px; height: 46px; border-radius: var(--radius-lg);
  background: var(--color-bg-base);
  border: var(--stroke-weight-base) solid var(--color-border-default);
  box-shadow: var(--shadow-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-icon-primary);
}
```

- 颜色只用 token，禁止 hex。
- 徽章里的图标从 `reference/04-asset/icons/` 取（保留 viewBox、`stroke=currentColor`）。
- 多张卡用统一样式，不每卡变色。

---

## 3. 复述模板（写在 §0.5 开工模板里）

> 配图走 `reference/04-asset/images/README.md` 方案一：从内置图池 (`reference/04-asset/images/gallery-NN.jpg`) 选 N 张 → base64 内联；列表/设置等"克制"页面或凑不齐主题时走方案二占位块。**永远不外链 Unsplash 或其他第三方 CDN。**

---

## 4. TODO

- [ ] 图池随项目演进每半年人工 review 一次，更换不合时宜的图
- [ ] 组件库发版后若有 `<ved-image-placeholder>` 官方组件，替换方案二的手写实现
- [ ] 池子可按业务方向扩展为分组（如 `gallery/scene/` / `gallery/abstract/` / `gallery/tech/`）
