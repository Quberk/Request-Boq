import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RemksPopUp = ({ isOpen, togglePopup, Id }) => {

    const navigate = useNavigate();

    const rejectBoq = async (id) =>{
        try{
            await axios.put(`http://localhost:5000/rejectRequest/${id}`);
            window.location.reload();
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div>
            {isOpen && (
                <div className="modal is-active">
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <div className="box">
                            <div className="field mt-4">
                                <label className='label'>Remks</label>
                                <div className="controls">
                                    <input
                                    type="text" 
                                    className="input"
                                    placeholder='Remks'
                                    />
                                </div>
                                <button onClick={()=> rejectBoq(Id)} className='button is-small is-success mx-1'>Kirim</button>
                                <button onClick={togglePopup} className='button is-small is-danger mx-1'>Batal</button>
                            </div>
                        </div>
                    </div>
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
