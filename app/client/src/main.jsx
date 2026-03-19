import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './Router.jsx';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </StrictMode>,
);
