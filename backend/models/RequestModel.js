import { Model, DataTypes, STRING } from "sequelize";
import sequelize from '../config/Database.js';
import Material from "./MaterialsModel.js"


class RequestModel extends Model {}

RequestModel.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Type_Project:{
        type: DataTypes.STRING
    },
    Id_Request:{
        type: DataTypes.INTEGER
    },
    FME_Office:{
        type: DataTypes.STRING
    },
    Region:{
        type: DataTypes.STRING
    },
    Section_Name:{
        type: DataTypes.STRING
    },
    Unicode:{
        type: DataTypes.STRING
    },
    Site_Survey_Date:{
        type: DataTypes.DATE
    },
    Rectification_Plan_Date:{
        type: DataTypes.DATE
    },
    Remks:{
        type: DataTypes.STRING
    },
    Id_Material: {
        type: DataTypes.STRING
    },
    Status: {
        type: DataTypes.STRING,
    },
    Username: {
        type: DataTypes.STRING,
    },

},{
    sequelize,
    modelName: 'RequestModel',
    tableName: 'request',
});

/*
RequestModel.belongsTo(Material, { foreignKey: 'Id_Material1', as: 'materials1'});
RequestModel.belongsTo(Material, { foreignKey: 'Id_Material2', as: 'materials2'});
RequestModel.belongsTo(Material, { foreignKey: 'Id_Material3', as: 'materials3'});
*/

export default RequestModel;

(async()=>{
    await sequelize.sync();
})();