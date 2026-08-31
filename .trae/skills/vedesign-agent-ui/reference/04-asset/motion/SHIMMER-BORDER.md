# Shimmer Border · 流光边框

> **状态:✅ Ready** —— 可在 demo 直接消费的 motion pattern。

vedesign Agent 第一个标准化 motion pattern。SVG `stroke-dasharray` 沿矩形周长流动彩色描边,12 层羽化叠加实现首尾平滑渐隐。

---

## 触发场景(钉死,Mode A 必做)

| 元素 | 触发时机 | loops | duration | strokeWidth |
|------|---------|-------|----------|------------|
| **欢迎页 Composer**(`.welcome-composer` / Hero 输入框) | 用户进入欢迎页时**立即**播放 | `1` | `2.7s` | `1.5px` |
| **对话流 artifact 卡片**(右栏代码/网页/文档产物) | 卡片**插入 DOM**(mock setTimeout 末尾)时立即播放 | `1` | `2.7s` | `1.5px` |

**禁止扩散**:这两个场景之外的元素**默认不加 shimmer**。如要加,先跟设计 confirm。

**节奏说明**:1 圈 2.7 秒。短而克制 —— 流光在 Composer / artifact 上**一次性扫过一圈**就结束,不会反复绕,既宣告"页面活了"的微感受,又不打扰用户主流程。早期版本是 3s × 2 圈,实际反馈"流光绕第二圈时已经看完了,反而拖沓";单圈 + 2.7s 是当前最佳平衡。再快就变成"闪一下没看清",再慢就拖。

**stroke 默认 1.5px(装饰描边,不强求跟宿主 border 一致)**:
- vedesign 标准 border 是 `--stroke-weight-base = 0.5px`,但 shimmer 是**装饰性流光**,不是宿主 border 的延伸
- 0.5px 在 12 层羽化叠加后视觉过弱,几乎看不出流光;1.5px 在装饰强度和视觉克制之间是最佳平衡
- shimmer **可以**比宿主 border 粗(1.5px > 0.5px),视觉上像"宿主被一道更醒目的流光环绕",这是设计的预期效果
- 若实际场景需要更柔(例如小卡片)可降到 1px;需要更突出(大型欢迎页 Hero)可上 2px,**但默认值钉死 1.5px**

---

## ⛔ 流光必须沿宿主视觉边框走(硬规则)

shimmer 的**核心承诺**是"输入框 / artifact 卡片自带流动描边",所以流光的 SVG 矩形**必须跟宿主的视觉边框完全重合**:

| 维度 | 要求 |
|------|-----|
| **宽度** | 跟宿主**视觉宽度**(border-box)完全一致 — 含 padding + border,不是 content-box |
| **高度** | 跟宿主**视觉高度**(border-box)完全一致 — 同上 |
| **圆角** | `radius` 参数 = 宿主 `border-radius` 计算值(像素数字) — 必须严格相等 |
| **位置** | 跟宿主**完全重合**,描边沿宿主四边走 — 不能浮在内部,不能溢出 |

**库的实现保证**(无需 caller 处理):
- 用 `entry.borderBoxSize[0]`(不是 `contentRect`)取宿主 border-box 尺寸 → 自动覆盖 padding + border
- 宿主有 `filter` 时自动外挂到 `parentNode` + `getBoundingClientRect` 同步坐标 → 流光不在 filter 子树里被裁
- 通过 `requestAnimationFrame` 重试 `play()` 等待真实尺寸到位

**caller 必须遵守的硬要求**:
- `radius` 参数**必须**跟宿主 `border-radius` 一致(以像素为单位)
  - 例:Composer `border-radius: var(--radius-2xl) /* 20px */` → `data-shimmer-radius="20"`
  - 例:artifact card `border-radius: var(--radius-lg) /* 12px */` → `data-shimmer-radius="12"`
  - **不一致 = 圆角偏差,描边在 4 个角处有视觉错位**
- 宿主必须有**确定的视觉边框尺寸**(由 padding + content + border 决定),不能在 shimmer 初始化时还在伸缩
- 宿主**不能**用 `transform`(scale / rotate),会导致 shimmer 坐标系跟视觉对不上

---

## 跟 Composer drop-shadow 的关系

