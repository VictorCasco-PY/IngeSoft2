import React, { useEffect, useState } from 'react';
import useSuscripcion from '../../hooks/useSuscripcion';
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import './TablaActividades.css';
import { capFirstMinRest, formatFecha } from '../../utils/Formatting';
import api from '../../utils/api';

const TablaActividadesCliente = ({ toast, clienteId, page = 1 }) => {

    // no borrar
    //const { getSuscripcionesByCliente, data: req_suscripciones, isLoading: cargandoSuscripciones, error: errorSuscripciones } = useSuscripcion();
    const [actividades, setActividades] = useState([]);
    const [loadTable, setLoadTable] = useState(false);

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
        } catch (error) {
            if (toast) {
                if (error.response.status === 404) {
                    setActividades([]);
                } else {
                    toast.error("Error al cargar suscripciones. Revise la conexión.");
                }
            }
        } finally {
            setLoadTable(false);
        }

    }

    useEffect(() => {

        // no borrar esto, no tomar en cuenta en  code review, lo usare en el sig sprint.

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

    return (
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Modalidad</th>
                    <th>Estado</th>
                    <th>Fecha de Inscripcion</th>
                    <th>Fecha de Vencimiento</th>
                </tr>
            </thead>
            <tbody>
                {loadTable ? (
                    <tr>
                        <td colSpan="5">
                            <CircularProgress />
                        </td>
                    </tr>
                ) : (

                    <>
                        {actividades && actividades.length === 0 ? (
                            <tr>
                                <td colSpan="5">
                                    Este cliente no tiene actividades inscritas.
                                </td>
                            </tr>
                        ) : (
                            (actividades) && actividades.items.map((actividad) => (
                                <tr key={actividad.id}>
                                    <td onClick={() => { navigate(`/infoServicio/${actividad.actividadId}`) }} className='rowClickable'>
                                        {actividad.actividadNombre}
                                    </td>
                                    <td>{capFirstMinRest(actividad.modalidad)}</td>
                                    <td>{capFirstMinRest(actividad.estado)}</td>
                                    <td>{formatFecha(actividad.fechaInicio)}</td>
                                    <td>{formatFecha(actividad.fechaFin)}</td>
                                </tr>
                            ))
                        )}
                    </>

                )}
                {/*
                {errorSuscripciones && (
                    <tr>
                        <td colSpan="4">
                            Error al cargar suscripciones. Revise la conexión.
                        </td>
                    </tr>
                )}
                */}
            </tbody>
        </table>
    );
};

export default TablaActividadesCliente;
