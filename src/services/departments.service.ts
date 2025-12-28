// src/services/departments.service.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import {type Departamento } from "../types/Departamento";

const COLLECTION = "departamentos";

export const DepartmentsService = {
  async getAll(): Promise<Departamento[]> {
    const ref = collection(db, COLLECTION);
    const snapshot = await getDocs(ref);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Departamento[];
  },
};
export type { Departamento };

