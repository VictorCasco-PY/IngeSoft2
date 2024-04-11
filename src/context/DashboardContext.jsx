import React, { createContext, useContext, useEffect, useState } from "react";
import ReporteStorage from "../utils/ReportesStorage";
import useReporteClientes from "../hooks/useReporteClientes";
import toast from "react-hot-toast";
import { formatDate } from "../utils/DateStatics";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {

    const [isDataStored, setIsDataStored] = useState(false); //para saber si los datos ya estan en el local storage
    const [nuevosClientesData, setNuevosClientesData] = useState(null);
    const { getNuevosClientesPorFechas, data, error, isLoading } = useReporteClientes();

    const getReportesData = async () => {
        if (!ReporteStorage.getNewClientsData()) {
            let today = new Date()
            //now a month ago
            let monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
            let twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate())
            today = formatDate(today); monthAgo = formatDate(monthAgo); twoMonthsAgo = formatDate(twoMonthsAgo);
            const resCurrent = await getNuevosClientesPorFechas(monthAgo, today)
            const resLastMonth = await getNuevosClientesPorFechas(twoMonthsAgo, monthAgo)
            if (resCurrent && resLastMonth) {
                setNuevosClientesData({ nuevosToday: resCurrent, nuevosLastMonth: resLastMonth });
                ReporteStorage.setNewClientsData({ nuevosToday: resCurrent, nuevosLastMonth: resLastMonth });
                setIsDataStored(true);
            } else {
                toast.error("Error al cargar los datos de nuevos clientes. Revise la conexión.");
                setIsDataStored(false)
            }
        } else {
            setLocalStorage();
            setIsDataStored(true);
        }
    }

    const setLocalStorage = () => {
        const data = ReporteStorage.getNewClientsData();
        if (data) {
            setNuevosClientesData(data);
            setIsDataStored(true);
        }
    }

    useEffect(() => {
        setLocalStorage()
    }, [isDataStored]);

    return (
        <DashboardContext.Provider value={{ isDataStored, nuevosClientesData, getReportesData, isLoading }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => useContext(DashboardContext);

export default DashboardProvider;