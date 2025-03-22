import { root } from '@lynx-js/react';
import { MemoryRouter, Routes, Route } from 'react-router';

import Home from './components/Home/Home.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/Layouts/Main.jsx';
import Wods from './components/Wods/Wods.jsx';
import { App } from './App.jsx';

const queryClient = new QueryClient();

root.render(
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Wods />} />
          <Route path="/wods" element={<Wods />} />
          <Route path="/homee" element={<App />} />
        </Routes>
      </MainLayout>
    </QueryClientProvider>
  </MemoryRouter>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
