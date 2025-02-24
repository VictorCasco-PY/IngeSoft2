import React from 'react';
import { useField } from 'formik';


// estos componentes fueron copiados de la pagina de formik

export const FormTextInput = ({ label, required = false, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>
                {label} {required && (<span style={{ color: 'red' }}>*</span>)}
            </label>
            <input className="text-input form-control" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error" style={{ color: 'red' }}>{meta.error}</div>
            ) : null}
        </>
    );
};

export const FormCheckbox = ({ children, ...props }) => {
    // React treats radios and checkbox inputs differently from other input types: select and textarea.
    // Formik does this too! When you specify `type` to useField(), it will
    // return the correct bag of props for you -- a `checked` prop will be included
    // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
    const [field, meta] = useField({ ...props, type: 'checkbox' });
    return (
        <div>
            <label className="checkbox-input">
                {required && (<span style={{ color: 'red' }}>*</span>)}
                <input type="checkbox" {...field} {...props} />
                {children}
            </label>
            {meta.touched && meta.error ? (
                <div className="error" style={{ color: 'red' }}>{meta.error}</div>
            ) : null}
        </div>
    );
};

export const FormSelect = ({ label, required = false, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div>
            <label htmlFor={props.id || props.name}>
                {label} {required && (<span style={{ color: 'red' }}>*</span>)}
            </label>
            <select {...field} {...props} className='form-control form-select' />
            {meta.touched && meta.error ? (
                <div className="error" style={{ color: 'red' }}>{meta.error}</div>
            ) : null}
        </div>
    );
};
