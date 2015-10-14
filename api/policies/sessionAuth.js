/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var util = require("util");
module.exports = function(req, res, next) {

    if (req.options.controller.indexOf("admin") === 0) {
        if (req.session.user) {
            var purview = req.session.user.usergroup.purview;
            var controller = req.options.controller.replace("admin/", "");
            var action = req.options.action;
            purview = JSON.parse(purview);
            var purview_item = purview[controller];
            if (!purview_item) {
                req.session.flash = {
                    error: "没有权限进行此操作，请更换账号继续 !"
                };
                return res.redirect('/admin/user/login');
            }
            action = action.replace("d_", "");
            if (action == "update") {
                action = "edit";
            }
            if (action == "delete") {
                action = "del";
            }
            if (["index", "list", "logout"].indexOf(action) == -1 && util.isArray(purview_item.method) && purview_item.method.indexOf(action) == -1) {
                req.session.flash = {
                    error: "没有权限进行此操作，请更换账号继续 !"
                };
                return res.redirect('/admin/user/login');
            }
            res.locals.user = req.session.user;
            return next();
        }

        // User is not allowed
        // (default res.forbidden() behavior can be overridden in `config/403.js`)
        // return res.forbidden('You are not permitted to perform this action.');
        req.session.flash = {
            error: "登陆过期，请重新登陆!"
        };
        return res.redirect('/admin/user/login');
    }

    return next();
};