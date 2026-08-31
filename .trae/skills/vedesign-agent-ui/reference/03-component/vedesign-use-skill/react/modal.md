`Modal` 用于在当前页面上方展示需要用户立即关注的对话内容，适合承载确认、反馈、表单配置、授权提示和高风险操作拦截。组件提供受控的 `visible` 状态、内置标题、遮罩、关闭入口、取消/确认按钮、背景滚动锁定和可取消事件，便于在弹窗打开期间隔离页面内容并拦截关闭行为。

## 何时使用

- 需要打断当前页面上下文，让用户聚焦完成确认、配置、授权或风险操作。
- 内容需要标题、正文、底部操作和关闭入口组成完整对话框，比 `Popconfirm` 承载的信息更复杂。
- 需要在点击确认前执行表单校验、异步提交或权限检查，并在校验失败时阻止弹窗自动关闭。
- 需要自定义标题、底部按钮、确认/取消按钮内容或关闭图标，以适配业务场景。
- 需要通过遮罩隔离页面内容，并在弹窗打开期间禁止背景内容滚动。

## 引入组件

```tsx
import { Modal } from '@ve-design/react';
```

## 示例

### 基础用法

`visible` 是弹窗展示状态，建议配合 `onVisibleChange` 同步由组件触发的关闭请求，保持外部状态一致；也可以通过 `ref` 调用 `show()` / `hide()` 方法。弹窗打开后会锁定页面背景滚动，多个弹窗同时打开时会在最后一个弹窗关闭后恢复。

```tsx preview
import { useState } from 'react';
import { Button, Modal } from '@ve-design/react';

export default function BasicModalDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <section
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 260,
        padding: 32,
      }}
    >
      <Button type="primary" onClick={() => setVisible(true)}>
        打开弹窗
      </Button>
      <Modal
        visible={visible}
        title="运行确认"
        okText="确认"
        cancelText="取消"
        onVisibleChange={(event) => setVisible(event.detail.visible)}
      >
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 180,
            border: '1px dashed var(--color-border-default)',
            borderRadius: 'var(--radius-base)',
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            lineHeight: '20px',
          }}
        >
          确认后将开始执行当前任务。
        </div>
      </Modal>
    </section>
  );
}
```

### 自定义宽度

`width` 接受任意合法 CSS 宽度值。传入空字符串时会回退到默认宽度 `480px`。

```tsx preview
import { useState } from 'react';
import { Button, Modal } from '@ve-design/react';

export default function WidthModalDemo() {
  const [activeModal, setActiveModal] = useState<'compact' | 'default' | 'wide' | null>(null);

  const modalContentStyle = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    border: '1px dashed var(--color-border-default)',
    borderRadius: 'var(--radius-base)',
    background: 'var(--color-bg-surface)',
    color: 'var(--color-text-secondary)',
    fontSize: 13,
    lineHeight: '20px',
  } as const;

  return (
    <section
      style={{
        boxSizing: 'border-box',
        display: 'grid',
        justifyItems: 'center',
        minHeight: 260,
        padding: 32,
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        <Button onClick={() => setActiveModal('compact')}>400px</Button>
        <Button onClick={() => setActiveModal('default')}>默认宽度</Button>
        <Button onClick={() => setActiveModal('wide')}>600px</Button>
      </div>

      <Modal
        visible={activeModal === 'compact'}
        width="400px"
        title="紧凑弹窗"
        onVisibleChange={(event) => !event.detail.visible && setActiveModal(null)}
      >
        <div style={modalContentStyle}>适合短确认和轻量表单。</div>
      </Modal>

      <Modal
        visible={activeModal === 'default'}
        title="默认弹窗"
        onVisibleChange={(event) => !event.detail.visible && setActiveModal(null)}
      >
        <div style={modalContentStyle}>默认宽度为 480px。</div>
      </Modal>

      <Modal
        visible={activeModal === 'wide'}
        width="600px"
        title="宽弹窗"
        onVisibleChange={(event) => !event.detail.visible && setActiveModal(null)}
      >
        <div style={modalContentStyle}>适合承载更完整的配置项。</div>
      </Modal>
    </section>
  );
}
```

