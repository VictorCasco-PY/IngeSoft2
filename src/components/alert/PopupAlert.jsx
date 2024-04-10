import React from 'react';
import './CustomAlert.css';
import { Btn } from '../bottons/Button';

const PopupAlert = ({ message, header, confirmText, cancelText, confirmAction, closePopup, open, loading, disabled, name }) => {
    const modalClass = `modal fade ${open ? 'show' : ''}`;

    return (
        <div className={modalClass} style={{ display: open ? 'block' : 'none' }}>
            <div className='modal-dialog-centered modal-dialog-square'>
                <div className="custom-alert popupStructure d-flex flex-column gap-3">
                    {header && (<h3 style={{ textAlign: 'center' }}>{header}</h3>)}
                    <p style={{ textAlign: 'center' }}>{message}</p>
                    <div className="button-container gap-4">
                        {cancelText && (<Btn onClick={closePopup} id="btn-popup-cancel" type="secondary" outline disabled={disabled}>
                            {cancelText}
                        </Btn>)}
                        <Btn className="confirm-button" onClick={confirmAction} id="btn-popup-confirm" type="danger" loading={loading} disabled={disabled}>
                            {confirmText}
                        </Btn>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupAlert;
