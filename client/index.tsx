import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';

// Get the root element from the DOM and ensure it is not null
const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  // Initial render
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </BrowserRouter>
  );
} else {
  console.error('Root element not found');
}
