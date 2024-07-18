'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactUs extends Model {
    static associate(models) {
      // define association here if necessary
    }
  }
  ContactUs.init({
    contactuscreate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    yourname: DataTypes.STRING,
    yourphone: DataTypes.STRING,
    youremail: DataTypes.STRING,
    message: DataTypes.TEXT,
    website: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ContactUs',
    tableName: 'contactus',  // specify the actual table name
  });
  return ContactUs;
};
