import { useState, useEffect, useRef } from 'react';
import { UrlAction } from '../types/UrlAction';
import { URL_ACTION_TEMPLATES } from '../config/defaults';
import '../styles/modal.css';
import './EditActionModal.css';

// Add cache-busting parameter to bypass service worker cache
function withNocache(url: string): string {
  // Skip _nocache if url contains text or data URIs
  if (!url || url.length <= 2 || url.startsWith('data')) return url;
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('_nocache', Date.now().toString());
    return urlObj.toString();
  } catch {
    return url;
  }
}

interface EditActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (urlAction: UrlAction) => void;
  editingAction?: UrlAction | null;
  isSearchAction: boolean;
}

export function EditActionModal({
  isOpen,
  onClose,
  onSave,
  editingAction,
  isSearchAction,
}: EditActionModalProps) {
  const [url, setUrl] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [isFindingIcon, setIsFindingIcon] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [previewIconUrl, setPreviewIconUrl] = useState('');
  const debounceTimerRef = useRef<number | null>(null);

  // Reset form when modal opens/closes or initialButton changes
  useEffect(() => {
    if (isOpen) {
      if (editingAction) {
        setUrl(editingAction.url);
        setSearchUrl(editingAction.searchUrl);
        setDescription(editingAction.description);
        setIconUrl(editingAction.iconUrl);
        setPreviewIconUrl(withNocache(editingAction.iconUrl));
        setSelectedTemplate('');
      } else {
        setUrl('');
        setSearchUrl('');
        setDescription('');
        setIconUrl('');
        setPreviewIconUrl('');
        setSelectedTemplate('');
      }
    }
    // Clear debounce timer on close
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isOpen, editingAction]);

  let templates: UrlAction[] = [];
  if (isSearchAction) {
    templates = URL_ACTION_TEMPLATES.filter((urlact) =>
      urlact.supportsSearch()
    );
  } else {
    templates = URL_ACTION_TEMPLATES.filter((urlact) => urlact.supportsLink());
  }

  // Sort templates by description (title)
  templates = templates
    .slice()
    .sort((a, b) => a.description.localeCompare(b.description));

  const handleTemplateSelect = (templateIndex: string) => {
    if (templateIndex === '') {
      return;
    }
    const template = templates[parseInt(templateIndex)];
    if (template) {
      setUrl(template.url);
      setSearchUrl(template.searchUrl);
      setDescription(template.description);
      setIconUrl(template.iconUrl);
      setPreviewIconUrl(withNocache(template.iconUrl));
      setSelectedTemplate(templateIndex);
    }
  };

  const getModalTitle = () => {
    if (editingAction) {
      return isSearchAction ? 'Edit Search Action' : 'Edit Link Action';
    }
    return isSearchAction ? 'Add Search Action' : 'Add Link Action';
  };

  // Handle manual icon URL changes with debounce
  const handleIconUrlChange = (newIconUrl: string) => {
    setIconUrl(newIconUrl);

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer for 1.5 seconds
    debounceTimerRef.current = window.setTimeout(() => {
      setPreviewIconUrl(withNocache(newIconUrl));
    }, 1500);
  };

  const handleFindIcon = async () => {
    if (!url.trim() && !searchUrl.trim()) {
      return;
    }

    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsFindingIcon(true);

    const iconUrls: string[] = [];

    try {
      let tempUrl = url.trim() || searchUrl.trim();

      // Add https:// if no protocol is present
      if (!tempUrl.match(/^[a-zA-Z]+:\/\//)) {
        tempUrl = 'https://' + tempUrl;
        setUrl(tempUrl); // Update the URL input field
      }

      while (tempUrl.endsWith('/')) {
        tempUrl = tempUrl.slice(0, -1);
      }
      const urlObj = new URL(tempUrl);
      if (urlObj.pathname != '/') {
        iconUrls.push(
          `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}/apple-touch-icon.png`,
          `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}/favicon.ico`
        );
      }
      iconUrls.push(
        `${urlObj.protocol}//${urlObj.host}/apple-touch-icon.png`,
        `${urlObj.protocol}//${urlObj.host}/favicon.ico`
      );
      console.log(iconUrls.toString());
    } catch {
      // If URL parsing fails, show error
      setIconUrl('');
      setPreviewIconUrl('');
      setIsFindingIcon(false);
      return;
    }

    // Use Image element to test if icon exists
    const testIcon = (iconUrl: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        let resolved = false;

        // Timeout after 3 seconds
        const timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(false);
          }
        }, 3000);

        img.onload = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            resolve(true);
          }
        };
        img.onerror = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            resolve(false);
          }
        };
        img.src = withNocache(iconUrl);
      });
    };

    for (const testIconUrl of iconUrls) {
      const exists = await testIcon(testIconUrl);
      if (exists) {
        setIconUrl(testIconUrl);
        setPreviewIconUrl(withNocache(testIconUrl));
        setIsFindingIcon(false);
        return;
      }
    }

    // If all attempts fail, clear icon URL and show error
    setIconUrl('');
    setPreviewIconUrl('');
    setIsFindingIcon(false);
  };

  const handleSave = () => {
    if ((!url.trim() && !searchUrl.trim()) || !description.trim()) {
      return;
    }

    const urlAction = new UrlAction(
      description.trim(),
      url.trim(),
      isSearchAction ? searchUrl.trim() : '',
      iconUrl.trim()
    );
    onSave(urlAction);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="modal-title">{getModalTitle()}</h2>

        <div className="modal-form">
          <div className="modal-templates">
            <div className="form-group">
              <label htmlFor="template-select">Templates</label>
              <select
                id="template-select"
                className="form-input"
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
              >
                <option value="">Select a template...</option>
                {templates.map((template, index) => (
                  <option key={index} value={index.toString()}>
                    {template.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description-input">Description</label>
            <input
              id="description-input"
              type="text"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Action description"
              autoFocus
            />
          </div>

          {isSearchAction && (
            <div className="form-group">
              <label htmlFor="search-url-input">Search URL</label>
              <input
                id="search-url-input"
                type="text"
                className="form-input"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                placeholder="https://example.com/search?q={query}"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="url-input">
              {isSearchAction ? 'No-search URL (optional)' : 'URL'}
            </label>
            <input
              id="url-input"
              type="text"
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="icon-url-input">Icon URL or text</label>
            <div className="form-input-with-button">
              <input
                id="icon-url-input"
                type="text"
                className="form-input"
                value={iconUrl}
                onChange={(e) => handleIconUrlChange(e.target.value)}
                placeholder="https://example.com/favicon.ico"
              />
              <button
                type="button"
                className="modal-button modal-button-sm"
                onClick={handleFindIcon}
                disabled={isFindingIcon}
                title="Try to find icon automatically"
              >
                Auto
              </button>
            </div>
            <div className="icon-preview">
              {UrlAction.renderIcon(previewIconUrl, '')}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-button modal-button-primary"
            onClick={handleSave}
            disabled={
              !description.trim() ||
              (isSearchAction && !searchUrl.trim()) ||
              (!isSearchAction && !url.trim())
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
