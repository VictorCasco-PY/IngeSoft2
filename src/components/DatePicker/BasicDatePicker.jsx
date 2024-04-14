import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import './DatePicker.css'

const BasicDatePicker = ( {selected, onChange, ...props} ) => {

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="datePickerStyle" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    return (
        <ReactDatePicker selected={selected} onChange={onChange} customInput={<ExampleCustomInput />} {...props} />
    );
};

export default BasicDatePicker;