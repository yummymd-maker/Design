import { useMemo, useRef, useState } from 'react';
import {
  loadLibraryFiles,
  saveLibraryFiles,
  type LibraryFile,
} from '../runtime/fileLibraryStore';
import {
  defaultSecuritySettings,
  validateUploadFiles,
  type RuntimeSecuritySettings,
  type SecurityNotice,
} from '../runtime/security';

const fileFilterOptions = [
  ['all', '全部'],
  ['document', '文档'],
  ['image', '图片'],
  ['data', '数据'],
] as const;

function formatSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getFileIcon(type: string, name: string) {
  if (type.includes('pdf') || name.endsWith('.pdf')) return 'type-pdf-state-default';
  if (type.includes('image')) return 'type-image-state-default';
  if (type.includes('spreadsheet') || name.endsWith('.xlsx') || name.endsWith('.csv')) return 'type-chart-state-default';
  if (type.includes('zip') || name.endsWith('.zip')) return 'file-attachment';
  return 'unknown-file';
}

export interface FileLibraryViewProps {
  securitySettings?: RuntimeSecuritySettings;
  onSecurityNotice?: (notice: SecurityNotice) => void;
}

export function FileLibraryView({
  securitySettings = defaultSecuritySettings,
  onSecurityNotice,
}: FileLibraryViewProps) {
  const [files, setFiles] = useState<LibraryFile[]>(() => loadLibraryFiles());
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'document' | 'image' | 'data'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return files.filter((file) => {
      const byKeyword = !keyword || file.name.toLowerCase().includes(keyword);
      const byType =
        filter === 'all' ||
        (filter === 'image' && file.type.includes('image')) ||
        (filter === 'data' && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) ||
        (filter === 'document' && !file.type.includes('image') && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx'));
      return byKeyword && byType;
    });
  }, [files, query, filter]);

  const updateFiles = (nextFiles: LibraryFile[]) => {
    setFiles(nextFiles);
    saveLibraryFiles(nextFiles);
  };

  const handleUpload = (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return;
    const filesToUpload = Array.from(selectedFiles);
    const notice = validateUploadFiles(filesToUpload, securitySettings);
    if (notice) {
      onSecurityNotice?.(notice);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    const next = filesToUpload.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      createdAt: new Date().toISOString(),
      status: 'ready' as const,
    }));
    updateFiles([...next, ...files]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const markIndexed = (id: string) => {
    updateFiles(files.map((file) => (file.id === id ? { ...file, status: 'indexed' } : file)));
  };

  const removeFile = (id: string) => {
    updateFiles(files.filter((file) => file.id !== id));
  };

  return (
    <div className="main-panel feature-panel">
      <div className="feature-container management-container">
        <div className="page-header">
          <div>
            <h2>文件库</h2>
            <span>管理本地工作区资料，当前共 {files.length} 个文件。</span>
          </div>
          <div className="header-actions">
            <div className="feature-search native-search">
              <ve-icon name="search" size="16" />
              <input
                value={query}
                placeholder="搜索文件名"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <ve-button type="primary" onClick={() => inputRef.current?.click()}>
              上传文件
            </ve-button>
            <input
              ref={inputRef}
              className="file-input-hidden"
              type="file"
              multiple
              onChange={(event) => handleUpload(event.target.files)}
            />
          </div>
        </div>

        <div className="file-library-list-header">
          <div className="list-header">文件列表</div>
          <div className="file-library-filter-slot">
            <ve-tabs
              className="file-filter-tabs"
              value={filter}
              active-key={filter}
              aria-label="文件类型筛选"
            >
              {fileFilterOptions.map(([value, label]) => (
                <ve-tab
                  key={value}
                  value={value}
                  selected={filter === value}
                  data-active={filter === value ? 'true' : undefined}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </ve-tab>
              ))}
            </ve-tabs>
          </div>
        </div>

        {filteredFiles.length > 0 ? (
          <div className="file-table">
            {filteredFiles.map((file) => (
              <div className="file-row" key={file.id}>
                <span className="file-icon">
                  <ve-icon name={getFileIcon(file.type, file.name)} size="28" />
                </span>
                <strong title={file.name}>{file.name}</strong>
                <span>{formatDate(file.createdAt)}</span>
                <span>{formatSize(file.size)}</span>
                <ve-dropdown trigger="click" position="bottom-end">
                  <button className="history-more-button visible" type="button" slot="trigger" aria-label={`${file.name} 更多操作`}>
                    <ve-icon name="more-horizontal" size="16" />
                  </button>
                  <ve-dropdown-item onClick={() => markIndexed(file.id)}>
                    <span className="account-menu-item">
                      <ve-icon name="sync" size="16" />
                      重新索引
                    </span>
                  </ve-dropdown-item>
                  <ve-dropdown-item onClick={() => removeFile(file.id)}>
                    <span className="account-menu-item danger">
                      <ve-icon name="trash-03" size="16" />
                      删除
                    </span>
                  </ve-dropdown-item>
                </ve-dropdown>
              </div>
            ))}
          </div>
        ) : (
          <div className="feature-empty">
            <ve-empty description="暂无文件，上传一个试试" />
          </div>
        )}
      </div>
    </div>
  );
}
