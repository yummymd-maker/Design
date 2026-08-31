`ve-message` 用于展示轻量级全局反馈。实际业务中通常通过 `Message` 命令式 API 触发，也可以作为单条 Web Component 直接使用。

<style>{`
  .ve-message-doc-surface {
    display: grid;
    justify-items: center;
    align-items: center;
    gap: var(--space-s);
    padding: var(--space-xl) var(--space-l);
    background: var(--color-bg-base);
  }

  .ve-message-doc-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--space-xs);
  }

  .ve-message-doc-note {
    max-width: 560px;
    margin: 0;
    color: var(--color-text-tertiary);
    font-size: var(--text-caption);
    line-height: 20px;
    text-align: center;
  }

  .ve-message-doc-rich {
    display: inline-flex;
    align-items: flex-start;
    gap: var(--space-xs);
    min-width: 0;
  }

  .ve-message-doc-rich-main {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .ve-message-doc-rich-title {
    color: var(--color-text-primary);
    font-size: var(--text-body);
    font-weight: var(--font-weight-medium);
    line-height: 22px;
  }

  .ve-message-doc-rich-meta {
    color: var(--color-text-tertiary);
    font-size: var(--text-caption);
    line-height: 18px;
  }

  .ve-message-doc-link-button {
    all: unset;
    flex: none;
    color: var(--color-text-primary);
    font-size: var(--text-body);
    font-weight: var(--font-weight-medium);
    line-height: 22px;
    cursor: pointer;
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-color: var(--color-text-tertiary);
    text-underline-offset: 3px;
  }

  .ve-message-doc-link-button:focus-visible {
    outline: var(--stroke-2) solid var(--color-bg-info);
    outline-offset: 2px;
  }

  .ve-message-doc-inline {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xxs);
  }
`}</style>

## 何时使用

- 操作完成、失败、处理中或需要补充说明时，给用户即时反馈。
- 反馈不需要打断当前流程，也不需要用户强制处理。
- 同一条提示需要从加载中更新为成功或失败状态。

## 引入组件

```ts
import { Message } from '@ve-design/web/ve-message';
```

直接使用元素时：

```ts
import '@ve-design/web/ve-message';
```

## 示例

### 基础用法

直接传入文本即可打开不同语义的全局提示。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import { Message } from '@ve-design/web/ve-message';

  window.messageDocOpenInfo = () => {
    Message.info('评测任务已加入队列，预计 2 分钟后开始执行。');
  };

  window.messageDocOpenSuccess = () => {
    Message.success('配置已保存，后续操作将使用最新设置。');
  };

  window.messageDocOpenWarning = () => {
    Message.warning('本月评测额度剩余 8%，建议先暂停批量回归任务。');
  };

  window.messageDocOpenError = () => {
    Message.error('发布失败：当前流程缺少必填的回滚策略。');
  };

  window.messageDocOpenLoading = () => {
    Message.loading({
      content: '正在同步 128 条评测轨迹，完成后会自动刷新结果。',
      duration: 2600,
    });
  };
</script>

<section class="ve-message-doc-surface">
  <div class="ve-message-doc-row">
    <ve-button type="secondary" onclick="window.messageDocOpenInfo()">
      查看队列
    </ve-button>
    <ve-button
      type="primary"
      status="success"
      onclick="window.messageDocOpenSuccess()"
    >
      保存配置
    </ve-button>
    <ve-button
      type="primary"
      status="warning"
      onclick="window.messageDocOpenWarning()"
    >
      检查额度
    </ve-button>
    <ve-button
      type="primary"
      status="danger"
      onclick="window.messageDocOpenError()"
    >
      模拟失败
    </ve-button>
    <ve-button type="secondary" onclick="window.messageDocOpenLoading()">
      同步评测
    </ve-button>
  </div>
