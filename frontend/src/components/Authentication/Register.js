import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Register = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [region, setRegion] = useState('');
    const [fmeOffice, setFmeOffice] = useState('');
    const [typeProject, setTypeProject] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const GetLastId = async(e) => {
        try{
            const response = await axios.get('http://localhost:5000/userLastId');
            setId(response.data.data);
        }catch(error){
            
        }
    }

    const Register = async(e) =>{
        e.preventDefault();
        try{
            await axios.post('http://localhost:5000/register',{
                name: name,
                username: username,
                password: password,
                confPassword: confPassword,
                phone_number: phoneNumber,
                region: region,
                fme_office: fmeOffice,
                type_project: typeProject
            });
            navigate("/");
        }catch(error){
            if (error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    useEffect(()=>{
        GetLastId();
    }, []); 

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
        <div className="hero-body">
            <div className="container">
            <div className="columns is-centered">
                <div className="column is-4-desktop">
        
                    <form onSubmit={ Register } className='box'>
                        <p className='has-text-centered'>{msg}</p>

                        <div className="field mt-5">
                            <label className='label'>Id Karyawan</label>
                            <div className="controls">
                                <input 
                                type="number" 
                                className="input" 
                                placeholder='Id Karyawan'
                                value={id + 1}
                                readOnly
                                />
                            </div>
                        </div>

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
                                placeholder='Username'
                                value={username}
                                onChange={(e)=> setUsername(e.target.value)}/>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <label className='label'>Phone Number</label>
                            <div className="controls">
                                <input 
                                type="text" 
                                className="input" 
                                placeholder='Nomor telepon'
                                value={phoneNumber}
                                onChange={(e)=> setPhoneNumber(e.target.value)}/>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <label className='label'>Password</label>
                            <div className="controls">
                                <input 
                                type="password" 
                                className="input" 
                                placeholder='********'
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}/>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <label className='label'>Confirm Password</label>
                            <div className="controls">
                                <input 
                                type="password" 
                                className="input" 
                                placeholder='********'
                                value={confPassword}
                                onChange={(e)=> setConfPassword(e.target.value)}/>
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
                                    value={fmeOffice}
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
                                    value={typeProject}
                                    onChange={(e)=> setTypeProject(e.target.value)}
                                    >
                                        
                                        <option value="FO">FO</option>
                                        <option value="ODN">ODN</option>

                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <button className='button is-success is-fullwidth'>Register</button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </div>
        </section>
    )
}

export default Register