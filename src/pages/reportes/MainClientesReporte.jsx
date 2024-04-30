import React, { useState, useEffect } from "react";
import { Table } from "../../components/table/Table";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import BasicDatePicker from "../../components/DatePicker/BasicDatePicker";
import useReporteClienteNuevo from "../../hooks/useReporteClienteNuevo";
import Pagination from "../../components/pagination/PaginationContainer";
import FilterAltIcon from '@mui/icons-material/FilterAlt'; // Importa el ícono de filtro
import "./MainClientesReporte.css";
import { Btn } from '../../components/bottons/Button';

const MainReporteCliente = () => {
    const { data, isLoadingNewClients, error, getNuevosClientesPorFechas } = useReporteClienteNuevo();
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchClicked, setSearchClicked] = useState(false); 

    useEffect(() => {

        const cargarClientes = async () => {
            try {// formato de fecha DD/MM/YYYY
                const fechaInicioFormatted = fechaInicio ? fechaInicio.toISOString().split('T')[0] : null;
                const fechaFinFormatted = fechaFin ? fechaFin.toISOString().split('T')[0] : null;
                
                if (fechaInicioFormatted && fechaFinFormatted && searchClicked) { 
                    const response = await getNuevosClientesPorFechas(fechaInicioFormatted, fechaFinFormatted, currentPage);
                    setTotalPages(response.totalPages);
                }
            } catch (error) {
                console.error("Error al cargar los clientes:", error);
            }
        };
        cargarClientes();
    }, [fechaInicio, fechaFin, currentPage, searchClicked]);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = () => {
        setSearchClicked(true); 
    };

    return (
        <CartaPrincipal>
            <h1>Reporte de nuevos clientes</h1>
            <div className='fecha-container'>         
                <p className='fecha-selector'> Fecha Desde: </p>
                <BasicDatePicker
                    id="fechaInicio"
                    selected={fechaInicio}
                    onChange={date => setFechaInicio(date)}
                    botonHoy={true} 
                    placeholderText="Fecha de inicio" 
                />
                <p className='fecha-selector'>Hasta: </p>
                <BasicDatePicker
                    id="fechaFin"
                    selected={fechaFin}
                    onChange={date => setFechaFin(date)}
                    botonHoy={true}
                    placeholderText="Fecha de fin"
                />
                <Btn onClick={handleSearch} id="btn-filtrar-fecha"> 
                    <FilterAltIcon />
                </Btn>
            </div>
            {error && <div>Error: {error.message}</div>}
            {isLoadingNewClients ? (
                <div>Cargando...</div>
            ) : (
                <Table headers={["Nombre", "Fecha de ingreso", "Cedula", "Telefono", "email"]}>
                    {data && data.items && data.items.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.fechaRegistro}</td>
                            <td>{cliente.cedula}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.email}</td>
                        </tr>
                    ))}
                </Table>
            )}
            <div className="position-absolute bottom-0 start-50 translate-middle-x ">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </CartaPrincipal>
    );
};

export default MainReporteCliente;


