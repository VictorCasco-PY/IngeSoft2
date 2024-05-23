import { LottieComp } from "../../components/animations/LottieComp"
import passwordAnimation from "../../assets/lotties/password-animation.json"
import { Btn } from "../../components/bottons/Button"
import { Input } from "../../components/input/input"
import { usePassword } from "../../hooks/usePassword"

export const SugerirForm = ({redirectToMain, handleChangeActualPasswordInput, handleChangeConfirmPasswordInput, handleChangeNuevaPasswordInput, handleChangePassword}) => {
    const {loading} = usePassword();
    return (<>
        <div className="rounded-3 d-flex justify-content-end w-100 mx-auto p-2">
            <div>
                <Btn type="secondary" onClick={() => redirectToMain()}>Omitir</Btn>
            </div>
        </div>

        <div className="suggestion-card bg-white rounded-3 shadow-lg d-md-flex justify-content-between">
            <div className="order-2 p-0 p-md-3 p-xl-5 d-flex">
                <LottieComp animation={passwordAnimation} className="mx-auto" />
            </div>
            <div className="order-1 p-0 p-md-5 p-xl-5 mt-sm-0 mt-md-5 mt-xl-5 d-flex flex-column justify-content-around">
                <div>
                    <h1 className="p-0">La contraseña que estás utilizando es insegura.</h1>
                    <h4 className="text-secondary">Te recomendamos cambiarla por una más segura.</h4>
                </div>

                <div className="d-grid gap-3 m-xl-5 border-top mt-4 pt-4">
                    <h5 className="m-0 text-black-50"><span className="text-danger">*</span> Completa los siguientes campos para cambiar tu contraseña.</h5>
                    <Input type="password" placeholder="Contraseña actual" id="actual-password" onChange={(e) => handleChangeActualPasswordInput(e)} />
                    <Input type="password" placeholder="Nueva contraseña" id="new-password" onChange={(e) => handleChangeNuevaPasswordInput(e)} />
                    <Input type="password" placeholder="Confirmar contraseña" id="new-confirm-password" onChange={(e) => handleChangeConfirmPasswordInput(e)} />
                    <Btn type="primary" id="boton-cambiar" onClick={handleChangePassword} loading={loading}>Cambiar contraseña</Btn>
                    <p className="text-black-50 m-0"><b className="text-danger">*</b> Tu nueva contraseña debe contener por lo menos una letra minúscula, una letra mayúscula, un número y un caracter especial.</p>
                </div>

                <p>Si tienes alguna duda, por favor contáctanos.<br />
                    Gracias, el equipo de <b><u>PowerFit</u></b>.
                </p>
            </div>
        </div>
    </>)
}
