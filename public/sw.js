self.addEventListener("fetch", (event) => {
  if (event.request.destination === "image") {
    const url = new URL(event.request.url);
    // Bypass cache if _nocache parameter is present
    if (url.searchParams.has("_nocache")) {
      return; // Let browser handle normally
    }

    event.respondWith(
      caches.open("icon-cache").then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      })
    );
  }
});

