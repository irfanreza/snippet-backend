module.exports = function (sequelize, DataTypes) {
  return sequelize.define('voucher', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    voucher_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'voucher_type',
        key: 'id'
      }
    },
    service: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    value: {
      type: DataTypes.INTEGER(20),
      allowNull: true
    },
    tnc: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
      timestamps: false, tableName: 'voucher'
    });
};