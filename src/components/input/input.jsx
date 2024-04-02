import PropTypes from 'prop-types';

const Input = ({...props}) => {
    return <input {...props} className="form-control d-inline" />
}

Input.propTypes = {
    id: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};

export { Input };