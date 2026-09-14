(() => {
  const SW_VERSION = 'shell-v13-private-vary-range-safe';
  const installButton = document.getElementById('installAppBtn');
  let deferredPrompt = null;

  const canRegister = location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname);
  if ('serviceWorker' in navigator && canRegister) {
    window.addEventListener('load', () => {
      const hadController = Boolean(navigator.serviceWorker.controller);
      let reloading = false;

      navigator.serviceWorker.register(`./sw.js?v=${SW_VERSION}`, { updateViaCache: 'none' })
        .then((registration) => {
          registration.update().catch(() => {});

          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              registration.update().catch(() => {});
            }
          });

          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!hadController || reloading) return;
            reloading = true;
            window.location.reload();
          });
        })
        .catch((error) => console.warn('PWA service worker registration failed', error));
    });
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (installButton) installButton.hidden = false;
  });

  installButton?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    installButton.disabled = true;
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      deferredPrompt = null;
      installButton.hidden = true;
      installButton.disabled = false;
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installButton) installButton.hidden = true;
  });
})();
