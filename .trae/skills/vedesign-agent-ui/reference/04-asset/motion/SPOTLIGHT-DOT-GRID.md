# Spotlight Dot Grid · 漂浮光斑点阵

> **状态:✅ Ready** —— 可在 demo 直接消费的 motion pattern。

vedesign Agent 第二个标准化 motion pattern。静态点阵 + N 个沿 Lissajous 曲线漂浮的光斑,光斑覆盖区域的点显现,离开后渐隐。视觉上是云团缓慢扫过的连贯感,**不是**满屏星空式的乱闪。

---

## 触发场景(钉死)

| 元素 | 触发时机 | spotCount | speed | spotRadiusRatio | 备注 |
|------|---------|-----------|-------|-----------------|------|
| **欢迎页主面板背景**(`.welcome-board` / Hero 卡片承载 Composer + 推荐 chips 的大白板) | 用户进入欢迎页时**立即**播放,持续到离开 | `3` | `2.5` | `0.39` | 给空状态大白板加微妙活力,不打扰用户 |
| **Empty State 大插画区**(查询结果为空 / 文件库为空 / 新建会话提示) | 进入空状态时立即播放 | `2` | `1.5` | `0.45` | 比欢迎页慢、光斑更大,弱化"空"的负面感 |

**禁止扩散**:这两个场景之外的元素**默认不加 spotlight-dot-grid**:

- ❌ 不要加在对话气泡、artifact 卡片、列表项上(干扰阅读)
- ❌ 不要加在小尺寸卡片(< 320×200 px)上(光斑半径会比卡片还大,看起来像渐变背景而非动效)
- ❌ 不要叠加在已有复杂动效或阅读主体上(会竞争注意力)

**节奏说明**:`speed=2.5` 是欢迎页标准。视觉上 3 个光斑各自周期约 9~25 秒,慢到刚好"察觉到在动但不分散注意力"。早期版本用 `speed=0.7`,实际反馈"太慢,几乎是静态背景";`speed=4` 则"光斑像在抖,有焦虑感"。

**点色随主题切换 — 双值规格(钉死)**:

浅色和深色必须是**相对背景反向**的关系:浅色白底上点阵要比背景略暗;深色黑底上点阵要比背景略亮。两套值都很克制,只作为背景纹理存在。

| 主题 | 点色 RGB | 设计意图 |
|------|---------|---------|
| **亮色**(白底 `--color-bg-base: #FFFFFF`)| `232, 232, 240`(浅冷灰,B+8) | 在白底上"勉强可见但不抢戏"。灰度 232 是"内容/背景纹理"边界的甜区 |
| **暗色**(深底 `--color-bg-base: #101013`)| `60, 60, 70`(深冷灰,B+10) | 在深底上同样"勉强可见"。**不是反色** —— 反成 `15,15,15` 全黑消失,反成 `200,200,210` 过亮抢戏。要的是**比底色亮 10-15% 的中性冷灰** |

**B 通道 +8~10 做轻微冷调**(避免在白底上发黄 / 在深底上发暖),是两个主题共有的规则。

**Why 不是简单取同一套色或数学反色**:
- 白底用浅灰逻辑 = "用比底色暗一档"做纹理
- 深底用浅灰逻辑 ≠ "用比底色亮一档"做纹理 —— 应该是"亮一档的中性灰",不是"用 200+ 的浅色"。这是设计师在实际效果上反复调出的甜区,不要凭"反色逻辑"自己改
- 浅色模式绝不能继续使用暗色值 `60,60,70`,否则点阵过重;暗色模式绝不能继续使用亮色值 `232,232,240`,否则点阵抢内容焦点。

**实现:用 CSS variable 让 color 跟着主题热切换**(推荐):

```css
:root {
  --ved-spotlight-color: 232, 232, 240;
}
:root.dark {
  --ved-spotlight-color: 60, 60, 70;
}
```

```html
<div class="ved-spotlight-host" data-spotlight-dots
     data-spotlight-color="var(--ved-spotlight-color)">
  ...
</div>
```

库支持 `color` 选项为 `var(--xxx)` 形式,draw loop 每帧实时 resolve,**主题切换无需重新 init,无闪烁**。

---

## ⛔ host 必须有确定尺寸 + overflow 处理(硬规则)

spotlight 的 canvas 用 `position: absolute; inset: 0` 铺满 host,所以:

| 维度 | 要求 |
|------|-----|
| **尺寸** | host 必须有明确宽高(不能塌陷为 0×0)。常见做法:host 自己有内容撑开,或显式设 `min-height` |
| **position** | host 必须 `position: relative`(或其他非 static)。库会自动给 `static` 的 host 注入 `relative` 兜底 |
| **overflow** | host 推荐 `overflow: hidden`,让 canvas 被 host 圆角裁剪 — 否则圆角区域外会露出方形 canvas 边缘 |
| **content z-index** | host 自身内容应 `position: relative; z-index: 2+`,否则会被 canvas (z-index 1) 盖住。或直接用 `.ved-spotlight-content` 包裹 |

