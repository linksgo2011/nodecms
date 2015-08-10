module.exports = {
    index: function(req, res, next) {
        sails.config.paths.views += ("\\"+"templets\\default");
        res.locals.theme = "default";
        res.locals.view = "index";

        return res.templet(sails.config);
    }
};