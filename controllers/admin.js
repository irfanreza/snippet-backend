const Admin = require('../models').admin
    util = require('../helpers/utils');

exports.get_admin = function (req, res) {
    const global = req.app.locals;
    const data = util.decodeToken(global, req, res);

    Admin.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: data.id
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(401).json(util.error(global, global.error.invalidToken));
        } else {
            res.json(util.schema(global, cursor));
        }
    });
}