var Admin = require('../models').admin,
Message = require('../models').message,
Conversation = require('../models').conversation,
util = require('../helpers/utils');
const request = require('request');
const rp = require('request-promise');
const conf = {
    server_key: "serverKeyFCM",
    sender_id: "senderIdFCM"
}
var FCM = require('fcm-node');
var fcm = new FCM(conf.server_key);

var message = {
    to: '',

    notification: {
        title: '',
        body: ''
    },

    data: {
        title: '',
        body: ''
    }
};

Conversation.hasMany(Message, {
    as: "message",
    foreignKey: 'conversation'
});

exports.get_all_message = function (req, res) {
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
            Message.findAll({  
            }).then(cursor => {
                // cursor.forEach((message) => {
                //     message.date = new Date(message.date + " UTC");
                // });

                res.json(util.schema(global, cursor));
            });
        }
    });
};

exports.send_message_admin_to_partner = function (req, res) {
    var global = req.app.locals;
    const headers = {
        "apikey": global.auth.key,
        "Content-Type": "application/json"
    }

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
            Conversation.findOrCreate({
                where: {
                    user: req.body.receiver,
                    type: 'partner'
                }
            }).then(main => {
                if (main == null) {
                    res.status(400).json(util.error(global, global.error.cantCreateData));
                } else {
                    Message.create({
                        sender: 0,
                        receiver: req.body.receiver,
                        title: req.body.title,
                        content: req.body.content,
                        date: new Date(),
                        conversation: main[0].id
                    }).then(cursor => {
                        if (cursor == null) {
                            res.status(400).json(util.error(global, global.error.cantCreateData));
                        } else {
                            request({
                                method: 'GET',
                                url: global.auth.host + 'partner/' + req.body.receiver,
                                headers: headers
                            }, function (err, response, data) {
                                if (!err && response.statusCode == 200) {
                                    var user = JSON.parse(data);
                                    message.to = user.data.reg_id;
                                    message.notification.title = 'Admin';
                                    message.notification.body = req.body.content;
                                    message.data.title = req.body.title;
                                    message.data.body = req.body.content;

                                    console.log(message);
                                    fcm.send(message, function (err, response) {
                                        if (err) {
                                            console.log(err);
                                            res.status(400).json(util.error(global, err));
                                        } else {
                                            res.json(util.schema(global, response));
                                        }
                                    });
                                } else {
                                    res.status(400).json(util.error(global, global.error.dataNotFound));
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.send_message_admin_to_user = function (req, res) {
    var global = req.app.locals;
    const headers = {
        "apikey": global.auth.key,
        "Content-Type": "application/json"
    }

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
            Conversation.findOrCreate({
                where: {
                    user: req.body.receiver,
                    type: 'user'
                }
            }).then(main => {
                if (main == null) {
                    res.status(400).json(util.error(global, global.error.cantCreateData));
                } else {
                    Message.create({
                        sender: 0,
                        receiver: req.body.receiver,
                        title: req.body.title,
                        content: req.body.content,
                        date: new Date(),
                        conversation: main[0].id
                    }).then(cursor => {
                        if (cursor == null) {
                            res.status(400).json(util.error(global, global.error.cantCreateData));
                        } else {
                            request({
                                method: 'GET',
                                url: global.auth.host + 'user/' + req.body.receiver,
                                headers: headers
                            }, function (err, response, data) {
                                if (!err && response.statusCode == 200) {
                                    var user = JSON.parse(data);
                                    message.to = user.data.reg_id;
                                    message.notification.title = 'Admin';
                                    message.notification.body = req.body.content;
                                    message.data.title = req.body.title;
                                    message.data.body = req.body.content;

                                    console.log(message);
                                    fcm.send(message, function (err, response) {
                                        if (err) {
                                            res.status(400).json(util.error(global, err));
                                        } else {
                                            res.json(util.schema(global, response));
                                        }
                                    });
                                } else {
                                    res.status(400).json(util.error(global, global.error.dataNotFound));
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.send_message = function (req, res) {
    var global = req.app.locals;

    Conversation.findOrCreate({
        where: {
            user: req.body.sender,
            type: req.body.type,
        }
    }).then(main => {
        if (main == null) {
            res.status(400).json(util.error(global, global.error.cantCreateData));
        } else {
            Message.create({
                sender: req.body.sender,
                receiver: 0,
                title: req.body.title,
                content: req.body.content,
                date: new Date(),
                conversation: main[0].id
            }).then(cursor => {
                if (cursor == null) {
                    res.status(400).json(util.error(global, global.error.cantCreateData));
                } else {
                    Conversation.findAll({
                        where: {
                            id: main[0].id
                        },
                        include: [
                        {
                            model: Message,
                            as: 'message',
                            required: true
                        }
                        ],
                        order: [[Message, 'date', 'ASC']]
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
    })
};

exports.get_message_by_receiver = function (req, res) {
    var global = req.app.locals;
    const headers = {
        "apikey": global.auth.key,
        "Content-Type": "application/json"
    }

    if (req.params.type == 'admin') {
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
                Conversation.findAll({
                    include: [
                    {
                        model: Message,
                        as: 'message',
                        required: true
                    }
                    ],
                    order: [[Message, 'date', 'ASC']]
                }).then(cursor => {
                    if (cursor == null) {
                        res.status(404).json(util.error(global, global.error.dataNotFound));
                    } else {
                        const result = [];

                        var promises = cursor.map((conversation) => {
                            if(conversation.type == "partner") {
                                return new Promise((resolve, reject) => {
                                    rp({
                                        method: "GET",
                                        url: global.auth.host + 'partner/' + conversation.user,
                                        headers: headers,
                                        json: true
                                    }).then((partner) => {
                                        conversation.dataValues.data = partner.data
                                        resolve();
                                    }).catch((err) => {
                                        resolve();
                                    });
                                });
                            } else {
                                return new Promise((resolve, reject) => {
                                    rp({
                                        method: "GET",
                                        url: global.auth.host + 'user/' + conversation.user,
                                        headers: headers,
                                        json: true
                                    }).then((user) => {
                                        conversation.dataValues.data = user.data
                                        resolve();
                                    }).catch((err) => {
                                        resolve();
                                    });
                                });
                            }
                        });

                        Promise.all(promises).then(() => {
                            cursor.forEach((conversation) => {
                                if(typeof conversation.dataValues.data !== "undefined") {
                                    // conversation.message.forEach((message) => {
                                    //     message.date = new Date(message.date + " UTC");
                                    // });

                                    result.push(conversation);
                                }
                            })

                            return res.json(util.schema(global, result));
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
                });
            }
        });
    } else {
        Conversation.findAll({
            where: {
                user: req.params.id,
                type: req.params.type
            },
            include: [
            {
                model: Message,
                as: 'message',
                required: true
            }
            ],
            order: [[Message, 'date', 'ASC']]
        }).then(cursor => {
            if (cursor == null) {
                res.status(404).json(util.error(global, global.error.dataNotFound));
            } else {
                // cursor.forEach((conversation) => {
                //     conversation.message.forEach((message) => {
                //         message.date = new Date(message.date + " UTC");
                //     })
                // })

                res.json(util.schema(global, cursor));
            }
        });
    }
}

exports.get_message_by_conversation = function (req, res) {
    var global = req.app.locals;

    Message.findAll({
        where: {
            conversation: req.params.id
        },
        order: [['date', 'ASC']]
    }).then(cursor => {
        if (cursor == null) {
            res.status(404).json(util.error(global, global.error.dataNotFound));
        } else {
            // cursor.forEach((message) => {
            //     message.date = new Date(message.date + " UTC");
            // })
            
            res.json(util.schema(global, cursor));
        }
    });
}

exports.conversation_delete = function (req, res) {
    var global = req.app.locals;

    Conversation.destroy({
        where: {
            id: req.params.id
        }
    }).then(cursor => {
        if (cursor == null) {
            res.status(404).json(util.error(global, global.error.dataNotFound));
        } else {
            res.json(util.schema(global, []));
        }
    });
}