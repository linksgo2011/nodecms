var Promise = require('es6-promise').Promise;

module.exports = {
    index: function(req, res, next){
        var category = req.param("id");
        var current_category = null;

        Promise.resolve().then(function(){
            if(category){
                return Category.findOne({dir:category,model:"article"});
            }else{
                return new Promise(function(resolve,reject){
                    return resolve(null);
                });
            }
        })
        .then(function(category){
            current_category = category;

            return Category.getTree({model:"article"});
        })
        .then(function(getTree){
            res.locals.categorys  =  getTree;

            var current_page = req.query['p'] || req.query['page'] || 1;
            var pageContion = {
                sort: "id DESC",
                limit: 4, // 每页数量
            };

            if(current_category){
                pageContion.where = {category:current_category.id};
            }
            return Pagination(Article, {
                current_page: current_page
            },pageContion);
        })
        .then(function(rs){
            res.locals.data = rs.data;
            res.locals.paging = rs.paging;
            return Article.find({limit:5});
        })
        .then(function(pop_articles){
            res.locals.pop_articles = pop_articles;

            res.locals.category = category;
            res.locals.currentMenu = "news";
            res.locals.theme = "default";
            res.locals.view = "article_list";
            return res.templet({});
        },function(err) {
            return next(err);
        });
    },
    
    /**
     * 文章详情
     */
    detail:function(req,res,next){
        var id = req.param("id");
        Category.getTree({model:"article"}).then(function(getTree){
            res.locals.categorys  =  getTree;

            return Article.findOne({id:id});
        })
        .then(function(article){
            res.locals.article = article;
            if(!article){
                Promise.reject(404);
            }
            var category_id = article.category;
            return Category.find({id:category_id});
        })
        .then(function(category){
            res.locals.category = category.dir;

            return Article.find({limit:5});
        })
        .then(function(pop_articles){
            res.locals.pop_articles = pop_articles;

            res.locals.currentMenu = "news";
            res.locals.theme = "default";
            res.locals.view = "article_detail";
            return res.templet({});
        },function(err) {
            if(err == 404){
                return res.notFound();
            }
            return next(err);
        });
    }
};