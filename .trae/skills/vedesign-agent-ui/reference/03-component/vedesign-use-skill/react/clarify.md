`Clarify` 用于在 AI 对话流中把模型的「待确认 / 待选择」诉求转化为结构化问答，让用户通过点选、拖拽排序、跳过和文本补充给出答案。

## 何时使用

- AI 在继续执行前需要用户确认意图、范围、风格、平台或参数。
- 需要把一组候选项展示为单选、多选或优先级排序。
- 需要按题目顺序完成多步追问，并在每题或全部完成时回收结构化结果。
- 既提供候选项，也允许用户补充自由文本或跳过当前问题。

## 引入组件

```tsx
import { Clarify } from '@ve-design/react';
```

## 示例

### 基础用法

每题只允许选择一个选项。用户点击候选项后会触发 `onSubmit`，并自动流转到下一题。

```tsx preview
import { Clarify } from '@ve-design/react';

function ClarifyBasicDemo() {
  const questions = [
    {
      id: 'tone',
      title: 'Pick a tone for the generated copy',
      options: [
        { key: 'pro', label: 'Professional', value: 'professional' },
        { key: 'cas', label: 'Casual', value: 'casual' },
        { key: 'play', label: 'Playful', value: 'playful' },
      ],
    },
  ];

  return (
    <section style={{ padding: 24 }}>
      <Clarify
        questions={questions}
        style={{ display: 'block' }}
        onSubmit={(event) => console.log('submitted', event.detail)}
      />
    </section>
  );
}
```

### 多选 + 自由文本

设置 `multiple: true` 进入多选模式；设置 `showInput: true` 后，输入内容会随提交结果一起通过 `inputText` 返回。

```tsx preview
import { Clarify } from '@ve-design/react';

function ClarifyMultiDemo() {
  const questions = [
    {
      id: 'features',
      title: 'Which capabilities should the agent enable?',
      multiple: true,
      showInput: true,
      inputPlaceholder: 'Add more capabilities...',
      options: [
        { key: 'web', label: 'Web search', value: 'web' },
        { key: 'code', label: 'Code interpreter', value: 'code' },
        { key: 'doc', label: 'Document retrieval', value: 'doc' },
        { key: 'img', label: 'Image generation', value: 'img' },
      ],
    },
  ];

  return (
    <section style={{ padding: 24 }}>
      <Clarify
        questions={questions}
        style={{ display: 'block' }}
        onSubmit={(event) => console.log('submitted', event.detail)}
      />
    </section>
  );
}
```

### 排序（拖拽优先级）

设置 `sortable: true` 后，用户可以拖拽候选项排序。提交时 `selectedValues` 会按当前排序返回。

```tsx preview
import { Clarify } from '@ve-design/react';

function ClarifySortableDemo() {
  const questions = [
    {
      id: 'ui-priority',
      title:
        '第一步：你最在意这个 UI 方案 哪几件事？拖拽排序（从最重要到最不重要）',
      sortable: true,
      options: [
        { key: 'visual', label: '视觉表达', value: 'visual' },
        { key: 'usability', label: '交互可用性', value: 'usability' },
        { key: 'layout', label: '布局合理性', value: 'layout' },
        { key: 'design', label: '设计感', value: 'design' },
      ],
    },
  ];

  return (
    <section style={{ padding: 24 }}>
      <Clarify
        questions={questions}
        style={{ display: 'block' }}
        onSubmit={(event) => console.log('sorted result', event.detail)}
      />
    </section>
  );
}
```

### 多步问答流转

`questions` 按数组顺序流转。单题提交触发 `onSubmit`，所有题目完成后触发 `onComplete`。

