import { useEffect, useState } from "react";
import { DepartmentsService } from "../services/departments.service";
import { type Departamento } from '../types/Departamento';
import './styles/Home.css';
import DepartmentCard from "../components/DepartmentCard/DepartmentCard";


export default function Home() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  useEffect(() => {
    DepartmentsService.getAll().then(setDepartamentos);
  }, []);

  return (
    <div className="home-container">
      <div className="home-grid">
        {departamentos.map((d,i ) => (
          <DepartmentCard key={d.id} departamento={d} index={i}/>
        ))}
      </div>
    </div>
  );
}