var Admin = require('../models').admin,
    Promotion = require('../models').promotion,
    Voucher = require('../models').voucher,
    util = require('../helpers/utils');

Promotion.belongsTo(Voucher, {
    as: "voucher_detail",
    foreignKey: 'voucher'
});

Voucher.hasOne(Promotion, {
    as: "voucher_detail",
    foreignKey: 'voucher'
});

exports.get_all_promotion = function (req, res) {
    var global = req.app.locals;

    Promotion.findAll({
        attributes: {
            exclude: ['voucher']
        },
        include: [
            {
                model: Voucher,
                as: "voucher_detail",
                required: true
            }
        ]
    }).then(cursor => {
        res.json(util.schema(global, cursor));
    });
};

exports.get_active_promotion = function (req, res) {
    var global = req.app.locals;

    Promotion.findAll({
        where: {
            status: 1
        },
        attributes: {
            exclude: ['voucher']
        },
        include: [
            {
                model: Voucher,
                as: "voucher_detail",
                required: true
            }
        ]
    }).then(cursor => {
        res.json(util.schema(global, cursor));
    });
};

exports.get_promotion = function (req, res) {
    var global = req.app.locals;

    Promotion.findOne({
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
};

exports.add_promotion = function (req, res) {
    var global = req.app.locals;

    var data = util.decodeToken(global, req, res);
    console.log(data);
    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            var filename = util.writeFile(req.body.image, req.body.type);
            Voucher.create({
                voucher_type: req.body.voucher_type,
                service: req.body.service,
                code: req.body.code,
                start: req.body.start,
                expiry: req.body.expiry,
                value: req.body.value,
                tnc: req.body.tnc
            }).then(voucher => {
                if (voucher == null) {
                    res.status(400).json(util.error(global, global.error.cantCreateData));
                } else {
                    Promotion.create({
                        name: req.body.name,
                        desc: req.body.desc,
                        image_url: "promotion/" + filename,
                        status: 1,
                        voucher: voucher.id
                    }).then(cursor => {
                        if (cursor == null) {
                            res.status(400).json(util.error(global, global.error.cantCreateData));
                        } else {
                            res.json(util.schema(global, cursor));
                        }
                    });
                }
            }).catch(err => {
                res.status(400).json(util.error(global, err.name));
            });
        }
    });
};

exports.update_promotion = function (req, res) {
    var global = req.app.locals;

    var data = util.decodeToken(global, req, res);
    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            Promotion.findOne({
                where: {
                    id: req.params.id
                }
            }).then(promotion => {
                if (promotion == null) {
                    res.status(404).json(util.error(global, global.error.dataNotFound));
                } else {
                    var filename = util.writeFile(req.body.image, req.body.type);

                    Voucher.update({
                        voucher_type: req.body.voucher_type,
                        service: req.body.service,
                        code: req.body.code,
                        start: req.body.start,
                        expiry: req.body.expiry,
                        value: req.body.value,
                        tnc: req.body.tnc
                    }, {
                        where: {
                            id: promotion.voucher
                        }
                    }).then(voucher => {
                        if (voucher == null) {
                            res.status(400).json(util.error(global, global.error.cantCreateData));
                        } else {
                            Promotion.update({
                                name: req.body.name,
                                desc: req.body.desc,
                                image_url: "promotion/" + filename
                            }, {
                                where: {
                                    id: promotion.id
                                }
                            }).then(cursor => {
                                if (cursor == null) {
                                    res.status(400).json(util.error(global, global.error.cantCreateData));
                                } else {
                                    res.json(util.schema(global, cursor));
                                }
                            });
                        }
                    }).catch(err => {
                        res.status(400).json(util.error(global, err.name));
                    });
                }
            });
        }
    });
}

exports.update_status_promotion = function (req, res) {
    var global = req.app.locals;

    var data = util.decodeToken(global, req, res);
    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            Promotion.findOne({
                where: {
                    id: req.params.id
                }
            }).then(cursor => {
                if (cursor == null) {
                    res.status(404).json(util.error(global, global.error.dataNotFound));
                } else {
                    cursor.updateAttributes({
                        status: req.body.status
                    }).then(cursor => {
                        if (cursor == null) {
                            res.status(400).json(util.error(global, global.error.cantUpdateData));
                        } else {
                            res.json(util.schema(global, cursor));
                        }
                    });
                }
            });
        }
    });
}

exports.delete_promotion = function (req, res) {
    var global = req.app.locals;

    var data = util.decodeToken(global, req, res);
    Admin.findOne({
        where: {
            email: data.email,
            password: data.password
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            Promotion.findOne({
                where: {
                    id: req.params.id
                }
            }).then((promotion) => {
                if (promotion == null) {
                        res.status(400).json(util.error(global, global.error.dataNotFound));
                } else {
                    Voucher.destroy({
                        where: {
                            id: promotion.voucher
                        }
                    }).then((voucher) => {
                        if (voucher == null) {
                                res.status(400).json(util.error(global, global.error.dataNotFound));
                        } else {
                            Promotion.destroy({
                                where: {
                                    id: promotion.id
                                }
                            }).then(cursor => {
                                if (cursor == null) {
                                    res.status(400).json(util.error(global, global.error.dataNotFound));
                                } else {
                                    res.json(util.schema(global, []));
                                }
                            });
                        }
                    })
                }
            })
        }
    });
}