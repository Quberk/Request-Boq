import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [region, setRegion] = useState("");
    const [fme_office, setFmeOffice] = useState("");
    const [type_project, setTypeProject] = useState("");
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(()=>{
        getUserById();
    }, []); 

    const updateUser = async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`http://localhost:5000/users/${id}`,{
                name,
                username,
                region,
                fme_office,
                type_project
            });
            navigate("/dashboard/user");
        }catch(error){
            console.log(error);
        }
    };
    
    const getUserById = async () =>{
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setName(response.data.data.name);
        setUsername(response.data.data.username);
        setRegion(response.data.data.region);
        setFmeOffice(response.data.data.fme_office);
        setTypeProject(response.data.data.type_project);

        console.log(response);
    };

    return (
        <div className="columns mt-5 is-centered">
            <div className="column is-half">
                <form onSubmit={updateUser}>
                    
                <div className="field mt-5">
                            <label className='label'>Name</label>
                            <div className="controls">
                                <input 
                                type="text" 
                                className="input" 
                                placeholder='Name'
                                value={name}
                                onChange={(e)=> setName(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="field mt-5">
                            <label className='label'>Username</label>
                            <div className="controls">
                                <input 
                                type="text" 
                                className="input" 
                                placeholder='Nomor telepon'
                                value={username}
                                onChange={(e)=> setUsername(e.target.value)}/>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <label className='label'>Region</label>
                            <div className="controls">
                                <input 
                                type="text" 
                                className="input" 
                                placeholder='Region'
                                value={region}
                                onChange={(e)=> setRegion(e.target.value)}/>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <label className="label">FME Office</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select 
                                    value={fme_office}
                                    onChange={(e)=> setFmeOffice(e.target.value)}
                                    >
                                        
                                        <option value="Sulawesi">Sulawesi</option>
                                        <option value="Bali">Bali</option>
                                        <option value="Central">Central</option>

                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="field mt-5">
                            <label className="label">Type Project</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select 
                                    value={type_project}
                                    onChange={(e)=> setTypeProject(e.target.value)}
                                    >
                                        
                                        <option value="FO">FO</option>
                                        <option value="ODN">ODN</option>

                                    </select>
                                </div>
                            </div>
                        </div>
    
                    <div className="field">
                        <button type='submit' className='button is-success'>Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default EditUser;