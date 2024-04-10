import React from 'react';
import './CustomAlert.css';
import { Btn } from '../bottons/Button';

const PopupAlert = ({ message, confirmText, cancelText, confirmAction, closePopup, open, name }) => {
    const modalClass = `modal fade ${open ? 'show' : ''}`;

    return (
        <div className={modalClass} style={{ display: open ? 'block' : 'none' }}>
            <div className='modal-dialog-centered modal-dialog-square'>
                <div className="custom-alert popupStructure">
                    <p style={{textAlign:'center'}}>{message}</p>
                    <div className="button-container gap-4">
                        <Btn onClick={closePopup} id="btn-popup-cancel" type="secondary">
                            {cancelText}
                        </Btn>
                        <Btn className="confirm-button" onClick={confirmAction} id="btn-popup-confirm" type="danger">
                            {confirmText}
                        </Btn>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupAlert;