**库的自动处理**:
- 检测 `getComputedStyle(host).position === 'static'` 时自动注入 `position: relative`
- DPR 处理(最高 2x)、`ResizeObserver` 自适应 host 尺寸变化
- `IntersectionObserver` 在 host 离屏时暂停 `requestAnimationFrame`(`autoPause: true`,默认开)
- canvas 自动继承 host 的 `border-radius`(通过 `border-radius: inherit`)

---

## 使用边界

`spotlight-dot-grid` 是本 skill 唯一保留的 motion pattern，只负责背景氛围，不负责按钮、输入框、思考态或卡片进场强调。

---

## 集成步骤(单文件 agent.html)

### 1) 在 `<head>` 内联 `spotlight-dot-grid.css` 全部内容

```html
<style>
/* ...其他 css... */

/* === spotlight-dot-grid 复制自 reference/04-asset/motion/spotlight-dot-grid.css === */
.ved-spotlight-canvas { ... }
.ved-spotlight-canvas canvas { ... }
.ved-spotlight-host { ... }
.ved-spotlight-content { ... }
</style>
```

### 2) 在文档底部 `<script>` 内联 `spotlight-dot-grid.js` 全部内容

```html
<script>
/* === spotlight-dot-grid 复制自 reference/04-asset/motion/spotlight-dot-grid.js === */
(function (global) { ... })(window);

// 页面 ready 后自动初始化所有 [data-spotlight-dots]
document.addEventListener('DOMContentLoaded', autoInitSpotlightDotGrids);
</script>
```

### 3) HTML 上标注 `data-spotlight-dots`(欢迎页主面板例)

```html
<div class="ved-welcome-board ved-spotlight-host" data-spotlight-dots>
  <!-- ⚠️ 内容必须用 .ved-spotlight-content 或自己设 z-index: 2+ -->
  <div class="ved-spotlight-content">
    <h1>今天想设计点什么?</h1>
    <div class="ved-composer">...</div>
    <div class="ved-recommended-chips">...</div>
  </div>
</div>
```

无需任何 JS 调用,`autoInit` 会自动接管。

### 4) 想用非标准参数 → 用 `data-spotlight-*` 覆盖

```html
<!-- 比欢迎页慢、更柔和的 Empty State 用法 -->
<div class="ved-spotlight-host" data-spotlight-dots
     data-spotlight-spot-count="2"
     data-spotlight-spot-radius="0.45"
     data-spotlight-speed="1.5">
  ...
</div>
```

### 5) 动态插入 host(对话流中后插入的卡片) → 手动 init

```javascript
var board = document.createElement('div');
board.className = 'ved-empty-state ved-spotlight-host';
board.innerHTML = '<div class="ved-spotlight-content">暂无结果</div>';
container.appendChild(board);

var ctrl = initSpotlightDotGrid(board, {
  spotCount: 2,
  speed: 1.5,
  spotRadiusRatio: 0.45
});

// host 销毁前记得 destroy,否则 rAF 会泄漏
board.__spotlightCtrl = ctrl;
```

---

## API

### `initSpotlightDotGrid(host, opts)` → controller

| opts 字段 | 类型 | 默认 | 说明 |
|----------|------|------|------|
| `gap` | number | `15` | 点间距 px。vedesign 标准 = 15 |
| `radius` | number | `1.4` | 点半径 px。vedesign 标准 = 1.4 |
| `spotRadiusRatio` | number | `0.39` | 光斑半径占面板长边的比例(0..1)。值越大光斑越宽 |
| `spotCount` | number | `3` | 同时存在的光斑数(1..4)。3 是 vedesign 标准,2 更柔、4 太满 |
| `speed` | number | `2.5` | 全局速度倍率。建议 0.5..3 |
| `baseOpacity` | number | `0.01` | 不在光斑下时点的最低不透明度。0 = 完全消失,0.01 = 极轻底纹 |
| `peakOpacity` | number | `0.7` | 光斑中心处点的最大不透明度 |
| `color` | string | `"232, 232, 240"` | 点颜色 RGB 三元组字符串。**白底用浅冷灰,深底改为深冷灰**(详见上方双主题表)。**支持 CSS variable**:传 `"var(--ved-spotlight-color)"` 时 draw loop 每帧实时 resolve,主题切换自动跟随,无需重新 init |
| `autoPause` | boolean | `true` | host 离屏时是否自动暂停 rAF |

返回 controller:
```ts
{
  play(): void,       // 启动(初始化时已自动 play)
  stop(): void,       // 暂停,canvas 保留
  destroy(): void,    // 移除 canvas + 断开所有 observer(host 销毁前必调)
  isPlaying(): boolean
}
```

