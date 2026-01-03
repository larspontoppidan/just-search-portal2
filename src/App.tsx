import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { UrlAction } from './types/UrlAction';
import {
  loadUrlActions,
  saveUrlActions,
  loadTheme,
  saveTheme,
  loadAlwaysNewTab,
  saveAlwaysNewTab,
} from './utils/storage';
import { DEFAULT_URL_ACTIONS } from './config/defaults';
import { EditActionModal } from './components/EditActionModal';
import { AboutModal } from './components/AboutModal';

// Generate a unique key for a button based on its properties
const getUrlActionKey = (urlAction: UrlAction, index: number): string => {
  return `${urlAction.supportsSearch() ? 'search' : 'link'}-${index}`;
};

const themeNames: string[] = ['light', 'ocean', 'dark'];
const themeIcons: string[] = ['☀️', '🌊', '🌙'];
const themeDefault: number = 2;

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [alwaysNewTab, setAlwaysNewTab] = useState(() => loadAlwaysNewTab());
  const [theme, setTheme] = useState<number>(() => {
    const stored = loadTheme();
    if (stored && stored < themeNames.length) return stored;
    return themeDefault;
  });
  // Load URL actions from storage synchronously during initial render
  const [urlActions, setUrlActions] = useState<UrlAction[]>(() => {
    const stored = loadUrlActions();
    if (stored) {
      return stored;
    }
    return DEFAULT_URL_ACTIONS;
  });
  const [searchText, setSearchText] = useState(() => {
    // Check URL fragment for initial search query (e.g., #query=searchTerms)
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const query = params.get('query');
      if (query) {
        return decodeURIComponent(query);
      }
    }
    return '';
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUrlAction, setEditingUrlAction] = useState<UrlAction | null>(
    null
  );
  const [isSearchAction, setIsSearchAction] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const isDraggingRef = useRef(false);
  const isFirstRender = useRef(true);

  // Save URL actions to storage whenever they change (skip initial render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveUrlActions(urlActions);
  }, [urlActions]);

  // Save theme preference to localStorage
  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  // Save alwaysNewTab preference to localStorage
  useEffect(() => {
    saveAlwaysNewTab(alwaysNewTab);
  }, [alwaysNewTab]);

  // Apply theme to the document root (used by CSS variables in index.css)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 0) {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = themeNames[theme];
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev + 1) % themeNames.length);

  // Safety: Reset drag state on mouseup in case drag events don't fire properly
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current && draggedIndex === null) {
        // Drag ref is stuck but no actual drag is happening - reset it
        isDraggingRef.current = false;
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [draggedIndex]);

  const toggleEditMode = () => {
    // Reset drag state when toggling edit mode
    isDraggingRef.current = false;
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsEditMode(!isEditMode);
  };

  const handleUrlActionClick = useCallback(
    (urlAction: UrlAction, e: React.MouseEvent) => {
      // Don't handle click if we just finished dragging
      if (isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // In edit mode, open the modal for editing instead of navigating
      if (isEditMode) {
        e.preventDefault();
        e.stopPropagation();
        setIsSearchAction(urlAction.supportsSearch());
        setEditingUrlAction(urlAction);
        setIsEditOpen(true);
        return;
      }

      // Navigate to the URL
      const url = urlAction.makeUrl(searchText);
      if (url !== null) {
        if (alwaysNewTab) {
          window.open(url, '_blank');
        } else {
          window.location.href = url;
        }
      }
    },
    [isEditMode, searchText, alwaysNewTab]
  );

  // Handle middle-click (auxiliary click) to open in new tab
  const handleUrlActionAuxClick = useCallback(
    (urlAction: UrlAction, e: React.MouseEvent) => {
      // Only handle middle-click (button 1)
      if (e.button !== 1) return;

      // Don't handle click if we just finished dragging or in edit mode
      if (isDraggingRef.current || isEditMode) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      e.preventDefault();

      // Open in new tab for middle-click
      const url = urlAction.makeUrl(searchText);
      if (url !== null) {
        window.open(url, '_blank');
      }
    },
    [isEditMode, searchText]
  );

  const handleDeleteButton = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setUrlActions((prevActions) => prevActions.filter((_, i) => i !== index));
    },
    []
  );

  const handleDragStart = useCallback(
    (index: number, e: React.DragEvent) => {
      if (!isEditMode) {
        e.preventDefault();
        return;
      }
      isDraggingRef.current = true;
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
      // Set a drag image to improve visual feedback
      if (e.currentTarget instanceof HTMLElement) {
        e.dataTransfer.setDragImage(e.currentTarget, 60, 60);
      }
    },
    [isEditMode]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    // Reset isDragging after a short delay to prevent click from firing
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  }, []);

  const handleDragOver = useCallback(
    (targetIndex: number, targetForSearch: boolean, e: React.DragEvent) => {
      e.preventDefault();
      if (!isEditMode || draggedIndex === null || draggedIndex === targetIndex)
        return;

      // Only allow drag over if buttons are in the same category
      const draggedButton = urlActions[draggedIndex];
      if (!draggedButton || draggedButton.supportsSearch() !== targetForSearch)
        return;

      e.dataTransfer.dropEffect = 'move';
      setDragOverIndex(targetIndex);
    },
    [isEditMode, draggedIndex, urlActions]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear if we're leaving the element entirely (not entering a child)
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverIndex(null);
    }
  }, []);

  const handleDrop = useCallback(
    (dropIndex: number, dropForSearch: boolean, e: React.DragEvent) => {
      e.preventDefault();

      if (!isEditMode || draggedIndex === null || draggedIndex === dropIndex) {
        setDragOverIndex(null);
        return;
      }

      const draggedButton = urlActions[draggedIndex];
      if (!draggedButton || draggedButton.supportsSearch() !== dropForSearch) {
        setDragOverIndex(null);
        return;
      }

      setUrlActions((prevActions) => {
        const newActions = [...prevActions];
        const [removed] = newActions.splice(draggedIndex, 1);
        newActions.splice(dropIndex, 0, removed);
        return newActions;
      });

      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [isEditMode, draggedIndex, urlActions]
  );

  const handleAddButton = (forSearch: boolean) => {
    setIsSearchAction(forSearch);
    setEditingUrlAction(null);
    setIsEditOpen(true);
  };

  const handleSaveUrlAction = (newUrlAction: UrlAction) => {
    if (editingUrlAction) {
      // Update existing action
      setUrlActions((prevActions) =>
        prevActions.map((urlact) =>
          urlact === editingUrlAction ? newUrlAction : urlact
        )
      );
    } else {
      // Add new action
      setUrlActions((prevActions) => [...prevActions, newUrlAction]);
    }
  };

  const handleCloseModal = () => {
    setIsEditOpen(false);
    setEditingUrlAction(null);
    // Reset drag state to ensure buttons remain clickable after modal closes
    isDraggingRef.current = false;
  };

  // Handle Enter key in search input - trigger first search URL action
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isEditMode && searchText.trim()) {
      const firstUrlAction = urlActions.find((urlact) =>
        urlact.supportsSearch()
      );
      if (firstUrlAction) {
        const url = firstUrlAction.makeUrl(searchText);
        if (url !== null) {
          if (alwaysNewTab) {
            window.open(url, '_blank');
          } else {
            window.location.href = url;
          }
        }
      }
    }
  };

  // Track which search button index we're on (for identifying the first/default one)
  let searchButtonIndex = 0;

  return (
    <div className="app">
      {/* Search Section */}
      <div className="search-section">
        <h1 className="search-title">SEARCH</h1>
        <input
          type="text"
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Enter your search query..."
          autoComplete="off"
        />
        <div className="button-container search-buttons">
          {urlActions.map((urlact, index) => {
            if (!urlact.supportsSearch()) return null;
            const isDefault = searchButtonIndex === 0;
            searchButtonIndex++;
            return (
              <div
                key={getUrlActionKey(urlact, index)}
                className={`button-wrapper ${isEditMode ? 'editable' : ''} ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(index, e)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(index, true, e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(index, true, e)}
              >
                <div
                  className={`square-button ${isDefault ? 'default-button' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleUrlActionClick(urlact, e)}
                  onAuxClick={(e) => handleUrlActionAuxClick(urlact, e)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    handleUrlActionClick(
                      urlact,
                      e as unknown as React.MouseEvent
                    )
                  }
                  title={urlact.searchUrl}
                >
                  {isEditMode && (
                    <span
                      className="delete-button"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleDeleteButton(index, e)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        handleDeleteButton(
                          index,
                          e as unknown as React.MouseEvent
                        )
                      }
                      title="Delete button"
                      aria-label="Delete button"
                    >
                      ×
                    </span>
                  )}
                  {urlact.makeIcon()}
                  <span className="button-description">
                    {urlact.description}
                  </span>
                </div>
              </div>
            );
          })}
          {isEditMode && (
            <div className="button-wrapper">
              <button
                className="square-button add-button"
                type="button"
                title="Add new search button"
                onClick={() => handleAddButton(true)}
              >
                <span className="plus-icon">+</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="section-spacer"></div>

      {/* Links Section */}
      <div className="links-section">
        <h1 className="search-title">LINKS</h1>
        <div className="button-container link-buttons">
          {urlActions.map((urlact, index) => {
            if (urlact.supportsSearch()) return null;
            return (
              <div
                key={getUrlActionKey(urlact, index)}
                className={`button-wrapper ${isEditMode ? 'editable' : ''} ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(index, e)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(index, false, e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(index, false, e)}
              >
                <div
                  className="square-button"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleUrlActionClick(urlact, e)}
                  onAuxClick={(e) => handleUrlActionAuxClick(urlact, e)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    handleUrlActionClick(
                      urlact,
                      e as unknown as React.MouseEvent
                    )
                  }
                  title={urlact.url}
                >
                  {isEditMode && (
                    <span
                      className="delete-button"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleDeleteButton(index, e)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        handleDeleteButton(
                          index,
                          e as unknown as React.MouseEvent
                        )
                      }
                      title="Delete button"
                      aria-label="Delete button"
                    >
                      ×
                    </span>
                  )}
                  {urlact.makeIcon()}
                  <span className="button-description">
                    {urlact.description}
                  </span>
                </div>
              </div>
            );
          })}
          {isEditMode && (
            <div className="button-wrapper">
              <button
                className="square-button add-button"
                type="button"
                title="Add new link button"
                onClick={() => handleAddButton(false)}
              >
                <span className="plus-icon">+</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-left">
          <span className="footer-text">
            JUST SEARCH PORTAL v{__APP_VERSION__}
          </span>
          <button
            className="footer-link"
            type="button"
            onClick={() => setIsAboutOpen(true)}
          >
            ReadMe
          </button>
          <a
            className="footer-link"
            href={__APP_GITHUB_URL__}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <div className="footer-actions">
          <label
            className="footer-toggle"
            title={isEditMode ? 'Exit edit mode' : 'Enter edit mode'}
          >
            <span className="footer-toggle-label">Edit</span>
            <input
              type="checkbox"
              checked={isEditMode}
              onChange={toggleEditMode}
            />
            <span className="footer-toggle-track"></span>
          </label>
          <label
            className="footer-toggle"
            title="Enable to always open in new tab (otherwise use middle-click)"
          >
            <span className="footer-toggle-label">New tab</span>
            <input
              type="checkbox"
              checked={alwaysNewTab}
              onChange={() => setAlwaysNewTab(!alwaysNewTab)}
            />
            <span className="footer-toggle-track"></span>
          </label>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            title="Click to change theme"
            aria-label={`Theme: ${themeNames[theme]}`}
          >
            {themeIcons[theme]}
          </button>
        </div>
      </footer>

      <EditActionModal
        isOpen={isEditOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUrlAction}
        editingAction={editingUrlAction}
        isSearchAction={isSearchAction}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default App;
