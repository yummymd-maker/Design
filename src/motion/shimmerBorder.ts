export type ShimmerGradientStop = {
  offset: string;
  color: string;
};

export type ShimmerBorderController = {
  play(): void;
  stop(): void;
  destroy(): void;
  setGradient(stops: ShimmerGradientStop[]): void;
  isPlaying(): boolean;
};

export type ShimmerBorderOptions = {
  radius?: number;
  strokeWidth?: number;
  colorRatio?: number;
  duration?: number;
  loops?: number;
  gradient?: ShimmerGradientStop[];
  trigger?: 'mount' | 'manual';
};

const DEFAULT_GRADIENT: ShimmerGradientStop[] = [
  { offset: '0%', color: '#006AFF' },
  { offset: '33%', color: '#7861FF' },
  { offset: '66%', color: '#9CC5FF' },
  { offset: '100%', color: '#FFCC6B' },
];

const FADE_LAYERS = 12;
const SVG_NS = 'http://www.w3.org/2000/svg';

let idCounter = 0;

function uid() {
  idCounter += 1;
  return `ved-shimmer-${idCounter}-${Date.now().toString(36)}`;
}

export function parseShimmerGradient(colors: string): ShimmerGradientStop[] {
  const list: string[] = [];
  let current = '';
  let depth = 0;

  for (const char of colors) {
    if (char === '(') depth += 1;
    if (char === ')') depth = Math.max(0, depth - 1);
    if (char === ',' && depth === 0) {
      if (current.trim()) list.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  if (current.trim()) list.push(current.trim());
  if (list.length === 0) return DEFAULT_GRADIENT;

  return list.map((color, index) => ({
    offset: `${Math.round((index / Math.max(list.length - 1, 1)) * 100)}%`,
    color,
  }));
}

export function initShimmerBorder(
  host: HTMLElement | null,
  options: ShimmerBorderOptions = {},
): ShimmerBorderController | null {
  if (!host) return null;

  const radius = options.radius ?? 8;
  const strokeWidth = options.strokeWidth ?? 1.5;
  const colorRatio = options.colorRatio ?? 0.5;
  const duration = options.duration ?? 2.7;
  const loops = options.loops ?? 1;
  const gradient = options.gradient ?? DEFAULT_GRADIENT;
  const trigger = options.trigger ?? 'mount';
  const gradientId = uid();
  const hostHasFilter = getComputedStyle(host).filter !== 'none';

  const wrap = document.createElement('div');
  wrap.className = 'ved-shimmer-border';
  wrap.setAttribute('aria-hidden', 'true');

  let mountParent: HTMLElement = host;
  if (hostHasFilter && host.parentElement) {
    mountParent = host.parentElement;
    if (getComputedStyle(mountParent).position === 'static') {
      mountParent.style.position = 'relative';
    }
    wrap.style.position = 'absolute';
    wrap.style.borderRadius = `${radius}px`;
    wrap.style.zIndex = '2';
  } else {
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const cs = getComputedStyle(host);
    const bt = parseFloat(cs.borderTopWidth) || 0;
    const br = parseFloat(cs.borderRightWidth) || 0;
    const bb = parseFloat(cs.borderBottomWidth) || 0;
    const bl = parseFloat(cs.borderLeftWidth) || 0;
    if (bt || br || bb || bl) {
      wrap.style.position = 'absolute';
      wrap.style.top = `${-bt}px`;
      wrap.style.right = `${-br}px`;
      wrap.style.bottom = `${-bb}px`;
      wrap.style.left = `${-bl}px`;
    }
  }
  mountParent.appendChild(wrap);

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('fill', 'none');
  wrap.appendChild(svg);

  const defs = document.createElementNS(SVG_NS, 'defs');
  const grad = document.createElementNS(SVG_NS, 'linearGradient');
  grad.setAttribute('id', gradientId);
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%');
  grad.setAttribute('y2', '0%');
  grad.setAttribute('spreadMethod', 'reflect');
  defs.appendChild(grad);
  svg.appendChild(defs);

  const groups = Array.from({ length: FADE_LAYERS }, () => {
    const g = document.createElementNS(SVG_NS, 'g');
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('stroke', `url(#${gradientId})`);
    rect.setAttribute('stroke-width', String(strokeWidth));
    rect.setAttribute('stroke-linecap', 'round');
    rect.setAttribute('fill', 'none');
    g.appendChild(rect);
    svg.appendChild(g);
    return { g, rect };
  });

  let currentSize = { w: 0, h: 0 };
  let playing = false;

  function setGradient(stops: ShimmerGradientStop[]) {
    while (grad.firstChild) grad.removeChild(grad.firstChild);
    stops.forEach((stopConfig) => {
      const stop = document.createElementNS(SVG_NS, 'stop');
      stop.setAttribute('offset', stopConfig.offset);
      stop.setAttribute('stop-color', stopConfig.color);
      grad.appendChild(stop);
    });
  }

  function syncWrapPosition() {
    if (!hostHasFilter) return;
    const hostRect = host.getBoundingClientRect();
    const parentRect = mountParent.getBoundingClientRect();
    wrap.style.left = `${hostRect.left - parentRect.left}px`;
    wrap.style.top = `${hostRect.top - parentRect.top}px`;
    wrap.style.width = `${hostRect.width}px`;
    wrap.style.height = `${hostRect.height}px`;
  }

  function layout(w: number, h: number) {
    currentSize = { w, h };
    if (w <= 0 || h <= 0) return;
    syncWrapPosition();
    svg.setAttribute('width', String(w));
    svg.setAttribute('height', String(h));
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const inset = strokeWidth / 2;
    const perimeter = 2 * (w + h) - 8 * radius + 2 * Math.PI * radius;
    const effectiveColorSegment = Math.max(perimeter * colorRatio, 0);
    const layers = Array.from({ length: FADE_LAYERS }, (_, index) => {
      const t = index / (FADE_LAYERS - 1);
      const raw = Math.exp(-4 * t);
      const segLen = Math.max(effectiveColorSegment * (0.5 + 0.5 * t), 8);
      return {
        segLen,
        segGap: Math.max(perimeter - segLen, 0),
        offset: (effectiveColorSegment - segLen) / 2,
        raw,
      };
    });
    const totalRaw = layers.reduce((sum, layer) => sum + layer.raw, 0);

    groups.forEach(({ g, rect }, index) => {
      const layer = layers[index];
      g.setAttribute('opacity', String(Math.min((layer.raw / totalRaw) * 1.55, 0.9)));
      rect.setAttribute('x', String(inset));
      rect.setAttribute('y', String(inset));
      rect.setAttribute('width', String(Math.max(w - strokeWidth, 0)));
      rect.setAttribute('height', String(Math.max(h - strokeWidth, 0)));
      rect.setAttribute('rx', String(radius));
      rect.setAttribute('ry', String(radius));
      rect.setAttribute('stroke-dasharray', `${layer.segLen} ${layer.segGap}`);
      rect.style.setProperty('--shimmer-start', String(layer.offset));
      rect.style.setProperty('--shimmer-perimeter', String(perimeter));
    });
  }

  const resizeObserver =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const borderBoxSize = Array.isArray(entry.borderBoxSize)
              ? entry.borderBoxSize[0]
              : entry.borderBoxSize;
            if (borderBoxSize) {
              layout(borderBoxSize.inlineSize, borderBoxSize.blockSize);
              return;
            }
            const rect = host.getBoundingClientRect();
            layout(rect.width, rect.height);
          });
        })
      : null;

  if (resizeObserver) {
    resizeObserver.observe(host);
  } else {
    const rect = host.getBoundingClientRect();
    layout(rect.width, rect.height);
  }

  function play() {
    if (currentSize.w <= 0) {
      requestAnimationFrame(play);
      return;
    }
    playing = true;
    const animationName = loops === Infinity ? 'ved-shimmer-loop' : 'ved-shimmer-flow';
    const iterations = loops === Infinity ? 'infinite' : String(loops);
    const timing = loops === Infinity ? 'linear' : 'ease-in-out';
    groups.forEach(({ rect }) => {
      rect.style.animation = 'none';
      rect.getBoundingClientRect();
      rect.style.animation = `${animationName} ${duration}s ${timing} ${iterations} forwards`;
    });
  }

  function stop() {
    playing = false;
    groups.forEach(({ rect }) => {
      rect.style.animation = 'none';
    });
  }

  function destroy() {
    stop();
    resizeObserver?.disconnect();
    wrap.parentNode?.removeChild(wrap);
  }

  setGradient(gradient);
  if (trigger === 'mount') {
    requestAnimationFrame(() => requestAnimationFrame(play));
  }

  return {
    play,
    stop,
    destroy,
    setGradient,
    isPlaying: () => playing,
  };
}
