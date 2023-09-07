import Request from "../models/RequestModel.js";
import Material from "../models/MaterialsModel.js";
import Foto from "../models/FotoModel.js";
import kmz from "../models/kmzModel.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import e, { response } from "express";
import internal from "stream";
import { timeStamp } from "console";


export const getRequests = async(req, res)=> {
    try{
        const response = await Request.findAll({
            attributes:['Id', 'Type_Project', 'Id_Request', 'FME_Office', 'Region', 'Section_Name', 'Unicode', 'Site_Survey_Date', 
                        'Rectification_Plan_Date', 'Remks', 'Id_Material', 'Status', 'Username']
        });

        const message = "Data Berhasil diambil dari Server.";

        res.status(200).json({ message, data: response });
    }catch (error){
        console.log(error.message);
    }
};

export const getRequestById = async(req, res) => {
  try {
    const response = await Request.findOne({
      where:{
          Id: req.params.id
      }
    });
    const message = "Data Berhasil diambil dari Server.";

        res.status(200).json({ message, data: response });
  } catch (error) {
    console.log(error.message);
  }
};

export const createRequest = async (req, res) => {

  //Middleware
  const upload = multer().any();
    
  try {

    upload(req, res, async(err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to upload photos' });
      }

      // Dapatkan data dari form-data
      let {
        Type_Project,
        Id_Request,
        FME_Office,
        Region,
        Section_Name,
        Unicode,
        Site_Survey_Date,
        Rectification_Plan_Date,
        Remks,
        Status,
        Username,
        jumlahMaterial,
        Item = [],
        UOM = [],
        Qty = [],
        jumlahFoto = [],
        jumlahKMZ = [],
      } = req.body;

      //Mengkonversi tipe Data yang bukan String
      Id_Request = parseInt(Id_Request);
      Site_Survey_Date = new Date(Site_Survey_Date);
      Rectification_Plan_Date = new Date(Rectification_Plan_Date);
      jumlahMaterial = parseInt(jumlahMaterial);
      for(let i = 0; i < Qty.length; i++){
        Qty[i] = parseInt(Qty[i]);
        console.log("Qty : "+Qty[i]);
      }
      for(let i = 0; i < jumlahFoto.length; i++){
        jumlahFoto[i] = parseInt(jumlahFoto[i]);
        console.log("Jumlah Foto : "+jumlahFoto[i]);
      }
      for(let i = 0; i < jumlahKMZ.length; i++){
        jumlahKMZ[i] = parseInt(jumlahKMZ[i]);
        console.log("Jumlah KMZ : "+jumlahKMZ[i]);
      }

      let id_Materials = "";
    
      if (jumlahMaterial > 0){
        //Menangkap Files dari form-data
        let Files = [];
        let Photos = [];
        let KMZs = [];

        Files = req.files;
        for(let i = 0; i < Files.length; i++){
          console.log("Isi Index Files ["+i+"] : "+Files[i].originalname);
        }
        
        let newMaterials = [];

        let posisiFile = 0;

        //Pembuatan Material
        for(let i = 0; i < jumlahMaterial; i++){

          console.log("Jumlah Material : "+jumlahMaterial);
          let newPhotos = [];
          let newKMZs = [];
          let photoIds = "";
          let kmzIds = "";

          let fileStart = posisiFile;

          //Pemasukan Variabel Photos dari Files
          for(let j = fileStart; j < (jumlahFoto[i] + fileStart); j++){
            console.log("posisi File : "+posisiFile);
            Photos.push(Files[j]);

            //Upload pada Foto Server
            const folderPath = "./uploads/photos";
            const timestamp = Date.now();
            //const ext = path.extname(Files[j].originalname);
            const randomNumber = Math.floor(Math.random() * 1000);
            const fileName = timestamp + '-' + randomNumber + '-' + Files[j].originalname;

            //Proses Updoad foto pada Folder Server & Database
            try {
              await new Promise((resolve, reject) => {
                //Upload foto pada folder uploads/photos
                fs.writeFile(folderPath + "/" + fileName, Files[j].buffer, (err) => {
                  if (err) {
                    console.error('Failed to write File:', err);
                    reject(err);
                  } else {
                    console.log('Succeed to write File.');
                    resolve();
                  }
                });
              });

              //Update pada Database
              const newFoto = await Foto.create({
                Nama_Foto: fileName,
                path: folderPath + "/" + fileName
              });
              newPhotos.push(newFoto);
              photoIds += (newFoto.Id+",");

              posisiFile++;
            } catch (err) {
              console.error('Error:', err);
            }
          }

          fileStart = posisiFile;

          //Pemasukan Variabel KMZs dari Files
          for(let j = fileStart; j < (jumlahKMZ[i] + fileStart); j++){
            console.log("posisi File : "+posisiFile);
            KMZs.push(Files[j]);

            //Upload KMZ pada Server
            const folderPath = "./uploads/files";
            const timestamp = Date.now();
            //const ext = path.extname(Files[j].originalname);
            const randomNumber = Math.floor(Math.random() * 1000);
            const fileName = timestamp + '-' + randomNumber + '-' + Files[j].originalname;

            //Proses Updoad foto pada Folder Server & Database
            try {
              await new Promise((resolve, reject) => {
                //Update KMZ File pada Folder uploads/files Server
                fs.writeFile(folderPath + "/" + fileName, Files[j].buffer, (err) => {
                  if (err) {
                    console.error('Failed to write File:', err);
                    reject(err);
                  } else {
                    console.log('Succeed to write File.');
                    resolve();
                  }
                });
              });

              //Update pada Database
              const newKmz = await kmz.create({
                Nama_file: fileName,
                path: folderPath + "/" + fileName
              });
              newKMZs.push(newKmz);
              kmzIds += (newKmz.Id+",");

              posisiFile++;
            }catch (err) {
              console.error('Error:', err);
            }
          }

          //Pembuatan Material Objek
          const newMaterial = await Material.create({
            Item: Item[i],
            UOM: UOM[i],
            Qty: Qty[i],
            Id_Foto: photoIds,
            Id_KMZ: kmzIds
          });
          newMaterials.push(newMaterial);
          id_Materials += (newMaterials[i].Id+",");
        }
      }
      
      // Buat objek request baru dengan menghubungkannya ke material baru
      await Request.create({
        Type_Project: Type_Project,
        Id_Request: Id_Request,
        FME_Office: FME_Office,
        Region: Region,
        Section_Name: Section_Name,
        Unicode: Unicode,
        Site_Survey_Date: Site_Survey_Date,
        Rectification_Plan_Date: Rectification_Plan_Date,
        Remks: Remks,
        Status: Status,
        Username: Username,
        Id_Material: id_Materials
      });
      
      res.status(201).json({ msg: "Request Created.." });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateRequest = async(req, res)=> {

  //Middleware
  const upload = multer().any();
      
  try {

    upload(req, res, async(err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to upload photos' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No photo files provided' });
      }

      // Dapatkan data dari form-data
      let {
        Type_Project,
        Id_Request,
        FME_Office,
        Region,
        Section_Name,
        Unicode,
        Site_Survey_Date,
        Rectification_Plan_Date,
        Remks,
        Status,
        jumlahMaterial,
        Item = [],
        UOM = [],
        Qty = [],
        jumlahFoto = [],
        jumlahKMZ = [],
      } = req.body;

      //Menangkap Files dari form-data
      let Files = [];
      let Photos = [];
      let KMZs = [];

      //============MENGHAPUS DATA MATERIAL, FOTO DAN KMZ LAMA DARI DATABASE=======================
      try {
        const responseRequest = await Request.findOne({
          where:{
              Id: req.params.id
          }
        });
        console.log("Berhasil mendapatkan Response Request...");

        //Mengonversi String Material Id menjadi int
        let materialId = responseRequest.Id_Material;
        materialId = materialId.replace(/,$/, '');
        const materialIdArray = materialId.split(',').map(Number);

        //Mencari Material pada Database
        for (let i = 0; i < materialIdArray.length; i++){
          const responseMaterial = await Material.findOne({
            where:{
              Id: materialIdArray[i]
            }
          });

          //Mengonversi String Foto Id & KMZ Id menjadi int
          let fotoId = responseMaterial.Id_Foto;
          fotoId = fotoId.replace(/,$/, '');
          const fotoIdArray = fotoId.split(',').map(Number);
          let kmzId = responseMaterial.Id_KMZ;
          kmzId = kmzId.replace(/,$/, '');
          const kmzIdArray = kmzId.split(',').map(Number);

          for (let j = 0; j < fotoIdArray.length; j++){
            const responseFoto = await Foto.findOne({
              where:{
                Id: fotoIdArray[j]
              }
            });

            const filePath = responseFoto.path;

            //Menghapus file Foto pada Server
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Gagal menghapus foto:', err);
              } else {
                console.log('Foto berhasil dihapus pada Server.');
              }
            });

            //Menghapus Foto pada Database
            try{
              await Foto.destroy({
                  where:{
                      id: fotoIdArray[j]
                  }
              });
              console.log("Foto Deleted from Database");
            }catch (error){
              console.log(error.message);
            }
          }

          for (let j = 0; j < kmzIdArray.length; j++){
            const responseKmz = await kmz.findOne({
              where:{
                Id: kmzIdArray[j]
              }
            });

            const filePath = responseKmz.path;

            //Menghapus File KMZ pada Server
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Gagal menghapus file:', err);
              } else {
                console.log('KMZ berhasil dihapus dari Server.');
              }
            });

            //Menghapus KMZ pada Database
            try{
              await kmz.destroy({
                  where:{
                      id: kmzIdArray[j]
                  }
              });
              console.log("Kmz Deleted from Database");
            }catch (error){
              console.log(error.message);
            }
          }

          //Menghapus Material pada Database
          try{
            await Material.destroy({
                where:{
                    id: materialIdArray[i]
                }
            });
            console.log("Material Deleted from Database");
          }catch (error){
            console.log(error.message);
          }

        }

      } catch (error) {
        return res.status(400).json({ error: 'No Request in the server' });
      }

      //Mengkonversi tipe Data yang bukan String
      Id_Request = parseInt(Id_Request);
      Site_Survey_Date = new Date(Site_Survey_Date);
      Rectification_Plan_Date = new Date(Rectification_Plan_Date);
      jumlahMaterial = parseInt(jumlahMaterial);
      for(let i = 0; i < Qty.length; i++){
        Qty[i] = parseInt(Qty[i]);
        console.log("Qty : "+Qty[i]);
      }
      for(let i = 0; i < jumlahFoto.length; i++){
        jumlahFoto[i] = parseInt(jumlahFoto[i]);
        console.log("Jumlah Foto : "+jumlahFoto[i]);
      }
      for(let i = 0; i < jumlahKMZ.length; i++){
        jumlahKMZ[i] = parseInt(jumlahKMZ[i]);
        console.log("Jumlah KMZ : "+jumlahKMZ[i]);
      }
    

      Files = req.files;
      for(let i = 0; i < Files.length; i++){
        console.log("Isi Index Files ["+i+"] : "+Files[i].originalname);
      }
      
      let newMaterials = [];
      let id_Materials = "";

      let posisiFile = 0;

      //=====================PEMBUATAN MATERIAL==========================
      for(let i = 0; i < jumlahMaterial; i++){

        console.log("Jumlah Material : "+jumlahMaterial);
        let newPhotos = [];
        let newKMZs = [];
        let photoIds = "";
        let kmzIds = "";

        let fileStart = posisiFile;

        //Pemasukan Variabel Photos dari Files
        for(let j = fileStart; j < (jumlahFoto[i] + fileStart); j++){
          console.log("posisi File : "+posisiFile);
          Photos.push(Files[j]);

          //Upload pada Foto Server
          const folderPath = "./uploads/photos";
          const timestamp = Date.now();
          //const ext = path.extname(Files[j].originalname);
          const randomNumber = Math.floor(Math.random() * 1000);
          const fileName = timestamp + '-' + randomNumber + '-' + Files[j].originalname;

          //Proses Updoad foto pada Folder Server & Database
          try {
            await new Promise((resolve, reject) => {
              //Upload foto pada folder uploads/photos
              fs.writeFile(folderPath + "/" + fileName, Files[j].buffer, (err) => {
                if (err) {
                  console.error('Failed to write File:', err);
                  reject(err);
                } else {
                  console.log('Succeed to write File.');
                  resolve();
                }
              });
            });

            //Update pada Database
            const newFoto = await Foto.create({
              Nama_Foto: fileName,
              path: folderPath + "/" + fileName
            });
            newPhotos.push(newFoto);
            photoIds += (newFoto.Id+",");

            posisiFile++;
          } catch (err) {
            console.error('Error:', err);
          }
        }

        fileStart = posisiFile;

        //Pemasukan Variabel KMZs dari Files
        for(let j = fileStart; j < (jumlahKMZ[i] + fileStart); j++){
          console.log("posisi File : "+posisiFile);
          KMZs.push(Files[j]);

          //Upload KMZ pada Server
          const folderPath = "./uploads/files";
          const timestamp = Date.now();
          //const ext = path.extname(Files[j].originalname);
          const randomNumber = Math.floor(Math.random() * 1000);
          const fileName = timestamp + '-' + randomNumber + '-' + Files[j].originalname;

          //Proses Updoad foto pada Folder Server & Database
          try {
            await new Promise((resolve, reject) => {
              //Update KMZ File pada Folder uploads/files Server
              fs.writeFile(folderPath + "/" + fileName, Files[j].buffer, (err) => {
                if (err) {
                  console.error('Failed to write File:', err);
                  reject(err);
                } else {
                  console.log('Succeed to write File.');
                  resolve();
                }
              });
            });

            //Update pada Database
            const newKmz = await kmz.create({
              Nama_file: fileName,
              path: folderPath + "/" + fileName
            });
            newKMZs.push(newKmz);
            kmzIds += (newKmz.Id+",");

            posisiFile++;
          }catch (err) {
            console.error('Error:', err);
          }
        }

        //Pembuatan Material Objek
        const newMaterial = await Material.create({
          Item: Item[i],
          UOM: UOM[i],
          Qty: Qty[i],
          Id_Foto: photoIds,
          Id_KMZ: kmzIds
        });
        newMaterials.push(newMaterial);
        id_Materials += (newMaterials[i].Id+",");
      }
      
      // Buat objek request baru dengan menghubungkannya ke material baru
      await Request.update({
        Type_Project: Type_Project,
        Id_Request: Id_Request,
        FME_Office: FME_Office,
        Region: Region,
        Section_Name: Section_Name,
        Unicode: Unicode,
        Site_Survey_Date: Site_Survey_Date,
        Rectification_Plan_Date: Rectification_Plan_Date,
        Remks: Remks,
        Status: Status,
        Id_Material: id_Materials
      },
      {
        where:{
          id: req.params.id
        }
      });
      
      res.status(201).json({ msg: "Request Updated.." });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteRequest = async(req, res) => {
  try {
    const responseRequest = await Request.findOne({
      where:{
        Id: req.params.id
      }
    });

    console.log("Berhasil mendapatkan Response Request...");

    //Mengonversi String Material Id menjadi int
    let materialId = responseRequest.Id_Material;
    materialId = materialId.replace(/,$/, '');
    const materialIdArray = materialId.split(',').map(Number);

    for (let i = 0; i < materialIdArray.length; i++){
      const responseMaterial = await Material.findOne({
        where:{
          Id: materialIdArray[i]
        }
      });

      //Mengonversi String foto Id menjadi int
      let fotoId = responseMaterial.Id_Foto;
      fotoId = fotoId.replace(/,$/, '');
      const fotoIdArray = fotoId.split(',').map(Number);
      let kmzId = responseMaterial.Id_KMZ;
      kmzId = kmzId.replace(/,$/, '');
      const kmzIdArray = kmzId.split(',').map(Number);

      //Menghapus KMZ dari Database & Server
      for (let j = 0; j < fotoIdArray.length; j++){
        const responseFoto = await Foto.findOne({
          where:{
            Id: fotoIdArray[j]
          }
        });

        const filePath = responseFoto.path;

        //Menghapus file Foto pada Server
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Gagal menghapus foto:', err);
          } else {
            console.log('Foto berhasil dihapus pada Server.');
          }
        });

        //Menghapus file Foto pada Database
        await Foto.destroy({
          where:{
            Id: fotoIdArray[j]
          }
        });
      }

      //Menghapus KMZ dari Database & Server
      for (let j = 0; j < kmzIdArray.length; j++){
        const responseKmz = await kmz.findOne({
          where:{
            Id: kmzIdArray[j]
          }
        });

        const filePath = responseKmz.path;

        //Menghapus file KMZ pada Server
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Gagal menghapus kmz:', err);
          } else {
            console.log('Kmz berhasil dihapus pada Server.');
          }
        });

        //Mneghapus KMZ pada Database
        await kmz.destroy({
          where:{
            Id: kmzIdArray[j]
          }
        });
      }
      
      await Material.destroy({
        where:{
          Id: materialIdArray[i]
        }
      });

    }

    //Menghapus Request dari Database
    await Request.destroy({
      where:{
        Id: req.params.id
      }
    });

    res.status(201).json({ msg: "Request deleted.." });

  } catch (error) {
    res.status(400).json({ error: "Request Not Found." });
  }
};

