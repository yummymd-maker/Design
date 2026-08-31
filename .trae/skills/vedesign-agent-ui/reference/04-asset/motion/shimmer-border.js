/**
 * Shimmer Border —— 流光边框动画
 *
 * Vanilla JS 实现(从 HoverBorder.tsx 移植,不依赖 React)。
 * 用 SVG stroke-dasharray + stroke-dashoffset 沿 rect 周长流动彩色描边。
 * 12 层 rect 叠加 + 指数衰减实现首尾羽化(平滑渐隐)。
 *
 * 用法:
 *   1. HTML: <div class="ved-shimmer-host">内容</div>
 *   2. JS:   initShimmerBorder(document.querySelector('.ved-shimmer-host'), { radius: 12 });
 *      或自动初始化所有 [data-shimmer]:
 *      autoInitShimmerBorders();
 *
 * 配置项 (opts):
 *   radius        圆角半径 px(必须跟宿主元素 border-radius 一致)         默认 8
 *   strokeWidth   描边线宽 px                                            默认 1.5
 *   colorRatio    彩色段占周长比例 0-1                                   默认 0.5
 *   duration      一圈时长(秒)                                           默认 2.7
 *   loops         播放圈数(整数;Infinity = 永久循环)                     默认 1
 *   gradient      渐变色数组 [{offset,color},...]                        默认 vedesign 4 色
 *   gradientId    SVG 渐变 id(多实例需唯一,默认自动生成)
 *   trigger       'mount' = 立刻播放; 'manual' = 等手动调 .play()         默认 'mount'
 *
 * 返回 controller:
 *   { play(), stop(), destroy() }
 *
 * 视觉规格(跟 HoverBorder 一致):
 *   渐变 #006AFF → #7861FF → #9CC5FF → #FFCC6B (蓝-紫-浅蓝-金)
 *   12 层 rect,opacity 指数衰减 0.0183 ^ (i/11)
 *   stroke-dasharray 长度 [50%, 100%] × colorSegment
 */