```tsx preview
import { Clarify } from '@ve-design/react';

function ClarifyFlowDemo() {
  const questions = [
    {
      id: 'goal',
      title: 'What is the goal of this task?',
      options: [
        { key: 'doc', label: 'Generate documentation', value: 'doc' },
        { key: 'sum', label: 'Summarize content', value: 'sum' },
        { key: 'rev', label: 'Review code quality', value: 'rev' },
      ],
    },
    {
      id: 'audience',
      title: 'Who is the audience?',
      options: [
        { key: 'eng', label: 'Engineers', value: 'engineers' },
        { key: 'pm', label: 'Product managers', value: 'pm' },
        { key: 'all', label: 'Mixed audience', value: 'mixed' },
      ],
    },
    {
      id: 'depth',
      title: 'How deep should the answer go?',
      options: [
        { key: 's', label: 'Brief overview', value: 'brief' },
        { key: 'm', label: 'Standard analysis', value: 'standard' },
        { key: 'l', label: 'Deep dive', value: 'deep' },
      ],
    },
  ];

  return (
    <section style={{ padding: 24 }}>
      <Clarify
        questions={questions}
        style={{ display: 'block' }}
        onSubmit={(event) => console.log('submitted', event.detail)}
        onComplete={(event) => console.log('completed', event.detail)}
      />
    </section>
  );
}
```

### 受控 activeIndex

通过 `activeIndex` 与 `onActiveIndexChange` 受控当前激活题，业务侧可从外部按钮驱动跳题。

```tsx preview
import { useState } from 'react';
import { Button, Clarify } from '@ve-design/react';

function ClarifyControlledDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const questions = [
    {
      id: 'platform',
      title: 'Which platform are you targeting?',
      options: [
        { key: 'web', label: 'Web', value: 'web' },
        { key: 'mobile', label: 'Mobile', value: 'mobile' },
        { key: 'desktop', label: 'Desktop', value: 'desktop' },
      ],
    },
    {
      id: 'style',
      title: 'Pick a visual style',
      options: [
        { key: 'min', label: 'Minimal', value: 'minimal' },
        { key: 'mod', label: 'Modern', value: 'modern' },
        { key: 'play', label: 'Playful', value: 'playful' },
      ],
    },
    {
      id: 'lang',
      title: 'Output language',
      options: [
        { key: 'cn', label: 'Chinese', value: 'cn' },
        { key: 'en', label: 'English', value: 'en' },
        { key: 'jp', label: 'Japanese', value: 'jp' },
      ],
    },
  ];

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          type="outline"
          size="small"
          disabled={activeIndex <= 0}
          onClick={() => setActiveIndex((value) => Math.max(0, value - 1))}
        >
          Prev
        </Button>
        <Button
          type="outline"
          size="small"
          disabled={activeIndex >= questions.length - 1}
          onClick={() =>
            setActiveIndex((value) => Math.min(questions.length - 1, value + 1))
          }
        >
          Next
        </Button>
        <span style={{ lineHeight: '28px', color: 'var(--color-text-tertiary)' }}>
          {activeIndex + 1} / {questions.length}
        </span>
      </div>
      <Clarify
        questions={questions}
        activeIndex={activeIndex}
        style={{ display: 'block' }}
        onActiveIndexChange={(event) => setActiveIndex(event.detail.index)}
      />
    </section>
  );
}
```

### 隐藏跳过 / 隐藏关闭

每个问题可通过 `showSkip: false` 隐藏跳过入口；组件级 `closable` 控制头部是否展示关闭按钮。

```tsx preview
import { Clarify } from '@ve-design/react';

function ClarifyRequiredDemo() {
  const questions = [
    {
      id: 'confirm',
      title: 'Confirm before running the selected operation',
      showSkip: false,
      options: [
        { key: 'yes', label: 'Yes, proceed', value: 'yes' },
        { key: 'no', label: 'No, stop here', value: 'no' },
      ],
    },
  ];

  return (
    <section style={{ padding: 24 }}>
      <Clarify
        questions={questions}
        closable
        style={{ display: 'block' }}
        onClose={() => console.log('user closed')}
      />
    </section>
  );
}
```

### 禁用态

使用 `disabled` 禁用整个组件。

```tsx preview
import { Clarify } from '@ve-design/react';

function ClarifyDisabledDemo() {
  const questions = [
    {
      id: 'demo',
      title: 'Disabled while previous task is still running',
      options: [
        { key: 'a', label: 'Option A', value: 'a' },
        { key: 'b', label: 'Option B', value: 'b' },
      ],
    },
  ];

  return (
    <section style={{ padding: 24 }}>
      <Clarify questions={questions} disabled style={{ display: 'block' }} />
    </section>
  );
}
```

### 选项级禁用

单个选项也可以通过 `disabled: true` 单独禁用。

