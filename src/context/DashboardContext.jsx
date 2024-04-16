import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import ReporteStorage from "../utils/ReportesStorage";
import useReporteClientes from "../hooks/useReporteClientes";
import toast from "react-hot-toast";
import { dateIsLaterOrEqualThan, formatDate, getCurrentDate, getLastWeekDate } from "../utils/DateStatics";
import useReporteProductos from "../hooks/useReporteProductos";
import useReporteActividades from "../hooks/useReporteActividades";

const DashboardContext = createContext();

/*
    Funcionamiento:
    - ReporteStorage tiene un valor que se llama expiration date, cuando
    esta fecha vence, se deben actualizar los datos del dashboard, cada vez que
    se va a la página dashboard se checkea si ya venció esta fecha con la función checkExpirationTime()
*/

const DIAS_EXPIRACION = 7; //dias de expiracion de los datos

export const DashboardProvider = ({ children }) => {

    const [isDataStored, setIsDataStored] = useState(false); //para saber si los datos ya estan en el local storage

    const [nuevosClientesData, setNuevosClientesData] = useState(null);

    const [productosMasVendidosData, setProductosMasVendidosData] = useState(null);
    const [fechaProductosMasVendidos, setFechaProductosMasVendidos] = useState(null); //guardar la fecha que se selecciono {fechaInicio, fechaFin}

    const [estadoClientes, setEstadoClientes] = useState(null); //guardar el estado de los clientes morosos-enregla

    const [clientesPorActividad, setClientesPorActividad] = useState(null); //guardar los clientes por actividad [actividad, cantidadClientes]

    const { getCantidadPorEstadoSuscripcion, getNuevosClientesPorFechas, isLoading: isLoadingNewClients } = useReporteClientes();
    const { getProductosMasVendidosPorFecha, isLoading: isLoadingProductosMasVendidos } = useReporteProductos();
    const { getActividadesConMasClientes, isLoading: isLoadingActividades } = useReporteActividades();

    const refreshData = async (resetExpirationDate = false) => {
        console.log("DEBUG: Refrescando datos del dashboard... Esto hace fetch")
        fetchNuevosClientes();
        fetchProductosMasVendidosData(getLastWeekDate(), getCurrentDate()); //fetch de la semana pasada a hoy
        fetchEstadoClientes();
        fetchActividadesConMasClientes();

        if (resetExpirationDate) { //si se quiere resetear la fecha de expiracion, parametro de esta función, default = false
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + DIAS_EXPIRACION);
            ReporteStorage.setExpirationDate(formatDate(expirationDate));
        }
        ReporteStorage.setLastRefresh(getCurrentDate());
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
            let dataSimplified = {
                nuevosToday: resCurrent['cantidadNuevosClientes'],
                nuevosLastMonth: resLastMonth['cantidadNuevosClientes']
            }
            return dataSimplified
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

    //fetch data del api
    const fetchActividadesConMasClientes = async () => {
        const res = await getActividadesConMasClientes()
        if (res) {
            setClientesPorActividad(res);
            ReporteStorage.setClientesActividadData(res);
            setIsDataStored(true);
            return res
        } else {
            toast.error("Error al cargar los datos de actividades mas registradas. Revise la conexión.");
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

    const getActividadesMasRegistradas = async () => {
        //si no hay datos en el local storage o si las fechas son diferentes, se hace el fetch
        if (!ReporteStorage.getClientesActividadData()) {
            const res = await fetchActividadesConMasClientes();
            return res
        } else { //si los datons ya estan cargados en local ejecutar esta seccion
            setIsDataStored(true);
            return ReporteStorage.getClientesActividadData()
        }
    }
    //end Getters de reportes

    /*Devuelve true si ya expiró, false si aun no expiró*/
    const checkExpirationTime = () => {
        if (ReporteStorage.getExpirationDate()) console.log("DEBUG: La fecha de expiración es " + ReporteStorage.getExpirationDate());
        if (!ReporteStorage.getExpirationDate()) {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + DIAS_EXPIRACION);
            ReporteStorage.setExpirationDate(formatDate(expirationDate));
            return false
        } else if (dateIsLaterOrEqualThan(getCurrentDate(), ReporteStorage.getExpirationDate())) {
            return true
        } else {
            return false
        }
    }

    //TODO: por el momento los estados no funcionan bien, utilizan valor anterior
    const setLocalStorage = () => {
        const newClientsData = ReporteStorage.getNewClientsData();
        const productosMasVendidosData = ReporteStorage.getProductosMasVendidosData();
        const fechaProductosMasVendidos = ReporteStorage.getFechaProductosMasVendidosData();
        const estadoClientesData = ReporteStorage.getEstadosClientesData();
        const clientesActividadData = ReporteStorage.getClientesActividadData();
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
        if (clientesActividadData) {
            setClientesPorActividad(clientesActividadData);
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
            getEstadoClientes, getNewClients, getProductosMasVendidos, getActividadesMasRegistradas, //getters datos
            refreshData, checkExpirationTime, //refrescar todos los datos (fetch)
            isLoadingNewClients, isLoadingProductosMasVendidos, isLoadingActividades //estados de cargando
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => useContext(DashboardContext);

export default DashboardProvider;