### `autoInitSpotlightDotGrids(scope?)` → controller[]

批量初始化所有 `[data-spotlight-dots]` 元素。通过 `data-spotlight-*` 属性读取配置:

| HTML 属性 | 对应 opts |
|-----------|-----------|
| `data-spotlight-gap="15"` | `gap` |
| `data-spotlight-radius="1.4"` | `radius` |
| `data-spotlight-spot-radius="0.39"` | `spotRadiusRatio` |
| `data-spotlight-spot-count="3"` | `spotCount` |
| `data-spotlight-speed="2.5"` | `speed` |
| `data-spotlight-base="0.01"` | `baseOpacity` |
| `data-spotlight-peak="0.7"` | `peakOpacity` |
| `data-spotlight-color="232,232,240"` | `color` |
| `data-spotlight-auto-pause="false"` | `autoPause = false` |

防重复:host 上挂 `__spotlightCtrl`,再次 auto-init 会跳过。

---

## 视觉规格

- **点阵排列**:蜂窝(偶数行 offset 半个 gap),比正方网格更柔和
- **点颜色**:`rgba(232, 232, 240, alpha)`,浅冷灰,B 比 R/G 高 8 做冷调
- **光斑运动**:Lissajous 曲线,fx ∈ [0.05, 0.11] Hz,fy ∈ [0.04, 0.11] Hz,fx ≠ fy 保证无周期
- **光斑半径呼吸**:每个光斑还有独立的 ±10~20% 半径呼吸,频率 0.03~0.08 Hz
- **衰减函数**:smoothstep `t·t·(3 - 2·t)`,边缘自然渐隐(不是硬切,也不是线性)
- **alpha 计算**:`base + (peak - base) · max(falloff(d_to_light_k))` —— 多光斑取**最大值**而非求和,避免重叠区爆光
- **性能**:`alpha < 0.01` 直接跳过绘制;距离比较先用 `dist²` < `R²` 跳过远点

---

## 反 Pattern(踩过的坑)

| ❌ | ✅ |
|----|----|
| 每个点用 motion / framer 独立动画 | 点本身**不动**,只动光斑(性能高一个数量级) |
| 多光斑用 alpha 求和(重叠区爆光) | 取最大值 `max(influence_k)` |
| 用 `setInterval` 跑动画(掉帧) | `requestAnimationFrame` |
| host 离屏时仍在 rAF | `IntersectionObserver` autoPause |
| host 不设 `overflow: hidden` | 圆角外会露出方形 canvas 边缘 |
| host 内容不设 z-index | 被 canvas (z-index 1) 盖住 |
| 在小尺寸卡片(< 320×200)上加 | 光斑比卡片还大,失去"漂浮"感 |
| 叠加在复杂动效或阅读主体上 | 会竞争注意力,只放在背景宿主 |
| 改 `color` 后没换冷暖通道 | 白底用浅冷灰 `232,232,240`(B+8),深底用**深冷灰** `60,60,70`(B+10) —— 不是反色,是"亮 10-15% 的中性冷灰"。详见 §点色随主题切换 |
| 深色模式直接用亮色模式的 `232,232,240` | 深底上 contrast 过高,从"氛围铺底"变成"明显纹理装饰" —— 用 CSS variable 切换两套色值,见 §实现 |

### ⚠️ host 尺寸塌陷(典型新手坑)

**问题**:`<div data-spotlight-dots></div>` 内部没内容,height 为 0,canvas 看不见。

**解决**:host 自己要有内容撑开,或显式 `min-height`:
```css
.ved-welcome-board {
  min-height: 480px; /* 或让内部 grid/flex 撑开 */
}
```

### ⚠️ host 销毁前忘记 destroy() 导致内存泄漏

**问题**:动态插入的 host 被 React/Vue 销毁时,canvas 元素被一起移除,但 rAF 循环还在跑(因为 closure 还引用着 ctx),内存泄漏。

**解决**:在 host 销毁前手动 `__spotlightCtrl.destroy()`:
```javascript
// React useEffect cleanup
useEffect(() => {
  var ctrl = initSpotlightDotGrid(ref.current);
  return () => ctrl && ctrl.destroy();
}, []);
```

`autoInitSpotlightDotGrids` 接管的 host 会把 controller 挂在 `host.__spotlightCtrl`,可以通过 `host.__spotlightCtrl.destroy()` 主动清理。

---

## 浏览器兼容

- Chrome / Edge / Safari / Firefox 现代版本
- 依赖:`Canvas 2D`、`requestAnimationFrame`、`ResizeObserver`(IE 不支持,demo 场景 OK)
- 可选:`IntersectionObserver`(不支持时跳过 autoPause,正常运行)

---

## 源码

- `reference/04-asset/motion/spotlight-dot-grid.js`(约 230 行,纯 Vanilla)
- `reference/04-asset/motion/spotlight-dot-grid.css`(约 50 行)
