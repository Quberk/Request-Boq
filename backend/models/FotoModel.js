import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Database.js';

class FotoModel extends Model {}

FotoModel.init({
    // Kolom-kolom dalam tabel Materials
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nama_Foto:{
      type: DataTypes.STRING
    },
    path:{
      type: DataTypes.STRING
    }
  
  }, {
    sequelize,
    modelName: 'FotoModel',
    tableName: 'foto',
  });

export default FotoModel;
