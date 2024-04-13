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
    const [fechaProductosMasVendidos, setFechaProductosMasVendidos] = useState(null); //guardar la fecha que se selecciono {fechaInicio, fechaFin}

    const [estadoClientes, setEstadoClientes] = useState(null); //guardar el estado de los clientes morosos-enregla

    const { getCantidadPorEstadoSuscripcion, getNuevosClientesPorFechas, isLoading: isLoadingNewClients } = useReporteClientes();
    const { getProductosMasVendidosPorFecha, isLoading: isLoadingProductosMasVendidos } = useReporteProductos();

    const refreshData = async () => {
        console.log("Refrescando datos del dashboard...")
        fetchNuevosClientes();
        if (ReporteStorage.getFechaProductosMasVendidosData()) {
            const fechas = ReporteStorage.getFechaProductosMasVendidosData();
            fetchProductosMasVendidosData(fechas.fechaInicio, fechas.fechaFin);
        }
        fetchEstadoClientes();
    }

    /*
        Start FETCHES
        - aqui se guardan los datos en localStorage
        - aqui se settean los states de este context
    */
    //fetch data del api
    const fetchEstadoClientes = async () => {
        const res = await getCantidadPorEstadoSuscripcion()
        if (res) {
            setEstadoClientes(res);
            ReporteStorage.setEstadosClientesData(res);
            setIsDataStored(true);
            return res
        } else {
            toast.error("Error al cargar los datos de estado de clientes. Revise la conexión.");
            return null
        }
    }

    const fetchNuevosClientes = async () => {
        let today = new Date();
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
        const res = await getProductosMasVendidosPorFecha(fechaInicio, fechaFin)
        if (res) {
            setProductosMasVendidosData(res);
            ReporteStorage.setProductosMasVendidosData(res);
            ReporteStorage.setFechaProductosMasVendidosData({ fechaInicio, fechaFin });
            setIsDataStored(true);
            return res
        } else {
            toast.error("Error al cargar los datos de productos mas vendidos. Revise la conexión.");
            setIsDataStored(false)
            return null
        }
    }
    ///////// FIN FETCHES /////////

    //start Getters de reportes
    const getEstadoClientes = async () => {
        if (!ReporteStorage.getEstadosClientesData()) {
            const res = await fetchEstadoClientes();
            return res
        } else { //si los datons ya estan cargados en local ejecutar esta seccion
            setIsDataStored(true);
            return ReporteStorage.getEstadosClientesData()
        }
    }

    const getNewClients = async () => {
        if (!ReporteStorage.getNewClientsData()) {
            const res = await fetchNuevosClientes();
            setIsDataStored(true);
            return res
        } else { //si los datons ya estan cargados en local ejecutar esta seccion
            setIsDataStored(true);
            return ReporteStorage.getNewClientsData()
        }
    }

    const getProductosMasVendidos = async (fechaInicio, fechaFin) => {
        //si no hay datos en el local storage o si las fechas son diferentes, se hace el fetch
        if (!ReporteStorage.getProductosMasVendidosData()
            || (!ReporteStorage.getFechaProductosMasVendidosData())
            || (ReporteStorage.getFechaProductosMasVendidosData().fechaInicio !== fechaInicio)
            || (ReporteStorage.getFechaProductosMasVendidosData().fechaFin !== fechaFin)) {

            const res = await fetchProductosMasVendidosData(fechaInicio, fechaFin);
            return res
        } else { //si los datons ya estan cargados en local ejecutar esta seccion
            setIsDataStored(true);
            return ReporteStorage.getProductosMasVendidosData()
        }
    }
    //end Getters de reportes

    //TODO: por el momento los estados no funcionan bien, utilizan valor anterior
    const setLocalStorage = () => {
        const newClientsData = ReporteStorage.getNewClientsData();
        const productosMasVendidosData = ReporteStorage.getProductosMasVendidosData();
        const fechaProductosMasVendidos = ReporteStorage.getFechaProductosMasVendidosData();
        const estadoClientesData = ReporteStorage.getEstadosClientesData();
        if (productosMasVendidosData) {
            setNuevosClientesData(newClientsData);
        }
        if (productosMasVendidosData) {
            setProductosMasVendidosData(productosMasVendidosData);
        }
        if (fechaProductosMasVendidos) {
            setFechaProductosMasVendidos(fechaProductosMasVendidos);
        }
        if (estadoClientesData) {
            setEstadoClientes(estadoClientesData);
        }
        setIsDataStored(true);
    }

    useMemo(() => {
        setLocalStorage()
    }, [isDataStored]);

    return (
        <DashboardContext.Provider value={{
            isDataStored, //boolean check
            estadoClientes, nuevosClientesData, productosMasVendidosData, //states guardados
            fechaProductosMasVendidos, //filtros
            getEstadoClientes, getNewClients, getProductosMasVendidos, //getters datos
            refreshData, //refrescar todos los datos (fetch)
            isLoadingNewClients, isLoadingProductosMasVendidos //estados de cargando
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => useContext(DashboardContext);

export default DashboardProvider;