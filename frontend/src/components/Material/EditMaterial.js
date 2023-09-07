import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditMaterial = () => {

    const [item, setItem] = useState("");
    const [uom, setUom] = useState("");
    const [qty, setQty] = useState("");
    const [photoNames, setPhotoNames] = useState("");
    const [kmzNames, setKmzNames] = useState("");

    const [photoDatas, setPhotoDatas] = useState("");
    const [kmzDatas, setKmzDatas] = useState("");

    const [photoExts, setPhotoExts] = useState("");
    const [kmzExts, setKmzExts] = useState(""); 

    //Membuat Array untuk Photo Names dan KMZ Names
    const photoNamesArray = photoNames.split(",");
    const kmzNamesArray = kmzNames.split(",");

    const photoDatasArray = photoDatas.split(",");

    let imageType = ["jpeg"]; //Variabel yang nanti akan digunakan untuk membuat Extension Image
    const photoExtsArray = photoExts.split(",");
    for (let i = 0; i < photoExtsArray.length; i++){
        if (photoExtsArray[i] === "jpg" || photoExtsArray[i] === "jpeg") {
            imageType[i] = "jpeg";
          } else if (photoExtsArray[i] === "png") {
            imageType[i] = "png";
          }
    }

    function base64ToBlob(base64String, contentType = "") {
        const sliceSize = 1024;
        const byteCharacters = atob(base64String);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        return new Blob(byteArrays, { type: contentType });
    }

    function base64ToFile(base64String, filename, contentType) {
        const blob = base64ToBlob(base64String, contentType);
        return new File([blob], filename, { type: contentType });
    }

    const downloadFileKmz = () => {
        if (kmzDatas != null){
            const file = base64ToFile(kmzDatas, "kmz", "application/vnd.google-earth.kmz");
            const a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = "Kmz";
            a.click();
            URL.revokeObjectURL(a.href);
        }

    };

    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(()=>{
        getMaterialById();
    }, []); 

    const updateMaterial = async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`http://localhost:5000/request/${id}`,{
                

            });
            navigate("/dashboard/boq");
        }catch(error){
            console.log(error);
        }
    };
    
    const getMaterialById = async () =>{
        const response = await axios.get(`http://localhost:5000/material/${id}`);
        
        setItem(response.data.data.Item);
        setUom(response.data.data.UOM);
        setQty(response.data.data.Qty);

        //========PHOTO DATAS=================
        const photoDataArray = response.data.data.photoBuffers;

        if (photoDataArray.length > 0){ //Memastikan Datanya tidak kosong
            
            const photoDatasString = photoDataArray.join(","); //Konversi menjadi String
            
            setPhotoDatas(photoDatasString); //Set Photo Datas
        }

        //=======PHOTO EXTENSION============
        const photoExtensionArray = response.data.data.photoExt;

        if (photoExtensionArray.length > 0){ //Memastikan data tidak kosong

            const photoExtString = photoExtensionArray.join(",");

            setPhotoExts(photoExtString); // Set Photo Extension

        }

        //=======KMZ DATAS=====================
        setKmzDatas(response.data.data.kmzBuffers);
    };

    return (
        <div className="columns mt-5 is-centered">
            <div className="column is-half">

                <div className="field mt-5">
                    <Link to={`../dashboard/boq`} className='button is-success'>Back</Link>
                </div>

                <div className="field mt-5">
                    <label className='label'>Item</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='Item'
                        value={item}
                        readOnly
                        />
                    </div>
                </div>
                    
                <div className="field mt-5">
                    <label className='label'>UOM</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='UOM'
                        value={uom}
                        readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className='label'>Qty</label>
                    <div className="controls">
                        <input
                        type="text" 
                        className="input" 
                        placeholder='Qty'
                        value={qty}
                        readOnly
                        />
                    </div>
                </div>

                <div className="field mt-5">

                    <label className='label'>Photos</label>

                    <div style={{ display: 'flex' }}>
                        { photoDatasArray.map((base64Photo, index) => (
                            <div style={{ grid: 1 }} className='mx-1'>
                                <img 
                                    src={`data:image/${imageType[index]};base64,${base64Photo}`}
                                    alt="Photo"
                                />
                            </div>
                        ))}
                    </div>

                </div>

                <div className="field mt-5">

                    <label className='label'>KMZ file</label>

                    <div style={{ display: 'flex' }}>
                    <button onClick={downloadFileKmz}>Download KMZ File</button>
                    </div>

                </div>

            </div>
        </div>
    )
};

export default EditMaterial;