export const getMaterialById = async(req, res) => {
  try {
    const response = await Material.findOne({
      where:{
          Id: req.params.id
      }
    });

    //================MENGAMBIL FOTO PATH DARI DATABASE========================
    let photoBuffers = [];
    let photoNames = [];
    let photoExt = [];
    const photoIds = response['Id_Foto'];
    
    //Mengubah String Id menjadi Int
    const inputString = photoIds;
    const stringArray = inputString.split(",").filter(Boolean);
    const integerArray = stringArray.map(Number);

    console.log("Panjang dari Photo : " +integerArray.length);

    //Mengambil Path
    for(let i = 0; i < integerArray.length; i++){
      const photoObject = await Foto.findOne({
        where:{
          Id: integerArray[i]
        }
      });

      //Mengambil Nama dari Foto tersebut
      photoNames.push(photoObject['Nama_Foto']);
      console.log("Isi dari Photo Names : "+photoNames[i]);

      //Mengambil Extension dari Foto tersebut
      photoExt.push(photoNames[i].split('.').pop());
      console.log("Isi dari Photo Ext : "+photoExt[i]);

      //Mengambil foto dari Server dalam bentuk Buffer
      await new Promise((resolve, reject) => {
        fs.readFile(photoObject['path'], (err, data) => {
          if (err) {
            console.error('Failed to read file:', err);
            reject(err);
          } else {
            console.log('File berhasil dibaca');
            const base64Data = data.toString('base64');
            photoBuffers.push(base64Data); //Menaruh Buffer File pada PhotoBuffers
            resolve(data);
          }
        });
      });
    }

    //================MENGAMBIL KMZ DARI DATABASE========================
    let kmzBuffers = [];
    let kmzNames = [];
    let kmzExt = [];
    let kmzIds = response['Id_KMZ'];

    //Mengubah String Id menjadi Int
    const inputString1 = kmzIds;
    const stringArray1 = inputString1.split(",").filter(Boolean);
    const integerArray1 = stringArray1.map(Number);

    console.log("Panjang dari Photo : " +integerArray1.length);

    //Mengambil Path
    for(let i = 0; i < integerArray1.length; i++){
      const kmzObject = await kmz.findOne({
        where:{
          Id: integerArray1[i]
        }
      });

      //Mengambil Nama dari File KMZ tersebut
      kmzNames.push(kmzObject['Nama_file']);
      console.log("Isi dari Photo Names : "+kmzNames[i]);

      //Mengambil Extension dari File KMZ tersebut
      kmzExt.push(kmzNames[i].split('.').pop());
      console.log("Isi dari Photo Ext : "+kmzExt[i]);

      //Mengambil KMZ dari Server dalam bentuk Buffer
      await new Promise((resolve, reject) => {
        fs.readFile(kmzObject['path'], (err, data) => {
          if (err) {
            console.error('Failed to read file:', err);
            reject(err);
          } else {
            console.log('File berhasil dibaca');
            const base64Data = data.toString('base64');
            kmzBuffers.push(base64Data); //Menaruh Buffer File pada PhotoBuffers
            resolve(data);
          }
        });
      });
    }

    //=========================MEMASUKKAN DATA PADA RESPONSE====================================
    const responseJson = response.toJSON();


    responseJson['photoNames'] = photoNames;
    responseJson['photoExt'] = photoExt;

    responseJson['kmzNames'] = kmzNames;
    responseJson['kmzExt'] = kmzExt;

    responseJson['photoBuffers'] = photoBuffers;
    responseJson['kmzBuffers'] = kmzBuffers;

    const message = "Data Berhasil diambil dari Server.";

    res.status(200).json({ message, data: responseJson });
  } catch (error) {
    res.status(400).json("Material Not Found.");
  }
};


