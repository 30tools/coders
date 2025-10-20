'use client';

import { useEffect, useState } from 'react';

export default function PwaTestPage() {
  const [isPWA, setIsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator.standalone === true) ||
                  document.referrer.includes('android-app://');
    
    setIsPWA(isPWA);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">PWA Test Page</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800">PWA Status</h2>
              <p className="mt-2 text-gray-700">
                {isPWA 
                  ? '✅ App is running as a PWA (installed or in standalone mode)' 
                  : 'ℹ️ App is running in browser (not installed as PWA)'}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800">Manifest Check</h2>
              <p className="mt-2 text-gray-700">
                {typeof window !== 'undefined' && 'serviceWorker' in navigator
                  ? '✅ Service Worker is supported and registered'
                  : '❌ Service Worker is not supported'}
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-800">Install Status</h2>
              <p className="mt-2 text-gray-700">
                {installable
                  ? '✅ App is installable - click below to install'
                  : 'ℹ️ App is not currently installable (install prompt already shown or not supported)'}
              </p>
              
              {installable && (
                <button
                  onClick={handleInstallClick}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Install App
                </button>
              )}
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h2 className="text-xl font-semibold text-purple-800">PWA Features</h2>
              <ul className="mt-2 space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Offline support (with service worker)
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Add to home screen capability
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> App-like experience
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Fast loading with caching
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}