import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditBoq = () => {
    const [typeProject, setTypeProject] = useState("");
    const [idRequest, setIdRequest] = useState("");
    const [fmeOffice, setFmeOffice] = useState("");
    const [region, setRegion] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [unicode, setUnicode] = useState("");
    const [siteSurveyDate, setSiteSurveyDate] = useState("");
    const [rectificationPlanDate, setRectificationPlanDate] = useState("");
    const [remks, setRemks] = useState("");
    const [Id_Material, setIdMaterial] = useState("");
    const [status, setStatus] = useState("");
    const [username, setUsername] = useState("");

    //Material Id
    const idMaterialArray = Id_Material
    .split(',') // Memisahkan string berdasarkan koma
    .filter(str => str.trim() !== '') // Menghapus elemen kosong (seperti di akhir string)
    .map(str => parseInt(str)); // Mengonversi setiap elemen menjadi angka

    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(()=>{
        getRequestById();
    }, []); 

    const updateRequest = async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`http://localhost:5000/request/${id}`,{
                idRequest,
                typeProject,
                fmeOffice,
                region,
                sectionName,
                unicode,
                siteSurveyDate,
                rectificationPlanDate,
                remks,
                Id_Material,
                status,
                username

            });
            navigate("/dashboard/boq");
        }catch(error){
            console.log(error);
        }
    };
    
    const getRequestById = async () =>{
        const response = await axios.get(`http://localhost:5000/request/${id}`);
        setTypeProject(response.data.data.Type_Project);
        setIdRequest(response.data.data.Id_Request);
        setFmeOffice(response.data.data.FME_Office);
        setRegion(response.data.data.Region);
        setSectionName(response.data.data.Section_Name);
        setUnicode(response.data.data.Unicode);
        setSiteSurveyDate(response.data.data.Site_Survey_Date);
        setRectificationPlanDate(response.data.data.Rectification_Plan_Date);
        setRemks(response.data.data.Remks);
        setIdMaterial(response.data.data.Id_Material);
        setStatus(response.data.data.Status);
        setUsername(response.data.data.Username);

        console.log(response.data.data.Type_Project);
    };

    return (
        <div className="columns mt-5 is-centered">
            <div className="column is-half">

                <div className="field mt-5">
                    <Link to={`../dashboard/boq`} className='button is-success'>Back</Link>
                </div>

                <div className="field mt-5">
                    <label className='label'>Username</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='Username'
                        value={username}
                        readOnly
                        />
                    </div>
                </div>
                    
                <div className="field mt-5">
                    <label className='label'>Type Project</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='Type Project'
                        value={typeProject}
                        readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className='label'>Id Request</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='Id Request'
                        value={idRequest}
                        readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className='label'>FME Office</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='FME Office'
                        value={fmeOffice}
                        readOnly
                        />
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
                        readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className='label'>Section Name</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='Section Name'
                        value={sectionName}
                        readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className='label'>Unicode</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='Unicode'
                        value={unicode}
                        readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className='label'>Site Survey Date</label>
                    <div className="controls">
                        <input
                            type="date"
                            className="input"
                            value={siteSurveyDate}
                            readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className='label'>Rectification Plan Date</label>
                    <div className="controls">
                        <input
                            type="date"
                            className="input"
                            value={rectificationPlanDate}
                            readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className='label'>Remks</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='Remks'
                        value={remks}
                        readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className='label'>Status</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='Status'
                        value={status}
                        readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">

                    <label className='label'>Materials</label>

                    <div style={{ display: 'flex' }}>
                        { idMaterialArray.map((idMaterial, index) => (
                            <div style={{ grid: 1 }} className='mx-1'>
                                <Link to={`../dashboard/material/edit/${idMaterial}`} className='button is-info'>Material {idMaterial}</Link>
                            </div>
                        ))}
                    </div>

                </div>


            </div>
        </div>
    )
};

export default EditBoq;