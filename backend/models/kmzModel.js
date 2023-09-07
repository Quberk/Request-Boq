import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Database.js';

class kmzModel extends Model {}

kmzModel.init({
    // Kolom-kolom dalam tabel Materials
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nama_file:{
      type: DataTypes.STRING
    },
    path:{
      type: DataTypes.STRING
    }
  
  }, {
    sequelize,
    modelName: 'kmzModel',
    tableName: 'kmz_file',
  });

  export default kmzModel;
  