import React, {useState, useEffect} from 'react'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import * as XLSX from 'xlsx';

const BoqList = () => {
    const [boqs, setBoq] = useState([]);

    const [Username, setUsername] = useState('');
    const [From, setFrom] = useState('');
    const [Status, setStatus] = useState('');

    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        getBoqs();
    },[]);

    const refreshToken = async() => {
        try{
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUsername (decoded.name);
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
            setUsername (decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) =>{
        return Promise.reject(error);
    });

    const getBoqs = async () =>{
        const response = await axiosJWT.get('http://localhost:5000/request',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data.data);
        setBoq(response.data.data);
    }

    const approveBoq = async (id) => {
        try{
            await axios.put(`http://localhost:5000/approveRequest/${id}`);
            getBoqs();
        }catch(err){
            console.log(err);
        }
    }

    const rejectBoq = async (id) =>{
        try{
            await axios.put(`http://localhost:5000/rejectRequest/${id}`);
            getBoqs();
        }catch(error){
            console.log(error);
        }
    }

    const exportToExcel = async () => {
        try {
            // Call your async function here
            await getBoqs();
        
            // After fetching data, proceed with Excel export
            const ws = XLSX.utils.json_to_sheet(boqs);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const excelBlob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create a download link and trigger the download
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(excelBlob);
            downloadLink.download = 'data.xlsx';
            downloadLink.click();

          } catch (error) {
            console.error('Error:', error);
          }
    };

    // Helper function to convert string to ArrayBuffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    };

    
  return (
    <div className='columns mt-5 is-centered'>
        <div className='column is-half'>
            <button className='button is-success mx-1' onClick={exportToExcel}>Export BOQ Data To Excel</button>
            <table className='table is-striped is-fullwidth'>

                <thead>
                    <tr>
                        <th>No</th>
                        <th>From (Username)</th>
                        <th>User Phone Number</th>
                        <th>Status</th>
                        <th>Date Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {boqs.map((boq, index) => (
                        <tr key={boq.Id}>
                        <td>{index + 1}</td>
                        <td>{boq.Username}</td>
                        <td>{boq.Phone_Number}</td>
                        <td>{boq.Status}</td>
                        <td>{boq.Status}</td>
                        <td>
                            <Link to={`edit/${boq.Id}`} className='button is-small is-info mx-1'>See</Link>
                            <button onClick={()=> approveBoq(boq.Id)} className='button is-small is-success mx-1'>Approve</button>
                            <button onClick={()=> rejectBoq(boq.Id)} className='button is-small is-danger mx-1'>Reject</button>
                        </td>
                    </tr>
                    ))}
                    
                </tbody>
            </table>
        </div>
    </div>
  )
};

export default BoqList;