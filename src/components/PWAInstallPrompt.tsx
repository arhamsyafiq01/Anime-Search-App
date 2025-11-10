import React, { useEffect, useState } from "react";

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log("Install outcome:", outcome);

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white shadow-xl p-5 w-[90%] max-w-md rounded-xl border border-gray-200">
      <div className="flex items-start gap-4">
        <img
          src="/image.png"
          alt="App icon"
          className="w-14 h-14 rounded-lg border shadow-sm"
        />

        <div className="flex-1 ">
          <h3 className="text-lg font-bold text-gray-800">
            Install Anime Search
          </h3>
          <p className="text-sm text-gray-600">
            Search for your favorite anime and view details
          </p>
        </div>

        <button
          className="text-gray-500 hover:text-gray-700 text-xl"
          onClick={handleClose}
        >
          ✕
        </button>
      </div>

      <button
        onClick={handleInstall}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700  p-2 rounded-lg text-center font-semibold"
      >
        Install App
      </button>
    </div>
  );
};

export default PWAInstallPrompt;
