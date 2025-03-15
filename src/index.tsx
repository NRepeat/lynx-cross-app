import { root } from '@lynx-js/react';
import { MemoryRouter, Routes, Route } from 'react-router';

import { App } from './App.jsx';
import Home from './components/Home/Home.jsx';

root.render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<App />} />
    </Routes>
  </MemoryRouter>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
