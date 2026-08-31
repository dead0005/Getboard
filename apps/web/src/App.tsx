import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { SyncPage } from './pages/SyncPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="sync" element={<SyncPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

