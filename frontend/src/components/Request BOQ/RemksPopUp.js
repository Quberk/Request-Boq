import React, { useState } from 'react';

const RemksPopUp = ({ isOpen, togglePopup }) => {

    return (
        <div>
            {isOpen && (
                <div className="modal is-active">
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <div className="box">
                            <p>Konten Popup Anda di sini.</p>
                        </div>
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={togglePopup}></button>
                </div>
            )}
        </div>
    );
};

export const usePopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    return { isOpen, togglePopup };
};

export default RemksPopUp;
