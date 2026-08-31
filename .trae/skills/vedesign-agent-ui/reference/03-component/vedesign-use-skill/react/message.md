`Message` 用于展示轻量级全局反馈。React 中既可以通过静态方法触发全局提示，也可以直接渲染单条提示组件。

## 何时使用

- 操作完成、失败、处理中或需要补充说明时，给用户即时反馈。
- 反馈不需要打断当前流程，也不需要用户强制处理。
- 同一条提示需要从加载中更新为成功或失败状态。

## 引入组件

```tsx
import { Message } from '@ve-design/react';
```

## 示例

### 基础用法

直接传入文本即可打开不同语义的全局提示。

```tsx preview
import { Button, Message } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Button
    type="secondary"
    onClick={() => Message.info('评测任务已加入队列，预计 2 分钟后开始执行。')}
  >
    查看队列
  </Button>
  <Button
    type="primary"
    status="success"
    onClick={() =>
      Message.success('配置已保存，后续操作将使用最新设置。')
    }
  >
    保存配置
  </Button>
  <Button
    type="primary"
    status="warning"
    onClick={() =>
      Message.warning('本月评测额度剩余 8%，建议先暂停批量回归任务。')
    }
  >
    检查额度
  </Button>
  <Button
    type="primary"
    status="danger"
    onClick={() =>
      Message.error('发布失败：当前流程缺少必填的回滚策略。')
    }
  >
    模拟失败
  </Button>
  <Button
    type="secondary"
    onClick={() =>
      Message.loading({
        content: '正在同步 128 条评测轨迹，完成后会自动刷新结果。',
        duration: 2600,
      })
    }
  >
    同步评测
  </Button>
</section>;
```

### 关键配置

静态 API 通过 `Message.success()` 等方法创建全局提示；直接渲染 `<Message />` 用于页面内固定展示。`closable` 展示关闭按钮，`duration={0}` 表示不自动关闭，`position` 控制顶部或底部出现；静态 API 的 `onClose` 配置会在离场动画结束后触发，不等同于组件实例的 `onClose` 事件。

```tsx preview
import { useState } from 'react';
import { Button, Message } from '@ve-design/react';

function MessageConfigDemo() {
  const [log, setLog] = useState('关闭第一条提示后会触发 onClose。');

  return (
    <section
      style={{
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        gap: 12,
        padding: 32,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px 24px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          type="primary"
          status="success"
          onClick={() =>
            Message.success({
              content: '评测报告已生成，可前往详情页查看结果。',
              closable: true,
              duration: 6000,
              onClose: () => {
                setLog('报告完成提示已关闭。');
              },
            })
          }
        >
          生成报告
        </Button>
        <Button
          type="primary"
          status="warning"
          onClick={() =>
            Message.warning({
              content: '已进入离线模式。网络恢复后会继续同步 3 条本地编辑。',
              position: 'bottom',
              closable: true,
              duration: 0,
            })
          }
        >
          切换离线
        </Button>
      </div>
      <div
        style={{
          maxWidth: 560,
          color: 'var(--color-text-tertiary)',
          fontSize: 12,
          lineHeight: '20px',
          textAlign: 'center',
        }}
      >
        {log}
      </div>
    </section>
  );
}

```

### 更新同一条提示

传入相同 `id` 时会更新已有提示，常用于“加载中 → 成功/失败”的状态切换。

```tsx preview
import { Button, Message } from '@ve-design/react';

function MessageUpdateDemo() {
  const publishWorkflow = () => {
    Message.loading({
      id: 'message-react-doc-publish-workflow',
      content: '正在发布 当前流程 到 发布环境...',
      duration: 0,
    });

    setTimeout(() => {
      Message.success({
        id: 'message-react-doc-publish-workflow',
        content: '当前流程 已上线，生产流量将使用最新编排配置。',
        closable: true,
        duration: 6000,
      });
    }, 1600);
  };

  return (
    <section style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
      <Button type="primary" onClick={publishWorkflow}>
        发布工作流
      </Button>
    </section>
  );
}
```

### 自定义 content

`content` 支持传入 React 节点或 render function。render function 会收到挂载容器和上下文，可返回文本、DOM 节点、React 节点，或返回清理函数用于卸载框架组件。

```tsx preview
import { Button, Message } from '@ve-design/react';

function MessageCustomContentDemo() {
  const openReviewNotice = () => {
    Message.warning({
      content: (_, { close }) => (
        <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 8 }}>
          <span
            style={{
              display: 'grid',
              gap: 2,
              minWidth: 0,
            }}
          >
            <span
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--font-weight-medium)',
                lineHeight: '22px',
              }}
            >
              上线前需要人工复核
            </span>
            <span
              style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--text-caption)',
                lineHeight: '18px',
              }}
            >
              3 个高风险场景低于质量阈值，请确认后再发布。
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              Message.info('已打开评测报告。');
              close();
            }}
            style={{
              all: 'unset',
              flex: 'none',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-body)',
              fontWeight: 'var(--font-weight-medium)',
              lineHeight: '22px',
              cursor: 'pointer',
              textDecorationLine: 'underline',
              textDecorationStyle: 'dotted',
              textDecorationColor: 'var(--color-text-tertiary)',
              textUnderlineOffset: 3,
            }}
          >
            打开报告
          </button>
        </span>
      ),
      closable: true,
      duration: 0,
    });
  };

  return (
    <section
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px 24px',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
      }}
    >
      <Button type="primary" status="warning" onClick={openReviewNotice}>
        展示复核提示
      </Button>
    </section>
  );
}

```

