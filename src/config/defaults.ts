import { UrlAction } from '../types/UrlAction';

/**
 * URL action templates that can be used when adding a new
 */
export const URL_ACTION_TEMPLATES: UrlAction[] = [
  new UrlAction(
    'Google',
    'https://www.google.com', // 0
    'https://www.google.com/search?q={query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png'
  ),
  new UrlAction(
    'Google Maps',
    'https://maps.google.com', // 1
    'https://maps.google.com?q={query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/250px-Google_Maps_icon_%282020%29.svg.png'
  ),
  new UrlAction(
    'Google Images',
    'https://images.google.com', // 2
    'https://www.google.com/search?tbm=isch&q={query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Google_Photos_icon_%282020-2025%29.svg/250px-Google_Photos_icon_%282020-2025%29.svg.png'
  ),
  new UrlAction(
    'Google Translate',
    'https://translate.google.com', // 3
    'https://translate.google.com/#auto/en/{query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/250px-Google_Translate_logo.svg.png'
  ),
  new UrlAction(
    'Wikipedia',
    'https://www.wikipedia.org', // 4
    'https://en.wikipedia.org/w/index.php?search={query}',
    'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/120px-Wikipedia-logo-v2.svg.png'
  ),
  new UrlAction(
    'DuckDuckGo',
    'https://duckduckgo.com', // 5
    'https://duckduckgo.com/?q={query}',
    'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/The_DuckDuckGo_Duck.png/250px-The_DuckDuckGo_Duck.png'
  ),
  new UrlAction(
    'Perplexity',
    'https://www.perplexity.ai', // 6
    'https://www.perplexity.ai/search?q={query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Perplexity_AI_Turquoise_on_White.png/250px-Perplexity_AI_Turquoise_on_White.png'
  ),
  new UrlAction(
    'Bing',
    'https://www.bing.com', // 7
    'https://www.bing.com/search?q={query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bing_Fluent_Logo.svg/250px-Bing_Fluent_Logo.svg.png'
  ),
  new UrlAction(
    'Facebook',
    'https://www.facebook.com', // 8
    'https://www.facebook.com/search/results/?q={query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/250px-Facebook_f_logo_%282019%29.svg.png'
  ),
  new UrlAction(
    'Stack Overflow',
    'https://stackoverflow.com', // 9
    'https://stackoverflow.com/search?q={query}',
    'https://stackoverflow.com/apple-touch-icon.png'
  ),
  new UrlAction(
    'Reddit',
    'https://www.reddit.com', // 10
    'https://www.reddit.com/search?q={query}',
    'https://www.reddit.com/favicon.ico'
  ),
  new UrlAction(
    'YouTube',
    'https://www.youtube.com', // 11
    'https://www.youtube.com/results?search_query={query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/330px-YouTube_full-color_icon_%282017%29.svg.png'
  ),
  new UrlAction(
    'Medium',
    'https://www.medium.com', // 12
    'https://www.medium.com/search?q={query}',
    'M'
  ),
  new UrlAction(
    'Spotify',
    'https://open.spotify.com', // 13
    'https://open.spotify.com/search/{query}',
    'https://open.spotify.com/favicon.ico'
  ),
  new UrlAction(
    'GitHub',
    'https://github.com', // 14
    'https://github.com/search?q={query}',
    'https://github.com/apple-touch-icon.png'
  ),
  new UrlAction('Open as URL', '', '{query-as-url}', ''), // 15
  new UrlAction(
    'Grokipedia',
    'https://grokipedia.com', // 16
    'https://grokipedia.com/search?q={query}',
    'https://grokipedia.com/favicon.ico'
  ),
  new UrlAction(
    'Google Scholar',
    'https://scholar.google.com', // 17
    'https://scholar.google.com/scholar?q={query}',
    'https://upload.wikimedia.org/wikipedia/commons/f/fe/Googlescholar.png'
  ),
  new UrlAction(
    'Wikimedia Commons',
    'https://commons.wikimedia.org', // 18
    'https://commons.wikimedia.org/w/index.php?search={query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Commons-logo.svg/250px-Commons-logo.svg.png'
  ),
  new UrlAction(
    'Thesaurus',
    'https://www.thesaurus.com', // 19
    'https://www.thesaurus.com/browse/{query}',
    '📕'
  ),
  new UrlAction(
    'ChatGPT',
    'https://chatgpt.com', // 20
    '',
    'https://chatgpt.com/favicon.ico'
  ),
  new UrlAction(
    'Qwant',
    'https://www.qwant.com', // 21
    'https://www.qwant.com/?q={query}',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Qwant-Icone-2022.svg/250px-Qwant-Icone-2022.svg.png'
  ),
  new UrlAction(
    'Rumble',
    'https://rumble.com', // 22
    'https://rumble.com/search/all?q={query}',
    'https://cdn.freelogovectors.net/wp-content/uploads/2023/05/rumble-logo-freelogovectors.net_.png'
  ),
];

/**
 * Default URL action configuration to use when no local storage data exists
 */
export const DEFAULT_URL_ACTIONS: UrlAction[] = [
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[5], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[7], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[0], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[1], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[2], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[3], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[4], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[6], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[10], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[15], true),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[8], false),
  UrlAction.fromUrlAction(URL_ACTION_TEMPLATES[13], false),
];
