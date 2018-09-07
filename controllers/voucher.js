var Admin = require('../models').admin,
    Voucher = require('../models').voucher,
    Promotion = require('../models').promotion,
    VoucherType = require('../models').voucher_type,
    util = require('../helpers/utils');

Voucher.belongsTo(VoucherType, {
    as: "voucher_type_",
    foreignKey: 'voucher_type'
})

exports.get_all_voucher = function (req, res) {
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
            Voucher.findAll({
                include: [{
                    model: VoucherType,
                    as: "voucher_type_",
                    required: true
                }]
            }).then(cursor => {
                res.json(util.schema(global, cursor));
            });
        }
    });
};

exports.get_voucher = function (req, res) {
    var global = req.app.locals;

    Voucher.findOne({
        where: {
            code: req.params.code
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(404).json(util.error(global, global.error.dataNotFound));
        } else {
            res.json(util.schema(global, cursor));
        }
    });
};

exports.add_voucher = function (req, res) {
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
            Voucher.create({
                voucher_type: req.body.voucher_type,
                service: req.body.service,
                code: req.body.code,
                start: req.body.start,
                expiry: req.body.expiry,
                value: req.body.value,
                tnc: req.body.tnc
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
};

exports.update_voucher = function (req, res) {
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
            Voucher.findOne({
                where: {
                    id: req.params.id
                }
            }).then(cursor => {
                cursor.updateAttributes({
                    voucher_type: req.body.voucher_type,
                    service: req.body.service,
                    code: req.body.code,
                    start: req.body.start,
                    expiry: req.body.expiry,
                    value: req.body.value,
                    tnc: req.body.tnc
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

exports.delete_voucher = function (req, res) {
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
                    voucher: req.params.id
                }
            }).then(promotion => {
                if (promotion == null) {
                    Voucher.destroy({
                        where: {
                            id: req.params.id
                        }
                    }).then(cursor => {
                        if (cursor == null) {
                            res.status(400).json(util.error(global, global.error.dataNotFound));
                        } else {
                            res.json(util.schema(global, []));
                        }
                    });
                } else {
                    res.status(200).send({ status:false, message:"sorry (^,^), this voucher is belongs to promotion" });
                }
            });
        }
    });
}

exports.get_all_voucher_type = function (req, res) {
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
            VoucherType.findAll({}).then(cursor => {
                res.json(util.schema(global, cursor));
            });
        }
    });
}

exports.get_voucher_type = function (req, res) {
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
            VoucherType.findOne({
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
};

exports.add_voucher_type = function (req, res) {
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
            VoucherType.create({
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
};

exports.update_voucher_type = function (req, res) {
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
            VoucherType.findOne({
                where: {
                    id: req.params.id
                }
            }).then(cursor => {
                cursor.updateAttributes({
                    name: req.body.name
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

exports.delete_voucher_type = function (req, res) {
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
            VoucherType.destroy({
                where: {
                    id: req.params.id
                }
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