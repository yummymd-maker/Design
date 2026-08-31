`Actions` 用于渲染一行图标按钮组成的操作工具条，常作为 AI 对话气泡底部的快捷操作区。

## 何时使用

- AI 回答底部的复制、重试、点赞、点踩、更多等操作行。
- AI 提问底部的复制、分享、引用、重试、编辑等操作行。
- 任意需要一行紧凑图标按钮 + 可选 dropdown 的工具条。

## 引入组件

```tsx
import { Actions, DropdownDivider, DropdownItem } from '@ve-design/react';
```

## 示例

### 基础用法

AI 回答底部典型操作栏：复制、重试、分隔线、点赞、点踩、更多。点击复制会短暂切换为对勾，点赞与点踩会切换为实心图标且互斥；右侧「参考 11 篇资料」是可点击的来源入口。

```tsx preview
import { useMemo, useRef, useState } from 'react';
import { Actions, DropdownDivider, DropdownItem } from '@ve-design/react';
import {
  IconCheck,
  IconCopy,
  IconDislike,
  IconLike,
  IconMoreHorizontal,
  IconRefresh,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from '@ve-design/react/icons';

function AnswerActionsDemo() {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [message, setMessage] = useState('点击按钮试试');
  const timerRef = useRef<number | null>(null);

  const items = useMemo(
    () => [
      { key: 'copy', icon: copied ? <IconCheck /> : <IconCopy /> },
      { key: 'retry', icon: <IconRefresh /> },
      { key: 'divider-1', divider: true },
      { key: 'like', icon: liked ? <IconThumbUpFilled /> : <IconLike /> },
      {
        key: 'dislike',
        icon: disliked ? <IconThumbDownFilled /> : <IconDislike />,
      },
      {
        key: 'more',
        type: 'more' as const,
        icon: <IconMoreHorizontal />,
        menu: (
          <>
            <DropdownItem value="fav">收藏</DropdownItem>
            <DropdownItem value="export">导出</DropdownItem>
            <DropdownDivider />
            <DropdownItem value="delete" danger>
              删除
            </DropdownItem>
          </>
        ),
      },
    ],
    [copied, disliked, liked],
  );

  return (
    <section style={{ display: 'grid', gap: 12, justifyContent: 'center' }}>
      <Actions
        items={items}
        extra={
          <button
            type="button"
            aria-label="查看 11 篇参考资料"
            style={{
              all: 'unset',
              display: 'inline-flex',
              alignItems: 'center',
              height: 28,
              padding: '0 6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-tertiary)',
              fontSize: 13,
              cursor: 'pointer',
            }}
            onClick={() => setMessage('打开来源列表：共 11 篇资料')}
          >
            参考 11 篇资料
          </button>
        }
        onActionsClick={(event) => {
          const key = event.detail.item.key;
          if (key === 'copy') {
            if (timerRef.current !== null) {
              window.clearTimeout(timerRef.current);
            }
            setCopied(true);
            setMessage('已复制，图标切换为对勾');
            timerRef.current = window.setTimeout(() => {
              setCopied(false);
              timerRef.current = null;
            }, 2000);
            return;
          }
          if (key === 'like') {
            setLiked((value) => {
              const next = !value;
              if (next) setDisliked(false);
              setMessage(next ? '已点赞' : '取消点赞');
              return next;
            });
            return;
          }
          if (key === 'dislike') {
            setDisliked((value) => {
              const next = !value;
              if (next) setLiked(false);
              setMessage(next ? '已点踩' : '取消点踩');
              return next;
            });
          }
        }}
      />
      <code style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        {message}
      </code>
    </section>
  );
}

<AnswerActionsDemo />;
```

### 提问场景

提问消息的操作栏，左侧汇集复制、编辑、重试、点赞、点踩、更多等操作，右侧通过 `extra` 传入翻页与时间。复制点击后短暂切换为对勾，点赞与点踩互斥切换为实心图标，更多操作使用内置 `DropdownItem` 菜单。

