// Service Worker Registration for Rider PWA
export const registerRiderServiceWorker = () => {
  if ('serviceWorker' in navigator && window.location.pathname.startsWith('/rider')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/rider-service-worker.js')
        .then(registration => {
          console.log('Rider Service Worker registered: ', registration);
          
          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the updated precached content has been fetched,
                  // but the previous service worker will still serve the older
                  // content until all client tabs are closed.
                  console.log(
                    'New content is available and will be used when all tabs for this page are closed.'
                  );
                  
                  // Show update notification to the user
                  if (window.confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                } else {
                  // At this point, everything has been precached.
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
};

// Check if the app can be installed (PWA)
export const checkPwaInstallable = (setInstallPrompt) => {
  if (window.location.pathname.startsWith('/rider')) {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    });
  }
};

// Install PWA
export const installPwa = (installPrompt, setInstallPrompt) => {
  if (!installPrompt) return;
  
  // Show the install prompt
  installPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  installPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setInstallPrompt(null);
  });
};

// Check if the app is in standalone mode (installed PWA)
export const isPwaInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone || 
         document.referrer.includes('android-app://');
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};
