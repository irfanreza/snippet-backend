module.exports = function (sequelize, DataTypes) {
    return sequelize.define('data_type', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        timestamps: false, tableName: 'data_type'
    });
}