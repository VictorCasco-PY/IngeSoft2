import React, { useEffect, useState } from 'react';
import useSuscripcion from '../../hooks/useSuscripcion';
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import './TablaActividades.css';
import { capFirstMinRest, formatFecha } from '../../utils/Formatting';
import api from '../../utils/api';
import ErrorPagina from '../errores/ErrorPagina';
import { ListaVacía } from '../errores/ListaVacía';
import { Table } from '../table/Table';

/*
    USO: se usa el prop clienteId para obtener las actividades de un cliente en específico.
    Se usa el prop toast para mostrar mensajes de error.
    Se usa el prop setParentTotalPages para setear el total de páginas en el componente padre. (En el componente padre, implementarlo como una funcion)
        esta función se llama cada vez que se obtienen las actividades.
    Se usa el prop page para setear la página actual.
*/

const TablaActividadesCliente = ({ toast, clienteId, setParentTotalPages, page = 1 }) => {

    // TODO: no borrar
    //const { getSuscripcionesByCliente, data: req_suscripciones, isLoading: cargandoSuscripciones, error: errorSuscripciones } = useSuscripcion();
    const [actividades, setActividades] = useState([]);
    const [loadTable, setLoadTable] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null)

    const navigate = useNavigate();

    const getSuscripciones = async () => {
        setLoadTable(true);
        try {
            const res = await api.get(`suscripciones/cliente/${clienteId}/page/${page}`)
            //por el momento se utiliza esto cuando en la pagina no hay datos
            if (res.data.items.length === 0) {
                setActividades([])
            }
            setActividades(res.data)
            if (setParentTotalPages) setParentTotalPages(res.data.totalPages) // se usa para setear el total de paginas en el componente padre
        } catch (error) {
            if (toast) {
                if (error.response.status === 404) {
                    setActividades([]);
                    //setErrorMessage(error.response.data.message) //no se usa porque no me gusta el formateo el error traido desde el back
                    setErrorMessage("Este cliente no posee actividades.")
                } else {
                    setErrorMessage("Ha ocurrido un error al solicitar las cajas.")
                    toast.error("Error al cargar suscripciones. Revise la conexión.");
                }
            }
        } finally {
            setLoadTable(false);
        }

    }

    useEffect(() => {

        //TODO: no borrar esto, no tomar en cuenta en  code review, lo usare en el sig sprint.

        /*const fetchData = async () => {
            setLoadTable(true);
            try {
                const suscripcionesData = await getSuscripcionesByCliente(clienteId, page);
                setActividades(suscripcionesData);
            } catch (error) {
                if (toast) {
                    setActividades([]);
                    if (error.response.status === 404) {
                        setActividades([]);
                    } else {
                        toast.error("Error al cargar suscripciones. Revise la conexión.");
                    }
                }
            } finally {
                setLoadTable(false);
            }
            console.log(actividades)
        };

        fetchData();*/

        getSuscripciones();
    }, [page]);

    const switchRender = () => {

        if (loadTable) return <Table headers={["Nombre", "Modalidad", "Estado", "Fecha de Inscripcion", "Fecha de Vencimiento"]} striped>
            <td colSpan="5" style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block' }}>
                    <CircularProgress />
                </div>
            </td>
        </Table>

        if (actividades.length <= 0 || actividades.items.length <= 0) return <ListaVacía mensaje={errorMessage} />

        if (!actividades) return <ErrorPagina mensaje={errorMessage} />

        if (actividades.items) {
            return (
                <>
                    <Table headers={["Nombre", "Modalidad", "Estado", "Fecha de Inscripcion", "Fecha de Vencimiento"]} striped>
                        {actividades.items.map(actividad => {
                            return (

                                <tr key={actividad.id} onClick={() => { navigate(`/infoServicio/${actividad.actividadId}`) }} className='rowClickable'>
                                    <td style={{ color: "#7749F8" }} scope="row">
                                        {actividad.actividadNombre}
                                    </td>
                                    <td>{capFirstMinRest(actividad.modalidad)}</td>
                                    <td>{capFirstMinRest(actividad.estado)}</td>
                                    <td>{formatFecha(actividad.fechaInicio)}</td>
                                    <td>{formatFecha(actividad.fechaFin)}</td>
                                </tr>

                            )
                        })}
                    </Table>
                </>
            );
        }
    };

    return (
        <>
            {switchRender()}
        </>
    );
};

export default TablaActividadesCliente;