```tsx preview
import { useMemo, useRef, useState } from 'react';
import { Actions, Button, DropdownDivider, DropdownItem } from '@ve-design/react';
import {
  IconCheck,
  IconChevronLeftMd,
  IconChevronRightMd,
  IconCopy,
  IconDislike,
  IconEdit,
  IconLike,
  IconMoreHorizontal,
  IconRefresh,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from '@ve-design/react/icons';

function QuestionActionsDemo() {
  const [page, setPage] = useState(1);
  const total = 3;
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [message, setMessage] = useState('点击按钮试试');
  const timerRef = useRef<number | null>(null);

  const items = useMemo(
    () => [
      { key: 'copy', icon: copied ? <IconCheck /> : <IconCopy /> },
      { key: 'edit', icon: <IconEdit /> },
      { key: 'retry', icon: <IconRefresh /> },
      { key: 'divider-1', divider: true },
      { key: 'like', icon: liked ? <IconThumbUpFilled /> : <IconLike /> },
      {
        key: 'dislike',
        icon: disliked ? <IconThumbDownFilled /> : <IconDislike />,
      },
      {
        key: 'more',
        type: 'more' as const,
        icon: <IconMoreHorizontal />,
        menu: (
          <>
            <DropdownItem value="fav">收藏</DropdownItem>
            <DropdownItem value="export">导出</DropdownItem>
            <DropdownDivider />
            <DropdownItem value="delete" danger>
              删除
            </DropdownItem>
          </>
        ),
      },
    ],
    [copied, disliked, liked],
  );

  return (
    <section style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
      <Actions
        items={items}
        extra={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--color-text-tertiary)',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label="上一页"
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <IconChevronLeftMd />
              </Button>
              <span style={{ minWidth: 24, textAlign: 'center' }}>
                {page}/{total}
              </span>
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label="下一页"
                disabled={page >= total}
                onClick={() => setPage((value) => Math.min(total, value + 1))}
              >
                <IconChevronRightMd />
              </Button>
            </span>
            <span>4月22日 13:33</span>
          </span>
        }
        onActionsClick={(event) => {
          const key = event.detail.item.key;
          if (key === 'copy') {
            if (timerRef.current !== null) {
              window.clearTimeout(timerRef.current);
            }
            setCopied(true);
            setMessage('已复制，图标切换为对勾');
            timerRef.current = window.setTimeout(() => {
              setCopied(false);
              timerRef.current = null;
            }, 2000);
            return;
          }
          if (key === 'like') {
            setLiked((value) => {
              const next = !value;
              if (next) setDisliked(false);
              setMessage(next ? '已点赞' : '取消点赞');
              return next;
            });
            return;
          }
          if (key === 'dislike') {
            setDisliked((value) => {
              const next = !value;
              if (next) setLiked(false);
              setMessage(next ? '已点踩' : '取消点踩');
              return next;
            });
            return;
          }
          setMessage(`点击了 ${key}`);
        }}
      />
      <code style={{ color: 'var(--color-text-secondary)' }}>{message}</code>
    </section>
  );
}

<QuestionActionsDemo />;
```

### 状态切换

通过 `onActionsClick` 处理统一点击事件，并根据当前状态更新 `items`。

```tsx preview
import { useMemo, useRef, useState } from 'react';
import { Actions } from '@ve-design/react';
import {
  IconCheck,
  IconCopy,
  IconDislike,
  IconLike,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from '@ve-design/react/icons';

function ActionsToggleDemo() {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('点击按钮试试');
  const timerRef = useRef<number | null>(null);

  const items = useMemo(
    () => [
      {
        key: 'copy',
        icon: copied ? <IconCheck /> : <IconCopy />,
      },
      {
        key: 'like',
        icon: liked ? <IconThumbUpFilled /> : <IconLike />,
      },
      {
        key: 'dislike',
        icon: disliked ? <IconThumbDownFilled /> : <IconDislike />,
      },
    ],
    [copied, disliked, liked],
  );

  return (
    <section style={{ display: 'grid', gap: 12, justifyContent: 'center' }}>
      <Actions
        items={items}
        onActionsClick={(event) => {
          const key = event.detail.item.key;
          if (key === 'copy') {
            if (timerRef.current !== null) {
              window.clearTimeout(timerRef.current);
            }
            setCopied(true);
            setMessage('已复制');
            timerRef.current = window.setTimeout(() => {
              setCopied(false);
              timerRef.current = null;
            }, 2000);
          }
          if (key === 'like') {
            setLiked((value) => {
              const next = !value;
              if (next) setDisliked(false);
              setMessage(next ? '已点赞' : '取消点赞');
              return next;
            });
          }
          if (key === 'dislike') {
            setDisliked((value) => {
              const next = !value;
              if (next) setLiked(false);
              setMessage(next ? '已点踩' : '取消点踩');
              return next;
            });
          }
        }}
      />
      <code style={{ color: 'var(--color-text-secondary)' }}>{message}</code>
    </section>
  );
}

<ActionsToggleDemo />;
```

