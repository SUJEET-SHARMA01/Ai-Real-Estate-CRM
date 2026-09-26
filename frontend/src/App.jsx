import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import PropertiesPage from "./pages/PropertiesPage";
import InteractionsPage from "./pages/InteractionsPage";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="interactions" element={<InteractionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
