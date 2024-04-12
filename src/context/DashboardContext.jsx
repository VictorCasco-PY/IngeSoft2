import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import ReporteStorage from "../utils/ReportesStorage";
import useReporteClientes from "../hooks/useReporteClientes";
import toast from "react-hot-toast";
import { formatDate, getCurrentDate } from "../utils/DateStatics";
import useReporteProductos from "../hooks/useReporteProductos";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {

    const [isDataStored, setIsDataStored] = useState(false); //para saber si los datos ya estan en el local storage
    const [nuevosClientesData, setNuevosClientesData] = useState(null);
    const [productosMasVendidosData, setProductosMasVendidosData] = useState(null);

    const { getNuevosClientesPorFechas, isLoading: isLoadingNewClients } = useReporteClientes();
    const { getProductosMasVendidosPorFecha, isLoading: isLoadingProductosMasVendidos } = useReporteProductos();

    const refreshData = async () => {
        console.log("Refrescando datos del dashboard...")
        fetchReportesData();
    }

    //fetch data del api
    const fetchReportesData = async () => {
        let today = getCurrentDate();
        let monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        let twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate())
        today = formatDate(today); monthAgo = formatDate(monthAgo); twoMonthsAgo = formatDate(twoMonthsAgo);
        const resCurrent = await getNuevosClientesPorFechas(monthAgo, today)
        const resLastMonth = await getNuevosClientesPorFechas(twoMonthsAgo, monthAgo)
        if (resCurrent && resLastMonth) {
            setNuevosClientesData({ nuevosToday: resCurrent, nuevosLastMonth: resLastMonth });
            ReporteStorage.setNewClientsData({ nuevosToday: resCurrent, nuevosLastMonth: resLastMonth });
            setIsDataStored(true);
            return { nuevosToday: resCurrent, nuevosLastMonth: resLastMonth }
        } else {
            toast.error("Error al cargar los datos de nuevos clientes. Revise la conexión.");
            setIsDataStored(false)
            return null
        }
    }

    //fetch data del api
    const fetchProductosMasVendidosData = async (fechaInicio, fechaFin) => {
        /*let today = new Date();
        let monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        let twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate())
        today = formatDate(today); monthAgo = formatDate(monthAgo); twoMonthsAgo = formatDate(twoMonthsAgo);*/
        const res = await getProductosMasVendidosPorFecha(fechaInicio, fechaFin)
        if (res) {
            console.log(res)
            setProductosMasVendidosData(res);
            ReporteStorage.setProductosMasVendidosData(res);
            setIsDataStored(true);
            return res
        } else {
            toast.error("Error al cargar los datos de nuevos clientes. Revise la conexión.");
            setIsDataStored(false)
            return null
        }
    }

    //esto es para guardar los reportes en el local storage
    const getNewClients = async () => {
        if (!ReporteStorage.getNewClientsData()) {
            const res = await fetchReportesData();
            setNuevosClientesData(res);
            ReporteStorage.setNewClientsData(res);
            setIsDataStored(true);
            return res
        } else {
            setLocalStorage();
            setIsDataStored(true);
            return ReporteStorage.getNewClientsData()
        }
    }

    //TERMINAR PARA ESTE SPRNITY
    const getProductosMasVendidos = async () => {
        //HACER QUE SEA POR FECHA, guardar la fecha y si la fecha no coincide con los parametros pasados, hacer nuevo fetch
        if (!ReporteStorage.getProductosMasVendidosData()) {
            const res = await fetchProductosMasVendidosData();
            setProductosMasVendidosData(res);
            ReporteStorage.setProductosMasVendidosData(res);
            return res
        } else {
            setLocalStorage();
            return ReporteStorage.getProductosMasVendidosData()
        }
    }

    const setLocalStorage = () => {
        const newClientsData = ReporteStorage.getNewClientsData();
        const productosMasVendidosData = ReporteStorage.getProductosMasVendidosData();
        if (productosMasVendidosData) {
            setNuevosClientesData(newClientsData);
        }
        if (productosMasVendidosData) {
            setProductosMasVendidosData(productosMasVendidosData);
        }
        setIsDataStored(true);
    }

    useMemo(() => {
        setLocalStorage()
    }, [isDataStored]);

    return (
        <DashboardContext.Provider value={{
            isDataStored,
            nuevosClientesData, productosMasVendidosData,
            getNewClients, getProductosMasVendidos, refreshData, isLoadingNewClients
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => useContext(DashboardContext);

export default DashboardProvider;