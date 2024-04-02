import PropTypes from 'prop-types';
import { Btn } from './Button';


const ButtonBasic = ({ icon, color, text, onClick, ...props }) => {
    return (
        <Btn color={color} onClick={onClick} {...props} icon={icon} outline>
            {text}
        </Btn>
    );
};

ButtonBasic.propTypes = {
    icon: PropTypes.node,
    color: PropTypes.string,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};

export default ButtonBasic;
