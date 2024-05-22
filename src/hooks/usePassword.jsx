import api from "../utils/api";
import { useState } from "react";

export const usePassword = () => {

    const URL = "/password"

    const [loading, setLoading] = useState(false);

    const needChange = async () => {

        const response = await api.get(`${URL}/need-change`)
        const { needChange } = response.data;
        return needChange;

    }

    const changePassword = async ({ passActual, nuevaPass, confirmarPass }) => {
        setLoading(true)
        try {
            const send = { passActual, nuevaPass, confirmarPass }
            const response = await api.post(`${URL}/change`, send);
            if (response.status !== 200) {
                throw new Error('Error al cambiar la contraseña');
            }
            return response.data
        } catch (e) {
            setLoading(false)
            throw e;
        }
    }

    return { needChange, changePassword, loading }

}