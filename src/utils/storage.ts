import { UrlAction } from '../types/UrlAction';

const STORAGE_KEY = 'jsp_url_actions';
const THEME_KEY = 'jsp_theme';
const NEW_TAB_KEY = 'jsp_new_tab';

/**
 * Saves URL actions to local storage
 */
export function saveUrlActions(urlActions: UrlAction[]): void {
  try {
    const serialized = JSON.stringify(
      urlActions.map((urlact) => urlact.toObject())
    );
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save URL actions to local storage:', error);
  }
}

/**
 * Loads URL actions from local storage
 * Returns null if no data exists or if there's an error
 */
export function loadUrlActions(): UrlAction[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return null;
    }

    const urlActions = parsed.map((obj) => UrlAction.fromObject(obj));
    return urlActions;
  } catch (error) {
    console.error('Failed to load URL actions from local storage:', error);
    return null;
  }
}

export function saveTheme(theme: number): void {
  localStorage.setItem(THEME_KEY, theme.toString());
}

export function loadTheme(): number | undefined {
  const stored = localStorage.getItem(THEME_KEY);
  if (!stored) {
    return undefined;
  }
  return parseInt(stored);
}

export function saveAlwaysNewTab(value: boolean): void {
  localStorage.setItem(NEW_TAB_KEY, value ? '1' : '0');
}

export function loadAlwaysNewTab(): boolean {
  return localStorage.getItem(NEW_TAB_KEY) === '1';
}
