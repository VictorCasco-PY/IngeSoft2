
const ModalFormik = ({ children, title, closeModal, open }) => {
    const modalClass = `modal fade ${open ? 'show' : ''}`;

    return (
        <div className={modalClass} style={{ display: open ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-square">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body mb-3">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ModalFormik;
