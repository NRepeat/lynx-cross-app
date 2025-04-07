import { root } from '@lynx-js/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App.jsx';
import Home from './components/Home/Home.jsx';
import MainLayout from './components/Layouts/Main.jsx';
import Wods from './components/Wods/Wods.jsx';

const queryClient = new QueryClient();

root.render(
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Wods />} />
          <Route path="/wods" element={<Wods />} />
          <Route path="/homee" element={<App />} />
          <Route path="/workout/:id" element={<Home />} />
        </Routes>
      </MainLayout>
    </QueryClientProvider>
  </MemoryRouter>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
