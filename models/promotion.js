module.exports = function (sequelize, DataTypes) {
  return sequelize.define('promotion', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    voucher: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'voucher',
        key: 'id'
      }
    },
  }, {
      timestamps: false, tableName: 'promotion'
    });
};