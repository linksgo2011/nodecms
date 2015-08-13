module.exports = {
    index: function(req, res, next) {
        Product.find({sort:"listorder ASC",limit:4}).then(function(products){
            res.locals.products = products;

            return Fragment.find({varname:"home_intro"});
        }).then(function(fragmentes){
            if(fragmentes){
                fragmentes.forEach(function(one,key){
                    res.locals[one.varname] = one.content;
                });
            }

            return Slide.find();
        }).then(function(slides){
            res.locals.slides = slides;
            console.log(slides);

            res.locals.currentMenu = "home";
            res.locals.theme = "default";
            res.locals.view = "index";
            return res.templet({});
        },function reject(err){
            return next(err);
        });
    }
};