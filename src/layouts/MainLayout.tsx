import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
