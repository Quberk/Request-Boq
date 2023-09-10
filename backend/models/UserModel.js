import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const User = db.define('users',{
    name : {
        type: DataTypes.STRING
    },
    username : {
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    phone_number:{
        type: DataTypes.STRING
    },
    region : {
        type: DataTypes.STRING
    },
    fme_office : {
        type: DataTypes.STRING
    },
    type_project : {
        type: DataTypes.STRING
    },
    refresh_token : {
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
});

export default User;

(async()=>{
    await db.sync();
})();