import React, {useState, useEffect} from 'react'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const UserList = () => {
    const [users, setUser] = useState([]);

    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        getUsers();
    },[]);

    const refreshToken = async() => {
        try{
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName (decoded.name);
            setExpire(decoded.exp);
        }catch(error){
            if (error.response){
                navigate("/");
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async(config) =>{
        const currentDate = new Date();
        if (expire * 100000 < currentDate.getTime()){
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName (decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) =>{
        return Promise.reject(error);
    });

    const getUsers = async () =>{
        const response = await axiosJWT.get('http://localhost:5000/users',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data);
        setUser(response.data);
    }

    const deleteUser = async (id) =>{
        try{
            await axios.delete(`http://localhost:5000/users/${id}`);
            getUsers();
        }catch(error){
            console.log(error);
        }
    }
    
  return (
    <div className='columns mt-5 is-centered'>
        <div className='column is-half'>
            
            <Link to={`../register`} className='button is-success'>
                Add New User
            </Link>
            
            <table className='table is-striped is-fullwidth'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Username</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>
                            <Link to={`edit/${user.id}`} className='button is-small is-info mx-1'>Edit</Link>
                            <button onClick={()=> deleteUser(user.id)} className='button is-small is-danger mx-1'>Delete</button>
                        </td>
                    </tr>
                    ))}
                    
                </tbody>
            </table>
        </div>
    </div>
  )
};

export default UserList;