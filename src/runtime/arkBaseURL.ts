export const DEFAULT_ARK_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';

export function normalizeArkBaseURL(baseURL?: string) {
  return (baseURL?.trim() || DEFAULT_ARK_BASE_URL)
    .replace(/\/+$/, '')
    .replace(/\/chat\/completions$/i, '')
    .replace(/\/sessions(?:\/.*)?$/i, '');
}