### 禁用项

在单个 item 上设置 `disabled` 可禁用该操作项。

```tsx preview
import { Actions } from '@ve-design/react';
import {
  IconCopy,
  IconDislike,
  IconLike,
  IconRefresh,
} from '@ve-design/react/icons';

<div style={{ display: 'flex', justifyContent: 'center' }}>
  <Actions
    items={[
      { key: 'copy', icon: <IconCopy /> },
      {
        key: 'retry',
        icon: <IconRefresh />,
        disabled: true,
      },
      { key: 'like', icon: <IconLike />, disabled: true },
      { key: 'dislike', icon: <IconDislike /> },
    ]}
  />
</div>;
```

### 监听事件

监听 `onActionsClick` 统一处理所有项的点击回调。

```tsx preview
import { useState } from 'react';
import { Actions } from '@ve-design/react';
import {
  IconCopy,
  IconDislike,
  IconLike,
  IconRefresh,
} from '@ve-design/react/icons';

function ActionsEventDemo() {
  const [message, setMessage] = useState('Choose an action');

  return (
    <section style={{ display: 'grid', gap: 12, justifyContent: 'center' }}>
      <Actions
        items={[
          { key: 'copy', icon: <IconCopy /> },
          { key: 'retry', icon: <IconRefresh /> },
          { key: 'like', icon: <IconLike /> },
          { key: 'dislike', icon: <IconDislike /> },
        ]}
        onActionsClick={(event) => {
          setMessage(`Selected: ${event.detail.item.key}`);
        }}
      />
      <code style={{ color: 'var(--color-text-secondary)' }}>{message}</code>
    </section>
  );
}

<ActionsEventDemo />;
```

## API

### Props

| 属性名  | 描述                                        | 类型              | 默认值 |
| ------- | ------------------------------------------- | ----------------- | ------ |
| `items` | 操作项数组                                  | `ActionItem[]`    | `[]`   |
| `extra` | 右侧自定义内容，对应组件的 `extra` 具名区域 | `React.ReactNode` | `-`    |

### 事件

| 事件名           | 描述                             | 参数类型                              |
| ---------------- | -------------------------------- | ------------------------------------- |
| `onActionsClick` | 非 divider / more 项被点击时触发 | `CustomEvent<{ item: VeActionItem }>` |

### VeActionItem

| 字段       | 描述                                     | 类型                                              | 默认值  |
| ---------- | ---------------------------------------- | ------------------------------------------------- | ------- |
| `key`      | 唯一标识                                 | `string`                                          | —       |
| `type`     | 项类型；省略为普通图标按钮               | `'more'`                                          | —       |
| `text`     | 纯文本内容，渲染为非点击文本项           | `string`                                          | —       |
| `divider`  | 是否渲染为竖向分隔线                     | `boolean`                                         | `false` |
| `icon`     | 图标，支持 React 节点、DOM 节点或文本    | `React.ReactNode \| Node`                         | —       |
| `disabled` | 是否禁用该操作项                         | `boolean`                                         | `false` |
| `onClick`  | 单项点击回调，先于 `onActionsClick` 执行 | `(item: VeActionItem, event: MouseEvent) => void` | —       |
| `menu`     | 仅 `type: 'more'` 生效，下拉菜单内容节点 | `React.ReactNode \| Element`                      | —       |

### Ref

可通过 `ref` 访问 Actions 组件实例。
