import { ILoginProps, ILoginErrors, IRegisterErrors, IRegisterProps } from "@/types";

export const validateFormLogin = (values: ILoginProps): ILoginErrors => {
    const errors: ILoginErrors = {};


    if (!values.email) {
        errors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Formato de correo no valido";
    }

    if (!values.password) {
        errors.password = "Contraseña obligatoria";
    } else if (values.password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return errors;
};


export const validateFormRegister = (values: IRegisterProps): IRegisterErrors => {
    const errors: IRegisterErrors = {};

    if (!values.name.trim()) {
        errors.name = "Nombre es obligatorio";
    }

    if (!values.email.trim()) {
        errors.email = "Correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Correo invalido";
    }

    if (!values.password) {
        errors.password = "Contraseña es obligatoria";
    } else if (values.password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Debes confirmar tu contraseña";
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "La contraseña no coinciden";
    }

    if (!values.address.trim()) {
        errors.address = "Direccion es obligatoria";
    }

    if (!values.phone.trim()) {
        errors.phone = "Numero de celular es obligatorio";
    } else if (!/^\d{7,15}$/.test(values.phone)) {
        errors.phone = "Numero telefonico no permitido";
    }

    return errors;
};