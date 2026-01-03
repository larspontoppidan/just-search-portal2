import React from 'react';

/**
 * Represents a search portal button with URL, description, and icon URL
 */
export class UrlAction {
  constructor(
    public description: string,
    public url: string,
    public searchUrl: string,
    public iconUrl: string
  ) {}

  /**
   * Creates a UrlAction instance from a plain object
   */
  static fromObject(obj: {
    description: string;
    url: string;
    searchUrl: string;
    iconUrl: string;
  }): UrlAction {
    return new UrlAction(obj.description, obj.url, obj.searchUrl, obj.iconUrl);
  }

  static fromUrlAction(urlAction: UrlAction, with_search: boolean): UrlAction {
    if (!with_search) {
      return new UrlAction(
        urlAction.description,
        urlAction.url,
        '',
        urlAction.iconUrl
      );
    }
    return urlAction;
  }

  /**
   * Converts the UrlAction to a plain object for JSON serialization
   */
  toObject(): {
    description: string;
    url: string;
    searchUrl: string;
    iconUrl: string;
  } {
    return {
      description: this.description,
      url: this.url,
      searchUrl: this.searchUrl,
      iconUrl: this.iconUrl,
    };
  }

  supportsSearch(): boolean {
    return this.searchUrl !== '';
  }

  supportsLink(): boolean {
    return this.url !== '';
  }

  makeUrl(searchText: string): string | null {
    if (this.supportsSearch()) {
      let search_trim = searchText.trim();
      if (search_trim) {
        // Handle query-as-url special case
        if (this.searchUrl == '{query-as-url}') {
          // Add https:// if no protocol is present
          if (!search_trim.match(/^[a-zA-Z]+:\/\//)) {
            search_trim = 'https://' + search_trim;
          }
          return search_trim;
        } else {
          // For search actions, replace {query} placeholder with the encoded search text
          return this.searchUrl.replace(
            '{query}',
            encodeURIComponent(search_trim)
          );
        }
      } else if (this.url !== '') {
        // No search terms. If the action has a non-search URL, open it.
        return this.url;
      }
      // No search terms and no URL, return null
      return null;
    } else {
      // For regular link actions, just open the URL
      return this.url;
    }
  }

  /**
   * Renders an icon element based on iconUrl and description.
   * Static version that can be used without a UrlAction instance.
   */
  static renderIcon(iconUrl: string, description: string): React.ReactElement {
    return (
      <div className="icon-tile">
        {iconUrl ? (
          iconUrl.length <= 2 ? (
            <span className="button-icon-placeholder" aria-hidden="true">
              {iconUrl}
            </span>
          ) : (
            <img
              src={iconUrl}
              alt={description}
              className="button-icon-image"
              draggable={false}
            />
          )
        ) : (
          <span className="button-icon-placeholder" aria-hidden="true">
            🔗
          </span>
        )}
      </div>
    );
  }

  /**
   * Renders the icon for this UrlAction
   */
  makeIcon(): React.ReactElement {
    return UrlAction.renderIcon(this.iconUrl, this.description);
  }
}