### 自定义标题

`title` 适合纯文本标题；传入 `ReactNode` 时会替换整个标题区域，适合加入图标、状态、风险标记或业务标签。

```tsx preview
import { useState } from 'react';
import { Button, Modal } from '@ve-design/react';
import { IconInfo } from '@ve-design/react/icons';

export default function TitleModalDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <section
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 260,
        padding: 32,
      }}
    >
      <Button type="primary" onClick={() => setVisible(true)}>
        查看授权提示
      </Button>
      <Modal
        visible={visible}
        okText="同意"
        cancelText="暂不处理"
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <IconInfo size={22} style={{ color: 'var(--color-text-info)' }} />
            <span>需要授权</span>
          </span>
        }
        onVisibleChange={(event) => setVisible(event.detail.visible)}
      >
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 180,
            border: '1px dashed var(--color-border-default)',
            borderRadius: 'var(--radius-base)',
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            lineHeight: '20px',
          }}
        >
          继续前请确认 Agent 可以读取当前工作区信息。
        </div>
      </Modal>
    </section>
  );
}
```

### 自定义底部

传入 `footer` 后会完全替换默认底部，不再渲染内置取消和确认按钮；此时自定义按钮需要自行处理提交和关闭逻辑。

```tsx preview
import { useState } from 'react';
import { Button, Input, Modal, Select, SelectItem } from '@ve-design/react';
import { IconCheck, IconClose } from '@ve-design/react/icons';

export default function CustomModalDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <section
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 320,
        padding: 32,
      }}
    >
      <Button type="primary" onClick={() => setVisible(true)}>
        配置任务
      </Button>
      <Modal
        visible={visible}
        width="600px"
        title="任务运行设置"
        footer={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-end' }}>
            <Button type="secondary" onClick={() => setVisible(false)}>
              <IconClose />
              <span>取消</span>
            </Button>
            <Button type="primary" onClick={() => setVisible(false)}>
              <IconCheck />
              <span>运行任务</span>
            </Button>
          </div>
        }
        onVisibleChange={(event) => setVisible(event.detail.visible)}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: '20px' }}>
              任务名称
            </span>
            <Input placeholder="生成发布说明" />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: '20px' }}>
              工作区
            </span>
            <Select placeholder="设计系统">
              <SelectItem value="design-system">设计系统</SelectItem>
              <SelectItem value="project-space-a">项目空间 A</SelectItem>
              <SelectItem value="prompt-lab">项目空间 B</SelectItem>
              <SelectItem value="knowledge-hub">测试环境</SelectItem>
              <SelectItem value="eval-center">生产环境</SelectItem>
              <SelectItem value="data-platform">数据平台</SelectItem>
              <SelectItem value="growth-analytics">增长分析</SelectItem>
              <SelectItem value="risk-control">风险控制</SelectItem>
              <SelectItem value="content-review">内容审核</SelectItem>
              <SelectItem value="customer-service">客户服务</SelectItem>
              <SelectItem value="marketing-automation">营销自动化</SelectItem>
              <SelectItem value="experiment-platform">实验平台</SelectItem>
            </Select>
          </label>
        </div>
      </Modal>
    </section>
  );
}
```

### 关闭控制

`maskClosable={false}` 可以禁止点击遮罩关闭；`closable={false}` 可以隐藏右上角关闭按钮；`hideFooter` 可以隐藏底部区域。`onOk`、`onCancel`、`onClose` 都可以调用 `event.preventDefault()` 阻止默认关闭。

```tsx preview
import { useState } from 'react';
import { Button, Modal } from '@ve-design/react';

export default function CloseControlModalDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <section style={{ display: 'flex', justifyContent: 'center', minHeight: 260, padding: 32 }}>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开受限弹窗
      </Button>
      <Modal
        visible={visible}
        title="确认发布"
        maskClosable={false}
        okText="发布"
        cancelText="返回检查"
        onVisibleChange={(event) => setVisible(event.detail.visible)}
      >
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 180,
            border: '1px dashed var(--color-border-default)',
            borderRadius: 'var(--radius-base)',
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            lineHeight: '20px',
          }}
        >
          该操作只能通过按钮或右上角关闭入口退出。
        </div>
      </Modal>
    </section>
  );
}
```

