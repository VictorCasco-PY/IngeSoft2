import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import './DatePicker.css'

const BasicDatePicker = ( {selected, onChange, botonHoy = true, ...props} ) => {

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="datePickerStyle" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    return (
        <ReactDatePicker todayButton={botonHoy ? "Hoy" : undefined} selected={selected} onChange={onChange} customInput={<ExampleCustomInput />} {...props} />
    );
};

export default BasicDatePicker;