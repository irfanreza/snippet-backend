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
    secret: '9d0758740ae4eb192278882f1300a33dbc1dfbea',
    auth: {
        host: 'https://api.gw.dolano.id/v1/',
        key: 'b1gvsgXFwoYuVq0DYc2k13PuhrBABejc'
    },
};

var routes = require('./routes/routes');
routes(app);

app.listen(port);

console.log('RESTful API server started on: ' + port);