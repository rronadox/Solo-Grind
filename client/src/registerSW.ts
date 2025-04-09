
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      } catch (error) {
        console.error('ServiceWorker registration failed: ', error);
      }
    });
  }
}