### 直接使用元素

少数需要在页面内固定展示反馈时，可以直接渲染 `<Message>`。`children` 会作为消息内容展示；也可以用 `content` 传入文本内容。

```tsx preview
import { Button, Message } from '@ve-design/react';

<section
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  }}
>
  <Message
    type="info"
    content="这段 fallback 文本会被 children 覆盖。"
    closable
    duration={0}
  >
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <strong>灰度任务</strong>
      <span>已接入 12 条生产流量采样，下一轮评测将在 20 分钟后开始。</span>
      <Button type="text" size="small">
        查看详情
      </Button>
    </span>
  </Message>
</section>;
```

## API

### 静态方法

| 方法                               | 描述                 | 返回值                 |
| ---------------------------------- | -------------------- | ---------------------- |
| `Message.info(configOrContent)`    | 打开信息提示         | `MessageCloseFunction` |
| `Message.success(configOrContent)` | 打开成功提示         | `MessageCloseFunction` |
| `Message.warning(configOrContent)` | 打开警告提示         | `MessageCloseFunction` |
| `Message.error(configOrContent)`   | 打开错误提示         | `MessageCloseFunction` |
| `Message.loading(configOrContent)` | 打开加载提示         | `MessageCloseFunction` |
| `Message.addInstance(config)`      | 使用完整配置创建提示 | `MessageCloseFunction` |
| `Message.clear()`                  | 关闭当前全部提示     | `void`                 |

`configOrContent` 可直接传入 `MessageContent`，也可以传入完整的 `MessageOptions`。

### 类型定义

#### MessageOptions

| 参数名      | 描述                                      | 类型                                                       | 默认值      |
| ----------- | ----------------------------------------- | ---------------------------------------------------------- | ----------- |
| `content`   | 消息内容                                  | `React.ReactNode \| Node \| MessageContentRenderer`        | 必填        |
| `type`      | 消息类型                                  | `'info' \| 'success' \| 'warning' \| 'error' \| 'loading'` | `'info'`    |
| `id`        | 唯一标识；相同 `id` 会更新已有提示        | `string`                                                   | 自动生成    |
| `duration`  | 自动关闭时间，单位 ms；`0` 表示不自动关闭 | `number`                                                   | `3000`      |
| `showIcon`  | 是否显示状态图标                          | `boolean`                                                  | `true`      |
| `icon`      | 自定义图标                                | `React.ReactNode \| Node`                                  | `undefined` |
| `closable`  | 是否显示关闭按钮                          | `boolean`                                                  | `false`     |
| `closeIcon` | 自定义关闭图标                            | `React.ReactNode \| Node`                                  | `undefined` |
| `position`  | 消息位置                                  | `'top' \| 'bottom'`                                        | `'top'`     |
| `onClose`   | 离场动画结束后的回调                      | `() => void`                                               | `undefined` |

#### MessageContentRenderer

```ts
type MessageContentRenderer = (
  container: HTMLElement,
  context: {
    element: VeMessageElement;
    close: () => void;
  },
) => void | string | Node | React.ReactNode | (() => void);
```

### Props

| 属性名          | 描述                                      | 类型                                                       | 默认值   |
| --------------- | ----------------------------------------- | ---------------------------------------------------------- | -------- |
| `type`          | 消息类型                                  | `'info' \| 'success' \| 'warning' \| 'error' \| 'loading'` | `'info'` |
| `content`       | 消息内容                                  | `React.ReactNode`                                          | `''`     |
| `children`      | 消息内容；非文本内容可通过 children 传入  | `React.ReactNode`                                          | `-`      |
| `messageId`     | 消息唯一标识                              | `string`                                                   | `''`     |
| `position`      | 消息位置元信息                            | `'top' \| 'bottom'`                                        | `'top'`  |
| `showIcon`      | 是否显示状态图标                          | `boolean`                                                  | `true`   |
| `icon`          | 自定义状态图标                            | `React.ReactNode`                                          | `-`      |
| `closable`      | 是否显示关闭按钮                          | `boolean`                                                  | `false`  |
| `closeIcon`     | 自定义关闭图标                            | `React.ReactNode`                                          | `-`      |
| `duration`      | 自动关闭时间，单位 ms；`0` 表示不自动关闭 | `number`                                                   | `3000`   |
| `enterDuration` | 进入动画时长，单位 ms                     | `number`                                                   | `100`    |
| `exitDuration`  | 离场动画时长，单位 ms                     | `number`                                                   | `300`    |

### 事件

| 事件名         | 描述                                                   | 参数类型                          |
| -------------- | ------------------------------------------------------ | --------------------------------- |
| `onClose`      | 消息开始关闭时触发，调用 `preventDefault()` 可阻止关闭 | `CustomEvent<MessageCloseDetail>` |
| `onAfterClose` | 离场动画完成后触发                                     | `CustomEvent<MessageCloseDetail>` |

```ts
interface MessageCloseDetail {
  id?: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'loading';
  sourceEvent?: MouseEvent;
}
```

### Ref

可通过 `ref` 调用组件实例上的 `close(sourceEvent?)` 和 `restartTimer()` 方法。
