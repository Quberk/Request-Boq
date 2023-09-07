import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/Database.js';
import FotoModel from './FotoModel.js';
import kmzModel from './kmzModel.js';


class MaterialsModel extends Model {}

MaterialsModel.init({
  // Kolom-kolom dalam tabel Materials
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Item:{
    type: DataTypes.STRING
  },
  UOM:{
    type: DataTypes.STRING
  },
  Qty:{
    type: DataTypes.INTEGER
  },
  Id_Foto:{
    type: DataTypes.STRING
  },
  Id_KMZ:{
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'MaterialsModel',
  tableName: 'materials',
});

/*
MaterialsModel.belongsTo(FotoModel, { foreignKey: 'Id_Foto1', as: 'foto1'});
MaterialsModel.belongsTo(FotoModel, { foreignKey: 'Id_Foto2', as: 'foto2'});
MaterialsModel.belongsTo(FotoModel, { foreignKey: 'Id_Foto3', as: 'foto3'});
MaterialsModel.belongsTo(kmzModel, { foreignKey: 'Id_KMZ', as: 'kmz'});
*/

export default MaterialsModel;
