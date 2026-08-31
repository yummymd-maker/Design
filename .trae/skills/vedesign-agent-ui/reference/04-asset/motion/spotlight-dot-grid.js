/**
 * Spotlight Dot Grid —— 漂浮光斑点阵动画
 *
 * Vanilla JS 实现(从 React 版本移植,不依赖任何框架)。
 *
 * 机制:静态点阵 + N 个沿 Lissajous 曲线漂浮的"光斑"。
 *      每个点的不透明度 = 离它最近的光斑距离 d 的 smoothstep 衰减。
 *      光斑频率 fx / fy 不互为整数倍,保证肉眼察觉不到运动周期。
 *
 * 跟 Aceternity DottedGlowBackground / Magic UI DotPattern 的区别:
 *   它们都是"每个点独立闪烁",视觉上是满屏星空式乱闪;
 *   本 pattern 是"光斑漂过点阵",视觉上是云团扫过的连贯感。
 *
 * 用法:
 *   1. HTML: <div class="ved-spotlight-host" data-spotlight-dots>...</div>
 *   2. JS:   autoInitSpotlightDotGrids();   // 批量,自动读 [data-spotlight-dots]
 *      或:   initSpotlightDotGrid(host, { gap: 15, spotCount: 3, ... });
 *
 * 配置项 (opts):
 *   gap              点间距 px                               默认 15
 *   radius           点半径 px                               默认 1.4
 *   spotRadiusRatio  光斑半径占面板长边的比例 (0..1)         默认 0.39
 *   spotCount        同时存在的光斑数 (1..4)                 默认 3
 *   speed            全局速度倍率 (0..3, 建议 0.5..3)        默认 2.5
 *   baseOpacity      不在光斑下时点的最低不透明度            默认 0.01
 *   peakOpacity      光斑中心处点的最大不透明度              默认 0.7
 *   color            点颜色 RGB 三元组字符串                 默认 "232, 232, 240"
 *                    (浅冷灰 ≈ tailwind zinc-200,B 比 R/G 高 8)
 *                    **支持 CSS variable**:传 "var(--ved-spotlight-color)" 时
 *                    draw loop 每帧从 host 读 computed style,主题切换(light/dark)
 *                    自动跟随,无需重新 init。Fallback 形式 "var(--xxx, 232,232,240)" 也支持。
 *   autoPause        IntersectionObserver 离屏时暂停 rAF     默认 true
 *
 * 返回 controller:
 *   { play(), stop(), destroy(), isPlaying() }
 *
 * 视觉规格 (vedesign 标准):
 *   gap=15,radius=1.4,spotRadiusRatio=0.39,spotCount=3,speed=2.5,
 *   baseOpacity=0.01,peakOpacity=0.7,color="232,232,240"
 *   长面板长边 1200px 时,光斑半径 ≈ 468px,3 个光斑各自周期 9~25 秒。
 */

