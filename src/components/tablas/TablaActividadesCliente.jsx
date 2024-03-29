import React, { useEffect, useState } from 'react';
import useSuscripcion from '../../hooks/useSuscripcion';
import CircularProgress from "@mui/material/CircularProgress";

const TablaActividadesCliente = ({ toast, clienteId }) => {
    const { getSuscripcionesByCliente, data: req_suscripciones, isLoading: cargandoSuscripciones, error: errorSuscripciones } = useSuscripcion();
    const [actividades, setActividades] = useState([]);

    const [loadTable, setLoadTable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const suscripcionesData = await getSuscripcionesByCliente(1, 1);
                setActividades(suscripcionesData);
                setLoadTable(true);
            } catch (error) {
                if (toast) {
                    toast.error("Error al cargar suscripciones. Revise la conexión.");
                }
            }

            console.log(actividades['items'])
        };

        fetchData();
    }, []);


    const capFirstMinRest = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    return (
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Modalidad</th>
                    <th>Estado</th>
                    <th>Fecha de Inscripcion</th>
                </tr>
            </thead>
            <tbody>
                {(!loadTable) ? (
                    <tr>
                        <td colSpan="4">
                            <CircularProgress />
                        </td>
                    </tr>
                ) : (
                    actividades['items'].map((actividad) => (
                        <tr key={actividad.id}>
                            <td>{actividad.actividadNombre}</td>
                            <td>{capFirstMinRest(actividad.modalidad)}</td>
                            <td>{capFirstMinRest(actividad.estado)}</td>
                            <td>{actividad.fechaInicio}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default TablaActividadesCliente;
