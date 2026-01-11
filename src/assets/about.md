# Description

[Just Search Portal](https://justsearchportal.com) is an [open-source](https://github.com/larspontoppidan/just-search-portal2.git) New Tab page providing easy access to search engines and websites. It was built to respect the user:

**No distractions**. The search bar does not show search suggestions while the query is being typed. This is intentional. When suggestions are shown, they steer the user toward the preferences of an algorithm, obscuring the original search intent. Just Search Portal will not distract the user and will never show ads or add unwanted links.

**Privacy**. The search query is not sent anywhere except to the chosen search engine. This means the user is in full control of where their data goes.

**Customizable**. The links and search engines are fully customizable. Templates are provided for easy configuration of common engines and web-sites.

**Efficiency**. The portal is lightweight and contained in a single HTML file that doesn’t download external dependencies making the loading time as fast as possible. Icons are cached locally using a service worker.

# Hints

Pressing Enter from the search bar will use the default search engine, which is the leftmost icon.

Enable "NEW TAB" toggle to always open search engines and websites in new tabs. If disabled, middle-click will open in new tab and left-click will open in the same tab.

The "Open as URL" search action will not perform a search but open the query as an URL.

The "Icon URL or text" field supports URLs to image assets, which are cached locally. Inline images are supported, eg. `data:image/webp;base64,UklGRs...`. If up to three characters are provided, they will be shown as the icon. This may be used with graphical Unicode symbols. The "Auto" button will attempt to find an `apple-touch-icon.png` or a `favicon.ico` to use, from the provided "Search URL".

# Installing as a New Tab page

## Firefox

1. Click the top-right menu and select: "Settings"
2. Select "Home" at the left
3. For "Homepage and new windows" choose: "Custom URLs..." and enter: `https://justsearchportal.com/` 
4. Install an extension to control the new tab page, like the one named: New Tab Override
5. Configure the extension to use the home page as the new tab page


# Installing the search plugin

Just Search Portal provides an [OpenSearch plugin](https://en.wikipedia.org/wiki/OpenSearch_(specification)) for integration with the search menu in browsers. The plugin uses URL fragment to transfer search terms meaning the search terms will not be sent over the net to the server hosting the portal, they stay client only. This is explained in more detail [here](https://larsee.com/blog/2018/02/passing-url-parameters-client-only/).

## Firefox

1. Right-click at the right of the URL bar and select: "Customize Toolbar..."
2. Drag the Search bar widget to the right of the URL bar.
3. Navigate to https://justsearchportal.com
4. Click the magnifier glass in the search bar widget.
5. In the popup click the magnifier glass with a plus that says: Add search engine "Just Search Portal"
6. In the popup click the settings wheel. Select "Just Search Portal" as the default search engine.

# About

The first version of Just Search Portal was written by Lars Ole Pontoppidan in 2018. It featured many of the same ideas, but it didn't allow adding custom search engines, and it didn't have a links section. It was written in vanilla js with custom tooling and can be found on Github [here](https://github.com/larspontoppidan/just-search-portal).

The current version, v2, is a complete rewrite using React and TypeScript built with Vite. See the source and documentation on [Github](https://github.com/larspontoppidan/just-search-portal2). LLMs were used to assist in the development of this version.

The domain https://justsearchportal.com is managed by Lars Ole Pontoppidan and hosts stable builds of the v2 portal.

Read more about Just Search Portal [here](https://larsee.com/blog/tag/just-search-portal.html).

Contact: contact@justsearchportal.com