(function (global) {
  'use strict';

  var DEFAULT_GRADIENT = [
    { offset: '0%',   color: '#006AFF' },
    { offset: '33%',  color: '#7861FF' },
    { offset: '66%',  color: '#9CC5FF' },
    { offset: '100%', color: '#FFCC6B' }
  ];

  var FADE_LAYERS = 12;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var idCounter = 0;

  function uid() {
    idCounter += 1;
    return 'ved-shimmer-' + idCounter + '-' + Date.now().toString(36);
  }

  function initShimmerBorder(host, opts) {
    opts = opts || {};
    var radius      = opts.radius      != null ? opts.radius      : 8;
    var strokeWidth = opts.strokeWidth != null ? opts.strokeWidth : 1.5;
    var colorRatio  = opts.colorRatio  != null ? opts.colorRatio  : 0.5;
    var duration    = opts.duration    != null ? opts.duration    : 2.7;
    var loops       = opts.loops       != null ? opts.loops       : 1;
    var gradient    = opts.gradient    || DEFAULT_GRADIENT;
    var gradientId  = opts.gradientId  || uid();
    var trigger     = opts.trigger     || 'mount';

    // 支持传 selector 字符串或 DOM 节点;无效或找不到时直接返回 null
    if (typeof host === 'string') host = document.querySelector(host);
    if (!host || typeof host.appendChild !== 'function') return null;

    // ============ filter 兼容性处理 ============
    // CSS `filter` 会:① 裁切子元素的 visible overflow(SVG 描边被裁)
    //                 ② 创建独立 stacking context(z-index 隔离)
    // host 有 filter(典型场景:Composer 用 drop-shadow)时,
    // 把 wrap 挂到 host.parentNode,用 absolute 同步坐标 → 流光不在 filter 子树里。
    var hostHasFilter = getComputedStyle(host).filter !== 'none';
    var wrap = document.createElement('div');
    wrap.className = 'ved-shimmer-border';
    wrap.setAttribute('aria-hidden', 'true');

    var mountParent;
    if (hostHasFilter && host.parentNode) {
      // 外挂模式:wrap 放在 host parent 里,absolute 同步 host 坐标(getBoundingClientRect 默认 border-box)
      mountParent = host.parentNode;
      if (getComputedStyle(mountParent).position === 'static') {
        mountParent.style.position = 'relative';
      }
      wrap.style.position = 'absolute';
      wrap.style.borderRadius = String(radius) + 'px';
      wrap.style.zIndex = '2';
    } else {
      // 内挂模式:wrap 放在 host 里
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      mountParent = host;
      // ⚠️ 关键修复:CSS `inset: 0` 默认对齐到 host 的 padding-box,
      // 但 layout(w, h) 里 svg width = e.borderBoxSize(含 host border),
      // 这会导致 svg 比 wrap 多出 1 个 border-width,shimmer rect 在 host border 内沿,
      // 不贴 host 视觉边框,视觉上"光圈宽度 ≠ 宿主宽度"。
      // 修复:把 wrap 的 inset 设成负 border-width,让 wrap 包住 host 的 border-box。
      var cs = getComputedStyle(host);
      var bt = parseFloat(cs.borderTopWidth)    || 0;
      var br = parseFloat(cs.borderRightWidth)  || 0;
      var bb = parseFloat(cs.borderBottomWidth) || 0;
      var bl = parseFloat(cs.borderLeftWidth)   || 0;
      if (bt || br || bb || bl) {
        wrap.style.position = 'absolute';
        wrap.style.top    = (-bt) + 'px';
        wrap.style.right  = (-br) + 'px';
        wrap.style.bottom = (-bb) + 'px';
        wrap.style.left   = (-bl) + 'px';
      }
    }
    mountParent.appendChild(wrap);

    // SVG
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('fill', 'none');
    wrap.appendChild(svg);

    // gradient defs
    var defs = document.createElementNS(SVGNS, 'defs');
    var grad = document.createElementNS(SVGNS, 'linearGradient');
    grad.setAttribute('id', gradientId);
    grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '0%');
    grad.setAttribute('spreadMethod', 'reflect');
    gradient.forEach(function (s) {
      var stop = document.createElementNS(SVGNS, 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);

    // 12 个 g(rect 嵌在里面),layout/dash/offset 在 size 算出来后填
    var groups = [];
    for (var i = 0; i < FADE_LAYERS; i++) {
      var g = document.createElementNS(SVGNS, 'g');
      var rect = document.createElementNS(SVGNS, 'rect');
      rect.setAttribute('stroke', 'url(#' + gradientId + ')');
      rect.setAttribute('stroke-width', String(strokeWidth));
      rect.setAttribute('stroke-linecap', 'round');
      rect.setAttribute('fill', 'none');
      g.appendChild(rect);
      svg.appendChild(g);
      groups.push({ g: g, rect: rect });
    }

    var currentSize = { w: 0, h: 0 };
    var playing = false;

    /** 仅外挂模式需要:把 wrap 的 absolute 位置对齐 host 在 mountParent 里的位置 */
    function syncWrapPosition() {
      if (!hostHasFilter) return;
      var hostRect = host.getBoundingClientRect();
      var parentRect = mountParent.getBoundingClientRect();
      wrap.style.left   = (hostRect.left - parentRect.left) + 'px';
      wrap.style.top    = (hostRect.top  - parentRect.top)  + 'px';
      wrap.style.width  = hostRect.width  + 'px';
      wrap.style.height = hostRect.height + 'px';
    }

    function layout(w, h) {
      currentSize.w = w;
      currentSize.h = h;
      if (w <= 0 || h <= 0) return;

      syncWrapPosition();

      svg.setAttribute('width', String(w));
      svg.setAttribute('height', String(h));
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

      var inset = strokeWidth / 2;
      var perimeter = 2 * (w + h) - 8 * radius + 2 * Math.PI * radius;
      var effectiveColorSegment = Math.max(perimeter * colorRatio, 0);

      var totalRaw = 0;
      var layers = [];
      for (var i = 0; i < FADE_LAYERS; i++) {
        var t = i / (FADE_LAYERS - 1);
        var raw = Math.exp(-4 * t);
        var segLen = Math.max(effectiveColorSegment * (0.5 + 0.5 * t), 8);
        var segGap = Math.max(perimeter - segLen, 0);
        var offset = (effectiveColorSegment - segLen) / 2;
        layers.push({ segLen: segLen, segGap: segGap, offset: offset, raw: raw });
        totalRaw += raw;
      }

      for (var j = 0; j < FADE_LAYERS; j++) {
        var L = layers[j];
        var grp = groups[j].g;
        var r = groups[j].rect;
        grp.setAttribute('opacity', String(L.raw / totalRaw));
        r.setAttribute('x', String(inset));
        r.setAttribute('y', String(inset));
        r.setAttribute('width', String(Math.max(w - strokeWidth, 0)));
        r.setAttribute('height', String(Math.max(h - strokeWidth, 0)));
        r.setAttribute('rx', String(radius));
        r.setAttribute('ry', String(radius));
        r.setAttribute('stroke-dasharray', L.segLen + ' ' + L.segGap);
        r.style.setProperty('--shimmer-start', String(L.offset));
        r.style.setProperty('--shimmer-perimeter', String(perimeter));
      }
    }

    // 自适应尺寸
    var ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          // ⚠️ 必须用 borderBoxSize 而不是 contentRect:
          // - contentRect = content-box(不含 padding / border),视觉上比 host 边框矮一圈
          // - shimmer 描边必须沿 host 的视觉边框走 → 用 border-box 尺寸
          var w, h;
          if (e.borderBoxSize && e.borderBoxSize.length) {
            w = e.borderBoxSize[0].inlineSize;
            h = e.borderBoxSize[0].blockSize;
          } else if (e.borderBoxSize) {
            // 旧版浏览器:borderBoxSize 是单个对象而不是数组
            w = e.borderBoxSize.inlineSize;
            h = e.borderBoxSize.blockSize;
          } else {
            // 兜底:getBoundingClientRect 默认是 border-box
            var rb = host.getBoundingClientRect();
            w = rb.width;
            h = rb.height;
          }
          layout(w, h);
        }
      });
      ro.observe(host);
    } else {
      // fallback
      var b = host.getBoundingClientRect();
      layout(b.width, b.height);
    }

    function play() {
      if (currentSize.w <= 0) {
        // 尚未拿到尺寸,延后到 next frame
        requestAnimationFrame(play);
        return;
      }
      playing = true;
      var animName = loops === Infinity ? 'ved-shimmer-loop' : 'ved-shimmer-flow';
      var iterations = loops === Infinity ? 'infinite' : String(loops);
      var fillMode = loops === Infinity ? 'linear' : 'ease-in-out forwards';

      groups.forEach(function (item) {
        var r = item.rect;
        // reset 动画
        r.style.animation = 'none';
        // 强制 reflow 让浏览器接受重新触发
        // eslint-disable-next-line no-unused-expressions
        r.offsetHeight;
        r.style.animation = animName + ' ' + duration + 's ' + fillMode + ' ' + iterations;
      });
    }

    function stop() {
      playing = false;
      groups.forEach(function (item) {
        item.rect.style.animation = 'none';
      });
    }

    function destroy() {
      stop();
      if (ro) ro.disconnect();
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }

    if (trigger === 'mount') {
      // 让 layout 拿到尺寸再 play
      requestAnimationFrame(function () { requestAnimationFrame(play); });
    }

    return {
      play: play,
      stop: stop,
      destroy: destroy,
      isPlaying: function () { return playing; }
    };
  }

  /** 自动初始化所有 [data-shimmer] 元素 */
  function autoInitShimmerBorders(scope) {
    // 防御:requestAnimationFrame 直接传入时 scope 会是 timestamp 数字;
    // 也可能误传 Event / 字符串等。校验必须是带 querySelectorAll 的 DOM 节点。
    var root = (scope && typeof scope.querySelectorAll === 'function') ? scope : document;
    var hosts = root.querySelectorAll('[data-shimmer]');
    var controllers = [];
    hosts.forEach(function (host) {
      if (host.__shimmerCtrl) return; // 防重复
      var opts = {};
      if (host.dataset.shimmerRadius)   opts.radius      = parseFloat(host.dataset.shimmerRadius);
      if (host.dataset.shimmerStroke)   opts.strokeWidth = parseFloat(host.dataset.shimmerStroke);
      if (host.dataset.shimmerDuration) opts.duration    = parseFloat(host.dataset.shimmerDuration);
      if (host.dataset.shimmerLoops)    opts.loops       = parseFloat(host.dataset.shimmerLoops);
      if (host.dataset.shimmerTrigger)  opts.trigger     = host.dataset.shimmerTrigger;
      var ctrl = initShimmerBorder(host, opts);
      host.__shimmerCtrl = ctrl;
      controllers.push(ctrl);
    });
    return controllers;
  }

  global.initShimmerBorder = initShimmerBorder;
  global.autoInitShimmerBorders = autoInitShimmerBorders;
})(typeof window !== 'undefined' ? window : this);
