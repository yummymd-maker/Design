/// <reference types="vite/client" />

// prismjs 无内置类型声明；我们只把它当作全局注入用（见 runtime/prism-global.ts），
// 不消费其 API，故用最小声明避免引入额外的 @types/prismjs 依赖。
declare module 'prismjs';