### 确认前校验

在 `onOk` 中调用 `event.preventDefault()` 可以阻止组件自动关闭；校验通过后再手动设置 `visible = false`。

```tsx preview
import { useState } from 'react';
import { Button, Input, Modal } from '@ve-design/react';

export default function ValidationModalDemo() {
  const [visible, setVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [error, setError] = useState('');

  return (
    <section style={{ display: 'flex', justifyContent: 'center', minHeight: 260, padding: 32 }}>
      <Button type="primary" onClick={() => setVisible(true)}>
        创建任务
      </Button>
      <Modal
        visible={visible}
        title="创建任务"
        okText="创建"
        onOk={(event) => {
          event.preventDefault();

          if (!taskName.trim()) {
            setError('请输入任务名称');
            return;
          }

          setError('');
          setVisible(false);
        }}
        onVisibleChange={(event) => setVisible(event.detail.visible)}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <Input
            value={taskName}
            placeholder="请输入任务名称"
            onInput={(event) => {
              setTaskName((event.target as HTMLInputElement).value);
              setError('');
            }}
          />
          <div style={{ minHeight: 20, color: 'var(--color-text-danger)', fontSize: 13, lineHeight: '20px' }}>
            {error}
          </div>
        </div>
      </Modal>
    </section>
  );
}
```

### 事件监听

组件会在不同关闭来源下派发事件。可以通过 `event.detail.source` 判断关闭来源，通过 `sourceEvent` 获取原始交互事件。

```tsx preview
import { useState } from 'react';
import { Button, Modal } from '@ve-design/react';

export default function EventModalDemo() {
  const [visible, setVisible] = useState(false);
  const [log, setLog] = useState('等待事件');

  return (
    <section style={{ display: 'grid', justifyItems: 'center', minHeight: 260, padding: 32 }}>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开事件示例
      </Button>
      <Modal
        visible={visible}
        title="保存更改"
        okText="保存"
        onOk={(event) => setLog(`onOk：source=${event.detail.source}`)}
        onCancel={(event) => setLog(`onCancel：source=${event.detail.source}`)}
        onClose={(event) => setLog(`onClose：source=${event.detail.source}`)}
        onAfterClose={(event) => setLog(`onAfterClose：source=${event.detail.source}`)}
        onVisibleChange={(event) => setVisible(event.detail.visible)}
      >
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 180,
            border: '1px dashed var(--color-border-default)',
            borderRadius: 'var(--radius-base)',
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            lineHeight: '20px',
          }}
        >
          点击不同关闭入口查看事件来源。
        </div>
      </Modal>
      <div
        style={{
          marginBlockStart: 16,
          color: 'var(--color-text-tertiary)',
          fontSize: 12,
          lineHeight: '18px',
        }}
      >
        {log}
      </div>
    </section>
  );
}
```

### 使用 ref 调用方法

可通过 `ref` 调用 Modal 实例方法 `show()` / `hide(source?)` 控制弹窗显示与隐藏。

