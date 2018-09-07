module.exports = function (sequelize, DataTypes) {
  return sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sender: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    receiver: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    conversation: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'conversation',
        key: 'id'
      }
    },
  }, {
      timestamps: false, tableName: 'message'
    });
};