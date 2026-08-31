export interface LibraryFile {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  status: 'ready' | 'indexed';
}

const STORAGE_KEY = 'agent-template-file-library';

const seedFiles: LibraryFile[] = [
  {
    id: 'seed-1',
    name: '市场活动复盘.pdf',
    type: 'application/pdf',
    size: 1264000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    status: 'indexed',
  },
  {
    id: 'seed-2',
    name: '周会纪要.md',
    type: 'text/markdown',
    size: 18400,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    status: 'ready',
  },
];

export function loadLibraryFiles(): LibraryFile[] {
  if (typeof window === 'undefined') return seedFiles;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedFiles;
    return JSON.parse(raw) as LibraryFile[];
  } catch {
    return seedFiles;
  }
}

export function saveLibraryFiles(files: LibraryFile[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}
