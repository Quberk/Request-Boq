import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res)=> {
    try{
        const response = await User.findAll({
            attributes:['id', 'name', 'username', 'region', 'fme_office', 'type_project']
        });
        res.status(200).json(response);
    }catch (error){
        console.log(error.message);
    }
};

export const getUsersById = async(req, res)=> {
    try{
        const response = await User.findOne({
            where:{
                id: req.params.id
            }
        });
        const message = "Data Berhasil diambil dari Server.";
        res.status(200).json({message, data: response});
    }catch (error){
        console.log(error.message);
    }
};

export const createUser = async(req, res)=> {
    try{
        await User.create(req.body);
        res.status(201).json({msg: "User Created"});
    }catch (error){
        console.log(error.message);
    }
};

export const updateUser = async(req, res)=> {
    try{
        await User.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User Updated"});
    }catch (error){
        console.log(error.message);
    }
};

export const deleteUser = async(req, res)=> {
    try{
        await User.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    }catch (error){
        console.log(error.message);
    }
};

//Register
export const Register = async(req, res) => {
    const { name, username, password, confPassword, region, fme_office, type_project} = req.body;
    if (password !== confPassword) return res.status(400).json({msg: "Password dan Confirm password tidak Cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try{
        await User.create({
            name: name,
            username: username,
            password: hashPassword,
            region: region,
            fme_office : fme_office,
            type_project : type_project
        });
        res.json({msg: "Register telah berhasil"});
    }catch (error){
        console.log(error);
    }
};

//Login Function
export const Login = async(req, res) => {
    try{
        const user = await User.findAll({
            where:{
                id: req.body.id
            }
        });

        const match = await bcrypt.compare(req.body.password, user[0].password);

        if (!match) return res.status(400).json({msg : "Id atau password tidak cocok"});
        const userId = user[0].id;
        const name = user[0].name;
        const username = user[0].username;
        const accessToken = jwt.sign({userId, name, username}, process.env.ACCESS_TOKEN_SECRET, 
            {
            expiresIn: '20s'            
        });
        const refreshToken = jwt.sign({userId, name, username}, process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '1d'
        });

        await User.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({userId, accessToken});

    }catch(error){
        res.status(404).json({msg: "Id atau password tidak cocok"});
    }
};

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
        
    if (!refreshToken) return res.sendStatus(204);
    const user = await User.findAll({
       where:{
            refresh_token: refreshToken
       } 
    });
    
    if (!user[0]) return res.sendStatus(204);
    
    const userId = user[0].id;
    await User.update({ refresh_token: null },{
        where:{
            id : userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
};

export const GetLastId = async(req, res) => {

    try {
        const lastUser = await User.findOne({
          attributes: [
            [sequelize.fn('max', sequelize.col('id')), 'lastUserId']
          ]
        });
    
        if (!lastUser) {
          return res.status(404).json({ error: 'No users found' });
        }
    
        const lastUserId = lastUser.id;
        return res.status(200).json({ msg: "Apalu", data: lastUserId });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
};