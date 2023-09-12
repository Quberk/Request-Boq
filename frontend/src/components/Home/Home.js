import React, {useState, useEffect} from 'react'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const Home = () => {

    const [name, setName] = useState('');

    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        getName();
    },[]);


    const refreshToken = async() => {
        try{
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
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

    const getName = async() => {
        const response = await axiosJWT.get('http://localhost:5000/users',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data);
    }
    
  return (
    <div className='columns mt-5 is-centered'>
        <div className='column is-half'>
            <div className='container mt-7 mb-5'>
                <h1>Selamat Datang : {name}</h1>
            </div>
        </div>

    </div>
  )
};

export default Home;