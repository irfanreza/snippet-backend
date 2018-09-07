module.exports = function (app) {
    var promotion = require('../controllers/promotion.js'),
        voucher = require('../controllers/voucher.js'),
        message = require('../controllers/message.js'),
        static_data = require('../controllers/static_data.js')
    admin = require('../controllers/admin.js');

    app.route('/promotion')
        .get(promotion.get_all_promotion)
        .post(promotion.add_promotion);

    app.route('/promotion/active')
        .get(promotion.get_active_promotion);

    app.route('/promotion/status/:id')
        .put(promotion.update_status_promotion);

    app.route('/promotion/:id')
        .get(promotion.get_promotion)
        .put(promotion.update_promotion)
        .delete(promotion.delete_promotion);

    app.route('/voucher')
        .get(voucher.get_all_voucher)
        .post(voucher.add_voucher);

    app.route('/voucher/:id')
        .put(voucher.update_voucher)
        .delete(voucher.delete_voucher);

    app.route('/voucher/:code')
        .get(voucher.get_voucher);

    app.route('/voucher_type')
        .get(voucher.get_all_voucher_type)
        .post(voucher.add_voucher_type);

    app.route('/voucher_type/:id')
        .get(voucher.get_voucher_type)
        .put(voucher.update_voucher_type)
        .delete(voucher.delete_voucher_type);

    app.route('/message')
        .get(message.get_all_message)
        .post(message.send_message);

    app.route('/message/admin/user')
        .post(message.send_message_admin_to_user);

    app.route('/message/admin/partner')
        .post(message.send_message_admin_to_partner);

    app.route('/message/receiver/:type/:id')
        .get(message.get_message_by_receiver);

    app.route('/message/refresh/:id')
        .get(message.get_message_by_conversation);

    app.route('/conversation/:id')
        .delete(message.conversation_delete);

    app.route('/static_data')
        .get(static_data.get_all_static_data)
        .post(static_data.add_static_data);

    app.route('/static_data/:id')
        .get(static_data.get_static_data)
        .put(static_data.update_static_data)
        .delete(static_data.delete_static_data);

    app.route('/static_data_partner/:service')
        .get(static_data.get_static_data_by_service)

    app.route('/static_data_user/:service')
        .get(static_data.get_static_data_user)

    app.route('/data_type')
        .get(static_data.get_all_data_type)
        .post(static_data.add_data_type);

    app.route('/data_type/:id')
        .get(static_data.get_data_type)
        .put(static_data.update_data_type)
        .delete(static_data.delete_data_type)

    app.route('/admin')
        .get(admin.get_admin);
};