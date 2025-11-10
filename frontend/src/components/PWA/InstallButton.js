import React from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [canInstall, setCanInstall] = React.useState(false);
  const [installed, setInstalled] = React.useState(false);

  React.useEffect(() => {
    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    }
    function onAppInstalled() {
      setInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
      }
    } finally {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  }

  if (installed || !canInstall) return null;

  return (
    <button
      onClick={handleInstall}
      className="rounded-md border border-indigo-500 px-3 py-1.5 text-xs font-medium text-indigo-500 hover:bg-indigo-500/10"
    >
      Add to screen
    </button>
  );
}


