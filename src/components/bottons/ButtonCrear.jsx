import PropTypes from 'prop-types';
import { Btn } from './Button';


const BotonCrear = ({ icon, text, onClick, ...props }) => {
    return (
        <Btn type="primary" onClick={onClick} {...props} icon={icon}>
            {text}
        </Btn>
    );
};

BotonCrear.propTypes = {
    icon: PropTypes.node,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};

export default BotonCrear;
