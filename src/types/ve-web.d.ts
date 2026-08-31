/**
 * @ve-design/web 是一组 Lit 实现的 Web Components，
 * 需要在 React JSX 命名空间里声明为合法自定义元素，
 * 否则 TypeScript 会因未知内置标签报错。
 *
 * 这里统一放行 `ve-*`：所有属性宽松通过（HTML 标准属性 + 任意透传）。
 * 若后续想收紧签名，可为具体元素补充精细类型。
 */

import type * as React from 'react';

type VeElementProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & {
    slot?: string;
    // 允许通过 kebab-case / camelCase 传递任意 attribute / property
    [key: string]: unknown;
  },
  HTMLElement
>;

// React 19 已经把 JSX 命名空间放在 `react` 模块里。
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      've-sidebar': VeElementProps;
      've-sidebar-group': VeElementProps;
      've-sidebar-item': VeElementProps;
      've-avatar': VeElementProps;
      've-avatar-group': VeElementProps;
      've-icon': VeElementProps;
      've-button': VeElementProps;
      've-dropdown': VeElementProps;
      've-dropdown-group': VeElementProps;
      've-dropdown-item': VeElementProps;
      've-chat-input': VeElementProps;
      've-bubble': VeElementProps;
      've-bubble-list': VeElementProps;
      've-bubble-divider': VeElementProps;
      've-markdown': VeElementProps;
      've-thinking': VeElementProps;
      've-thought-chain': VeElementProps;
      've-citation': VeElementProps;
      've-artifact-card': VeElementProps;
      've-actions': VeElementProps;
      've-tag': VeElementProps;
      've-tabs': VeElementProps;
      've-tab': VeElementProps;
      've-modal': VeElementProps;
      've-input': VeElementProps;
      've-suggestion': VeElementProps;
      've-prompt-item': VeElementProps;
      've-clarify': VeElementProps;
      've-authorization': VeElementProps;
      've-tooltip': VeElementProps;
      've-empty': VeElementProps;
      've-alert': VeElementProps;
      've-spin': VeElementProps;
      've-badge': VeElementProps;
      've-link': VeElementProps;
      've-select': VeElementProps;
      've-switch': VeElementProps;
      've-checkbox': VeElementProps;
      've-radio': VeElementProps;
      've-message': VeElementProps;
      've-notification': VeElementProps;
      've-popconfirm': VeElementProps;
      've-upload': VeElementProps;
      've-resource-preview': VeElementProps;
      've-text-selection': VeElementProps;
      've-cascader': VeElementProps;
      've-table': VeElementProps;
      've-pagination': VeElementProps;
      've-date-picker': VeElementProps;
      've-time-picker': VeElementProps;
      've-digital-input': VeElementProps;
    }
  }
}

// 兼容仍使用全局 JSX 命名空间的写法。
declare global {
  namespace JSX {
    interface IntrinsicElements {
      've-sidebar': VeElementProps;
      've-sidebar-group': VeElementProps;
      've-sidebar-item': VeElementProps;
      've-avatar': VeElementProps;
      've-avatar-group': VeElementProps;
      've-icon': VeElementProps;
      've-button': VeElementProps;
      've-dropdown': VeElementProps;
      've-dropdown-group': VeElementProps;
      've-dropdown-item': VeElementProps;
      've-chat-input': VeElementProps;
      've-bubble': VeElementProps;
      've-bubble-list': VeElementProps;
      've-bubble-divider': VeElementProps;
      've-markdown': VeElementProps;
      've-thinking': VeElementProps;
      've-thought-chain': VeElementProps;
      've-citation': VeElementProps;
      've-artifact-card': VeElementProps;
      've-actions': VeElementProps;
      've-tag': VeElementProps;
      've-tabs': VeElementProps;
      've-tab': VeElementProps;
      've-modal': VeElementProps;
      've-input': VeElementProps;
      've-suggestion': VeElementProps;
      've-prompt-item': VeElementProps;
      've-clarify': VeElementProps;
      've-authorization': VeElementProps;
      've-tooltip': VeElementProps;
      've-empty': VeElementProps;
      've-alert': VeElementProps;
      've-spin': VeElementProps;
      've-badge': VeElementProps;
      've-link': VeElementProps;
      've-select': VeElementProps;
      've-switch': VeElementProps;
      've-checkbox': VeElementProps;
      've-radio': VeElementProps;
      've-message': VeElementProps;
      've-notification': VeElementProps;
      've-popconfirm': VeElementProps;
      've-upload': VeElementProps;
      've-resource-preview': VeElementProps;
      've-text-selection': VeElementProps;
      've-cascader': VeElementProps;
      've-table': VeElementProps;
      've-pagination': VeElementProps;
      've-date-picker': VeElementProps;
      've-time-picker': VeElementProps;
      've-digital-input': VeElementProps;
    }
  }
}

export {};
