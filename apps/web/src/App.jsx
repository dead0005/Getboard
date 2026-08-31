import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { QuestionsPage } from "./pages/QuestionsPage";
import { SyncPage } from "./pages/SyncPage";
import { UnmatchedPage } from "./pages/UnmatchedPage";
function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="unmatched" element={<UnmatchedPage />} />
          <Route path="sync" element={<SyncPage />} />
        </Route>
      </Routes>
    </BrowserRouter>;
}
export {
  App
};
