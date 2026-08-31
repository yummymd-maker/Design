import { ChatComposer } from './ChatComposer';
import type { WelcomeConfig, CapabilitiesConfig, BrandConfig } from '../config/types';
import type { SendMessageOptions } from '../runtime/types';
import type { RuntimeSecuritySettings, SecurityNotice } from '../runtime/security';

/**
 * 欢迎页。
 *
 * 1:1 复刻旧版 .welcome-panel / .welcome-content / .composer-shell / .prompt-chip-row。
 * 样式全部来自 theme/app-layout.css，本组件只组织 DOM 结构。
 */
export interface WelcomeScreenProps {
  brand: BrandConfig;
  welcome: WelcomeConfig;
  capabilities: CapabilitiesConfig;
  attachments: boolean;
  composerGlowColor: string;
  composerGlowColors: string;
  selectedSkill?: SendMessageOptions['skillInvocation'];
  securitySettings: RuntimeSecuritySettings;
  onSecurityNotice: (notice: SecurityNotice) => void;
  onSelectSkill?: (skill: SendMessageOptions['skillInvocation']) => void;
  onClearSkill?: () => void;
  onStart: (text: string, options?: SendMessageOptions) => void;
}

export function WelcomeScreen({
  brand,
  welcome,
  capabilities,
  attachments,
  composerGlowColor,
  composerGlowColors,
  selectedSkill,
  securitySettings,
  onSecurityNotice,
  onSelectSkill,
  onClearSkill,
  onStart,
}: WelcomeScreenProps) {
  const showTasks =
    welcome.tasksVisible !== false && Array.isArray(welcome.tasks) && welcome.tasks.length > 0;

  return (
    <>
      <div className="spotlight-grid" />
      <div className="welcome-content">
        <div className="welcome-core">
          {welcome.logoVisible === true && (
            <div className="welcome-logo" aria-label={brand.name}>
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} />
              ) : (
                <span>{brand.name.charAt(0)}</span>
              )}
            </div>
          )}
          <h1>{welcome.title}</h1>
          {welcome.subtitle && (
            <p style={{ margin: 0, color: 'var(--color-text-tertiary)' }}>
              {welcome.subtitle}
            </p>
          )}
          <div className="composer-shell">
            <div className="agent-composer">
              <ChatComposer
                attachments={attachments}
                motionColor={composerGlowColor}
                motionColors={composerGlowColors}
                selectedSkill={selectedSkill}
                shimmerIntervalMs={5000}
                shimmerDurationSec={4.2}
                chatUpload={capabilities.chatUpload}
                chatQuote={capabilities.chatQuote}
                chatPrompt={capabilities.chatPrompt}
                chatSearch={capabilities.chatSearch}
                chatCommand={capabilities.chatCommand}
                thinkingToggle={capabilities.thinkingChain}
                securitySettings={securitySettings}
                onSecurityNotice={onSecurityNotice}
                onSelectSkill={onSelectSkill}
                onClearSkill={onClearSkill}
                onSend={onStart}
              />
            </div>
          </div>
          {welcome.suggestions.length > 0 && (
            <div className="prompt-chip-row">
              {welcome.suggestions.map((text) => (
                <button key={text} onClick={() => onStart(text)}>
                  {text}
                </button>
              ))}
            </div>
          )}
        </div>

        {showTasks && (
          <section className="gallery-section">
            <div className="gallery-title">试试这些任务</div>
            <div className="gallery-grid">
              {welcome.tasks!.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className="gallery-card"
                  onClick={() => onStart(task.title)}
                >
                  {task.cover ? (
                    <img src={task.cover} alt={task.title} />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '1.45',
                        borderRadius: 12,
                        background:
                          'linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))',
                      }}
                    />
                  )}
                  <span>{task.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
