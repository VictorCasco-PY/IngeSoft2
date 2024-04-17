import React, { forwardRef } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import es from "date-fns/locale/es";
import './DatePicker.css'

registerLocale("es", es);

const BasicDatePicker = ( {selected, onChange, ...props} ) => {

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="datePickerStyle" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    return (
        <ReactDatePicker dateFormat="dd/MM/yyyy" locale="es" selected={selected} onChange={onChange} customInput={<ExampleCustomInput />} {...props} />
    );
};

export default BasicDatePicker;