**叠加,不替换**。Composer 既保留 `filter: drop-shadow(...)`(详见 SKILL.md §1.4),又在其上叠加 shimmer-border。

```html
<div class="ved-composer ved-shimmer-host" data-shimmer
     data-shimmer-radius="20"
     data-shimmer-stroke="1.5"
     data-shimmer-duration="2.7"
     data-shimmer-loops="1">
  <!-- 输入框内部结构 -->
</div>
```

```css
.ved-composer {
  position: relative; /* shimmer 需要 host 是 positioned */
  border-radius: 20px;
  filter: drop-shadow(0 4px 13px rgba(16,16,19,0.05))
          drop-shadow(0 2px 2px rgba(16,16,19,0.05));
  /* shimmer-border 视觉叠加在描边层,不干扰 drop-shadow */
}
```

---

## 集成步骤(单文件 agent.html)

### 1) 在 `<head>` 内联 `shimmer-border.css` 全部内容

```html
<style>
/* ...其他 css... */

/* === shimmer-border 复制自 reference/04-asset/motion/shimmer-border.css === */
@keyframes ved-shimmer-flow { ... }
@keyframes ved-shimmer-loop { ... }
.ved-shimmer-border { ... }
.ved-shimmer-host   { ... }
</style>
```

### 2) 在文档底部 `<script>` 内联 `shimmer-border.js` 全部内容

```html
<script>
/* === shimmer-border 复制自 reference/04-asset/motion/shimmer-border.js === */
(function (global) { ... })(window);

// 页面 ready 后自动初始化所有 [data-shimmer]
document.addEventListener('DOMContentLoaded', autoInitShimmerBorders);
</script>
```

### 3) HTML 上标注 `data-shimmer`(欢迎页 Composer 例)

```html
<div class="ved-composer ved-shimmer-host"
     data-shimmer
     data-shimmer-radius="20"
     data-shimmer-stroke="1.5"
     data-shimmer-duration="2.7"
     data-shimmer-loops="1">
  <textarea placeholder="今天想设计点什么?"></textarea>
  <div class="ved-composer-footer">...</div>
</div>
```

⚠️ `data-shimmer-radius` 必须等于宿主 `border-radius` 的像素值。Composer 用 `--radius-2xl`(20px),所以这里写 20。**不一致 = 圆角不贴**。

### 4) artifact 卡片在 mock 生成完成时手动触发

artifact 不在 page-shots 初始 DOM 里,而是聊天 mock 流程中**动态插入**,所以用 JS 触发。`radius` 同样必须跟宿主 `border-radius` 一致:

```javascript
// mock ai 回复后,假装生成 artifact
setTimeout(function () {
  var artifactCard = document.createElement('div');
  artifactCard.className = 'ved-artifact ved-shimmer-host';
  // ⚠️ 这个卡片 css 用 --radius-lg(12px),所以 radius 传 12
  artifactCard.style.borderRadius = 'var(--radius-lg)';
  artifactCard.innerHTML = '<div class="ved-artifact-content">...</div>';
  threadEl.appendChild(artifactCard);

  // 立即初始化 shimmer
  initShimmerBorder(artifactCard, {
    radius: 12,        // 必须等于 .ved-artifact 的 border-radius
    strokeWidth: 1.5,
    duration: 2.7,
    loops: 1
  });
}, 1500);
```

---

## API

### `initShimmerBorder(host, opts)` → controller

| opts 字段 | 类型 | 默认 | 说明 |
|----------|------|------|------|
| `radius` | number | 8 | 圆角半径 px,**必须跟宿主 border-radius 一致** |
| `strokeWidth` | number | 1.5 | 描边线宽 px。装饰描边,**默认 1.5px**(0.5px 在 12 层羽化后视觉过弱) |
| `colorRatio` | number | 0.5 | 彩色段占周长比例(0-1) |
| `duration` | number | 2.7 | 一圈时长(秒)。vedesign 标准节奏 = 2.7s |
| `loops` | number / Infinity | 1 | 播放圈数(`Infinity` 永久循环)。vedesign 标准 = 1 圈(短而克制) |
| `gradient` | Array<{offset,color}> | vedesign 4 色 | 自定义渐变 stops |
| `gradientId` | string | 自动生成 | SVG 渐变 id,多实例需唯一 |
| `trigger` | `'mount'` / `'manual'` | `'mount'` | 触发时机 |

