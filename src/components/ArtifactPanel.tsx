import { useEffect, useState } from 'react';
import { Markdown } from '@ve-design/react';
import type { ArtifactItem } from '../runtime/types';
import type { ArtifactPanelConfig } from '../config/types';

/**
 * 产物结果面板。
 *
 * 承载产物默认视图（预览/代码）、代码 tab 显隐、产物操作按钮。
 * 布局容器（split/canvas/tabs）由外层 `.artifact-layout-*` 控制。
 */
export interface ArtifactPanelProps {
  artifact: ArtifactItem;
  config: ArtifactPanelConfig;
  onClose?: () => void;
}

type View = 'preview' | 'code';

export function ArtifactPanel({ artifact, config, onClose }: ArtifactPanelProps) {
  const initialView: View = config.defaultView === 'code' && config.codeTabVisible ? 'code' : 'preview';
  const [view, setView] = useState<View>(initialView);
  const artifactContent =
    artifact.content || artifact.description || '这里是产物预览区，替换真实产物内容后即可看到渲染结果。';

  // 配置变更时重置视图（例如宿主切换 defaultView）。
  useEffect(() => {
    setView(config.defaultView === 'code' && config.codeTabVisible ? 'code' : 'preview');
  }, [config.defaultView, config.codeTabVisible]);

  return (
    <section className="artifact-panel">
      <header className="artifact-header">
        <strong>{artifact.title}</strong>
        <div>
          {config.codeTabVisible && (
            <div className="artifact-view-tabs segmented">
              <button
                className={view === 'preview' ? 'active' : ''}
                onClick={() => setView('preview')}
              >
                预览
              </button>
              <button
                className={view === 'code' ? 'active' : ''}
                onClick={() => setView('code')}
              >
                代码
              </button>
            </div>
          )}
          {config.actionsVisible && (
            <div className="artifact-actions">
              <button className="icon-button" type="button" title="复制">
                <ve-icon name="copy" />
              </button>
              <button className="icon-button" type="button" title="下载">
                <ve-icon name="download" />
              </button>
              <button className="icon-button" type="button" title="更多">
                <ve-icon name="more-horizontal" />
              </button>
            </div>
          )}
          {onClose && (
            <button
              className="icon-button"
              type="button"
              title="关闭"
              aria-label="关闭产物面板"
              onClick={onClose}
            >
              <ve-icon name="close" />
            </button>
          )}
        </div>
      </header>

      {view === 'code' ? (
        <pre className="code-panel">
{`// ${artifact.title}
// 由 mock adapter 生成的演示产物
// kind: ${artifact.kind}

${artifactContent}
`}
        </pre>
      ) : (
        <div className="preview-doc">
          <Markdown content={artifactContent} />
        </div>
      )}
    </section>
  );
}
