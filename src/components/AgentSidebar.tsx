import { type ReactNode, useEffect, useRef, useState } from 'react';
import type { BrandConfig } from '../config/types';
import type { CapabilitiesConfig } from '../config/types';

export interface HistoryItem {
  id: string;
  title: string;
  generating?: boolean;
  justCompleted?: boolean;
}

export interface AgentSidebarProps {
  brand: BrandConfig;
  historyItems: HistoryItem[];
  capabilities: CapabilitiesConfig;
  userName?: string;
  activePage?: 'chat' | 'files' | 'settings';
  collapsed?: boolean;
  activeHistoryId?: string;
  onNavigate?: (page: 'chat' | 'files' | 'settings') => void;
  onToggleCollapsed?: (collapsed: boolean) => void;
  onHistoryClick?: (id: string) => void;
  onNewChat?: () => void;
  onSearchClick?: () => void;
  onHistoryArchive?: (id: string) => void;
  onHistoryDelete?: (id: string) => void;
}

function HistoryDropdownItem({
  icon,
  danger,
  children,
  onSelect,
}: {
  icon: string;
  danger?: boolean;
  children: ReactNode;
  onSelect: () => void;
}) {
  const itemRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleSelect = (event: Event) => {
      event.stopPropagation();
      onSelect();
    };

    item.addEventListener('ve-dropdown-item-select', handleSelect);
    return () => item.removeEventListener('ve-dropdown-item-select', handleSelect);
  }, [onSelect]);

  return (
    <ve-dropdown-item ref={itemRef}>
      <span className={danger ? 'account-menu-item danger' : 'account-menu-item'}>
        <ve-icon name={icon} size="16" />
        {children}
      </span>
    </ve-dropdown-item>
  );
}

/**
 * 侧边栏。
 *
 * 结构参照 runtime 编译产物的 CSS 选择器（.agent-sidebar / .brand-icon /
 * .history-row / .user-entry / .account-popover-* / .history-more-dropdown），
 * 用 <ve-sidebar> Web Component 作为壳。
 */
