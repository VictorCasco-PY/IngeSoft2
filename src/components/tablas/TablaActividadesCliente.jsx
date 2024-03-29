import React, { useEffect, useState } from 'react';
import useSuscripcion from '../../hooks/useSuscripcion';
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import './TablaActividades.css';
import { capFirstMinRest, formatFecha } from '../../utils/Formatting';
import api from '../../utils/api';

const TablaActividadesCliente = ({ toast, clienteId, page = 1 }) => {

    const { getSuscripcionesByCliente, data: req_suscripciones, isLoading: cargandoSuscripciones, error: errorSuscripciones } = useSuscripcion();
    const [actividades, setActividades] = useState([]);
    const [loadTable, setLoadTable] = useState(false);

    const navigate = useNavigate();

    const getSuscripciones = async () => {
        setLoadTable(true);
        try {
            const res = await api.get(`suscripciones/cliente/${clienteId}/page/${page}` ) 
            setActividades(res.data) 
            console.log(res.data)
        } catch (error) {
            //console.log(error)
            if (toast) {
                toast.error("Error al cargar suscripciones. Revise la conexión.");
            }
            console.log(error);
        } finally {
            setLoadTable(false);
        }
        
    }

    useEffect(() => {
        /*const fetchData = async () => {
            setLoadTable(true);
            try {
                const suscripcionesData = await getSuscripcionesByCliente(clienteId, page);
                setActividades(suscripcionesData);
            } catch (error) {
                if (toast) {
                    toast.error("Error al cargar suscripciones. Revise la conexión.");
                }
                console.log(error);
            } finally {
                setLoadTable(false);
            }
            console.log(req_suscripciones)
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
                        {(actividades.length == 0 || !actividades) ? (
                            <tr>
                                <td colSpan="5">
                                    No hay actividades inscritas.
                                </td>
                            </tr>
                        ) : (
                            actividades.items.map((actividad) => (
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
