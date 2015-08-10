module.exports = {
    index: function(req, res, next) {
        res.locals.theme = "default";
        
        res.locals.view = "index";
        return res.templet(sails.config);
    }
};