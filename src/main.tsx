import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handling to catch unhelpful "Script error." and provide more context
window.onerror = function(message, source, lineno, colno, error) {
  if (message === 'Script error.') {
    console.warn('Generic Script Error caught. This is likely a cross-origin issue or extension conflict.', { source, lineno });
    return true; // Prevent the error from bubbling up further if it's already masked
  }
  return false;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