export function AgentSidebar({
  brand,
  historyItems,
  capabilities,
  userName = '我',
  activePage = 'chat',
  collapsed = false,
  activeHistoryId,
  onNavigate,
  onToggleCollapsed,
  onHistoryClick,
  onNewChat,
  onSearchClick,
  onHistoryArchive,
  onHistoryDelete,
}: AgentSidebarProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popoverOpen) return;
    const handler = (event: MouseEvent) => {
      if (!anchorRef.current) return;
      if (!anchorRef.current.contains(event.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popoverOpen]);

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    (el as any).collapsed = collapsed;
  }, [collapsed]);

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el || !onToggleCollapsed) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ collapsed: boolean }>).detail;
      onToggleCollapsed(detail.collapsed);
    };
    el.addEventListener('ve-sidebar-toggle', handler);
    return () => el.removeEventListener('ve-sidebar-toggle', handler);
  }, [onToggleCollapsed]);

  return (
    <ve-sidebar
      ref={sidebarRef}
      className="agent-sidebar"
      with-footer=""
    >
      {/* Logo slot：品牌图标（ve-sidebar 内置折叠按钮，无需自己写） */}
      <span
        slot="logo"
        className="brand-icon"
        aria-label={brand.name}
        title={brand.name}
      >
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            style={{ width: 24, height: 24, display: 'block', borderRadius: 4 }}
          />
        ) : (
          <span style={{
            width: 24, height: 24,
            display: 'grid', placeItems: 'center',
            borderRadius: 4,
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            fontSize: 13, fontWeight: 600,
          }}>
            {brand.name.charAt(0)}
          </span>
        )}
      </span>

      {/* Brand slot：品牌文字（展开态显示） */}
      <span slot="brand">{brand.name}</span>

      <div slot="pinned" className="sidebar-pinned-layout">
        {/* 顶部导航：无分组标签 */}
        <ve-sidebar-group label="">
          <ve-sidebar-item
            type="primary"
            selected={activePage === 'chat' && !activeHistoryId}
            onClick={() => {
              onNavigate?.('chat');
              onNewChat?.();
            }}
          >
            <ve-icon slot="prefix" name="message-circle-plus" size="20" />
            新对话
          </ve-sidebar-item>
          {capabilities.search && (
            <ve-sidebar-item
              type="primary"
              onClick={onSearchClick}
            >
              <ve-icon slot="prefix" name="search" size="20" />
              搜索
            </ve-sidebar-item>
          )}
          <ve-sidebar-item
            type="primary"
            selected={activePage === 'files'}
            onClick={() => onNavigate?.('files')}
          >
            <ve-icon slot="prefix" name="folder" size="20" />
            文件库
          </ve-sidebar-item>
        </ve-sidebar-group>

        {historyItems.length > 0 && (
          <>
            <div className="sidebar-history-pinned-label">历史会话</div>
            <div className="sidebar-history-scroll">
              <ve-sidebar-group className="history-sidebar-group">
                {historyItems.map((item) => {
                  const isActive = activeHistoryId === item.id;
                  return (
                    <ve-sidebar-item
                      key={item.id}
                      type="history"
                      selected={isActive}
                      active={isActive || undefined}
                      onClick={() => {
                        onNavigate?.('chat');
                        onHistoryClick?.(item.id);
                      }}
                      data-no-icon=""
                    >
                      <div className="history-row">
                        <span className="history-title">{item.title}</span>
                        {item.generating && (
                          <span className="history-status-dot generating" title="生成中..." />
                        )}
                        {item.justCompleted && !item.generating && (
                          <span className="history-status-dot completed" title="刚刚完成" />
                        )}
                        <ve-dropdown
                          className="history-more-dropdown"
                          trigger="click"
                          position="right-start"
                        >
                          <button
                            className="history-more-button"
                            type="button"
                            aria-label={`${item.title} 更多操作`}
                            slot="trigger"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <ve-icon name="more-horizontal" size="16" />
                          </button>
                          <HistoryDropdownItem
                            icon="archive"
                            onSelect={() => onHistoryArchive?.(item.id)}
                          >
                            归档
                          </HistoryDropdownItem>
                          <HistoryDropdownItem
                            icon="trash-03"
                            danger
                            onSelect={() => onHistoryDelete?.(item.id)}
                          >
                            删除
                          </HistoryDropdownItem>
                        </ve-dropdown>
                      </div>
                    </ve-sidebar-item>
                  );
                })}
              </ve-sidebar-group>
            </div>
          </>
        )}
      </div>

      {/* Footer slot：账户入口 + Popover */}
      <div slot="footer" ref={anchorRef} className="account-menu-anchor">
        <button
          className="user-entry"
          onClick={() => setPopoverOpen((v) => !v)}
          aria-label="打开账户菜单"
        >
          <ve-avatar
            className="user-entry-avatar"
            size="28"
            shape="circle"
          >
            {userName.charAt(0)}
          </ve-avatar>
          <span className="user-entry-label">{userName}</span>
        </button>

        {popoverOpen && (
          <div className="account-popover-card" role="menu">
            <div className="account-popover-profile">
              <ve-avatar
                className="account-popover-avatar"
                size="36"
                shape="circle"
              >
                {userName.charAt(0)}
              </ve-avatar>
              <div className="account-popover-profile-text">
                <strong>{userName}</strong>
                <span>个人工作区</span>
              </div>
            </div>
            <div className="account-popover-actions">
              <button className="account-popover-item" role="menuitem">
                <ve-icon name="user-02" />
                个人资料
              </button>
              <button
                className="account-popover-item"
                role="menuitem"
                onClick={() => {
                  setPopoverOpen(false);
                  onNavigate?.('settings');
                }}
              >
                <ve-icon name="settings" />
                设置
              </button>
              <button
                className="account-popover-item danger"
                role="menuitem"
              >
                <ve-icon name="log-out" />
                退出
              </button>
            </div>
          </div>
        )}
      </div>
    </ve-sidebar>
  );
}
