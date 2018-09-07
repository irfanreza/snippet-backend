module.exports = function (sequelize, DataTypes) {
  return sequelize.define('conversation', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
  }, {
      timestamps: false, tableName: 'conversation'
    });
};