(function (global) {
  'use strict';

  var DPR_CAP = 2;
  var idCounter = 0;

  function uid() {
    idCounter += 1;
    return 'ved-spotlight-' + idCounter + '-' + Date.now().toString(36);
  }

  /** smoothstep 衰减: d=0 → 1, d>=R → 0 */
  function falloff(d, R) {
    if (d >= R) return 0;
    var t = 1 - d / R;
    return t * t * (3 - 2 * t);
  }

  function initSpotlightDotGrid(host, opts) {
    opts = opts || {};
    var gap             = opts.gap             != null ? opts.gap             : 15;
    var radius          = opts.radius          != null ? opts.radius          : 1.4;
    var spotRadiusRatio = opts.spotRadiusRatio != null ? opts.spotRadiusRatio : 0.39;
    var spotCount       = opts.spotCount       != null ? opts.spotCount       : 3;
    var speed           = opts.speed           != null ? opts.speed           : 2.5;
    var baseOpacity     = opts.baseOpacity     != null ? opts.baseOpacity     : 0.01;
    var peakOpacity     = opts.peakOpacity     != null ? opts.peakOpacity     : 0.7;
    var color           = opts.color           != null ? opts.color           : '232, 232, 240';

    /**
     * resolveColor —— 解析 color 为最终 rgb 三元组字符串
     * 支持两种形态:
     *   - 直接字面值: "232, 232, 240"  → 原样返回
     *   - CSS variable 引用: "var(--ved-spotlight-color)" → 实时从 host 读 computed style
     * 主题切换时(html.dark 类切换 / data-theme 切换),CSS variable 会指向不同的值,
     * draw loop 每帧调一次,自动跟随主题。
     */
    function resolveColor() {
      if (typeof color !== 'string') return '232, 232, 240';
      // CSS variable 引用形式: var(--xxx) 或 var(--xxx, fallback)
      if (color.indexOf('var(') === 0) {
        var match = color.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)$/);
        if (match) {
          var varName = match[1];
          var fallback = match[2];
          var resolved = getComputedStyle(host).getPropertyValue(varName).trim();
          if (resolved) return resolved;
          if (fallback) return fallback.trim();
          return '232, 232, 240';
        }
      }
      return color;
    }
    var autoPause       = opts.autoPause       != null ? opts.autoPause       : true;

    // 支持传 selector 字符串或 DOM 节点
    if (typeof host === 'string') host = document.querySelector(host);
    if (!host || typeof host.appendChild !== 'function') return null;

    // host 需要 position 不为 static(canvas 用 absolute 定位)
    var hostPos = getComputedStyle(host).position;
    if (hostPos === 'static') host.style.position = 'relative';

    // ============ DOM 构建 ============
    var wrap = document.createElement('div');
    wrap.className = 'ved-spotlight-canvas';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.id = uid();

    var canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    host.appendChild(wrap);

    var ctx = canvas.getContext('2d');
    if (!ctx) {
      host.removeChild(wrap);
      return null;
    }

    // ============ 状态 ============
    var dpr = Math.min(Math.max(1, global.devicePixelRatio || 1), DPR_CAP);
    var dots = [];
    var sources = [];
    var raf = 0;
    var playing = false;
    var isVisible = true;
    var lastTime = 0;
    var ro = null;
    var io = null;

    // ============ resize / 重建 ============
    function resize() {
      var rect = host.getBoundingClientRect();
      var w = Math.max(1, Math.floor(rect.width * dpr));
      var h = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = Math.floor(rect.width) + 'px';
      canvas.style.height = Math.floor(rect.height) + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function regenDots() {
      dots = [];
      var rect = host.getBoundingClientRect();
      var cols = Math.ceil(rect.width / gap) + 2;
      var rows = Math.ceil(rect.height / gap) + 2;
      // 蜂窝排列:偶数行 offset 半个 gap,视觉更柔和
      for (var i = -1; i < cols; i++) {
        for (var j = -1; j < rows; j++) {
          dots.push({
            x: i * gap + (j % 2 === 0 ? 0 : gap * 0.5),
            y: j * gap
          });
        }
      }
    }

    function regenSources() {
      sources = [];
      for (var k = 0; k < spotCount; k++) {
        sources.push({
          // 振幅 (相对面板尺寸的比例)
          ax: 0.55 + Math.random() * 0.25,
          ay: 0.45 + Math.random() * 0.25,
          // 基线 (从面板中心偏移)
          bx: 0.5 + (Math.random() - 0.5) * 0.2,
          by: 0.5 + (Math.random() - 0.5) * 0.2,
          // 不互为整数倍的频率
          fx: 0.05 + Math.random() * 0.06,
          fy: 0.04 + Math.random() * 0.07,
          // 起始相位
          px: Math.random() * Math.PI * 2,
          py: Math.random() * Math.PI * 2,
          // 光斑大小的轻微呼吸 (避免太机械)
          breathF: 0.03 + Math.random() * 0.05,
          breathAmp: 0.10 + Math.random() * 0.10,
          breathPhase: Math.random() * Math.PI * 2
        });
      }
    }

    // ============ 主循环 ============
    function draw(now) {
      if (!playing) return;
      if (!isVisible) {
        raf = global.requestAnimationFrame(draw);
        return;
      }

      var rect = host.getBoundingClientRect();
      var width = rect.width;
      var height = rect.height;
      if (width === 0 || height === 0) {
        raf = global.requestAnimationFrame(draw);
        return;
      }

      var t = (now / 1000) * speed;
      var longSide = Math.max(width, height);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 每帧 resolve 颜色 — 支持 CSS variable,主题切换自动跟随
      var resolvedColor = resolveColor();

      // 计算当前各光斑的状态
      var lights = [];
      for (var k = 0; k < sources.length; k++) {
        var s = sources[k];
        var cx = (s.bx + Math.cos(2 * Math.PI * s.fx * t + s.px) * s.ax * 0.5) * width;
        var cy = (s.by + Math.sin(2 * Math.PI * s.fy * t + s.py) * s.ay * 0.5) * height;
        var breath = 1 + Math.sin(2 * Math.PI * s.breathF * t + s.breathPhase) * s.breathAmp;
        var R = spotRadiusRatio * longSide * breath;
        lights.push({ cx: cx, cy: cy, R: R, R2: R * R });
      }

      // 画点阵
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var maxInfluence = 0;
        for (var m = 0; m < lights.length; m++) {
          var L = lights[m];
          var ddx = d.x - L.cx;
          var ddy = d.y - L.cy;
          var dist2 = ddx * ddx + ddy * ddy;
          if (dist2 < L.R2) {
            var inf = falloff(Math.sqrt(dist2), L.R);
            if (inf > maxInfluence) maxInfluence = inf;
          }
        }
        var alpha = baseOpacity + (peakOpacity - baseOpacity) * maxInfluence;
        if (alpha < 0.01) continue;
        ctx.fillStyle = 'rgba(' + resolvedColor + ', ' + alpha + ')';
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = global.requestAnimationFrame(draw);
    }

    // ============ Observer 装配 ============
    function setupResizeObserver() {
      if (typeof global.ResizeObserver === 'function') {
        ro = new global.ResizeObserver(function () {
          resize();
          regenDots();
        });
        ro.observe(host);
      } else {
        // 兜底:window resize
        global.addEventListener('resize', function () {
          resize();
          regenDots();
        });
      }
    }

    function setupIntersectionObserver() {
      if (!autoPause) return;
      if (typeof global.IntersectionObserver === 'function') {
        io = new global.IntersectionObserver(function (entries) {
          if (entries[0]) isVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        io.observe(host);
      }
    }

    // ============ 控制 API ============
    function play() {
      if (playing) return;
      playing = true;
      // 让 layout 拿到尺寸再启动
      global.requestAnimationFrame(function () {
        global.requestAnimationFrame(function (now) {
          lastTime = now;
          raf = global.requestAnimationFrame(draw);
        });
      });
    }

    function stop() {
      playing = false;
      if (raf) {
        global.cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function destroy() {
      stop();
      if (ro) { ro.disconnect(); ro = null; }
      if (io) { io.disconnect(); io = null; }
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }

    // ============ 初始化 ============
    resize();
    regenDots();
    regenSources();
    setupResizeObserver();
    setupIntersectionObserver();
    play();

    return {
      play: play,
      stop: stop,
      destroy: destroy,
      isPlaying: function () { return playing; }
    };
  }

  /** 自动初始化所有 [data-spotlight-dots] 元素 */
  function autoInitSpotlightDotGrids(scope) {
    // 防御:requestAnimationFrame 直接传入时 scope 会是 timestamp 数字
    var root = (scope && typeof scope.querySelectorAll === 'function') ? scope : document;
    var hosts = root.querySelectorAll('[data-spotlight-dots]');
    var controllers = [];
    hosts.forEach(function (host) {
      if (host.__spotlightCtrl) return; // 防重复
      var opts = {};
      var ds = host.dataset;
      if (ds.spotlightGap)        opts.gap             = parseFloat(ds.spotlightGap);
      if (ds.spotlightRadius)     opts.radius          = parseFloat(ds.spotlightRadius);
      if (ds.spotlightSpotRadius) opts.spotRadiusRatio = parseFloat(ds.spotlightSpotRadius);
      if (ds.spotlightSpotCount)  opts.spotCount       = parseInt(ds.spotlightSpotCount, 10);
      if (ds.spotlightSpeed)      opts.speed           = parseFloat(ds.spotlightSpeed);
      if (ds.spotlightBase)       opts.baseOpacity     = parseFloat(ds.spotlightBase);
      if (ds.spotlightPeak)       opts.peakOpacity     = parseFloat(ds.spotlightPeak);
      if (ds.spotlightColor)      opts.color           = ds.spotlightColor;
      if (ds.spotlightAutoPause)  opts.autoPause       = ds.spotlightAutoPause !== 'false';
      var ctrl = initSpotlightDotGrid(host, opts);
      host.__spotlightCtrl = ctrl;
      if (ctrl) controllers.push(ctrl);
    });
    return controllers;
  }

  global.initSpotlightDotGrid = initSpotlightDotGrid;
  global.autoInitSpotlightDotGrids = autoInitSpotlightDotGrids;
})(typeof window !== 'undefined' ? window : this);