```tsx preview
import { useRef, type ElementRef } from 'react';
import { Button, Modal } from '@ve-design/react';

export default function RefModalDemo() {
  const modalRef = useRef<ElementRef<typeof Modal>>(null);

  return (
    <section style={{ display: 'flex', justifyContent: 'center', minHeight: 260, padding: 32 }}>
      <Button type="primary" onClick={() => modalRef.current?.show()}>
        通过 ref 打开
      </Button>
      <Modal ref={modalRef} title="Ref 控制" okText="知道了">
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 180,
            border: '1px dashed var(--color-border-default)',
            borderRadius: 'var(--radius-base)',
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            lineHeight: '20px',
          }}
        >
          可以通过 ref 调用 show() 和 hide(source?)。
        </div>
      </Modal>
    </section>
  );
}
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `visible` | 是否展示弹窗。弹窗隐藏时仍保留在 DOM 中，但面板会设置 `aria-hidden="true"`；展示时会锁定页面背景滚动。 | `boolean` | `false` |
| `width` | 弹窗面板宽度，接受任意合法 CSS 宽度值，例如 `400px`、`60vw`、`min(640px, 90vw)`。传入空字符串时回退到 `480px`。 | `string` | `'480px'` |
| `title` | 头部标题。传入字符串时作为纯文本标题；传入 `ReactNode` 时会替换整个标题区域，适合图标、标签或复杂结构。 | `React.ReactNode` | `-` |
| `closable` | 是否展示右上角关闭按钮。 | `boolean` | `true` |
| `mask` | 是否展示遮罩。设置为 `false` 时遮罩背景透明，但弹窗仍会显示在页面上方。 | `boolean` | `true` |
| `maskClosable` | 点击遮罩是否请求关闭弹窗。设置为 `false` 后，点击遮罩不会触发关闭请求。 | `boolean` | `true` |
| `okText` | 内置确认按钮文案。传入 `ok` 后可替换按钮内容但保留默认确认事件。 | `string` | `'确定'` |
| `cancelText` | 内置取消按钮文案。传入 `cancel` 后可替换按钮内容但保留默认取消事件。 | `string` | `'取消'` |
| `okDisabled` | 是否禁用内置确认按钮。禁用后不会触发 `onOk`。 | `boolean` | `false` |
| `cancelDisabled` | 是否禁用内置取消按钮。禁用后不会触发 `onCancel`。 | `boolean` | `false` |
| `hideFooter` | 是否隐藏底部区域。适用于只展示信息、由正文内操作完成交互或完全自定义布局的场景。 | `boolean` | `false` |
| `zIndex` | 弹窗根层级。适用于页面中存在更高层浮层时调整层级关系。 | `number` | `1000` |
| `footer` | 自定义完整底部区域。存在时会替换内置取消和确认按钮，自定义按钮需要自行处理提交与关闭。 | `React.ReactNode` | `-` |
| `cancel` | 自定义内置取消按钮内容，保留内置取消按钮、`onCancel` 事件和默认关闭行为。 | `React.ReactNode` | `-` |
| `ok` | 自定义内置确认按钮内容，保留内置确认按钮、`onOk` 事件和默认关闭行为。 | `React.ReactNode` | `-` |
| `closeIcon` | 自定义右上角关闭图标，保留关闭按钮、`onClose` 事件和默认关闭行为。 | `React.ReactNode` | `-` |
| `children` | 弹窗主体内容。 | `React.ReactNode` | `-` |

### Events

| 事件 | 说明 | Detail |
| --- | --- | --- |
| `onVisibleChange` | 请求展示或隐藏弹窗时触发。事件可取消；调用 `event.preventDefault()` 后，本次状态变更不会继续执行。 | `{ visible: boolean; source: 'api' \| 'close' \| 'cancel' \| 'ok' \| 'mask' \| 'esc'; sourceEvent?: Event }` |
| `onOk` | 点击内置确认按钮时触发。事件可取消；调用 `event.preventDefault()` 后，确认按钮不会自动关闭弹窗。 | `{ source: 'ok'; sourceEvent: MouseEvent }` |
| `onCancel` | 点击内置取消按钮时触发。事件可取消；调用 `event.preventDefault()` 后，取消按钮不会自动关闭弹窗。 | `{ source: 'cancel'; sourceEvent: MouseEvent }` |
| `onClose` | 点击右上角关闭按钮、点击遮罩或按 Escape 请求关闭时触发。事件可取消；调用 `event.preventDefault()` 后不会关闭弹窗。 | `{ source: 'close' \| 'mask' \| 'esc'; sourceEvent?: Event }` |
| `onAfterClose` | 弹窗关闭动画结束后触发。若用户开启了减少动态效果偏好，会在关闭后立即触发。 | `{ source: 'close' \| 'cancel' \| 'ok' \| 'mask' \| 'esc' \| 'api' }` |

### Ref

可通过 `ref` 调用以下 Modal 实例方法：

| 方法 | 说明 |
| --- | --- |
| `show()` | 请求展示弹窗，并派发 `onVisibleChange`。 |
| `hide(source?, sourceEvent?)` | 请求隐藏弹窗。`source` 默认是 `api`，可用于后续事件判断关闭来源。 |
