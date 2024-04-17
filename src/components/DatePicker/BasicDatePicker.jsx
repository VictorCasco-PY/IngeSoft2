import React, { forwardRef } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import es from "date-fns/locale/es";
import './DatePicker.css'

<<<<<<< HEAD
const BasicDatePicker = ( {selected, onChange, botonHoy = true, ...props} ) => {
=======
registerLocale("es", es);

const BasicDatePicker = ( {selected, onChange, ...props} ) => {
>>>>>>> dev

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="datePickerStyle" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    return (
<<<<<<< HEAD
        <ReactDatePicker todayButton={botonHoy ? "Hoy" : undefined} selected={selected} onChange={onChange} customInput={<ExampleCustomInput />} {...props} />
=======
        <ReactDatePicker dateFormat="dd/MM/yyyy" locale="es" selected={selected} onChange={onChange} customInput={<ExampleCustomInput />} {...props} />
>>>>>>> dev
    );
};

export default BasicDatePicker;