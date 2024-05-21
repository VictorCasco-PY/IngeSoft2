
import { LottieComp } from "../../components/animations/LottieComp"
import passwordAnimation from "../../assets/lotties/password-animation.json"
import { Btn } from "../../components/bottons/Button"
import { Input } from "../../components/input/input"
import "./sugerirCambioPassword.css"

export const SugerirCambioPassword = () => {
    return (
        <div className="sugestion-container mx-auto">
            <div className="p-4 mx-auto">

                <div className="rounded-3 d-flex justify-content-end w-100 mx-auto p-2">
                    <div>
                        <Btn type="secondary">Omitir</Btn>
                    </div>
                </div>

                <div className="suggestion-card sbg-white rounded-3 shadow-lg d-md-flex justify-content-between">
                    <div className="order-2 p-0 p-md-3 p-xl-5">
                        <LottieComp animation={passwordAnimation} className="mx-auto" />
                        </div>
                    <div className="order-1 p-0 p-md-5 p-xl-5 mt-sm-0 mt-md-5 mt-xl-5 d-flex flex-column justify-content-around">
                        <div>
                            <h1 className="p-0">La contraseña que estás utilizando es insegura.</h1>
                        </div>

                        <div className="d-grid gap-3 m-xl-5">
                            <h4>Te recomendamos cambiarla por una más segura.</h4>
                            <Input type="password" placeholder="Contraseña actual" />
                            <Input type="password" placeholder="Nueva contraseña" />
                            <Btn type="primary">Cambiar contraseña</Btn>
                        </div>

                        <p>Si tienes alguna duda, por favor contáctanos.<br />
                            Gracias, el equipo de <b><u>PowerFit</u></b>.
                        </p>
                    </div>
                </div>

            </div>

        </div>
    )
}