```tsx preview
import { Clarify } from '@ve-design/react';

function ClarifyOptionDisabledDemo() {
  const questions = [
    {
      id: 'plan',
      title: 'Pick a plan to upgrade',
      options: [
        { key: 'free', label: 'Free', value: 'free' },
        { key: 'pro', label: 'Pro', value: 'pro' },
        {
          key: 'team',
          label: 'Team (requires admin)',
          value: 'team',
          disabled: true,
        },
        {
          key: 'ent',
          label: 'Enterprise (contact sales)',
          value: 'ent',
          disabled: true,
        },
      ],
    },
  ];

  return (
    <section style={{ padding: 24 }}>
      <Clarify questions={questions} style={{ display: 'block' }} />
    </section>
  );
}
```

### 提交事件 payload

`onSubmit` 返回单题提交结果；`onSkip` 返回被跳过的问题 ID。

```tsx preview
import { Clarify } from '@ve-design/react';

function ClarifyEventDemo() {
  const questions = [
    {
      id: 'channel',
      title: 'Which channels to publish?',
      multiple: true,
      showInput: true,
      inputPlaceholder: 'Notes for the release plan...',
      options: [
        { key: 'blog', label: 'Blog', value: 'blog' },
        { key: 'tw', label: 'X / Twitter', value: 'tw' },
        { key: 'ln', label: 'LinkedIn', value: 'ln' },
        { key: 'wx', label: 'WeChat', value: 'wx' },
      ],
    },
  ];

  return (
    <section style={{ display: 'grid', gap: 12, padding: 24 }}>
      <Clarify
        questions={questions}
        style={{ display: 'block' }}
        onSubmit={(event) => console.log('submitted', event.detail)}
        onSkip={(event) => console.log('skipped', event.detail)}
      />
    </section>
  );
}
```

## API

### Props

| 属性名               | 描述                                            | 类型                  | 默认值  |
| -------------------- | ----------------------------------------------- | --------------------- | ------- |
| `questions`          | 问答列表，按数组顺序流转                        | `ClarifyQuestion[]`   | `[]`    |
| `activeIndex`        | 当前激活的问题索引（受控）                      | `number \| null`      | `null`  |
| `defaultActiveIndex` | 初始激活问题索引（非受控）                      | `number`              | `0`     |
| `disabled`           | 是否禁用全部交互                                | `boolean`             | `false` |
| `closable`           | 是否展示关闭按钮                                | `boolean`             | `false` |
| `showKeyboardHint`   | 是否展示底部键盘快捷键提示                      | `boolean`             | `true`  |
| `keyboardNavigation` | 是否启用方向键切换、Enter 确认和 Esc 跳过等操作 | `boolean`             | `true`  |
| `style`              | 根节点内联样式                                  | `React.CSSProperties` | `-`     |
| `className`          | 根节点类名                                      | `string`              | `-`     |

### 事件

| 事件名                | 描述                                         | 参数类型                                      |
| --------------------- | -------------------------------------------- | --------------------------------------------- |
| `onActiveIndexChange` | 当前激活的问题索引改变时触发                 | `CustomEvent<ClarifyActiveIndexChangeDetail>` |
| `onSubmit`            | 单个问题被提交时触发                         | `CustomEvent<ClarifyResult>`                  |
| `onSkip`              | 单个问题被跳过时触发                         | `CustomEvent<ClarifySkipDetail>`              |
| `onComplete`          | 所有问题完成或跳过后触发，返回聚合后的结果   | `CustomEvent<ClarifyCompleteDetail>`          |
| `onClose`             | 用户点击关闭按钮时触发（需 `closable` 为真） | `CustomEvent`                                 |

### 类型定义

```ts
interface ClarifyOption {
  key: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface ClarifyQuestion {
  id: string;
  title: string;
  options: ClarifyOption[];
  multiple?: boolean;
  sortable?: boolean;
  showInput?: boolean;
  inputPlaceholder?: string;
  showSkip?: boolean;
}

interface ClarifyResult {
  questionId: string;
  selectedValues: string[];
  inputText?: string;
  skipped: boolean;
}

interface ClarifyActiveIndexChangeDetail {
  index: number;
}

interface ClarifySkipDetail {
  questionId: string;
}

interface ClarifyCompleteDetail {
  results: ClarifyResult[];
}
```
