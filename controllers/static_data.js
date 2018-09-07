const Admin = require('../models').admin,
    StaticData = require('../models').static_data,
    DataType = require('../models').data_type,
    util = require('../helpers/utils');

// DataType.hasMany(StaticData, {
//     as: "static_data",
//     foreignKey: 'transaction'
// });

// StaticData.belongsTo(DataType, {
// 	as: "data_type",
// 	foreignKey: 'transaction'
// });

exports.get_all_static_data = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);

    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            StaticData.findAll({}).then(cursor => {
                res.json(util.schema(global, cursor));
            });
        }
    });
}

exports.add_static_data = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);

    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            StaticData.create({
                data_type: req.body.data_type,
                service: req.body.service,
                text: req.body.text
            }).then(cursor => {
                if (cursor == null) {
                    res.status(400).json(util.error(global, global.error.cantCreateData));
                } else {
                    res.json(util.schema(global, cursor));
                }
            }).catch(err => {
                res.status(400).json(util.error(global, err.name));
            });
        }
    });
}

exports.get_static_data = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);

    StaticData.findOne({
        where: { id: req.params.id },
        order: [['data_type']]
    }).then(cursor => {
        if (cursor == null) {
            res.status(404).json(util.error(global, global.error.dataNotFound));
        } else {
            res.json(util.schema(global, cursor));
        }
    });
}

exports.get_static_data_by_service = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);

    StaticData.findAll({
        where: { service: req.params.service },
        order: [['data_type']]
    }).then(cursor => {
        if (cursor == null) {
            res.status(404).json(util.error(global, global.error.dataNotFound));
        } else {
            res.json(util.schema(global, cursor));
        }
    });
}

exports.get_static_data_user = function (req, res) {
    const global = req.app.locals;

    StaticData.findAll({
        where: { service: req.params.service },
        order: [['data_type']]
    }).then(cursor => {
        if (cursor == null) {
            res.status(404).json(util.error(global, global.error.dataNotFound));
        } else {
            res.json(util.schema(global, cursor));
        }
    });
}

exports.update_static_data = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);

    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            StaticData.findOne({
                where: { id: req.params.id }
            }).then(cursor => {
                cursor.updateAttributes({
                    data_type: req.body.data_type,
                    service: req.body.service,
                    text: req.body.text
                }).then(cursor => {
                    if (cursor == null) {
                        res.status(400).json(util.error(global, global.error.cantUpdateData));
                    } else {
                        res.json(util.schema(global, cursor));
                    }
                }).catch(err => {
                    res.status(400).json(util.error(global, err.name));
                });
            });
        }
    });

}

exports.delete_static_data = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);

    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            StaticData.destroy({
                where: { id: req.params.id }
            }).then(cursor => {
                if (cursor == null) {
                    res.status(400).json(util.error(global, global.error.dataNotFound));
                } else {
                    res.json(util.schema(global, []));
                }
            });
        }
    });
}

exports.get_all_data_type = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);
    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            DataType.findAll({}).then(cursor => {
                res.json(util.schema(global, cursor));
            });
        }
    });
}

exports.add_data_type = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);

    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            DataType.create({
                name: req.body.name
            }).then(cursor => {
                if (cursor == null) {
                    res.status(400).json(util.error(global, global.error.cantCreateData));
                } else {
                    res.json(util.schema(global, cursor));
                }
            }).catch(err => {
                res.status(400).json(util.error(global, err.name));
            });
        }
    });
}

exports.get_data_type = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);
    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            DataType.findOne({
                where: {
                    id: req.params.id
                }
            }).then(cursor => {
                if (cursor == null) {
                    res.status(404).json(util.error(global, global.error.dataNotFound));
                } else {
                    res.json(util.schema(global, cursor));
                }
            });
        }
    });
}

exports.update_data_type = function (req, res) {
    const global = req.app.locals;
    const data = utl.decodeToken(global, req, res);

    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            DataType.findOne({
                where: { id: req.params.id }
            }).then(cursor => {
                cursor.updateAttributes({
                    name: req.body.name
                }).then(cursor => {
                    if (cursor == null) {
                        res.status(400).json(util.error(global, global.error.cantUpdateData));
                    } else {
                        res.json(util.schema(global, cursor));
                    }
                });
            });
        }
    });
}

exports.delete_data_type = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);

    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            DataType.destroy({
                where: { id: req.params.id }
            }).then(cursor => {
                if (cursor == null) {
                    res.status(400).json(util.error(global, global.error.dataNotFound));
                } else {
                    res.json(util.schema(global, []));
                }
            });
        }
    });
}