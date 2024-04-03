import { Btn } from "../../components/bottons/Button"
import ModalBase from "../../components/modals/ModalBase"
import { normalizarPrecio, precioHandler } from "../../utils/precioHandler"
import { Input } from "../../components/input/input"
import { useEffect, useState } from "react"
import { toast, Toaster } from "react-hot-toast";
import { useMovimientos } from "../../hooks/useMovimientos"


export const CobrarFacturaModal = ({ data, open, closeModal }) => {

    const [efectivo, setEfectivo] = useState(0)
    const [tarjeta, setTarjeta] = useState(0)
    const [cambio, setCambio] = useState(0)
    const [totalPago, setTotalPago] = useState(0)

    const { crearMovimiento, error } = useMovimientos()

    const resetAndClose = () => {
        setEfectivo(0)
        setTarjeta(0)
        setCambio(0)
        closeModal()
    }

    const handleEfectivo = (e) => {
        setEfectivo(precioHandler(e.target.value))
    }

    const handleTarjeta = (e) => {
        setTarjeta(precioHandler(e.target.value))
    }


    const handleCobrar = async () => {

        const sesionId = parseInt(localStorage.getItem("sesionCajaId"))
        console.log(sesionId);

        if (!sesionId) {
            toast.error("No se ha iniciado una sesión de caja.")
            return;
        }

        if (efectivo === 0 && tarjeta === 0) {
            toast.error("Debe ingresar un monto de pago, ya sea en efectivo o tarjeta.")
            return;
        }

        if (tarjeta > normalizarPrecio(data?.factura?.saldo)) {
            toast.error("No puedes cobrar por tarjeta un monto mayor al saldo.")
            return;
        }

        const fechaHoraActual = new Date();

        // Obtener la hora, los minutos y los segundos
        const horas = fechaHoraActual.getHours();
        const minutos = fechaHoraActual.getMinutes();
        const segundos = fechaHoraActual.getSeconds();

        // Formatear la salida para que tenga un aspecto amigable
        const horaActualFormateada = horas + ":" + minutos + ":" + segundos;

        const cobro = {
            "movimiento": {
                "facturaId": data?.factura?.id,
                "sesionId": sesionId,
                "total": normalizarPrecio(totalPago),
                "hora": horaActualFormateada,
                "entrada": true,
            },
        }

        const detalles = []

        if (normalizarPrecio(efectivo) > 0) {
            let efectivoFinal

            efectivoFinal = normalizarPrecio(efectivo) - normalizarPrecio(cambio)

            detalles.push({
                "tipoDePagoId": 1,
                "monto": normalizarPrecio(efectivoFinal)
            })
        }

        if (normalizarPrecio(tarjeta) > 0) {
            detalles.push({
                "tipoDePagoId": 2,
                "monto": normalizarPrecio(tarjeta)
            })
        }

        cobro["detalles"] = detalles

        console.log(cobro);

        await crearMovimiento(cobro)

        if (error) {
            toast.error("Error al cobrar la factura.")
            return;
        }


        toast.success("El cobro se registró con éxito.")
        resetAndClose()

    }

    useEffect(() => {

        let nuevoCambio = 0;
        let totalAPagar = 0

        if (!isNaN(normalizarPrecio(efectivo)) && normalizarPrecio(efectivo) > 0) {
            totalAPagar = totalAPagar + normalizarPrecio(efectivo)
        }

        if (!isNaN(normalizarPrecio(tarjeta)) && normalizarPrecio(tarjeta) > 0) {
            totalAPagar = totalAPagar + normalizarPrecio(tarjeta)
        }

        nuevoCambio = totalAPagar - data?.factura?.saldo;


        if (nuevoCambio < 0 || isNaN(nuevoCambio)) {
            setTotalPago(totalAPagar)
            setCambio("0")
        } else {
            setTotalPago(totalAPagar - nuevoCambio)
            setCambio(precioHandler(nuevoCambio))
        }

    }, [efectivo, tarjeta])

    return <>
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                success: {
                    style: {
                        background: "#75B798",
                        color: "#0A3622",
                    },
                },
                error: {
                    style: {
                        background: "#FFDBD9",
                        color: "#D92D20",
                    },
                },
            }} />
        <ModalBase title={`Cobrar factura Nº ${data?.factura?.nroFactura}`} open={open} closeModal={resetAndClose}>
            <div>
                <div>
                    <p className="p-0 m-0">Saldo</p>
                    <Input value={precioHandler(data?.factura?.saldo)} disabled />

                </div>

                <div>
                    <p className="p-0 m-0">Efectivo</p>
                    <Input value={efectivo} onChange={e => handleEfectivo(e)} />
                </div>

                <div>
                    <p className="p-0 m-0">Tarjeta</p>
                    <Input value={tarjeta} onChange={e => handleTarjeta(e)} />
                </div>

                <div>
                    <p className="p-0 m-0">Cambio</p>
                    <Input value={cambio} disabled />
                </div>

                <div className="d-flex justify-content-center align-items-center float-end mt-4 gap-3">
                    <Btn onClick={resetAndClose} type="secondary">Cerrar</Btn>
                    <Btn type="primary" onClick={handleCobrar}>Cobrar Factura</Btn>
                </div>

            </div>
        </ModalBase></>

}