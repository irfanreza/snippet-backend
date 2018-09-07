module.exports = function (sequelize, DataTypes) {
    return sequelize.define('static_data', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        data_type: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'voucher_type',
                key: 'id'
            }
        },
        service: {
            type: DataTypes.INTEGER(4),
            allowNull: true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: false, tableName: 'static_data'
    });
}