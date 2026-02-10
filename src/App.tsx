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
import { useEffect, useState } from "react";
import MainLayout from "./layouts/MainLayout";
import Nosotras from "./pages/Nosotras";

function AppContent() {
  const { loading } = useAuth();

  
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!loading) {
      // ⏱ tiempo mínimo visible del loader
      const minTime = setTimeout(() => {
        setShowLoader(false);
      }, 700); // podés ajustar a 800ms o 1000ms

      return () => clearTimeout(minTime);
    }
  }, [loading]);

  return (
    <>
      <AppLoader visible={showLoader} />
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/departamento/:id" element={<DepartmentDetail />} />
        <Route path="/nosotras" element={<Nosotras />} />
        <Route path="/contacto" element={<div>Contacto</div>} />
      </Route>
      
      <Route path="/login" element={<LoginPage />} />


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
        <Route path="departamentos/:id" element={<DepartmentDetail />} />
      </Route>
    </Routes>
    </>
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
