/**
 * Admin/CategoryController
 */
module.exports = {
    index: function(req, res, next) {
        res.locals.config = {};
        res.locals.headers = {
            'breadcrumb': [{
                name: "后台首页",
                link: "/admin/main"
            }],
            'title': '栏目管理',
            'description': "",
            'parent_purview': "content",
            'purview': "content"
        }

        res.locals.data = [];
        Category.getTree().then(function(data) {
            res.locals.data = data;
            return res.view();
            return res.end(JSON.stringify(data));
        });
    }

};