import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { NoteProvider } from './context/NoteContext'; 

// Check if we are in a production environment and if the browser supports service workers
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  // Register the service worker when the window is loaded
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js') // Ensure the service-worker.js is at the correct path
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <NoteProvider>
    <App />
    </NoteProvider>
  </StrictMode>,
);
