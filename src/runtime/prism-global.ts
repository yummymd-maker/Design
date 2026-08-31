// 把 prismjs 核心挂到全局。
//
// 背景：@ve-design/web 的 ve-markdown 依赖 prismjs 做代码高亮，并静态引入了
// prismjs 的语言组件（prism-typescript.js / prism-tsx.js 等）。这些语言组件的
// 代码形如 `(function (Prism) { ... })(Prism)`，引用的是「全局 Prism」而非 import。
//
// dev 下 esbuild 预打包会自动兜住这个全局引用；但 vite build（rollup）产物里
// prismjs 核心不会挂到 window，语言组件执行时找不到全局 Prism → ReferenceError，
// 导致整个 React 应用崩溃、无法挂载。
//
// 解决：本模块作为入口的第一个 import，先执行 prismjs 核心，再把它写到 globalThis，
// 保证后续语言组件执行时全局 Prism 已就绪。
import Prism from 'prismjs';

(globalThis as unknown as { Prism?: unknown }).Prism = Prism;

export {};