返回 controller:
```ts
{
  play(): void,    // 重新播放
  stop(): void,    // 立刻停止
  destroy(): void, // 移除 shimmer DOM(适合 artifact 销毁时)
  isPlaying(): boolean
}
```

### `autoInitShimmerBorders()` → controller[]

批量初始化所有 `[data-shimmer]` 元素,通过 `data-shimmer-*` 属性读取配置。

---

## 视觉规格

- **渐变色**(钉死):`#006AFF → #7861FF → #9CC5FF → #FFCC6B`(蓝 → 紫 → 浅蓝 → 金)
- **羽化**:12 层 `<rect>` 叠加,每层 stroke-dasharray 长度 `[50%, 100%] × colorSegment`,opacity 指数衰减 `exp(-4 × i/11)`
- **流光方向**:沿 rect 周长顺时针流动(`stroke-dashoffset` 负值递增)
- **stroke-linecap**:`round`,首尾圆润不硬切
- **不影响**:`pointer-events: none` —— 流光层不拦点击

---

## 反 Pattern(踩过的坑)

| ❌ | ✅ |
|----|----|
| 用 `box-shadow` 模拟流光(性能差、不能沿圆角) | SVG `stroke-dasharray` 真沿周长 |
| 用 `background: linear-gradient` 当边框 | 描边动画必须 SVG stroke |
| 给 Composer 改成 `box-shadow` 取代 drop-shadow 后加 shimmer | drop-shadow 保留,shimmer 叠加(库自动外挂) |
| 整个页面加 `data-shimmer`(造成噪音) | 仅 §触发场景 表里 2 个元素 |
| `radius` 不跟宿主 border-radius 一致 | 两个值必须相同,否则描边歪斜 |
| 跨多实例共享 `gradientId` | 多实例需各自唯一 id(默认自动生成) |

### ⚠️ borderBoxSize vs contentRect(已由库自动处理)

**问题**:`ResizeObserver` 的 `entry.contentRect` 是 **content-box**(不含 padding / border),host 一旦有 padding(Composer 有 `padding: var(--space-xs)` 即 8px),contentRect.height 比视觉边框**矮 16px**。如果 shimmer SVG 用了 contentRect 尺寸,**描边会浮在 host 内部、不贴边框**。

**库的自动处理**:用 `entry.borderBoxSize[0]` 取 **border-box** 尺寸(包含 padding + border)。所有现代浏览器(Chrome 84+ / Safari 15.4+ / Firefox 69+)都支持;旧版用 `getBoundingClientRect()` 兜底,后者默认就是 border-box。

### ⚠️ filter / overflow 裁切陷阱(已由库自动处理)

**问题**:CSS `filter`(包括 `drop-shadow` / `blur` 等)会:
1. 给元素创建独立的 stacking context
2. **裁切**子元素超出 boundary 的 `overflow: visible` 内容
3. 让子 SVG 描边在 host 边缘外的部分**被切掉**

Composer 必有 `filter: drop-shadow(...)`(SKILL.md §1.4 铁律),如果 shimmer wrap 直接 `host.appendChild(wrap)`,SVG 描边视觉上**完全看不到**或**被切**。

**库的自动处理**:`initShimmerBorder` 检测 `getComputedStyle(host).filter !== 'none'` 时,**自动把 wrap 挂到 `host.parentNode`,通过 absolute + getBoundingClientRect 同步 host 坐标**。Composer 那种 filter 容器不需要使用者做任何额外处理,库会自动外挂。

**注意**:这要求 host 的 parent 不能 `overflow: hidden`(否则外挂的 wrap 还是会被 parent 裁)。Composer 的 parent 通常是 `.composer-zone` / `.main-card`,默认 `overflow: visible`,不冲突。

---

## 浏览器兼容

- Chrome / Edge / Safari / Firefox 现代版本
- 依赖:`ResizeObserver`(IE 不支持,demo 场景 OK)
- `requestAnimationFrame` / `CSS Custom Properties` —— 现代浏览器全支持

---

## 源码

- `reference/04-asset/motion/shimmer-border.js`(220 行,纯 Vanilla)
- `reference/04-asset/motion/shimmer-border.css`(60 行)