</section>
```

### 关键配置

`closable` 展示关闭按钮，`duration=0` 表示不自动关闭，`position` 控制顶部或底部出现，`onClose` 会在离场动画结束后触发。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import { Message } from '@ve-design/web/ve-message';

  window.messageDocOpenReport = () => {
    const log = document.querySelector('#message-doc-close-log');

    Message.success({
      content: '评测报告已生成，可前往详情页查看结果。',
      closable: true,
      duration: 6000,
      onClose: () => {
        log.textContent = '报告完成提示已关闭。';
      },
    });
  };

  window.messageDocOpenOffline = () => {
    Message.warning({
      content: '已进入离线模式。网络恢复后会继续同步 3 条本地编辑。',
      position: 'bottom',
      closable: true,
      duration: 0,
    });
  };
</script>

<section class="ve-message-doc-surface">
  <div class="ve-message-doc-row">
    <ve-button
      type="primary"
      status="success"
      onclick="window.messageDocOpenReport()"
    >
      生成报告
    </ve-button>
    <ve-button
      type="primary"
      status="warning"
      onclick="window.messageDocOpenOffline()"
    >
      切换离线
    </ve-button>
  </div>
  <p id="message-doc-close-log" class="ve-message-doc-note">
    关闭第一条提示后会触发 onClose。
  </p>
</section>
```

### 更新同一条提示

传入相同 `id` 时会更新已有提示，常用于“加载中 → 成功/失败”的状态切换。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import { Message } from '@ve-design/web/ve-message';

  window.messageDocPublishWorkflow = () => {
    Message.loading({
      id: 'message-doc-publish-workflow',
      content: '正在发布 当前流程 到 发布环境...',
      duration: 0,
    });

    window.setTimeout(() => {
      Message.success({
        id: 'message-doc-publish-workflow',
        content: '当前流程 已上线，生产流量将使用最新编排配置。',
        closable: true,
        duration: 6000,
      });
    }, 1600);
  };
</script>

<section class="ve-message-doc-surface">
  <ve-button type="primary" onclick="window.messageDocPublishWorkflow()">
    发布工作流
  </ve-button>
</section>
```

### 自定义 content

`content` 支持 `string`、`Node` 和 render function。render function 会收到挂载容器和上下文，可返回文本、DOM 节点，或返回清理函数用于卸载框架组件。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import { Message } from '@ve-design/web/ve-message';

  function createReviewNotice(close) {
    const wrapper = document.createElement('div');
    wrapper.className = 've-message-doc-rich';

    const main = document.createElement('div');
    main.className = 've-message-doc-rich-main';

    const title = document.createElement('div');
    title.className = 've-message-doc-rich-title';
    title.textContent = '上线前需要人工复核';

    const meta = document.createElement('div');
    meta.className = 've-message-doc-rich-meta';
    meta.textContent = '3 个高风险场景低于质量阈值，请确认后再发布。';

    const reportButton = document.createElement('button');
    reportButton.type = 'button';
    reportButton.className = 've-message-doc-link-button';
    reportButton.textContent = '打开报告';
    reportButton.onclick = () => {
      Message.info('已打开评测报告。');
      close();
    };

    main.append(title, meta);
    wrapper.append(main, reportButton);
    return wrapper;
  }

  window.messageDocOpenCustomContent = () => {
    Message.warning({
      content: (_, { close }) => createReviewNotice(close),
      closable: true,
      duration: 0,
    });
  };
</script>

<section class="ve-message-doc-surface">
  <ve-button
    type="primary"
    status="warning"
    onclick="window.messageDocOpenCustomContent()"
  >
    展示复核提示
  </ve-button>
</section>
```

### 直接使用元素

少数需要在页面内固定展示反馈时，可以直接使用 `<ve-message>`。默认插槽会覆盖 `content` 属性。

```html preview
<script type="module">
  import '@ve-design/web/ve-button';
  import '@ve-design/web/ve-message';
</script>

<section class="ve-message-doc-surface">
  <ve-message
    type="info"
    content="这段 fallback 文本会被默认插槽覆盖。"
    closable
    duration="0"
  >
    <span class="ve-message-doc-inline">
      <strong>灰度任务</strong>
      已接入 12 条生产流量采样，下一轮评测将在 20 分钟后开始。
      <ve-button type="text" size="small">查看详情</ve-button>
    </span>
  </ve-message>
</section>
```

## API

### Message 方法

