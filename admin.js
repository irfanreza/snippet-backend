var express = require('express'),
    app = express(),
    port = process.env.PORT || 8084,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

app.use(express.static('assets'));

app.locals = {
    error: {
        wrongAuthorization: 'Wrong authorization',
        noAuthorization: 'No authorization header',
        invalidSignature: 'Invalid signature',
        invalidToken: 'Invalid token',
        cantCreateData: 'Cannot create data',
        cantUpdateData: 'Cannot update data',
        dataNotFound: 'Data not found',
        fcmFailed: 'Fcm send failed!'
    },
    message: {
        success: 'Request success'
    },
    schema: {
        'status': Boolean,
        'message': String,
        'data': Object
    },
    secret: 'secret-key',
    auth: {
        host: 'host-url',
        key: 'key'
    },
};

var routes = require('./routes/routes');
routes(app);

app.listen(port);

console.log('RESTful API server started on: ' + port);