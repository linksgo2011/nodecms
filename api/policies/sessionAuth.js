/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    if(req.options.controller.indexOf("admin") === 0){
        if (req.session.user) {
            res.locals.user = req.session.user;
            return next();
        }

        // User is not allowed
        // (default res.forbidden() behavior can be overridden in `config/403.js`)
        // return res.forbidden('You are not permitted to perform this action.');
        req.session.flash = ['403 forbidden!'];
        return res.redirect('/admin/user/login');
    }

    return next();
};