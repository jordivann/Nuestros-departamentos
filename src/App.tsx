import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";

import PrivateRoute from "./auth/PrivateRoute";
import LoginPage from "./auth/LoginPage";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import DepartmentList from "./pages/admin/DepartmentList";
import Home from "./pages/Home";
import NewDepartment from "./pages/admin/NewDepartment";
import DepartmentDetail from "./components/DepartamentoDetalle/DepartmentDetail";

import AppLoader from "./components/AppLoader";
import EditDepartment from "./pages/admin/EditDepartment";

function AppContent() {
  const { loading } = useAuth();

  // 👉 Loader global cuando Firebase está inicializando
  if (loading) return <AppLoader />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/departamento/:id" element={<DepartmentDetail />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="departamentos" element={<DepartmentList />} />
        <Route path="departamentos/nuevo" element={<NewDepartment />} />
        <Route path="departamentos/editar/:id" element={<EditDepartment />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
