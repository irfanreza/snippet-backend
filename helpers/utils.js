var crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    fs = require('fs');

exports.decodeToken = function (global, req, res) {
    if (!req.headers.authorization) {
        res.status(401).json(this.error(global, global.error.noAuthorization));
    } else if (req.headers.authorization.split(' ')[0] != 'Bearer') {
        res.status(401).json(this.error(global, global.error.wrongAuthorization));
    } else {
        var token = req.headers.authorization.split(' ')[1];
        try {
            var data = jwt.verify(token, global.secret);
            return data;
        } catch (err) {
            res.status(401).json(this.error(global, global.error.invalidSignature));
        }
    }
}

exports.writeFile = function (image, type) {
    var filename = (new Date).getTime() + '.' + type.split('/')[1];
    fs.writeFile(__dirname + '/../assets/promotion/' + filename, image, 'base64', function (err) {
        console.log(err);
    });
    return filename;
}

exports.sha1 = function (data) {
    var generator = crypto.createHash('sha1');
    generator.update(data);
    return generator.digest('hex');
}

exports.schema = function (global, data) {
    global.schema.status = true;
    global.schema.message = global.message.success;
    global.schema.data = data;

    return global.schema;
}

exports.error = function (global, error) {
    global.schema.status = false;
    global.schema.message = error;
    global.schema.data = [];

    return global.schema;
}