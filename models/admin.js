module.exports = function (sequelize, DataTypes) {
  return sequelize.define('admin', {
    id: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    admin_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
      timestamps: false, tableName: 'admin'
    });
};