| 方法                               | 描述                 |
| ---------------------------------- | -------------------- |
| `Message.info(configOrContent)`    | 打开信息提示         |
| `Message.success(configOrContent)` | 打开成功提示         |
| `Message.warning(configOrContent)` | 打开警告提示         |
| `Message.error(configOrContent)`   | 打开错误提示         |
| `Message.loading(configOrContent)` | 打开加载提示         |
| `Message.addInstance(config)`      | 使用完整配置创建提示 |
| `Message.clear()`                  | 关闭当前全部提示     |

`configOrContent` 可直接传入 `string`、`Node`、`MessageContentRenderer`，也可以传入完整的 `MessageOptions`。

### MessageOptions

| 参数名      | 描述                                      | 类型                                                       | 默认值      |
| ----------- | ----------------------------------------- | ---------------------------------------------------------- | ----------- |
| `content`   | 消息内容                                  | `string \| Node \| MessageContentRenderer`                 | 必填        |
| `type`      | 消息类型                                  | `'info' \| 'success' \| 'warning' \| 'error' \| 'loading'` | `'info'`    |
| `id`        | 唯一标识；相同 `id` 会更新已有提示        | `string`                                                   | 自动生成    |
| `duration`  | 自动关闭时间，单位 ms；`0` 表示不自动关闭 | `number`                                                   | `3000`      |
| `showIcon`  | 是否显示状态图标                          | `boolean`                                                  | `true`      |
| `icon`      | 自定义图标                                | `string \| Node`                                           | `undefined` |
| `closable`  | 是否显示关闭按钮                          | `boolean`                                                  | `false`     |
| `closeIcon` | 自定义关闭图标                            | `string \| Node`                                           | `undefined` |
| `position`  | 消息位置                                  | `'top' \| 'bottom'`                                        | `'top'`     |
| `onClose`   | 离场动画结束后的回调                      | `() => void`                                               | `undefined` |

### MessageContentRenderer

```ts
type MessageContentRenderer = (
  container: HTMLElement,
  context: {
    element: VeMessageElement;
    close: () => void;
  },
) => void | string | Node | (() => void);
```

### 元素属性

| 属性名           | 描述                                      | 类型                                                       | 默认值   |
| ---------------- | ----------------------------------------- | ---------------------------------------------------------- | -------- |
| `type`           | 消息类型                                  | `'info' \| 'success' \| 'warning' \| 'error' \| 'loading'` | `'info'` |
| `content`        | 消息内容文本                              | `string`                                                   | `''`     |
| `message-id`     | 消息唯一标识                              | `string`                                                   | `''`     |
| `position`       | 消息位置元信息                            | `'top' \| 'bottom'`                                        | `'top'`  |
| `show-icon`      | 是否显示状态图标                          | `boolean`                                                  | `true`   |
| `closable`       | 是否显示关闭按钮                          | `boolean`                                                  | `false`  |
| `duration`       | 自动关闭时间，单位 ms；`0` 表示不自动关闭 | `number`                                                   | `3000`   |
| `enter-duration` | 进入动画时长，单位 ms                     | `number`                                                   | `100`    |
| `exit-duration`  | 离场动画时长，单位 ms                     | `number`                                                   | `300`    |

### 元素方法

| 方法                  | 描述                         |
| --------------------- | ---------------------------- |
| `close(sourceEvent?)` | 主动触发关闭流程             |
| `restartTimer()`      | 使用当前 `duration` 重置计时 |

### 事件

| 事件名                   | 描述               | `event.detail`                                                 |
| ------------------------ | ------------------ | -------------------------------------------------------------- |
| `ve-close`               | 消息开始关闭时触发，调用 `preventDefault()` 可阻止关闭 | `{ id?: string; type: MessageType; sourceEvent?: MouseEvent }` |
| `ve-after-close`         | 离场动画完成后触发 | `{ id?: string; type: MessageType; sourceEvent?: MouseEvent }` |

### 插槽

| 插槽名       | 描述                             |
| ------------ | -------------------------------- |
| `default`    | 自定义消息内容，优先于 `content` |
| `icon`       | 自定义状态图标                   |
| `close-icon` | 自定义关闭图标                   |
